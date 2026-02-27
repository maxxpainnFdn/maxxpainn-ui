import { AlertTriangle, CheckCircle2, Flame } from "lucide-react";

type LatePenaltyCardProps = { daysLate: number };

export default function LatePenaltyCard({ daysLate }: LatePenaltyCardProps) {
  const penalties = [
    { day: 0, label: "On Time", penalty: 0  },
    { day: 1, label: "Day 1",   penalty: 1  },
    { day: 2, label: "Day 2",   penalty: 3  },
    { day: 3, label: "Day 3",   penalty: 8  },
    { day: 4, label: "Day 4",   penalty: 17 },
    { day: 5, label: "Day 5",   penalty: 35 },
    { day: 6, label: "Day 6",   penalty: 72 },
    { day: 7, label: "7+ Days", penalty: 99 },
  ];

  const getCurrentPenalty = () => daysLate >= 7 ? 99 : (penalties[daysLate]?.penalty ?? 0);

  const getDotStyle = (item: typeof penalties[0], isCurrent: boolean, isPast: boolean) => {
    if (isCurrent) {
      if (item.penalty === 0) return "bg-emerald-400 border-emerald-400 shadow-[0_0_8px_color-mix(in srgb, var(--maxx-emerald-lt) 50%, transparent)]";
      if (item.penalty < 20) return "bg-yellow-400 border-yellow-400 shadow-[0_0_8px_color-mix(in_srgb,theme(colors.yellow.400)_50%,transparent)]";
      if (item.penalty < 50) return "bg-orange-400 border-orange-400 shadow-[0_0_8px_color-mix(in_srgb,theme(colors.orange.400)_50%,transparent)]";
      return "bg-maxx-pink border-maxx-pink shadow-[0_0_8px_color-mix(in srgb, var(--maxx-pink) 50%, transparent)]";
    }
    if (isPast) return "bg-maxx-dim/80 border-maxx-dim";
    return "bg-maxx-bg0 border-maxx-dim/40";
  };

  const getPenaltyColor = (item: typeof penalties[0], isCurrent: boolean) => {
    if (!isCurrent) return "text-maxx-dim";
    if (item.penalty === 0) return "text-emerald-400";
    if (item.penalty < 20) return "text-yellow-400";
    if (item.penalty < 50) return "text-orange-400";
    return "text-maxx-pink";
  };

  return (
    <div className="relative overflow-hidden bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-6 transition-all duration-200 card-hover-v">
      {/* top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-pink/50 via-maxx-violet/30 to-transparent" />
      {/* corner glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[radial-gradient(circle,color-mix(in srgb, var(--maxx-violet) 8%, transparent)_0%,transparent_70%)] pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10 flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-sm bg-maxx-pink/10 border border-maxx-pink/25 flex items-center justify-center shrink-0">
            <AlertTriangle size={13} className="text-maxx-pink" />
          </div>
          <div>
            <div className="eyebrow mb-0 text-maxx-pink" style={{ color: undefined }}>
              <span className="eyebrow-dot" style={{ background: "var(--maxx-pink)" }} />
              <span className="text-maxx-pink">Late Penalty Schedule</span>
            </div>
            <p className="font-sans text-xs text-maxx-sub">Claim on time to avoid penalties</p>
          </div>
        </div>

        {daysLate === 0 ? (
          <span className="pill border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 size={10} />Safe
          </span>
        ) : (
          <span className="pill border-maxx-pink/30 text-maxx-pink flex items-center gap-1.5 animate-pain-pulse">
            <Flame size={10} />-{getCurrentPenalty()}%
          </span>
        )}
      </div>

      {/* ── Timeline ── */}
      <div className="relative z-10 space-y-0.5">
        <div className="absolute left-[15px] top-3 bottom-3 w-[2px] rounded-sm bg-gradient-to-b from-emerald-500/40 via-yellow-500/30 to-maxx-pink/40" />

        {penalties.map((item, i) => {
          const isCurrent = daysLate === i || (i === 7 && daysLate >= 7);
          const isPast    = daysLate > i && !(i === 7 && daysLate >= 7);

          return (
            <div
              key={i}
              className={`group flex items-center justify-between rounded-md px-2 py-2 transition-all duration-200 ${
                isCurrent
                  ? "bg-maxx-violet/[0.08] border border-maxx-violet/20"
                  : "hover:bg-maxx-bg0/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`relative z-10 w-4 h-4 rounded-sm border-2 shrink-0 transition-all duration-300 ${getDotStyle(item, isCurrent, isPast)}`}>
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-sm animate-ping opacity-25 bg-current" />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-sm transition-colors ${isCurrent ? "text-maxx-white font-semibold" : isPast ? "text-maxx-dim" : "text-maxx-sub"}`}>
                    {item.label}
                  </span>
                  {isCurrent && (
                    <span className="font-mono text-[10px] tracking-widest uppercase text-maxx-violet bg-maxx-violet/10 border border-maxx-violet/20 px-2 py-0.5 rounded-sm">
                      You are here
                    </span>
                  )}
                </div>
              </div>

              <span className={`font-mono text-sm font-semibold transition-colors ${getPenaltyColor(item, isCurrent)}`}>
                {item.penalty === 0 ? (
                  <span className="flex items-center gap-1"><CheckCircle2 size={12} />0%</span>
                ) : (
                  `-${item.penalty}%`
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Warning footer ── */}
      {daysLate > 0 && (
        <div className="relative z-10 mt-4 pt-4 border-t border-maxx-violet/15">
          <div className="flex items-start gap-3">
            <AlertTriangle size={14} className="text-maxx-pink shrink-0 mt-0.5" />
            <p className="text-sm text-maxx-mid">
              You are currently{" "}
              <span className="text-maxx-white font-semibold">
                {daysLate} day{daysLate > 1 ? "s" : ""}
              </span>{" "}
              late. Claim now to minimise further losses.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
