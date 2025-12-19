import { AlertTriangle, Clock, CheckCircle2, Flame } from "lucide-react";

type LatePenaltyCardProps = {
  daysLate: number;
};

export default function LatePenaltyCard({ daysLate }: LatePenaltyCardProps) {
  const penalties = [
    { day: 0, label: "On Time", penalty: 0 },
    { day: 1, label: "Day 1", penalty: 1 },
    { day: 2, label: "Day 2", penalty: 3 },
    { day: 3, label: "Day 3", penalty: 8 },
    { day: 4, label: "Day 4", penalty: 17 },
    { day: 5, label: "Day 5", penalty: 35 },
    { day: 6, label: "Day 6", penalty: 72 },
    { day: 7, label: "7+ Days", penalty: 99 },
  ];

  const getCurrentPenalty = () => {
    if (daysLate >= 7) return 99;
    return penalties[daysLate]?.penalty ?? 0;
  };

  return (
    <div className="relative overflow-hidden bg-gray-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl transition-all hover:border-purple-500/20 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)]">
      {/* Soft Ambient Light */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />

      {/* header */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-red-500/15 border border-red-500/30">
            <AlertTriangle className="h-3.5 w-3.5 text-red-300" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Late Penalty Schedule
            </h4>
            <p className="text-[11px] text-gray-500">
              Claim on time to avoid penalties
            </p>
          </div>
        </div>

        {/* Current penalty badge */}
        {daysLate === 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3" />
            Safe
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-red-300 border border-red-500/30 animate-pulse">
            <Flame className="h-3 w-3" />-{getCurrentPenalty()}%
          </span>
        )}
      </div>

      {/* penalty timeline */}
      <div className="relative z-10 space-y-1">
        {/* vertical line */}
        <div className="absolute left-[15px] top-3 bottom-3 w-[2px] rounded-full bg-gradient-to-b from-emerald-500/40 via-yellow-500/40 to-red-500/40" />

        {penalties.map((item, i) => {
          const isCurrent = daysLate === i || (i === 7 && daysLate >= 7);
          const isPast = daysLate > i && !(i === 7 && daysLate >= 7);
          const isFuture = daysLate < i;

          // Determine dot color based on penalty severity
          const getDotStyle = () => {
            if (isCurrent) {
              if (item.penalty === 0)
                return "bg-emerald-400 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]";
              if (item.penalty < 20)
                return "bg-yellow-400 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]";
              if (item.penalty < 50)
                return "bg-orange-400 border-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.5)]";
              return "bg-red-500 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
            }
            if (isPast) return "bg-gray-600 border-gray-600";
            return "bg-gray-900 border-black-600";
          };

          // Determine text color based on penalty severity
          const getPenaltyColor = () => {
            if (!isCurrent) return "text-gray-500";
            if (item.penalty === 0) return "text-emerald-400";
            if (item.penalty < 20) return "text-yellow-400";
            if (item.penalty < 50) return "text-orange-400";
            return "text-red-400";
          };

          return (
            <div
              key={i}
              className={`group flex items-center justify-between rounded-xl px-2 py-2 transition-all duration-300 ${
                isCurrent
                  ? "bg-white/5 border border-white/10"
                  : "hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Timeline dot */}
                <div
                  className={`relative z-10 h-4 w-4 rounded-full border-2 transition-all duration-300 ${getDotStyle()}`}
                >
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-current" />
                  )}
                </div>

                {/* Day label */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm transition-colors ${
                      isCurrent
                        ? "text-white font-semibold"
                        : isPast
                          ? "text-gray-500"
                          : "text-gray-400"
                    }`}
                  >
                    {item.label}
                  </span>
                  {isCurrent && (
                    <span className="text-[12px] text-gray-300 bg-white/5 px-2 py-0.5 rounded-xl">
                      You are here
                    </span>
                  )}
                </div>
              </div>

              {/* Penalty percentage */}
              <span
                className={`font-mono text-sm font-semibold transition-colors ${getPenaltyColor()}`}
              >
                {item.penalty === 0 ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    0%
                  </span>
                ) : (
                  `-${item.penalty}%`
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* warning footer */}
      {daysLate > 0 && (
        <div className="relative z-10 mt-5 pt-4 border-t border-white/5">
          <div className="flex items-start gap-3 text-xs text-red-300/80">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              You are currently{" "}
              <span className="text-white font-semibold">
                {daysLate} day{daysLate > 1 ? "s" : ""}
              </span>{" "}
              late. Claim now to minimize further losses.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
