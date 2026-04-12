import { FC, useState, useMemo, useRef, useEffect } from "react";
import markdownit from "markdown-it";
import ReactPlayer from "react-player";
import { convertUrlToEmbedUrl } from "@social-embed/lib";
import {
  TikTokEmbed,
  XEmbed,
  InstagramEmbed,
  FacebookEmbed,
  LinkedInEmbed,
  PinterestEmbed,
} from "react-social-media-embed";
import { Link } from "react-router-dom";

// ─── markdown-it ──────────────────────────────────────────────────────────────

const md = markdownit({
  linkify: true,
  typographer: true,
  breaks: true,
  html: false,
});

md.linkify.add("@", {
  validate: /^[a-zA-Z0-9_]{1,50}/,
  normalize: (m) => { m.url = `/profile/${m.text.slice(1)}`; },
});

md.linkify.add("#", {
  validate: /^[a-zA-Z]\w{0,99}/,
  normalize: (m) => { m.url = `/posts?tag=${m.text.slice(1)}`; },
});

const _defaultLinkOpen =
  md.renderer.rules.link_open ??
  ((t, i, o, _e, s) => s.renderToken(t, i, o));

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const href = token.attrs?.[token.attrIndex("href")]?.[1] ?? "";

  token.attrSet("target", "_blank");
  token.attrSet("rel", "noopener noreferrer");

  if (href.startsWith("/profile/") || href.startsWith("/posts?tag=")) {
    token.attrSet(
      "class",
      "text-maxx-violet font-semibold no-underline hover:text-maxx-violetLt transition-colors"
    );
    token.attrSet("target", "_self");
    token.attrSet("rel", "");
  } else {
    token.attrSet(
      "class",
      "text-maxx-violet no-underline hover:text-maxx-violetLt transition-colors break-all"
    );
  }

  return _defaultLinkOpen(tokens, idx, options, env, self);
};

// ─── render markdown inline ──────────────────────────────────────────────────

function renderInline(text: string): string {
  const html = md.render(text);
  return html
    .replace(/^<p>([\s\S]*?)<\/p>\n?/, "$1")
    .replace(/<\/p>\n?<p>/g, "<br>\n")
    .replace(/<\/p>$/, "");
}

// ─── URL classification ───────────────────────────────────────────────────────

type EmbedKind =
  | "tiktok" | "twitter" | "instagram"
  | "facebook_post" | "facebook_video"
  | "linkedin" | "pinterest"
  | "player" | "link";

function classifyUrl(url: string): EmbedKind {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "tiktok.com" && /\/@[^/]+\/video\/\d+/.test(u.pathname)) return "tiktok";
    if ((host === "twitter.com" || host === "x.com") && /\/[^/]+\/status\/\d+/.test(u.pathname)) return "twitter";
    if ((host === "instagram.com") && /\/(p|reel|tv)\//.test(u.pathname)) return "instagram";
    if (host === "facebook.com") {
      if (u.pathname.includes("/videos/")) return "facebook_video";
      if (u.pathname.includes("/posts/")) return "facebook_post";
    }
    if (host === "linkedin.com") return "linkedin";
    if (host === "pinterest.com") return "pinterest";
    if (ReactPlayer.canPlay(url)) return "player";
  } catch {}
  return "link";
}

function extractUrls(text: string): string[] {
  const matches = md.linkify.match(text);
  if (!matches) return [];
  const seen = new Set<string>();

  return matches
    .filter((m) => m.schema === "http:" || m.schema === "https:")
    .map((m) => m.url)
    .filter((url) => (!seen.has(url) && seen.add(url)));
}

// ─── Embed Label ──────────────────────────────────────────────────────────────

const EmbedLabel: FC<{ name: string; color: string; url: string }> = ({
  name,
  color,
  url,
}) => (
  <div className="flex items-center gap-2 px-3.5 py-2 bg-maxx-bg0/85 border-b border-maxx-violet/[0.12]">
    <span
      className="w-2 h-2 rounded-full"
      style={{ background: color, boxShadow: `0 0 8px ${color}88` }}
    />
    <span className="font-mono font-bold text-[10px] uppercase text-maxx-sub">
      {name}
    </span>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="ml-auto text-[11px] text-maxx-dim truncate max-w-[240px]"
    >
      {url.replace(/^https?:\/\//, "")}
    </a>
  </div>
);

const shell =
  "mt-3 rounded-[14px] overflow-hidden border border-maxx-violet/[0.18]";

// ─── Player sanitiser ─────────────────────────────────────────────────────────

function sanitisePlayerUrl(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtube.com") {
      const shorts = u.pathname.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
      if (shorts) return `https://www.youtube.com/watch?v=${shorts[1]}`;
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/watch?v=${v}`;
    }

    if (host === "youtu.be") {
      const v = u.pathname.slice(1);
      return `https://www.youtube.com/watch?v=${v}`;
    }

    return convertUrlToEmbedUrl(url) ?? url;
  } catch {
    return url;
  }
}

// ─── Media Embed (YOUR ORIGINAL SYSTEM RESTORED) ─────────────────────────────

const PLAYER_LABELS: Record<string, { name: string; color: string }> = {
  "youtube.com": { name: "YouTube", color: "#FF0000" },
  "youtu.be": { name: "YouTube", color: "#FF0000" },
  "vimeo.com": { name: "Vimeo", color: "#1AB7EA" },
  "twitch.tv": { name: "Twitch", color: "#9146FF" },
  "soundcloud.com": { name: "SoundCloud", color: "#FF5500" },
  "spotify.com": { name: "Spotify", color: "#1DB954" },
  "dailymotion.com": { name: "Dailymotion", color: "#0066DC" },
  "streamable.com": { name: "Streamable", color: "#3F3F3F" },
  "wistia.com": { name: "Wistia", color: "#54BBFF" },
  "mixcloud.com": { name: "Mixcloud", color: "#52AAD8" },
  "facebook.com": { name: "Facebook", color: "#1877F2" },
};

const MediaEmbed: FC<{ url: string }> = ({ url }) => {
  const embedUrl = useMemo(() => sanitisePlayerUrl(url), [url]);

  const host = new URL(url).hostname.replace(/^www\./, "");
  const label = PLAYER_LABELS[host] ?? { name: "Media", color: "#8b5cf6" };
  const isAudio = /soundcloud|spotify|mixcloud/.test(url);

  return (
    <div className={shell}>
      <EmbedLabel name={label.name} color={label.color} url={url} />
      <div className="bg-black w-full" style={{ height: isAudio ? 90 : 315 }}>
        <ReactPlayer
          src={embedUrl}
          width="100%"
          height={isAudio ? 90 : 315}
          controls
        />
      </div>
    </div>
  );
};

// ─── Social Embed (FULL RESTORE) ─────────────────────────────────────────────

const SOCIAL_LABELS: Record<string, { name: string; color: string }> = {
  tiktok: { name: "TikTok", color: "#010101" },
  twitter: { name: "X", color: "#000000" },
  instagram: { name: "Instagram", color: "#E1306C" },
  facebook_post: { name: "Facebook", color: "#1877F2" },
  linkedin: { name: "LinkedIn", color: "#0A66C2" },
  pinterest: { name: "Pinterest", color: "#E60023" },
};

const SocialEmbed: FC<{ url: string; kind: EmbedKind }> = ({ url, kind }) => {
  const label = SOCIAL_LABELS[kind];

  return (
    <div className={shell}>
      <EmbedLabel name={label.name} color={label.color} url={url} />
      <div className="bg-maxx-bg0/50 p-3">
        {kind === "tiktok" && <TikTokEmbed url={url} width={325} />}
        {kind === "twitter" && <XEmbed url={url} width={325} />}
        {kind === "instagram" && <InstagramEmbed url={url} width={328} />}
        {kind === "facebook_post" && <FacebookEmbed url={url} width={350} />}
        {kind === "linkedin" && <LinkedInEmbed url={url} width={350} height={570} />}
        {kind === "pinterest" && <PinterestEmbed url={url} width={345} height={467} />}
      </div>
    </div>
  );
};

// ─── Link Card (UNCHANGED) ───────────────────────────────────────────────────

const LinkCard: FC<{ url: string }> = ({ url }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl border border-maxx-violet/[0.16]"
  >
    <span className="text-[13px] truncate">
      {url.replace(/^https?:\/\//, "")}
    </span>
  </a>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

interface Props {
  text: string;
  canCollapse?: boolean;
  postHref?: string;
  className?: string;
}

export default function SocialPostBody({
  text,
  canCollapse = false,
  postHref,
  className = "",
}: Props) {
  const [collapsed, setCollapsed] = useState(true);
  const [overflows, setOverflows] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const renderedHtml = useMemo(() => renderInline(text), [text]);

  const urls = useMemo(() => extractUrls(text), [text]);

  const classified = useMemo(
    () =>
      urls.map((url) => ({
        url,
        kind: classifyUrl(url),
      })),
    [urls]
  );

  const socialEmbeds = classified.filter((x) =>
    ["tiktok", "twitter", "instagram", "facebook_post", "linkedin", "pinterest"].includes(x.kind)
  );

  const playerEmbeds = classified.filter((x) =>
    x.kind === "player" || x.kind === "facebook_video"
  );

  const plainLinks = classified.filter((x) => x.kind === "link");

  const isCollapsed = canCollapse && collapsed && overflows;

  // ─── overflow detection ────────────────────────────────────────────────────
  useEffect(() => {
    const el = textRef.current;
    if (!el || !canCollapse) return;

    const lineHeight = parseFloat(getComputedStyle(el).lineHeight || "20");
    const maxLines = 6;

    setOverflows(el.scrollHeight > lineHeight * maxLines + 2);
  }, [renderedHtml, canCollapse]);

  // ─── smooth animation ─────────────────────────────────────────────────────
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const el = textRef.current;
    if (!wrapper || !el) return;

    const lineHeight = parseFloat(getComputedStyle(el).lineHeight || "20");
    const maxLines = 6;

    const collapsedHeight = lineHeight * maxLines;
    const expandedHeight = el.scrollHeight;

    wrapper.style.maxHeight = isCollapsed
      ? `${collapsedHeight}px`
      : `${expandedHeight}px`;
  }, [collapsed, renderedHtml, isCollapsed]);

  return (
    <div className={className}>
      {/* TEXT */}
      <div className="my-5">
        <div
          ref={wrapperRef}
          className="overflow-hidden transition-[max-height] duration-300 ease-out"
        >
          <div
            ref={textRef}
            className="text-maxx-mid text-[0.9375rem] leading-relaxed break-words"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        </div>

        {/* TOGGLE */}
        {canCollapse && overflows && (
          <div className="mt-2">
            {collapsed ? (
              postHref ? (
                <Link to={postHref} className="text-maxx-violet text-xs uppercase">
                  Read more
                </Link>
              ) : (
                <button onClick={() => setCollapsed(false)} className="text-maxx-violet text-xs uppercase">
                  Read more
                </button>
              )
            ) : (
              <button onClick={() => setCollapsed(true)} className="text-maxx-sub text-xs uppercase">
                Show less
              </button>
            )}
          </div>
        )}
      </div>

      {/* EMBEDS — FULL RESTORE */}
      {socialEmbeds.map(({ url, kind }) => (
        <SocialEmbed key={url} url={url} kind={kind} />
      ))}

      {playerEmbeds.map(({ url }) => (
        <MediaEmbed key={url} url={url} />
      ))}

      {plainLinks.map(({ url }) => (
        <LinkCard key={url} url={url} />
      ))}
    </div>
  );
}
