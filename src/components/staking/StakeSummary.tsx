import { StakingMath } from "@/core/StakingMath";
import utils from "@/lib/utils";

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
  return (
    <div className="lg:col-span-5">
      {/* Summary Panel */}
      <div
        className={`rounded-3xl border ${badge.border} bg-gradient-to-br from-black/40 to-purple-900/10 p-8  py-10 flex flex-col justify-between`}
      >
        <div>
          <div className="mb-10">
            <span className="text-xl sm:text-2xl md:text-4xl mr-2">
              {badge.icon}
            </span>
            <span
              className={`text-xl sm:text-2xl md:text-4xl font-black ${badge.color}`}
            >
              {badge.label}
            </span>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between">
              <span className="text-gray-400">Yield</span>
              <span className="text-green-400 font-bold text-lg sm:text-xl">
                {currentYield.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Multiplier</span>
              <span className="text-pink-400 font-bold text-lg sm:text-xl">
                {currentMultiplier}x
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Unlocks At</span>
              <span className="text-pink-400 font-bold text-lg sm:text-xl">
                {currentMultiplier}x
              </span>
            </div>

            <div className="h-px bg-white/10 my-5" />
            <div className="text-lg sm:text-2xl md:text-3xl mt-10 font-black text-white">
              {utils.toLocaleString(
                StakingMath.getReward(
                  Number(stakeAmount),
                  Number(termDays),
                  utils.daysToSeconds(termDays),
                ),
              )}{" "}
              <span className="text-lg text-gray-500">PAINN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
