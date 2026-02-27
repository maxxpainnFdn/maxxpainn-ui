import { StakingMath } from "@/core/StakingMath";
import utils from "@/lib/utils";
import { TrendingUp, Zap, Clock } from "lucide-react";

export interface StakeSummaryProps {
  badge: any;
  currentYield: number;
  currentMultiplier: number;
  stakeAmount: number;
  termDays: number;
}

export default function StakeSummary({
  badge,
  currentYield,
  currentMultiplier,
  stakeAmount,
  termDays,
}: StakeSummaryProps) {

  const projectedReward = StakingMath.getReward(
    Number(stakeAmount),
    Number(termDays),
    utils.daysToSeconds(termDays),
  );

  const unlockDate = new Date(Date.now() + termDays * 86400_000).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });

  return (
    <div className="lg:col-span-5">
      <div className="relative overflow-hidden bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-6 h-full flex flex-col">

        {/* top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet/60 via-maxx-pink/30 to-transparent" />

        {/* corner glow */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_70%)] pointer-events-none" />

        {/* ── Badge header ── */}
        <div className="relative z-10 mb-6">
          <div className="eyebrow mb-2">
            <span className="eyebrow-dot" />
            Staking Summary
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{badge.icon}</span>
            <span className={`font-sans font-black text-xl uppercase tracking-tight ${badge.color}`}>
              {badge.label}
            </span>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="relative z-10 space-y-3 flex-1">

          {/* Yield */}
          <div className="flex items-center justify-between px-3.5 py-3 rounded-md bg-maxx-bg0/40 border border-maxx-violet/10">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-sm bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <TrendingUp size={11} className="text-emerald-400" />
              </div>
              <span className="text-sm text-maxx-mid">Yield</span>
            </div>
            <span className="font-mono font-bold text-base text-emerald-400">
              {currentYield.toFixed(2)}%
            </span>
          </div>

          {/* Multiplier */}
          <div className="flex items-center justify-between px-3.5 py-3 rounded-md bg-maxx-bg0/40 border border-maxx-violet/10">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-sm bg-maxx-pink/10 border border-maxx-pink/20 flex items-center justify-center">
                <Zap size={11} className="text-maxx-pink" />
              </div>
              <span className="text-sm text-maxx-mid">Multiplier</span>
            </div>
            <span className="font-mono font-bold text-base text-maxx-pink">
              {currentMultiplier}x
            </span>
          </div>

          {/* Unlock date */}
          <div className="flex items-center justify-between px-3.5 py-3 rounded-md bg-maxx-bg0/40 border border-maxx-violet/10">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-sm bg-maxx-violet/10 border border-maxx-violet/20 flex items-center justify-center">
                <Clock size={11} className="text-maxx-violet" />
              </div>
              <span className="text-sm text-maxx-mid">Unlocks At</span>
            </div>
            <span className="font-mono font-bold text-sm text-maxx-bright">
              {unlockDate}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-maxx-violet/15 my-2" />

          {/* Projected reward */}
          <div className="px-3.5 py-4 rounded-md bg-maxx-violet/5 border border-maxx-violet/20">
            <div className="font-mono text-[0.65rem] tracking-widest uppercase text-maxx-sub mb-1.5">
              Projected Reward
            </div>
            <div className="font-sans font-black text-[clamp(1.5rem,4vw,2.2rem)] text-maxx-white leading-none">
              {utils.toLocaleString(projectedReward)}
            </div>
            <div className="font-mono text-xs text-maxx-violet mt-1 tracking-widest uppercase">
              $PAINN Tokens
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
