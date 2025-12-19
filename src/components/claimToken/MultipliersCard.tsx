import utils from "@/lib/utils";
import { Activity, Globe, TrendingUp, Trophy, Lock } from "lucide-react";
import { MintRewardInfo } from "@/core/MintAlgo";

interface MultipliersCardProps {
  rewardInfo: MintRewardInfo;
  globalRank: number;
  rankNo: number;
}

export default function MultipliersCard({
  rewardInfo,
  rankNo,
  globalRank,
}: MultipliersCardProps) {
  const newMinters = globalRank - rankNo;

  return (
    <div className="relative overflow-hidden bg-gray-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl transition-all hover:border-purple-500/20 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)]">
      {/* Soft Ambient Light */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
          <Activity className="w-4 h-4" />
        </div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Multipliers
        </h4>
      </div>

      {/* List */}
      <div className="relative z-10 space-y-3">
        <MultiplierRow
          label="Base Reward"
          value={utils.toShortNumber(rewardInfo.baseReward)}
          icon={TrendingUp}
          color="purple"
        />
        <MultiplierRow
          label="Early Adopter"
          value={`${rewardInfo.earlyAdopterMultiplier.toFixed(2)}x`}
          icon={Trophy}
          color="amber"
        />
        <MultiplierRow
          label={
            <>
              <div>Network Effect</div>
              <div className="text-[12px] text-gray-400 group-hover:text-gray-100">
                +{newMinters} new minter{newMinters > 1 && "s"} after you
              </div>
            </>
          }
          value={`${rewardInfo.networkMultiplier.toFixed(2)}x`}
          icon={Globe}
          color="blue"
        />
        <MultiplierRow
          label="Lock Period"
          value={`${rewardInfo.lockPeriodMultiplier.toFixed(2)}x`}
          icon={Lock}
          color="pink"
        />
      </div>
    </div>
  );
}

// Sub-component for multiplier rows
const MultiplierRow = ({ label, value, icon: Icon, color }: any) => {
  const iconStyles: any = {
    purple:
      "bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 group-hover:text-purple-300",
    amber:
      "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 group-hover:text-amber-300",
    blue: "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-300",
    pink: "bg-pink-500/10 text-pink-400 group-hover:bg-pink-500/20 group-hover:text-pink-300",
  };

  return (
    <div className="group flex items-center justify-between p-4 py-5 rounded-2xl bg-white/[0.02] border border-white/5 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/10">
      <div className="flex items-center gap-3">
        {/* Icon with subtle color background */}
        <div
          className={`p-2 rounded-lg transition-colors duration-300 ${iconStyles[color]}`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm text-gray-400 font-medium transition-colors duration-300 group-hover:text-gray-200">
          {label}
        </span>
      </div>

      {/* Value */}
      <span className="font-mono text-sm font-bold text-gray-300 transition-colors duration-300 group-hover:text-white">
        {value}
      </span>
    </div>
  );
};
