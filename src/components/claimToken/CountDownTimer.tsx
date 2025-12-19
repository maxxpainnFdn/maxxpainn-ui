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
      {/* Glow Effect */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[80px] opacity-40 transition-colors duration-1000 ${isClaimable ? "bg-green-500" : "bg-purple-600"}`}
      />

      <div className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] flex items-center justify-center">
        {/* SVG Gradient Definition */}
        <svg className="absolute w-0 h-0">
          <defs>
            <linearGradient
              id="progressGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient
              id="readyGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>
        </svg>

        {/* Background Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 transform">
          <circle
            cx="50%"
            cy="50%"
            r="46%"
            fill="none"
            stroke="#1f1f22"
            strokeWidth="8"
          />
          {/* Progress Ring */}
          <circle
            cx="50%"
            cy="50%"
            r="46%"
            fill="none"
            stroke={
              isClaimable ? "url(#readyGradient)" : "url(#progressGradient)"
            }
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={2.89 * 420}
            strokeDashoffset={1212 * (1 - progressPercent / 100)}
            className="transition-all duration-1000 ease-out drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            style={{
              strokeDasharray: 1212,
              strokeDashoffset: 1212 * (1 - progressPercent / 100),
            }}
          />
        </svg>

        {/* Central Data */}
        <div className="relative z-10 text-center flex flex-col items-center">
          {!isClaimable ? (
            <>
              <div className="text-purple-400 font-mono text-xs uppercase tracking-[0.3em] mb-4 animate-pulse">
                System Locked
              </div>
              <div className="flex items-baseline gap-1 text-white">
                <span className="text-6xl sm:text-7xl font-black tracking-tighter tabular-nums">
                  {timeLeft?.days}
                </span>
                <span className="text-lg text-gray-500 font-bold uppercase mr-3">
                  Days
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-gray-400 font-mono text-xl">
                {/* ... (Time components same as before) ... */}
                {String(timeLeft?.hours).padStart(2, "0")}h :{" "}
                {String(timeLeft?.minutes).padStart(2, "0")}m :{" "}
                {String(timeLeft?.seconds).padStart(2, "0")}s
              </div>
            </>
          ) : (
            <div className="animate-in zoom-in duration-500 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                <Zap className="w-10 h-10 text-green-400 fill-current" />
              </div>
              <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-2">
                Ready
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
