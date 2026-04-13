import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SpotifyMeta {
  title: string;
  artist: string;
  thumbnail: string | null;
  previewUrl: string | null;
  spotifyUrl: string;
  type: string;
}

export interface SpotifyEmbedProps {
  /** Full Spotify track/album/playlist URL */
  url: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function extractSpotifyInfo(url: string): { type: string; id: string } | null {
  const m = url.match(/spotify\.com\/(track|album|playlist|artist|episode)\/([a-zA-Z0-9]+)/);
  if (m) return { type: m[1], id: m[2] };
  const m2 = url.match(/spotify:([a-zA-Z]+):([a-zA-Z0-9]+)/);
  if (m2) return { type: m2[1], id: m2[2] };
  return null;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
}

function genBarHeights(count: number): number[] {
  return Array.from({ length: count }, (_, i) => {
    const pos = i / count;
    const base = 0.3 + 0.5 * Math.abs(Math.sin(pos * Math.PI * 3.7 + 0.4));
    const noise = 0.15 * Math.random();
    return Math.max(0.08, Math.min(1, base + noise));
  });
}

/**
 * Extracts the 30s preview URL from Spotify's embed page __NEXT_DATA__ blob.
 * No Spotify API key needed — uses allorigins.win as a CORS proxy.
 */
async function fetchPreviewUrl(trackId: string): Promise<string | null> {
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
      `https://open.spotify.com/embed/track/${trackId}`
    )}`;
    const res = await fetch(proxyUrl);
    const html = await res.text();
    const match = html.match(
      /<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/
    );
    if (!match) return null;
    const data = JSON.parse(match[1]);
    return data?.props?.pageProps?.state?.data?.entity?.audioPreview?.url ?? null;
  } catch {
    return null;
  }
}

const BAR_COUNT = 60;

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
const SpotifyLogo = ({ size = 10 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.622.622 0 11-.277-1.215c3.809-.87 7.076-.496 9.712 1.115a.622.622 0 01.207.857zm1.223-2.722a.779.779 0 01-1.071.257c-2.687-1.652-6.785-2.13-9.965-1.166a.779.779 0 01-.97-.519.779.779 0 01.519-.97c3.632-1.102 8.147-.568 11.23 1.327a.779.779 0 01.257 1.07zm.105-2.835c-3.223-1.914-8.54-2.09-11.618-1.156a.935.935 0 11-.543-1.79c3.532-1.072 9.404-.865 13.115 1.338a.935.935 0 01-.954 1.608z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width={13} height={13}>
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="#8b82a8" strokeWidth={2} strokeLinecap="round" />
    <path d="M15 3h6v6M10 14L21 3" stroke="#8b82a8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const VolumeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={13} height={13} className="text-maxx-dim flex-shrink-0">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
  </svg>
);

// ---------------------------------------------------------------------------
// Waveform
// ---------------------------------------------------------------------------
function Waveform({
  progress,
  playing,
  onSeek,
  currentTime,
  duration,
}: {
  progress: number;
  playing: boolean;
  onSeek: (ratio: number) => void;
  currentTime: number;
  duration: number;
}) {
  const [barHeights] = useState(() => genBarHeights(BAR_COUNT));
  const played = Math.floor(progress * BAR_COUNT);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
  };

  return (
    <div>
      <div className="h-px bg-white/[0.05] mx-5" />
      <div className="flex items-center gap-3 px-5 py-3">
        <span className="font-mono text-[10.5px] font-semibold text-maxx-dim min-w-[32px]">
          {formatTime(currentTime)}
        </span>
        <div className="flex-1 h-9 flex items-center cursor-pointer" onClick={handleClick}>
          <div className="flex items-center gap-[1.5px] w-full h-full">
            {barHeights.map((h, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 min-w-[2px] rounded-[2px] transition-colors duration-75",
                  i < played
                    ? i === played - 1 && playing
                      ? "bg-maxx-pink"
                      : "bg-maxx-violet"
                    : "bg-maxx-violet/15"
                )}
                style={{ height: `${h * 100}%` }}
              />
            ))}
          </div>
        </div>
        <span className="font-mono text-[10.5px] font-semibold text-maxx-dim min-w-[32px] text-right">
          {formatTime(duration || 30)}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SpotifyEmbed
// ---------------------------------------------------------------------------
export default function SpotifyEmbed({ url, className = "" }: SpotifyEmbedProps) {
  const [meta, setMeta] = useState<SpotifyMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stateMsg, setStateMsg] = useState<string | null>(null);

  const [playing, setPlayingState] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);

  const animateLoop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    setProgress(audio.currentTime / (audio.duration || 30));
    rafRef.current = requestAnimationFrame(animateLoop);
  }, []);

  const setPlaying = useCallback(
    (p: boolean) => {
      setPlayingState(p);
      if (p) {
        rafRef.current = requestAnimationFrame(animateLoop);
      } else {
        cancelAnimationFrame(rafRef.current);
      }
    },
    [animateLoop]
  );

  useEffect(() => {
    if (!url) return;
    const parsed = extractSpotifyInfo(url);
    if (!parsed) { setError("Not a valid Spotify URL."); return; }

    setLoading(true);
    setError(null);
    setMeta(null);
    setStateMsg(null);
    setProgress(0);
    setCurrentTime(0);
    setPlayingState(false);
    cancelAnimationFrame(rafRef.current);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }

    const run = async () => {
      try {
        const oeRes = await fetch(
          `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`
        );
        if (!oeRes.ok) throw new Error("oEmbed failed");
        const oe = await oeRes.json();

        let title: string = oe.title ?? "Unknown";
        let artist = "Spotify";
        // oEmbed title is often "Song · Artist"
        if (title.includes("·")) {
          const parts = title.split("·");
          title = parts[0].trim();
          artist = parts.slice(1).join("·").trim();
        }

        let previewUrl: string | null = null;
        if (parsed.type === "track") {
          setStateMsg("Loading preview…");
          previewUrl = await fetchPreviewUrl(parsed.id);
        }

        setMeta({
          title,
          artist,
          thumbnail: oe.thumbnail_url ?? null,
          previewUrl,
          spotifyUrl: url,
          type: parsed.type,
        });

        if (parsed.type !== "track") {
          setStateMsg("Previews only available for tracks.");
        } else if (!previewUrl) {
          setStateMsg("Preview unavailable for this track.");
        } else {
          setStateMsg(null);
        }
      } catch {
        setError("Could not load — check that the Spotify URL is valid and public.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [url]);

  const handlePlay = async () => {
    if (!meta?.previewUrl) return;

    if (!audioRef.current) {
      const audio = new Audio(meta.previewUrl);
      audio.volume = volume;
      audio.crossOrigin = "anonymous";
      audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
      audio.addEventListener("ended", () => {
        setPlaying(false);
        setProgress(0);
        setCurrentTime(0);
      });
      audioRef.current = audio;
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setPlaying(true);
        setStateMsg(null);
      } catch {
        setStateMsg("Click play to start preview.");
      }
    }
  };

  const handleSeek = (ratio: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = ratio * (audioRef.current.duration || 30);
    setProgress(ratio);
  };

  const handleVolume = (v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  // Cleanup on unmount
  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current);
      audioRef.current?.pause();
    },
    []
  );

  const canPlay = Boolean(meta?.previewUrl && meta.type === "track");
  const showWaveform = canPlay && (playing || progress > 0);

  return (
    <div
      className={cn(
        "group relative overflow-hidden w-full rounded-2xl",
        "bg-maxx-bg2/95 border border-maxx-violet/[0.14]",
        "transition-[border-color,box-shadow] duration-300",
        "hover:border-maxx-violet/30 hover:shadow-[0_8px_40px_rgba(139,92,246,0.08)]",
        className
      )}
    >
      {/* Top shimmer — matches PostCard */}
      <div className="absolute top-0 left-0 right-0 h-px pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-maxx-violet to-transparent" />

      {/* ── Skeleton ── */}
      {loading && (
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="w-[72px] h-[72px] rounded-xl bg-maxx-violet/10 animate-pulse flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-2.5">
            <div className="h-3.5 w-3/5 rounded bg-maxx-violet/10 animate-pulse" />
            <div className="h-3 w-2/5 rounded bg-maxx-violet/[0.07] animate-pulse" />
            <div className="h-[18px] w-16 rounded bg-maxx-violet/10 animate-pulse" />
          </div>
          <div className="w-12 h-12 rounded-full bg-maxx-violet/10 animate-pulse flex-shrink-0" />
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <p className="px-5 py-4 text-[12.5px] text-red-400 text-center">{error}</p>
      )}

      {/* ── Content ── */}
      {meta && !loading && (
        <>
          {/* Main row */}
          <div className="flex items-center gap-4 px-5 pt-4 pb-4">
            {/* Artwork */}
            <div className="flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden bg-maxx-violet/10 flex items-center justify-center">
              {meta.thumbnail ? (
                <img src={meta.thumbnail} alt="" className="w-full h-full object-cover block" />
              ) : (
                <SpotifyLogo size={28} />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-maxx-white text-[14.5px] truncate leading-snug mb-1">
                {meta.title}
              </p>
              <p className="text-maxx-sub text-[12.5px] truncate mb-2">{meta.artist}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.05em] text-[#1DB954] bg-[#1DB954]/10 px-2 py-0.5 rounded">
                <SpotifyLogo size={10} />
                {meta.type}
              </span>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Volume slider */}
              <div className="flex items-center gap-1.5">
                <VolumeIcon />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => handleVolume(parseFloat(e.target.value))}
                  className="w-16 h-1 rounded-full accent-maxx-violet cursor-pointer"
                />
              </div>

              {/* Play button */}
              {meta.type === "track" && (
                <button
                  onClick={handlePlay}
                  disabled={!canPlay}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border-none flex-shrink-0",
                    "transition-all duration-200",
                    canPlay
                      ? [
                          "cursor-pointer hover:scale-105 active:scale-[0.96]",
                          playing
                            ? "bg-maxx-pink shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:brightness-110"
                            : "bg-maxx-violet hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]",
                        ]
                      : "bg-maxx-dim cursor-not-allowed"
                  )}
                >
                  {playing ? (
                    <svg viewBox="0 0 24 24" fill="white" width={20} height={20}>
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="white" width={20} height={20}>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              )}

              {/* Open on Spotify */}
              <a
                href={meta.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                  "border border-maxx-violet/20 bg-transparent no-underline",
                  "transition-all duration-200 hover:bg-maxx-violet/12 hover:border-maxx-violet/50"
                )}
              >
                <ExternalLinkIcon />
              </a>
            </div>
          </div>

          {/* Waveform — appears after first play */}
          {showWaveform && (
            <Waveform
              progress={progress}
              playing={playing}
              onSeek={handleSeek}
              currentTime={currentTime}
              duration={duration}
            />
          )}

          {/* State message */}
          {stateMsg && (
            <p className="px-5 pb-3.5 text-[11.5px] text-maxx-dim text-center">{stateMsg}</p>
          )}
        </>
      )}
    </div>
  );
}
