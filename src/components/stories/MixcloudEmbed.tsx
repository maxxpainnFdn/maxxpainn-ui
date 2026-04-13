import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Mixcloud Widget API types
// ---------------------------------------------------------------------------
declare global {
  interface Window {
    Mixcloud?: {
      PlayerWidget: (iframe: HTMLIFrameElement) => MixcloudWidget;
    };
  }
}

interface MixcloudWidget {
  ready: Promise<void>;
  events: {
    play: { on: (cb: () => void) => void; off: () => void };
    pause: { on: (cb: () => void) => void; off: () => void };
    ended: { on: (cb: () => void) => void; off: () => void };
    error: { on: (cb: (e: unknown) => void) => void; off: () => void };
    progress: {
      on: (cb: (sec: number, dur: number) => void) => void;
      off: () => void;
    };
    buffering: { on: (cb: () => void) => void; off: () => void };
  };
  play(): Promise<void>;
  pause(): Promise<void>;
  seek(seconds: number): Promise<void>;
  getPosition(): Promise<number>;
  getDuration(): Promise<number>;
  getIsPaused(): Promise<boolean>;
  load(feedPath: string, autoPlay: boolean): void;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface MCMeta {
  title: string;
  uploader: string;
  thumbnail: string | null;
  trackUrl: string;
  feedPath: string; // e.g. /artist/show-name/
  type: "cloudcast" | "playlist" | "profile" | "unknown";
}

export interface MixcloudEmbedProps {
  /** Full Mixcloud show, mix, or playlist URL */
  url: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function extractMCInfo(url: string): { feedPath: string; type: MCMeta["type"] } | null {
  // https://www.mixcloud.com/artist/show-name/
  // https://www.mixcloud.com/artist/  (profile)
  // https://www.mixcloud.com/artist/playlists/playlist-name/
  if (!url.includes("mixcloud.com")) return null;

  const m = url.match(/mixcloud\.com(\/[^?#]+)/);
  if (!m) return null;

  let feedPath = m[1];
  if (!feedPath.endsWith("/")) feedPath += "/";

  const parts = feedPath.split("/").filter(Boolean);
  let type: MCMeta["type"] = "unknown";
  if (parts.length === 1) type = "profile";
  else if (parts.includes("playlists") || parts.includes("playlist")) type = "playlist";
  else if (parts.length === 2) type = "cloudcast";

  return { feedPath, type };
}

function buildEmbedUrl(feedPath: string): string {
  return `https://www.mixcloud.com/widget/iframe/?feed=${encodeURIComponent(
    feedPath
  )}&hide_cover=1&mini=0&hide_artwork=0&autoplay=0&light=0`;
}

function formatSecs(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  if (h > 0) return `${h}:${m < 10 ? "0" : ""}${m}:${sec < 10 ? "0" : ""}${sec}`;
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
const MC_TEAL = "#52aad8"; // Mixcloud brand blue
const MC_PURPLE = "#7c4dff"; // Mixcloud secondary

let mcApiPromise: Promise<void> | null = null;
function loadMCApi(): Promise<void> {
  if (window.Mixcloud) return Promise.resolve();
  if (mcApiPromise) return mcApiPromise;
  mcApiPromise = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://widget.mixcloud.com/media/js/widgetApi.js";
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
  return mcApiPromise;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
const MixcloudIcon = ({ size = 10, className = "" }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className}>
    <path d="M11.8 4C7.6 4 4.2 7.4 4.2 11.6c0 .9.2 1.8.5 2.7L3 16c-.2.2-.1.5.2.5l3.3-.3c1.2 1 2.8 1.6 4.4 1.6h.1C15 17.8 18.4 14.4 18.4 10.2 18.4 6.7 15.5 4 11.8 4zm0 12.4h-.1c-1.3 0-2.5-.5-3.5-1.3l-.2-.2-2.3.2 1-2.1-.2-.3c-.4-.8-.6-1.7-.6-2.7 0-3.5 2.8-6.3 6.3-6.3 2.9 0 5.4 2 6 4.9.1.4.1.9.1 1.4-.1 3.5-2.9 6.4-6.5 6.4zm3.5-8.3l-3.9 3.9-1.5-1.5-.7.7 2.2 2.2 4.6-4.6-.7-.7z" />
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
  progress: number; playing: boolean; onSeek: (r: number) => void;
  currentSecs: number; durationSecs: number;
}) {
  const [barHeights] = useState(() => genBarHeights(BAR_COUNT));
  const played = Math.floor(progress * BAR_COUNT);

  return (
    <div>
      <div className="h-px bg-white/[0.05] mx-5" />
      <div className="flex items-center gap-3 px-5 py-3">
        <span className="font-mono text-[10.5px] font-semibold text-maxx-dim min-w-[36px]">
          {formatSecs(currentSecs)}
        </span>
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
                className="flex-1 min-w-[2px] rounded-[2px] transition-colors duration-75"
                style={{
                  height: `${h * 100}%`,
                  background:
                    i < played
                      ? i === played - 1 && playing
                        ? MC_PURPLE
                        : MC_TEAL
                      : `${MC_TEAL}20`,
                }}
              />
            ))}
          </div>
        </div>
        <span className="font-mono text-[10.5px] font-semibold text-maxx-dim min-w-[36px] text-right">
          {durationSecs > 0 ? formatSecs(durationSecs) : "—"}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MixcloudEmbed
// ---------------------------------------------------------------------------
export default function MixcloudEmbed({ url, className = "" }: MixcloudEmbedProps) {
  const [meta, setMeta] = useState<MCMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stateMsg, setStateMsg] = useState<string | null>(null);

  const [playing, setPlayingState] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const [currentSecs, setCurrentSecs] = useState(0);
  const [durationSecs, setDurationSecs] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showWaveform, setShowWaveform] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<MixcloudWidget | null>(null);
  const playingRef = useRef(false);

  // Fetch oEmbed metadata
  useEffect(() => {
    if (!url) return;
    const parsed = extractMCInfo(url);
    if (!parsed) { setError("Not a valid Mixcloud URL."); return; }

    setLoading(true); setError(null); setMeta(null); setStateMsg(null);
    setProgress(0); setCurrentSecs(0); setDurationSecs(0);
    setPlayingState(false); playingRef.current = false;
    setShowWaveform(false); setWidgetReady(false);
    widgetRef.current = null;

    const run = async () => {
      try {
        let title = parsed.feedPath.split("/").filter(Boolean).pop() ?? "Mixcloud";
        title = title.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        let uploader = parsed.feedPath.split("/").filter(Boolean)[0] ?? "";
        uploader = uploader.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        let thumbnail: string | null = null;

        // oEmbed — no auth needed
        try {
          const oeRes = await fetch(
            `https://www.mixcloud.com/oembed/?url=${encodeURIComponent(url)}&format=json`
          );
          if (oeRes.ok) {
            const oe = await oeRes.json();
            if (oe.title) title = oe.title;
            if (oe.author_name) uploader = oe.author_name;
            if (oe.thumbnail_url) thumbnail = oe.thumbnail_url;
          }
        } catch { /* fall through */ }

        setMeta({
          title, uploader, thumbnail,
          trackUrl: url,
          feedPath: parsed.feedPath,
          type: parsed.type,
        });
        setStateMsg("Connecting player…");
      } catch {
        setError("Could not load — check that the Mixcloud URL is valid and public.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [url]);

  // Init Widget API once meta is ready and iframe is mounted
  useEffect(() => {
    if (!meta || !iframeRef.current) return;
    let cancelled = false;

    // Set iframe src
    iframeRef.current.src = buildEmbedUrl(meta.feedPath);

    loadMCApi().then(() => {
      if (cancelled || !iframeRef.current || !window.Mixcloud) return;

      const widget = window.Mixcloud.PlayerWidget(iframeRef.current);
      widgetRef.current = widget;

      widget.ready.then(() => {
        if (cancelled) return;
        setWidgetReady(true);
        setStateMsg(null);

        widget.getDuration().then((d) => {
          if (d > 0) setDurationSecs(d);
        });

        widget.events.play.on(() => {
          playingRef.current = true;
          setPlayingState(true);
          setShowWaveform(true);
          // Get duration once playing starts (Mixcloud loads it lazily)
          widget.getDuration().then((d) => { if (d > 0) setDurationSecs(d); });
        });

        widget.events.pause.on(() => {
          playingRef.current = false;
          setPlayingState(false);
        });

        widget.events.ended.on(() => {
          playingRef.current = false;
          setPlayingState(false);
          setCurrentSecs(0);
          setProgress(0);
        });

        widget.events.progress.on((sec, dur) => {
          setCurrentSecs(sec);
          if (dur > 0) {
            setDurationSecs(dur);
            setProgress(sec / dur);
          }
        });

        widget.events.error.on(() => {
          setStateMsg("Playback unavailable. Open on Mixcloud to listen.");
          setWidgetReady(false);
        });
      });
    });

    return () => { cancelled = true; };
  }, [meta]);

  const handlePlay = async () => {
    const w = widgetRef.current;
    if (!w || !widgetReady) return;
    const paused = await w.getIsPaused();
    if (paused) await w.play();
    else await w.pause();
  };

  const handleSeek = async (ratio: number) => {
    const w = widgetRef.current;
    if (!w || !widgetReady || durationSecs === 0) return;
    await w.seek(ratio * durationSecs);
    setProgress(ratio);
  };

  const typeLabel =
    meta?.type === "cloudcast" ? "Show"
    : meta?.type === "playlist" ? "Playlist"
    : meta?.type === "profile" ? "Profile"
    : "Mix";

  return (
    <div
      className={cn(
        "group relative overflow-hidden w-full rounded-2xl",
        "bg-maxx-bg2/95 border border-maxx-violet/[0.14]",
        "transition-[border-color,box-shadow] duration-300",
        className
      )}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${MC_TEAL}35`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px ${MC_TEAL}10`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "";
        (e.currentTarget as HTMLElement).style.boxShadow = "";
      }}
    >
      {/* Top shimmer */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${MC_TEAL}, ${MC_PURPLE}, ${MC_TEAL}, transparent)` }}
      />

      {/* Hidden widget iframe */}
      <iframe
        ref={iframeRef}
        title="Mixcloud player"
        allow="autoplay"
        className="hidden w-0 h-0 border-none"
      />

      {/* ── Skeleton ── */}
      {loading && (
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="w-[72px] h-[72px] rounded-xl animate-pulse flex-shrink-0" style={{ background: `${MC_TEAL}18` }} />
          <div className="flex-1 flex flex-col gap-2.5">
            <div className="h-3.5 w-3/5 rounded animate-pulse" style={{ background: `${MC_TEAL}18` }} />
            <div className="h-3 w-2/5 rounded animate-pulse" style={{ background: `${MC_TEAL}10` }} />
            <div className="h-[18px] w-20 rounded animate-pulse" style={{ background: `${MC_TEAL}18` }} />
          </div>
          <div className="w-12 h-12 rounded-full animate-pulse flex-shrink-0" style={{ background: `${MC_TEAL}18` }} />
        </div>
      )}

      {/* ── Error ── */}
      {error && <p className="px-5 py-4 text-[12.5px] text-red-400 text-center">{error}</p>}

      {/* ── Content ── */}
      {meta && !loading && (
        <>
          <div className="flex items-center gap-4 px-5 pt-4 pb-4">
            {/* Artwork */}
            <div
              className="flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden flex items-center justify-center"
              style={{ background: `${MC_TEAL}18` }}
            >
              {meta.thumbnail ? (
                <img src={meta.thumbnail} alt="" className="w-full h-full object-cover block" />
              ) : (
                <svg viewBox="0 0 24 24" fill={MC_TEAL} width={32} height={32} opacity={0.6}>
                  <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
                </svg>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-maxx-white text-[14.5px] truncate leading-snug mb-1">
                {meta.title}
              </p>
              <p className="text-maxx-sub text-[12.5px] truncate mb-2">{meta.uploader}</p>
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.05em] px-2 py-0.5 rounded"
                style={{ color: MC_TEAL, background: `${MC_TEAL}18` }}
              >
                {/* Mixcloud cloud icon */}
                <svg viewBox="0 0 24 24" fill={MC_TEAL} width={11} height={11}>
                  <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                </svg>
                Mixcloud · {typeLabel}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Play button */}
              <button
                onClick={handlePlay}
                disabled={!widgetReady}
                className={cn(
                  "action_btn action-btn",
                  "w-12 h-12 rounded-full flex items-center justify-center border-none flex-shrink-0",
                  "transition-all duration-200",
                  widgetReady
                    ? "cursor-pointer hover:scale-105 active:scale-[0.96]"
                    : "cursor-not-allowed"
                )}
                style={{
                  background: widgetReady
                    ? playing ? MC_PURPLE : MC_TEAL
                    : "var(--maxx-dim, #5a5370)",
                  boxShadow: widgetReady && playing
                    ? `0 0 20px ${MC_PURPLE}66`
                    : widgetReady
                    ? `0 0 0px ${MC_TEAL}00`
                    : "none",
                }}
                onMouseEnter={(e) => {
                  if (!widgetReady) return;
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    `0 0 20px ${playing ? MC_PURPLE : MC_TEAL}66`;
                }}
                onMouseLeave={(e) => {
                  if (!widgetReady || !playing) {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }
                }}
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

              {/* Open on Mixcloud */}
              <a
                href={meta.trackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 action-btn rounded-full flex items-center justify-center flex-shrink-0 bg-transparent no-underline transition-all duration-200"
                style={{ border: `1px solid ${MC_TEAL}30` }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = `${MC_TEAL}18`)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "transparent")
                }
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
              currentSecs={currentSecs}
              durationSecs={durationSecs}
            />
          )}

          {/* State message */}
          {stateMsg && (
            <p className="px-5 pb-3.5 text-[11.5px] text-maxx-dim text-center">
              {stateMsg}
            </p>
          )}
        </>
      )}
    </div>
  );
}
