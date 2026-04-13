import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// YT IFrame API types
// ---------------------------------------------------------------------------
declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement | string,
        opts: {
          videoId?: string;
          width?: number | string;
          height?: number | string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (e: { target: YTPlayer }) => void;
            onStateChange?: (e: { data: number; target: YTPlayer }) => void;
            onError?: (e: { data: number }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number; BUFFERING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(volume: number): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  destroy(): void;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface YTMeta {
  title: string;
  channelTitle: string;
  thumbnail: string | null;
  videoId: string;
  videoUrl: string;
  duration: number; // seconds
}

export interface YouTubeMusicEmbedProps {
  /** YouTube Music or youtube.com/watch URL */
  url: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function extractVideoId(url: string): string | null {
  // youtube.com/watch?v=ID, youtu.be/ID, music.youtube.com/watch?v=ID
  const m =
    url.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ||
    url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ||
    url.match(/embed\/([a-zA-Z0-9_-]{11})/);
  return m?.[1] ?? null;
}

function parseISO8601Duration(d: string): number {
  const m = d.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (parseInt(m[1] || "0") * 3600) + (parseInt(m[2] || "0") * 60) + parseInt(m[3] || "0");
}

function formatSecs(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
}

function genBarHeights(count: number): number[] {
  return Array.from({ length: count }, (_, i) => {
    const pos = i / count;
    const base = 0.3 + 0.5 * Math.abs(Math.sin(pos * Math.PI * 3.7 + 0.4));
    return Math.max(0.08, Math.min(1, base + 0.15 * Math.random()));
  });
}

const BAR_COUNT = 60;
let ytApiLoadPromise: Promise<void> | null = null;

function loadYTApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (ytApiLoadPromise) return ytApiLoadPromise;
  ytApiLoadPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  });
  return ytApiLoadPromise;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
const YTMusicIcon = ({ size = 10, className = "" }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className}>
    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z" />
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
  progress, playing, onSeek, currentSecs, durationSecs,
}: {
  progress: number; playing: boolean; onSeek: (r: number) => void; currentSecs: number; durationSecs: number;
}) {
  const [barHeights] = useState(() => genBarHeights(BAR_COUNT));
  const played = Math.floor(progress * BAR_COUNT);

  return (
    <div>
      <div className="h-px bg-white/[0.05] mx-5" />
      <div className="flex items-center gap-3 px-5 py-3">
        <span className="font-mono text-[10.5px] font-semibold text-maxx-dim min-w-[32px]">{formatSecs(currentSecs)}</span>
        <div
          className="flex-1 h-9 flex items-center cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            onSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
          }}
        >
          <div className="flex items-center gap-[1.5px] w-full h-full">
            {barHeights.map((h, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 min-w-[2px] rounded-[2px] transition-colors duration-75",
                  i < played
                    ? i === played - 1 && playing ? "bg-[#ff0000]" : "bg-[#ff0000]/80"
                    : "bg-[#ff0000]/12"
                )}
                style={{ height: `${h * 100}%` }}
              />
            ))}
          </div>
        </div>
        <span className="font-mono text-[10.5px] font-semibold text-maxx-dim min-w-[32px] text-right">
          {durationSecs > 0 ? formatSecs(durationSecs) : "—"}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// YouTubeMusicEmbed
// ---------------------------------------------------------------------------
export default function YouTubeMusicEmbed({ url, className = "" }: YouTubeMusicEmbedProps) {
  const [meta, setMeta] = useState<YTMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stateMsg, setStateMsg] = useState<string | null>(null);

  const [playing, setPlayingState] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const [currentSecs, setCurrentSecs] = useState(0);
  const [durationSecs, setDurationSecs] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(80);
  const [showWaveform, setShowWaveform] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playingRef = useRef(false);

  const startPolling = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      const cur = p.getCurrentTime();
      const dur = p.getDuration();
      setCurrentSecs(cur);
      setDurationSecs(dur);
      setProgress(dur > 0 ? cur / dur : 0);
    }, 250);
  }, []);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  // Fetch metadata via YouTube oEmbed (no API key)
  useEffect(() => {
    if (!url) return;
    const videoId = extractVideoId(url);
    if (!videoId) { setError("Not a valid YouTube Music or YouTube URL."); return; }

    setLoading(true); setError(null); setMeta(null); setStateMsg(null);
    setProgress(0); setCurrentSecs(0); setDurationSecs(0);
    setPlayingState(false); setShowWaveform(false); setWidgetReady(false);
    playingRef.current = false; stopPolling();
    playerRef.current?.destroy(); playerRef.current = null;

    const run = async () => {
      try {
        // YouTube oEmbed — no key needed
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
        if (!res.ok) throw new Error("oEmbed failed");
        const oe = await res.json();

        setMeta({
          title: oe.title ?? "Unknown",
          channelTitle: oe.author_name ?? "YouTube",
          thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
          videoId,
          videoUrl: `https://music.youtube.com/watch?v=${videoId}`,
          duration: 0,
        });
        setStateMsg("Player ready — click play");
      } catch {
        setError("Could not load — check that the YouTube URL is valid and public.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [url, stopPolling]);

  // Init YT player once meta is loaded
  useEffect(() => {
    if (!meta || !containerRef.current) return;
    let cancelled = false;

    loadYTApi().then(() => {
      if (cancelled || !containerRef.current || !window.YT) return;

      const player = new window.YT.Player(containerRef.current, {
        videoId: meta.videoId,
        width: "1",
        height: "1",
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: (e) => {
            e.target.setVolume(volume);
            const dur = e.target.getDuration();
            if (dur) setDurationSecs(dur);
            setWidgetReady(true);
            setStateMsg(null);
          },
          onStateChange: (e) => {
            const PLAYING = window.YT?.PlayerState.PLAYING ?? 1;
            const PAUSED = window.YT?.PlayerState.PAUSED ?? 2;
            const ENDED = window.YT?.PlayerState.ENDED ?? 0;
            if (e.data === PLAYING) {
              playingRef.current = true;
              setPlayingState(true);
              setShowWaveform(true);
              startPolling();
            } else if (e.data === PAUSED) {
              playingRef.current = false;
              setPlayingState(false);
              stopPolling();
            } else if (e.data === ENDED) {
              playingRef.current = false;
              setPlayingState(false);
              setProgress(0); setCurrentSecs(0);
              stopPolling();
            }
          },
          onError: () => {
            setStateMsg("Playback unavailable — video may be restricted.");
            setWidgetReady(false);
          },
        },
      });
      playerRef.current = player;
    });

    return () => { cancelled = true; };
  }, [meta]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePlay = () => {
    const p = playerRef.current;
    if (!p || !widgetReady) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
  };

  const handleSeek = (ratio: number) => {
    const p = playerRef.current;
    if (!p || durationSecs === 0) return;
    p.seekTo(ratio * durationSecs, true);
    setProgress(ratio);
  };

  const handleVolume = (v: number) => {
    setVolumeState(v);
    playerRef.current?.setVolume(v);
  };

  useEffect(() => () => { stopPolling(); playerRef.current?.destroy(); }, [stopPolling]);

  return (
    <div
      className={cn(
        "group relative overflow-hidden w-full rounded-2xl",
        "bg-maxx-bg2/95 border border-maxx-violet/[0.14]",
        "transition-[border-color,box-shadow] duration-300",
        "hover:border-[#ff0000]/25 hover:shadow-[0_8px_40px_rgba(255,0,0,0.06)]",
        className
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-px pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-[#ff0000] to-transparent" />

      {/* Hidden YT player container — 1px so it doesn't affect layout */}
      <div ref={containerRef} className="absolute opacity-0 pointer-events-none w-px h-px overflow-hidden" />

      {loading && (
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="w-[72px] h-[72px] rounded-xl bg-[#ff0000]/10 animate-pulse flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-2.5">
            <div className="h-3.5 w-3/5 rounded bg-[#ff0000]/10 animate-pulse" />
            <div className="h-3 w-2/5 rounded bg-[#ff0000]/[0.07] animate-pulse" />
            <div className="h-[18px] w-24 rounded bg-[#ff0000]/10 animate-pulse" />
          </div>
          <div className="w-12 h-12 rounded-full bg-[#ff0000]/10 animate-pulse flex-shrink-0" />
        </div>
      )}

      {error && <p className="px-5 py-4 text-[12.5px] text-red-400 text-center">{error}</p>}

      {meta && !loading && (
        <>
          <div className="flex items-center gap-4 px-5 pt-4 pb-4">
            <div className="flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden bg-[#ff0000]/10 flex items-center justify-center">
              {meta.thumbnail ? (
                <img src={meta.thumbnail} alt="" className="w-full h-full object-cover block" />
              ) : (
                <YTMusicIcon size={32} className="text-[#ff0000] opacity-60" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-maxx-white text-[14.5px] truncate leading-snug mb-1">{meta.title}</p>
              <p className="text-maxx-sub text-[12.5px] truncate mb-2">{meta.channelTitle}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.05em] text-[#ff0000] bg-[#ff0000]/10 px-2 py-0.5 rounded">
                <YTMusicIcon size={10} className="text-[#ff0000]" />
                YouTube Music
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
              <div className="hidden sm:flex items-center gap-1.5">
                <VolumeIcon />
                <input
                  type="range" min={0} max={100} step={1} value={volume}
                  onChange={(e) => handleVolume(parseInt(e.target.value))}
                  className="w-16 h-1 rounded-full cursor-pointer accent-[#ff0000]"
                />
              </div>

              <button
                onClick={handlePlay}
                disabled={!widgetReady}
                className={cn(
                  "w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-none flex-shrink-0",
                  "transition-all duration-200",
                  widgetReady
                    ? [
                        "cursor-pointer hover:scale-105 active:scale-[0.96]",
                        playing
                          ? "bg-maxx-violet shadow-[0_0_20px_rgba(139,92,246,0.45)] hover:brightness-110"
                          : "bg-[#ff0000] hover:shadow-[0_0_20px_rgba(255,0,0,0.4)] hover:bg-[#ff2020]",
                      ]
                    : "bg-maxx-dim cursor-not-allowed"
                )}
              >
                {playing ? (
                  <svg viewBox="0 0 24 24" fill="white" width={20} height={20}><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="white" width={20} height={20}><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>

              <a
                href={meta.videoUrl} target="_blank" rel="noopener noreferrer"
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                  "border border-[#ff0000]/20 bg-transparent no-underline",
                  "transition-all duration-200 hover:bg-[#ff0000]/10 hover:border-[#ff0000]/50"
                )}
              >
                <ExternalLinkIcon />
              </a>
            </div>
          </div>

          {showWaveform && (
            <Waveform
              progress={progress} playing={playing}
              onSeek={handleSeek} currentSecs={currentSecs} durationSecs={durationSecs}
            />
          )}

          {stateMsg && (
            <p className="px-5 pb-3.5 text-[11.5px] text-maxx-dim text-center">{stateMsg}</p>
          )}
        </>
      )}
    </div>
  );
}
