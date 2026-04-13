import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
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
  /** Full Deezer track, album, or playlist URL */
  url: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function extractDeezerInfo(url: string): { type: DeezerMeta["type"]; id: string } | null {
  const m = url.match(/deezer\.com(?:\/[a-z]{2})?\/([a-z]+)\/(\d+)/i);
  if (!m) return null;
  const rawType = m[1].toLowerCase();
  const typeMap: Record<string, DeezerMeta["type"]> = {
    track: "track", album: "album", playlist: "playlist",
    artist: "artist", podcast: "podcast", episode: "episode",
  };
  return { type: typeMap[rawType] ?? "unknown", id: m[2] };
}

function buildDeezerEmbedUrl(type: string, id: string): string {
  return `https://widget.deezer.com/widget/dark/${type}/${id}?autoplay=false&radius=false&tracklist=false`;
}


// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// DeezerEmbed
// ---------------------------------------------------------------------------
export default function DeezerEmbed({ url, className = "" }: DeezerEmbedProps) {
  const [meta, setMeta] = useState<DeezerMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!url) return;
    const parsed = extractDeezerInfo(url);
    if (!parsed) { setError("Not a valid Deezer URL."); return; }

    setLoading(true); setError(null); setMeta(null); setExpanded(false);

    const run = async () => {
      try {
        let title = "Deezer";
        let artist = "";
        let thumbnail: string | null = null;
        
        //console.log("parsed===>",parsed)

        
        const embedUrl = buildDeezerEmbedUrl(parsed.type, parsed.id);
        
        ///console.log("embedUrl===>", embedUrl)
        
        setMeta({
          title, artist, thumbnail,
          trackUrl: url,
          embedUrl,
          type: parsed.type,
          id: parsed.id,
        });
      } catch (e) {
        console.error(e,e.stack)
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
          <div className="w-12 h-12 rounded-full bg-[#a238ff]/10 animate-pulse flex-shrink-0" />
        </div>
      )}

      {error && <p className="px-5 py-4 text-[12.5px] text-red-400 text-center">{error}</p>}

      {meta && !loading && (
        <>
          <div className="flex items-center gap-4 px-5 pt-4 pb-4">
            <div className="flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden bg-[#a238ff]/10 flex items-center justify-center">
              {meta.thumbnail ? (
                <img src={meta.thumbnail} alt="" className="w-full h-full object-cover block" />
              ) : (
                <DeezerIcon size={32} className="text-[#a238ff] opacity-60" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-maxx-white text-[14.5px] truncate leading-snug mb-1">{meta.title}</p>
              {meta.artist && <p className="text-maxx-sub text-[12.5px] truncate mb-2">{meta.artist}</p>}
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.05em] text-[#a238ff] bg-[#a238ff]/10 px-2 py-0.5 rounded">
                <DeezerIcon size={10} className="text-[#a238ff]" />
                Deezer · {typeLabel}
              </span>
            </div>

            <div className="flex items-center gap-2.5 flex-shrink-0">
              {/* Toggle player button */}
              <button
                onClick={() => setExpanded((v) => !v)}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border-none cursor-pointer flex-shrink-0",
                  "transition-all duration-200 hover:scale-105 active:scale-[0.96]",
                  expanded
                    ? "bg-maxx-violet shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                    : "bg-[#a238ff] hover:shadow-[0_0_20px_rgba(162,56,255,0.5)]"
                )}
              >
                {expanded ? (
                  <svg viewBox="0 0 24 24" fill="white" width={18} height={18}>
                    <path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="white" width={20} height={20}><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>

              <a
                href={meta.trackUrl} target="_blank" rel="noopener noreferrer"
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                  "border border-[#a238ff]/20 bg-transparent no-underline",
                  "transition-all duration-200 hover:bg-[#a238ff]/10 hover:border-[#a238ff]/50"
                )}
              >
                <ExternalLinkIcon />
              </a>
            </div>
          </div>

          {/* Deezer's own iframe player — plays 30s previews without login */}
          {expanded && (
            <div className="mx-5 mb-4 rounded-xl overflow-hidden">
              <iframe
                src={meta.embedUrl}
                height="92"
                allow="encrypted-media *; clipboard-write *;"
                className="w-full border-none block"
                title="Deezer Player"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
