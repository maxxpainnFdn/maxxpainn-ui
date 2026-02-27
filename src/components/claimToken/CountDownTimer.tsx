import { Zap } from "lucide-react";

export interface CountDownTimerProps {
  isClaimable: boolean;
  timeLeft?: Record<string, any>;
  progressPercent: number;
}

export default function CountDownTimer({
  isClaimable,
  timeLeft,
  progressPercent,
}: CountDownTimerProps) {
  return (
    <div className="flex flex-col items-center justify-center relative w-full">

      {/* Ambient glow */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full blur-[80px] opacity-35 transition-colors duration-1000 pointer-events-none ${
          isClaimable ? "bg-emerald-500" : "bg-maxx-violet"
        }`}
      />

      <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] flex items-center justify-center">

        {/* SVG gradient defs */}
        <svg className="absolute w-0 h-0">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="var(--maxx-violet)" />
              <stop offset="100%" stopColor="var(--maxx-pink)" />
            </linearGradient>
            <linearGradient id="readyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="var(--maxx-emerald)" />
              <stop offset="100%" stopColor="var(--maxx-emerald-lt)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Track ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 transform">
          <circle
            cx="50%" cy="50%" r="46%"
            fill="none"
            stroke="color-mix(in srgb, var(--maxx-dim) 50%, transparent)"
            strokeWidth="6"
          />
          {/* Progress ring */}
          <circle
            cx="50%" cy="50%" r="46%"
            fill="none"
            stroke={isClaimable ? "url(#readyGradient)" : "url(#progressGradient)"}
            strokeWidth="6"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              strokeDasharray: 1212,
              strokeDashoffset: 1212 * (1 - progressPercent / 100),
              filter: isClaimable
                ? "drop-shadow(0 0 8px color-mix(in srgb, var(--maxx-emerald) 60%, transparent))"
                : "drop-shadow(0 0 8px color-mix(in srgb, var(--maxx-violet) 50%, transparent))",
            }}
          />
        </svg>

        {/* Inner content */}
        <div className="relative z-10 text-center flex flex-col items-center">
          {!isClaimable ? (
            <>
              {/* "System Locked" label */}
              <div className="eyebrow justify-center mb-4 animate-pain-pulse">
                <span className="eyebrow-dot" />
                System Locked
              </div>

              {/* Days */}
              <div className="flex items-baseline gap-1">
                <span className="font-sans font-black text-[clamp(3.5rem,12vw,5.5rem)] tracking-tighter tabular-nums leading-none text-maxx-white">
                  {timeLeft?.days}
                </span>
                <span className="text-base text-maxx-sub font-semibold uppercase ml-1 mb-1">
                  Days
                </span>
              </div>

              {/* HH:MM:SS */}
              <div className="font-mono text-lg text-maxx-mid mt-2 tracking-widest">
                {String(timeLeft?.hours).padStart(2, "0")}h :{" "}
                {String(timeLeft?.minutes).padStart(2, "0")}m :{" "}
                {String(timeLeft?.seconds).padStart(2, "0")}s
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center">
              {/* Ready icon */}
              <div className="w-16 h-16 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-5 shadow-[0_0_30px_color-mix(in srgb, var(--maxx-emerald) 20%, transparent)]">
                <Zap size={28} className="text-emerald-400 fill-current" />
              </div>

              <div className="eyebrow justify-center mb-2">
                <span className="eyebrow-dot" style={{ background: "var(--maxx-emerald)" }} />
                <span style={{ color: "var(--maxx-emerald)" }}>Ready to Harvest</span>
              </div>

              <h3 className="font-sans font-black text-[clamp(2.5rem,8vw,4rem)] text-maxx-white uppercase tracking-tight leading-none">
                Claim Now
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
