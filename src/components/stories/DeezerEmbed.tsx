import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DeezerMeta {
  title: string;
  artist: string;
  thumbnail: string | null;
  trackUrl: string;
  embedUrl: string;
  type: "track" | "album" | "playlist" | "artist" | "podcast" | "episode" | "unknown";
  id: string;
}

export interface DeezerEmbedProps {
  url: string;
  className?: string;
}

function extractDeezerInfo(url: string): { type: DeezerMeta["type"]; id: string } | null {
  const m = url.match(/deezer\.com(?:\/[a-z]{2})?\/([a-z]+)\/(\d+)/i);
  if (!m) return null;
  const typeMap: Record<string, DeezerMeta["type"]> = {
    track: "track", album: "album", playlist: "playlist",
    artist: "artist", podcast: "podcast", episode: "episode",
  };
  return { type: typeMap[m[1].toLowerCase()] ?? "unknown", id: m[2] };
}

function buildDeezerEmbedUrl(type: string, id: string): string {
  return `https://widget.deezer.com/widget/dark/${type}/${id}?autoplay=false&radius=false&tracklist=false`;
}

const DeezerIcon = ({ size = 10, className = "" }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className}>
    <path d="M18.81 4.16v2.03H24V4.16h-5.19zM12 9.21v2.03h5.19V9.21H12zm6.81 0v2.03H24V9.21h-5.19zM12 14.26v2.02h5.19v-2.02H12zm6.81 0v2.02H24v-2.02h-5.19zM5.19 19.31v2.02h5.19v-2.02H5.19zm6.81 0v2.02h5.19v-2.02H12zm6.81 0v2.02H24v-2.02h-5.19z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width={13} height={13}>
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="#8b82a8" strokeWidth={2} strokeLinecap="round" />
    <path d="M15 3h6v6M10 14L21 3" stroke="#8b82a8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function DeezerEmbed({ url, className = "" }: DeezerEmbedProps) {
  const [meta, setMeta] = useState<DeezerMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;
    const parsed = extractDeezerInfo(url);
    if (!parsed) { setError("Not a valid Deezer URL."); return; }

    setLoading(true); setError(null); setMeta(null);

    const run = async () => {
      try {
        let title = "Deezer";
        let artist = "";
        let thumbnail: string | null = null;

        // Deezer public API — no auth needed
        try {
          const endpoint =
            parsed.type === "track" ? `https://api.deezer.com/track/${parsed.id}` :
            parsed.type === "album" ? `https://api.deezer.com/album/${parsed.id}` :
            parsed.type === "playlist" ? `https://api.deezer.com/playlist/${parsed.id}` :
            parsed.type === "artist" ? `https://api.deezer.com/artist/${parsed.id}` :
            null;

          if (endpoint) {
            const res = await fetch(endpoint);
            if (res.ok) {
              const d = await res.json();
              title = d.title ?? d.name ?? title;
              artist = d.artist?.name ?? d.creator?.name ?? "";
              thumbnail =
                d.album?.cover_medium ??
                d.cover_medium ??
                d.picture_medium ??
                d.album?.cover ??
                d.cover ??
                d.picture ??
                null;
            }
          }
        } catch { /* fall through with defaults */ }

        setMeta({
          title, artist, thumbnail,
          trackUrl: url,
          embedUrl: buildDeezerEmbedUrl(parsed.type, parsed.id),
          type: parsed.type,
          id: parsed.id,
        });
      } catch (e) {
        console.error(e);
        setError("Could not load — check that the Deezer URL is valid and public.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [url]);

  const typeLabel = meta?.type
    ? meta.type.charAt(0).toUpperCase() + meta.type.slice(1)
    : "Track";

  return (
    <div
      className={cn(
        "group relative overflow-hidden w-full rounded-2xl",
        "bg-maxx-bg2/95 border border-maxx-violet/[0.14]",
        "transition-[border-color,box-shadow] duration-300",
        "hover:border-[#a238ff]/30 hover:shadow-[0_8px_40px_rgba(162,56,255,0.07)]",
        className
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-px pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-[#a238ff] to-transparent" />

      {loading && (
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="w-[72px] h-[72px] rounded-xl bg-[#a238ff]/10 animate-pulse flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-2.5">
            <div className="h-3.5 w-3/5 rounded bg-[#a238ff]/10 animate-pulse" />
            <div className="h-3 w-2/5 rounded bg-[#a238ff]/[0.07] animate-pulse" />
            <div className="h-[18px] w-16 rounded bg-[#a238ff]/10 animate-pulse" />
          </div>
          <div className="w-9 h-9 rounded-full bg-[#a238ff]/10 animate-pulse flex-shrink-0" />
        </div>
      )}

      {error && <p className="px-5 py-4 text-[12.5px] text-red-400 text-center">{error}</p>}

      {meta && !loading && (
        <>
          {/* Info row */}
          <div className="flex items-center gap-4 px-5 pt-4 pb-3">
            <div className="flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden bg-[#a238ff]/10 flex items-center justify-center">
              {meta.thumbnail
                ? <img src={meta.thumbnail} alt="" className="w-full h-full object-cover block" />
                : <DeezerIcon size={32} className="text-[#a238ff] opacity-60" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-maxx-white text-[14.5px] truncate leading-snug mb-1">{meta.title}</p>
              {meta.artist && <p className="text-maxx-sub text-[12.5px] truncate mb-2">{meta.artist}</p>}
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.05em] text-[#a238ff] bg-[#a238ff]/10 px-2 py-0.5 rounded">
                <DeezerIcon size={10} className="text-[#a238ff]" />
                Deezer · {typeLabel}
              </span>
            </div>

            <a
              href={meta.trackUrl} target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border border-[#a238ff]/20 bg-transparent no-underline transition-all duration-200 hover:bg-[#a238ff]/10 hover:border-[#a238ff]/50"
            >
              <ExternalLinkIcon />
            </a>
          </div>

          <div className="h-px bg-white/[0.05] mx-5" />

          {/* Inline Deezer player — always visible, plays 30s previews without login */}
          <div className="px-5 pb-4 pt-3">
            <iframe
              src={meta.embedUrl}
              height="92"
              allow="encrypted-media *; clipboard-write *;"
              className="w-full border-none block rounded-xl overflow-hidden"
              title="Deezer Player"
            />
          </div>
        </>
      )}
    </div>
  );
}
