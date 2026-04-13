import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// SC Widget API types (loaded from CDN)
// ---------------------------------------------------------------------------
declare global {
  interface Window {
    SC?: {
      Widget: ((iframe: HTMLIFrameElement) => SCWidget) & {
        Events: {
          READY: string;
          PLAY: string;
          PAUSE: string;
          FINISH: string;
          ERROR: string;
        };
      };
    };
  }
}

interface SCWidget {
  bind(event: string, handler: (...args: unknown[]) => void): void;
  unbind(event: string): void;
  play(): void;
  pause(): void;
  isPaused(cb: (paused: boolean) => void): void;
  getPosition(cb: (pos: number) => void): void;
  getDuration(cb: (dur: number) => void): void;
  seekTo(ms: number): void;
  setVolume(vol: number): void;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SCMeta {
  title: string;
  artist: string;
  thumbnail: string | null;
  trackUrl: string;
  type: "track" | "playlist";
}

export interface SoundCloudEmbedProps {
  url: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatMs(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
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

const SC_WIDGET_API = "https://w.soundcloud.com/player/api.js";
const BAR_COUNT = 60;

function loadSCApi(): Promise<void> {
  if (window.SC) return Promise.resolve();
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = SC_WIDGET_API;
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
const SCLogo = ({ size = 10, className = "" }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 80 80" fill="currentColor" width={size} height={size} className={className}>
    <path d="M4 52a4 4 0 008 0V44a4 4 0 00-8 0v8zm10-6a4 4 0 008 0V34a4 4 0 00-8 0v12zm10-4a4 4 0 008 0V28a4 4 0 00-8 0v14zm10 2a4 4 0 008 0V24a4 4 0 00-8 0v20zm10-8a4 4 0 008 0V16a4 4 0 00-8 0v20zm14-10C52 11.6 44.4 4 35 4c-.7 0-1.4.1-2.1.2A28 28 0 0060 38v14a8 8 0 0016 0V36a16 16 0 00-28-10z" />
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
  currentMs,
  durationMs,
}: {
  progress: number;
  playing: boolean;
  onSeek: (ratio: number) => void;
  currentMs: number;
  durationMs: number;
}) {
  const [barHeights] = useState(() => genBarHeights(BAR_COUNT));

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
  };

  return (
    <div>
      <div className="h-px bg-white/[0.05] mx-5" />
      <div className="flex items-center gap-3 px-5 py-3">
        <span className="font-mono text-[10.5px] font-semibold text-maxx-dim min-w-[32px]">
          {formatMs(currentMs)}
        </span>
        {/* Waveform: all bars rendered in a relative container.
            A single absolutely-positioned orange overlay is clipped to `progress`%
            width, revealing played bars continuously — no per-bar threshold needed. */}
        <div className="flex-1 h-9 flex items-center cursor-pointer relative" onClick={handleClick}>
          {/* Unplayed bars (dim) — full width, always visible */}
          <div className="flex items-center gap-[1.5px] w-full h-full">
            {barHeights.map((h, i) => (
              <div
                key={i}
                className="flex-1 min-w-[2px] rounded-[2px] bg-[#ff5500]/12"
                style={{ height: `${h * 100}%` }}
              />
            ))}
          </div>
          {/* Played overlay (orange) — clipped from the right by progress */}
          <div
            className="absolute inset-0 flex items-center gap-[1.5px]"
            style={{
              clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)`,
              transition: playing ? "clip-path 1000ms linear" : "none",
            }}
          >
            {barHeights.map((h, i) => (
              <div
                key={i}
                className="flex-1 min-w-[2px] rounded-[2px] bg-[#ff5500]"
                style={{ height: `${h * 100}%` }}
              />
            ))}
          </div>
          {/* Leading-edge overlay (purple) — a ~1.8% wide sliver at the playhead */}
          {playing && (
            <div
              className="absolute inset-0 flex items-center gap-[1.5px]"
              style={{
                clipPath: `inset(0 ${(1 - progress) * 100}% 0 ${Math.max(0, progress * 100 - 1.8)}%)`,
                transition: "clip-path 1000ms linear",
              }}
            >
              {barHeights.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 min-w-[2px] rounded-[2px] bg-maxx-violet"
                  style={{ height: `${h * 100}%` }}
                />
              ))}
            </div>
          )}
        </div>
        <span className="font-mono text-[10.5px] font-semibold text-maxx-dim min-w-[32px] text-right">
          {durationMs > 0 ? formatMs(durationMs) : "-"}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SoundCloudEmbed
// ---------------------------------------------------------------------------
export default function SoundCloudEmbed({ url, className = "" }: SoundCloudEmbedProps) {
  const [meta, setMeta] = useState<SCMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stateMsg, setStateMsg] = useState<string | null>(null);

  const [playing, setPlayingState] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const [currentMs, setCurrentMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(80);
  const [showWaveform, setShowWaveform] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<SCWidget | null>(null);
  // Holds the setInterval id for the 1-second position poll
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playingRef = useRef(false);

  // Keep durationMs in a ref so syncPosition always reads the latest value
  // without needing to be a dependency (avoids stale closures).
  const durationMsRef = useRef(0);
  useEffect(() => {
    durationMsRef.current = durationMs;
  }, [durationMs]);

  // Poll the widget position once — called on play start and then every second.
  const syncPosition = useCallback(() => {
    const w = widgetRef.current;
    if (!w || !playingRef.current) return;
    w.getPosition((pos) => {
      setCurrentMs(pos);
      const dur = durationMsRef.current;
      setProgress(dur > 0 ? pos / dur : 0);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setPlaying = useCallback(
    (p: boolean) => {
      playingRef.current = p;
      setPlayingState(p);
      if (p) {
        setShowWaveform(true);
        // Sync immediately so bars don't lag on play, then update every second.
        syncPosition();
        intervalRef.current = setInterval(syncPosition, 1000);
      } else {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    },
    [syncPosition]
  );

  // Load & init widget whenever url changes
  useEffect(() => {
    if (!url || !meta) return;

    const iframe = iframeRef.current;
    if (!iframe) return;

    setWidgetReady(false);
    setPlayingState(false);
    playingRef.current = false;
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentMs(0);
    setProgress(0);
    setDurationMs(0);
    durationMsRef.current = 0;
    setShowWaveform(false);
    setStateMsg("Connecting player...");

    const embedUrl =
      `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}` +
      `&auto_play=false&hide_related=true&show_comments=false&show_user=false` +
      `&show_reposts=false&visual=false&color=ff5500`;

    iframe.src = embedUrl;

    loadSCApi().then(() => {
      if (!window.SC || !iframeRef.current) return;
      const widget = window.SC.Widget(iframeRef.current);
      widgetRef.current = widget;

      widget.bind(window.SC.Widget.Events.READY, () => {
        widget.setVolume(volume);
        widget.getDuration((d) => {
          // Set both state AND ref immediately so syncPosition has the value
          // before the next render cycle.
          durationMsRef.current = d;
          setDurationMs(d);
        });
        setWidgetReady(true);
        setStateMsg(null);
      });

      widget.bind(window.SC.Widget.Events.PLAY, () => setPlaying(true));
      widget.bind(window.SC.Widget.Events.PAUSE, () => setPlaying(false));
      widget.bind(window.SC.Widget.Events.FINISH, () => {
        setPlaying(false);
        setCurrentMs(0);
        setProgress(0);
      });
      widget.bind(window.SC.Widget.Events.ERROR, () => {
        setStateMsg("Playback unavailable. Open on SoundCloud to listen.");
      });
    });

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [url, meta]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch oEmbed metadata
  useEffect(() => {
    if (!url) return;

    setLoading(true);
    setError(null);
    setMeta(null);
    setStateMsg(null);

    const run = async () => {
      try {
        const res = await fetch(
          `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(url)}`
        );
        if (!res.ok) throw new Error("oEmbed failed");
        const oe = await res.json();

        const title: string = oe.title ?? "Unknown";
        const artist: string = oe.author_name ?? "SoundCloud";
        const isPlaylist = /\/sets\//.test(url) || /\/playlists\//.test(url);

        let thumbnail: string | null = oe.thumbnail_url ?? null;
        if (thumbnail) thumbnail = thumbnail.replace("-large", "-t300x300");

        setMeta({
          title,
          artist,
          thumbnail,
          trackUrl: url,
          type: isPlaylist ? "playlist" : "track",
        });
      } catch {
        setError("Could not load — check that the SoundCloud URL is valid and public.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [url]);

  const handlePlay = () => {
    const w = widgetRef.current;
    if (!w || !widgetReady) return;
    w.isPaused((paused) => {
      if (paused) w.play();
      else w.pause();
    });
  };

  const handleSeek = (ratio: number) => {
    const w = widgetRef.current;
    if (!w || !widgetReady || durationMsRef.current === 0) return;
    w.seekTo(ratio * durationMsRef.current);
    // Update both immediately so the UI doesn't wait for the next poll tick.
    setProgress(ratio);
    setCurrentMs(ratio * durationMsRef.current);
  };

  const handleVolume = (v: number) => {
    setVolumeState(v);
    widgetRef.current?.setVolume(v);
  };

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    },
    []
  );

  return (
    <div
      className={cn(
        "group relative overflow-hidden w-full rounded-2xl",
        "bg-maxx-bg2/95 border border-maxx-violet/[0.14]",
        "transition-[border-color,box-shadow] duration-300",
        "hover:border-[#ff5500]/25 hover:shadow-[0_8px_40px_rgba(255,85,0,0.07)]",
        className
      )}
    >
      {/* Top shimmer */}
      <div className="absolute top-0 left-0 right-0 h-px pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-[#ff5500] to-transparent" />

      {/* Hidden SC widget iframe — required for Widget API */}
      <iframe
        ref={iframeRef}
        title="SoundCloud player"
        allow="autoplay"
        className="hidden w-0 h-0 border-none"
      />

      {/* Skeleton */}
      {loading && (
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="w-[72px] h-[72px] rounded-xl bg-[#ff5500]/10 animate-pulse flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-2.5">
            <div className="h-3.5 w-3/5 rounded bg-[#ff5500]/10 animate-pulse" />
            <div className="h-3 w-2/5 rounded bg-[#ff5500]/[0.07] animate-pulse" />
            <div className="h-[18px] w-16 rounded bg-[#ff5500]/10 animate-pulse" />
          </div>
          <div className="w-12 h-12 rounded-full bg-[#ff5500]/10 animate-pulse flex-shrink-0" />
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="px-5 py-4 text-[12.5px] text-red-400 text-center">{error}</p>
      )}

      {/* Content */}
      {meta && !loading && (
        <>
          {/* Main row */}
          <div className="flex items-center gap-4 px-5 pt-4 pb-4">
            {/* Artwork */}
            <div className="flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden bg-[#ff5500]/10 flex items-center justify-center">
              {meta.thumbnail ? (
                <img src={meta.thumbnail} alt="" className="w-full h-full object-cover block" />
              ) : (
                <SCLogo size={32} className="text-[#ff5500] opacity-50" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-maxx-white text-[14.5px] truncate leading-snug mb-1">
                {meta.title}
              </p>
              <p className="text-maxx-sub text-[12.5px] truncate mb-2">{meta.artist}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.05em] text-[#ff5500] bg-[#ff5500]/10 px-2 py-0.5 rounded">
                <SCLogo size={10} className="text-[#ff5500]" />
                {meta.type}
              </span>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
              {/* Volume */}
              <div className="hidden sm:flex items-center gap-1.5">
                <VolumeIcon />
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={volume}
                  onChange={(e) => handleVolume(parseInt(e.target.value))}
                  className="w-16 h-1 rounded-full cursor-pointer accent-[#ff5500]"
                />
              </div>

              {/* Play button */}
              <button
                onClick={handlePlay}
                disabled={!widgetReady}
                className={cn(
                  "w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-none flex-shrink-0",
                  "action-btn",
                  widgetReady
                    ? [
                        "cursor-pointer hover:scale-105 active:scale-[0.96]",
                        playing
                          ? "bg-maxx-violet shadow-[0_0_20px_rgba(139,92,246,0.45)] hover:brightness-110 transition-all duration-10"
                          : "bg-[#ff5500] hover:shadow-[0_0_20px_rgba(255,85,0,0.5)] hover:bg-[#ff6a1f]",
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

              {/* Open on SoundCloud */}
              <a
                href={meta.trackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                  "border border-[#ff5500]/20 bg-transparent no-underline",
                  "transition-all duration-200 hover:bg-[#ff5500]/10 hover:border-[#ff5500]/50"
                )}
              >
                <ExternalLinkIcon />
              </a>
            </div>
          </div>

          {/* Waveform */}
          {showWaveform && (
            <Waveform
              progress={progress}
              playing={playing}
              onSeek={handleSeek}
              currentMs={currentMs}
              durationMs={durationMs}
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
