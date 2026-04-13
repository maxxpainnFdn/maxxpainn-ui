import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface AudiomackMeta {
  title: string;
  artist: string;
  thumbnail: string | null;
  trackUrl: string;
  embedUrl: string;
  type: "song" | "album" | "playlist" | "unknown";
}

export interface AudiomackEmbedProps {
  /** Full Audiomack track, album, or playlist URL */
  url: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function extractAudiomackInfo(url: string): {
  type: AudiomackMeta["type"];
  artist: string;
  slug: string;
} | null {
  if (!url.includes("audiomack.com")) return null;

  const TYPES = ["song", "album", "playlist"];

  // Old style: audiomack.com/song/artist/slug  OR  audiomack.com/album/artist/slug
  const oldStyle = url.match(
    /audiomack\.com\/(song|album|playlist)\/([^/?#]+)\/([^/?#]+)/i
  );
  if (oldStyle) {
    return {
      type: oldStyle[1].toLowerCase() as AudiomackMeta["type"],
      artist: oldStyle[2],
      slug: oldStyle[3],
    };
  }

  // New style: audiomack.com/artist/(song|album|playlist)/slug
  const newStyle = url.match(
    /audiomack\.com\/([^/?#]+)\/(song|album|playlist)\/([^/?#]+)/i
  );
  if (newStyle) {
    return {
      type: newStyle[2].toLowerCase() as AudiomackMeta["type"],
      artist: newStyle[1],
      slug: newStyle[3],
    };
  }

  // Short style: audiomack.com/artist/slug  (2 segments, no type keyword)
  const short = url.match(/audiomack\.com\/([^/?#]+)\/([^/?#]+)/i);
  if (short && !TYPES.includes(short[1].toLowerCase())) {
    return { type: "song", artist: short[1], slug: short[2] };
  }

  return null;
}

function buildEmbedUrl(
  type: AudiomackMeta["type"],
  artist: string,
  slug: string
): string {
  const t = type === "unknown" ? "song" : type;
  return `https://audiomack.com/embed/${t}/${artist}/${slug}`;
}

function humanize(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const AM_ORANGE = "#ff6600";
const AM_YELLOW = "#ffcc00";

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
const AudiomackIcon = ({
  size = 10,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  // Audiomack "A" wave-style logo approximation
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
  >
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3c.55 0 1 .45 1 1v4.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L11 10.586V6c0-.55.45-1 1-1zm-5 7a1 1 0 010 2H5a1 1 0 010-2h2zm12 0a1 1 0 010 2h-2a1 1 0 010-2h2zm-7 3a3 3 0 100 6 3 3 0 000-6zm0 2a1 1 0 110 2 1 1 0 010-2z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width={13} height={13}>
    <path
      d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"
      stroke="#8b82a8"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <path
      d="M15 3h6v6M10 14L21 3"
      stroke="#8b82a8"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// AudiomackEmbed
//
// Strategy:
//   1. oEmbed  → title, artist, thumbnail (audiomack.com/oembed)
//   2. Embed iframe (audiomack.com/embed/song/:artist/:slug)
//      - Audiomack's embed player plays full tracks (they are freely streamable)
//      - No Widget JS API exists, so we use the iframe directly like Apple/Deezer
//      - The iframe always shows inline (no expand toggle) — it's compact at 252px
// ---------------------------------------------------------------------------
export default function AudiomackEmbed({
  url,
  className = "",
}: AudiomackEmbedProps) {
  const [meta, setMeta] = useState<AudiomackMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;
    const parsed = extractAudiomackInfo(url);
    if (!parsed) {
      setError("Not a valid Audiomack URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setMeta(null);

    const run = async () => {
      try {
        // 1. oEmbed for title, artist, thumbnail
        let title = humanize(parsed.slug);
        let artist = humanize(parsed.artist);
        let thumbnail: string | null = null;

        try {
          const oeRes = await fetch(
            `https://audiomack.com/oembed?url=${encodeURIComponent(url)}&format=json`
          );
          if (oeRes.ok) {
            const oe = await oeRes.json();
            // oEmbed title is often "Song by Artist"
            if (oe.title) {
              const byMatch = oe.title.match(/^(.+?)\s+by\s+(.+)$/i);
              if (byMatch) {
                title = byMatch[1].trim();
                artist = byMatch[2].trim();
              } else {
                title = oe.title;
              }
            }
            if (oe.author_name) artist = oe.author_name;
            if (oe.thumbnail_url) thumbnail = oe.thumbnail_url;
          }
        } catch {
          // fall through with slug-derived title/artist
        }

        setMeta({
          title,
          artist,
          thumbnail,
          trackUrl: url,
          embedUrl: buildEmbedUrl(parsed.type, parsed.artist, parsed.slug),
          type: parsed.type,
        });
      } catch {
        setError(
          "Could not load — check that the Audiomack URL is valid and public."
        );
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [url]);

  const typeLabel =
    meta?.type && meta.type !== "unknown"
      ? meta.type.charAt(0).toUpperCase() + meta.type.slice(1)
      : "Song";

  return (
    <div
      className={cn(
        "group relative overflow-hidden w-full rounded-2xl",
        "bg-maxx-bg2/95 border border-maxx-violet/[0.14]",
        "transition-[border-color,box-shadow] duration-300",
        className
      )}
      style={
        {
          "--hover-color": AM_ORANGE,
        } as React.CSSProperties
      }
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${AM_ORANGE}40`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px ${AM_ORANGE}12`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "";
        (e.currentTarget as HTMLElement).style.boxShadow = "";
      }}
    >
      {/* Top shimmer — orange/yellow gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${AM_ORANGE}, ${AM_YELLOW}, ${AM_ORANGE}, transparent)`,
        }}
      />

      {/* ── Skeleton ── */}
      {loading && (
        <div className="flex items-center gap-4 px-5 py-4">
          <div
            className="w-[72px] h-[72px] rounded-xl animate-pulse flex-shrink-0"
            style={{ background: `${AM_ORANGE}18` }}
          />
          <div className="flex-1 flex flex-col gap-2.5">
            <div
              className="h-3.5 w-3/5 rounded animate-pulse"
              style={{ background: `${AM_ORANGE}18` }}
            />
            <div
              className="h-3 w-2/5 rounded animate-pulse"
              style={{ background: `${AM_ORANGE}10` }}
            />
            <div
              className="h-[18px] w-20 rounded animate-pulse"
              style={{ background: `${AM_ORANGE}18` }}
            />
          </div>
          <div
            className="w-12 h-12 rounded-full animate-pulse flex-shrink-0"
            style={{ background: `${AM_ORANGE}18` }}
          />
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <p className="px-5 py-4 text-[12.5px] text-red-400 text-center">
          {error}
        </p>
      )}

      {/* ── Content ── */}
      {meta && !loading && (
        <>
          {/* Info row */}
          <div className="flex items-center gap-4 px-5 pt-4 pb-3">
            {/* Artwork */}
            <div
              className="flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden flex items-center justify-center"
              style={{ background: `${AM_ORANGE}18` }}
            >
              {meta.thumbnail ? (
                <img
                  src={meta.thumbnail}
                  alt=""
                  className="w-full h-full object-cover block"
                />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill={AM_ORANGE}
                  width={32}
                  height={32}
                  opacity={0.6}
                >
                  {/* Headphone / music note icon */}
                  <path d="M12 3a9 9 0 00-9 9v5a3 3 0 003 3h1a1 1 0 001-1v-4a1 1 0 00-1-1H5v-2a7 7 0 1114 0v2h-2a1 1 0 00-1 1v4a1 1 0 001 1h1a3 3 0 003-3v-5a9 9 0 00-9-9z" />
                </svg>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-maxx-white text-[14.5px] truncate leading-snug mb-1">
                {meta.title}
              </p>
              <p className="text-maxx-sub text-[12.5px] truncate mb-2">
                {meta.artist}
              </p>
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.05em] px-2 py-0.5 rounded"
                style={{ color: AM_ORANGE, background: `${AM_ORANGE}18` }}
              >
                {/* Audiomack wordmark bars */}
                <svg viewBox="0 0 20 14" fill={AM_ORANGE} width={12} height={8}>
                  <rect x="0" y="4" width="3" height="10" rx="1" />
                  <rect x="4.5" y="0" width="3" height="14" rx="1" />
                  <rect x="9" y="3" width="3" height="11" rx="1" />
                  <rect x="13.5" y="1" width="3" height="13" rx="1" />
                </svg>
                Audiomack · {typeLabel}
              </span>
            </div>

            {/* Open link */}
            <a
              href={meta.trackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent no-underline transition-all duration-200"
              style={{ border: `1px solid ${AM_ORANGE}30` }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = `${AM_ORANGE}18`)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "transparent")
              }
            >
              <ExternalLinkIcon />
            </a>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.05] mx-5" />

          {/* Audiomack embed iframe — always visible, full playback */}
          <div className="px-5 pb-4 pt-3">
            <iframe
              src={meta.embedUrl}
              width="100%"
              height="252"
              allow="autoplay"
              className="border-none block rounded-xl overflow-hidden"
              title="Audiomack Player"
              style={{ colorScheme: "normal" }}
            />
          </div>
        </>
      )}
    </div>
  );
}
