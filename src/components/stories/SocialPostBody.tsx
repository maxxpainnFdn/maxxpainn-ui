/**
 * SocialPostBody
 *
 * Drop-in rich-text renderer for post content.
 * Parses @mentions, #hashtags, and URLs from raw text.
 * Trusted media URLs (YouTube, Vimeo, Spotify, etc.) render as embedded iframes.
 * All other URLs render as a plain link card below the text.
 *
 * Production swap-ins:
 *   - Tokeniser  → npm i linkify-it
 *   - Embeds     → npm i react-player  →  <ReactPlayer url={url} width="100%" controls />
 *
 * Usage:
 *   <SocialPostBody text={post.content} />
 */

import { FC, ReactNode } from "react";

// ─── Token types ──────────────────────────────────────────────────────────────

type TokenType = "text" | "url" | "mention" | "hashtag";

interface Token {
  type: TokenType;
  value: string;
}

// ─── Tokeniser ────────────────────────────────────────────────────────────────
// Swap out for: import LinkifyIt from "linkify-it"

const URL_RE     = /https?:\/\/[^\s<>"{}|\\^`[\]()]+(?:[^\s<>"{}|\\^`[\]().,!?;:]|(?=[.,!?;:]*(?:\s|$)))/g;
const MENTION_RE = /(?<![a-zA-Z0-9_])@([a-zA-Z0-9_]{1,50})/g;
const HASHTAG_RE = /(?<![a-zA-Z0-9_&])#([a-zA-Z]\w{0,99})/g;

function tokenise(text: string): Token[] {
  interface Raw { index: number; end: number; type: TokenType; value: string }
  const raw: Raw[] = [];
  let m: RegExpExecArray | null;

  URL_RE.lastIndex = 0;
  while ((m = URL_RE.exec(text)) !== null)
    raw.push({ index: m.index, end: m.index + m[0].length, type: "url", value: m[0] });
  MENTION_RE.lastIndex = 0;
  while ((m = MENTION_RE.exec(text)) !== null)
    raw.push({ index: m.index, end: m.index + m[0].length, type: "mention", value: m[1] });
  HASHTAG_RE.lastIndex = 0;
  while ((m = HASHTAG_RE.exec(text)) !== null)
    raw.push({ index: m.index, end: m.index + m[0].length, type: "hashtag", value: m[1] });

  raw.sort((a, b) => a.index - b.index || (b.end - b.index) - (a.end - a.index));
  const deduped: Raw[] = [];
  let cursor = 0;
  for (const r of raw) {
    if (r.index < cursor) continue;
    deduped.push(r);
    cursor = r.end;
  }

  const tokens: Token[] = [];
  let pos = 0;
  for (const r of deduped) {
    if (r.index > pos) tokens.push({ type: "text", value: text.slice(pos, r.index) });
    tokens.push({ type: r.type, value: r.value });
    pos = r.end;
  }
  if (pos < text.length) tokens.push({ type: "text", value: text.slice(pos) });
  return tokens;
}

// ─── Embed platform registry ──────────────────────────────────────────────────
// Mirrors react-player's supported set. Swap embed rendering for:
//   import ReactPlayer from "react-player/lazy"
//   <ReactPlayer url={url} width="100%" controls />

interface Platform { name: string; color: string; pattern: RegExp }

const PLATFORMS: Platform[] = [
  { name: "YouTube",     color: "#FF0000", pattern: /(?:youtube\.com\/(?:watch|shorts)|youtu\.be\/)/ },
  { name: "Vimeo",       color: "#1AB7EA", pattern: /vimeo\.com\// },
  { name: "Twitch",      color: "#9146FF", pattern: /twitch\.tv\// },
  { name: "SoundCloud",  color: "#FF5500", pattern: /soundcloud\.com\// },
  { name: "Spotify",     color: "#1DB954", pattern: /open\.spotify\.com\// },
  { name: "Dailymotion", color: "#0066DC", pattern: /dailymotion\.com\// },
  { name: "Wistia",      color: "#54BBFF", pattern: /wistia\.(com|net)\// },
  { name: "Mixcloud",    color: "#52AAD8", pattern: /mixcloud\.com\// },
  { name: "Streamable",  color: "#3F3F3F", pattern: /streamable\.com\// },
  { name: "Loom",        color: "#625DF5", pattern: /loom\.com\/share\// },
  { name: "CodePen",     color: "#c4b5fd", pattern: /codepen\.io\/[^/]+\/pen\// },
];

function getPlatform(url: string): Platform | null {
  return PLATFORMS.find(p => p.pattern.test(url)) ?? null;
}

function iframeSrc(url: string, name: string): string | null {
  try {
    const u = new URL(url);
    switch (name) {
      case "YouTube": {
        const v = u.searchParams.get("v")
          ?? (u.hostname === "youtu.be" ? u.pathname.slice(1) : null)
          ?? (u.pathname.includes("/shorts/") ? u.pathname.split("/shorts/")[1] : null);
        return v ? `https://www.youtube-nocookie.com/embed/${v}?rel=0` : null;
      }
      case "Vimeo": {
        const id = u.pathname.split("/").find(s => /^\d+$/.test(s));
        return id ? `https://player.vimeo.com/video/${id}` : null;
      }
      case "Dailymotion": {
        const id = u.pathname.split("/video/")[1]?.split("_")[0];
        return id ? `https://www.dailymotion.com/embed/video/${id}` : null;
      }
      case "Spotify":
        return `https://open.spotify.com/embed${u.pathname}`;
      case "SoundCloud":
        return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=false&hide_related=true&show_comments=false&color=%238b5cf6`;
      case "Loom": {
        const id = u.pathname.split("/share/")[1];
        return id ? `https://www.loom.com/embed/${id}` : null;
      }
      case "Streamable":
        return `https://streamable.com/e/${u.pathname.replace("/", "")}`;
      case "CodePen": {
        const p = u.pathname.split("/");
        const i = p.indexOf("pen");
        return i !== -1 ? `https://codepen.io/${p[i - 1]}/embed/${p[i + 1]}?default-tab=result&theme-id=dark` : null;
      }
    }
  } catch(e){ console.log(e) }
  return null;
}

// ─── Inline link ──────────────────────────────────────────────────────────────

const InlineLink: FC<{ href: string; children: ReactNode }> = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-maxx-violet font-semibold no-underline hover:text-maxx-violet-lt transition-colors"
  >
    {children}
  </a>
);

// ─── Embed card ───────────────────────────────────────────────────────────────

const EmbedCard: FC<{ url: string; platform: Platform }> = ({ url, platform }) => {
  const src = iframeSrc(url, platform.name);
  if (!src) return <LinkCard url={url} />;
  const isAudio = ["Spotify", "SoundCloud"].includes(platform.name);

  return (
    <div className="mt-3 rounded-[14px] overflow-hidden border border-maxx-violet/[0.18]">
      {/* Header */}
      <div className="flex items-center gap-2 px-3.5 py-2 bg-maxx-bg0/85 border-b border-maxx-violet/[0.12]">
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: platform.color, boxShadow: `0 0 8px ${platform.color}88` }}
        />
        <span className="font-mono font-bold text-[10px] tracking-[0.12em] uppercase text-maxx-sub">
          {platform.name}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-[11px] text-maxx-dim hover:text-maxx-sub transition-colors no-underline truncate max-w-[240px]"
        >
          {url.replace(/^https?:\/\//, "")}
        </a>
      </div>
      <iframe
        src={src}
        height={isAudio ? 80 : 315}
        className="w-full border-none block bg-maxx-bg0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        loading="lazy"
        title={`${platform.name} embed`}
      />
    </div>
  );
};

// ─── Plain link card ──────────────────────────────────────────────────────────

const LinkCard: FC<{ url: string }> = ({ url }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2.5 mt-2.5 px-3.5 py-2.5 rounded-xl border border-maxx-violet/[0.16] bg-maxx-violet/[0.04] no-underline transition-all hover:border-maxx-violet/[0.35] hover:bg-maxx-violet/[0.09]"
  >
    {/* Link icon */}
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-maxx-sub flex-shrink-0">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
    <span className="text-[13px] text-maxx-sub truncate flex-1">
      {url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
    </span>
    {/* External icon */}
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-maxx-dim flex-shrink-0">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  </a>
);

// ─── SocialPostBody (export) ──────────────────────────────────────────────────

interface SocialPostBodyProps {
  text: string;
  className?: string;
}

export default function SocialPostBody({ text, className = "" }: SocialPostBodyProps) {
  const tokens    = tokenise(text);
  const urlTokens = [...new Set(tokens.filter(t => t.type === "url").map(t => t.value))];
  const embeds    = urlTokens.map(url => ({ url, platform: getPlatform(url) })).filter(e => e.platform !== null) as { url: string; platform: Platform }[];
  const links     = urlTokens.filter(url => getPlatform(url) === null);

  return (
    <div className={className}>
      {/* Inline rich text */}
      <p className="text-maxx-mid my-5 text-[0.9375rem] leading-relaxed break-words">
        {tokens.map((tok, i) => {
          if (tok.type === "text")    return <span key={i}>{tok.value}</span>;
          if (tok.type === "mention") return <InlineLink key={i} href={`/profile/${tok.value}`}>@{tok.value}</InlineLink>;
          if (tok.type === "hashtag") return <InlineLink key={i} href={`/posts?tag=${tok.value}`}>#{tok.value}</InlineLink>;
          if (tok.type === "url") {
            const d = tok.value.replace(/^https?:\/\//, "").replace(/\/$/, "");
            return <InlineLink key={i} href={tok.value}>{d.length > 52 ? d.slice(0, 49) + "…" : d}</InlineLink>;
          }
          return null;
        })}
      </p>

      {/* Trusted embeds */}
      {embeds.map(({ url, platform }) => (
        <EmbedCard key={url} url={url} platform={platform} />
      ))}

      {/* Plain link cards */}
      {links.map(url => <LinkCard key={url} url={url} />)}
    </div>
  );
}
