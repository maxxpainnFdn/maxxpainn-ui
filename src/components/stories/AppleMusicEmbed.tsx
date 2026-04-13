import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AppleMeta {
  title: string;
  artist: string;
  thumbnail: string | null;
  embedUrl: string;
  trackUrl: string;
  type: "song" | "album" | "playlist" | "artist" | "unknown";
}

export interface AppleMusicEmbedProps {
  url: string;
  className?: string;
}

function extractAppleInfo(url: string): { type: AppleMeta["type"]; id: string; storefront: string } | null {
  const m = url.match(/music\.apple\.com\/([a-z]{2})\/(album|playlist|artist|song|music-video)\/[^/]+\/([^?#]+)/);
  if (!m) return null;
  const [, storefront, rawType, id] = m;
  let type: AppleMeta["type"] = "unknown";
  if (rawType === "song" || url.includes("?i=")) type = "song";
  else if (rawType === "album") type = "album";
  else if (rawType === "playlist") type = "playlist";
  else if (rawType === "artist") type = "artist";
  return { type, id, storefront };
}

function buildEmbedUrl(url: string): string {
  const base = url.replace("https://music.apple.com/", "https://embed.music.apple.com/").split("?")[0];
  return `${base}?theme=dark`;
}

const AppleIcon = ({ size = 10, className = "" }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width={13} height={13}>
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="#8b82a8" strokeWidth={2} strokeLinecap="round" />
    <path d="M15 3h6v6M10 14L21 3" stroke="#8b82a8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function AppleMusicEmbed({ url, className = "" }: AppleMusicEmbedProps) {
  const [meta, setMeta] = useState<AppleMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;
    const parsed = extractAppleInfo(url);
    if (!parsed) { setError("Not a valid Apple Music URL."); return; }

    setLoading(true); setError(null); setMeta(null);

    const run = async () => {
      try {
        let title = "Apple Music";
        let artist = "";
        let thumbnail: string | null = null;

        const isPlaylist = url.includes("/playlist/");
        if (!isPlaylist) {
          const lookupId = url.match(/\/(\d+)(?:\?i=(\d+))?$/);
          const trackId = lookupId?.[2] || lookupId?.[1];
          if (trackId) {
            const res = await fetch(`https://itunes.apple.com/lookup?id=${trackId}&entity=song&limit=1`);
            if (res.ok) {
              const data = await res.json();
              const item = data?.results?.[0];
              if (item) {
                title = item.trackName || item.collectionName || title;
                artist = item.artistName || "";
                thumbnail = item.artworkUrl100?.replace("100x100", "300x300") ?? null;
              }
            }
          }
        } else {
          title = "Apple Music Playlist";
        }

        setMeta({ title, artist, thumbnail, embedUrl: buildEmbedUrl(url), trackUrl: url, type: parsed.type });
      } catch {
        setError("Could not load — check that the Apple Music URL is valid.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [url]);

  return (
    <div
      className={cn(
        "group relative overflow-hidden w-full rounded-2xl",
        "bg-maxx-bg2/95 border border-maxx-violet/[0.14]",
        "transition-[border-color,box-shadow] duration-300",
        "hover:border-[#fc3c44]/25 hover:shadow-[0_8px_40px_rgba(252,60,68,0.07)]",
        className
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-px pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-[#fc3c44] to-transparent" />

      {loading && (
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="w-[72px] h-[72px] rounded-xl bg-[#fc3c44]/10 animate-pulse flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-2.5">
            <div className="h-3.5 w-3/5 rounded bg-[#fc3c44]/10 animate-pulse" />
            <div className="h-3 w-2/5 rounded bg-[#fc3c44]/[0.07] animate-pulse" />
            <div className="h-[18px] w-20 rounded bg-[#fc3c44]/10 animate-pulse" />
          </div>
          <div className="w-9 h-9 rounded-full bg-[#fc3c44]/10 animate-pulse flex-shrink-0" />
        </div>
      )}

      {error && <p className="px-5 py-4 text-[12.5px] text-red-400 text-center">{error}</p>}

      {meta && !loading && (
        <>
          {/* Info row */}
          <div className="flex items-center gap-4 px-5 pt-4 pb-3">
            <div className="flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden bg-[#fc3c44]/10 flex items-center justify-center">
              {meta.thumbnail
                ? <img src={meta.thumbnail} alt="" className="w-full h-full object-cover block" />
                : <AppleIcon size={32} className="text-[#fc3c44] opacity-60" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-maxx-white text-[14.5px] truncate leading-snug mb-1">{meta.title}</p>
              {meta.artist && <p className="text-maxx-sub text-[12.5px] truncate mb-2">{meta.artist}</p>}
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.05em] text-[#fc3c44] bg-[#fc3c44]/10 px-2 py-0.5 rounded">
                <AppleIcon size={10} className="text-[#fc3c44]" />
                Apple Music
              </span>
            </div>

            <a
              href={meta.trackUrl} target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border border-[#fc3c44]/20 bg-transparent no-underline transition-all duration-200 hover:bg-[#fc3c44]/10 hover:border-[#fc3c44]/50"
            >
              <ExternalLinkIcon />
            </a>
          </div>

          <div className="h-px bg-white/[0.05] mx-5" />

          {/* Inline player — always visible, 30s previews without login */}
          <div className="px-5 pb-4 pt-3">
            <iframe
              src={meta.embedUrl}
              height="150"
              allow="autoplay *; encrypted-media *; fullscreen *"
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
              className="w-full border-none block rounded-xl"
              title="Apple Music Player"
            />
          </div>
        </>
      )}
    </div>
  );
}
