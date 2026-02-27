import utils from "@/lib/utils";
import { Activity, Globe, TrendingUp, Trophy, Lock } from "lucide-react";
import { MintRewardInfo } from "@/core/MintAlgo";

interface MultipliersCardProps {
  rewardInfo: MintRewardInfo;
  globalRank: number;
  rankNo: number;
}

export default function MultipliersCard({ rewardInfo, rankNo, globalRank }: MultipliersCardProps) {
  const newMinters = globalRank - rankNo;

  return (
    <div className="relative overflow-hidden bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-6 transition-all duration-200 card-hover-v">
      {/* top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet/60 via-maxx-pink/30 to-transparent" />
      {/* corner glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_70%)] pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10 flex items-center gap-3 mb-5">
        <div className="w-7 h-7 rounded-sm bg-maxx-violet/10 border border-maxx-violet/25 flex items-center justify-center shrink-0">
          <Activity size={13} className="text-maxx-violet" />
        </div>
        <div className="eyebrow mb-0">
          <span className="eyebrow-dot" />
          Multipliers
        </div>
      </div>

      {/* ── Rows ── */}
      <div className="relative z-10 space-y-2">
        <MultiplierRow
          label="Base Reward"
          value={utils.toShortNumber(rewardInfo.baseReward)}
          icon={TrendingUp}
          color="violet"
        />
        <MultiplierRow
          label="Early Adopter"
          value={`${rewardInfo.earlyAdopterMultiplier.toFixed(2)}x`}
          icon={Trophy}
          color="amber"
        />
        <MultiplierRow
          label="Network Effect"
          sublabel={`+${newMinters} new minter${newMinters !== 1 ? "s" : ""} after you`}
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

/* ── Row sub-component ── */
const colorMap: Record<string, { icon: string; border: string; bg: string }> = {
  violet: { icon: "text-maxx-violet", border: "border-maxx-violet/25", bg: "bg-maxx-violet/10" },
  amber:  { icon: "text-amber-400",   border: "border-amber-500/20",   bg: "bg-amber-500/10"   },
  blue:   { icon: "text-blue-400",    border: "border-blue-500/20",    bg: "bg-blue-500/10"    },
  pink:   { icon: "text-maxx-pink",   border: "border-maxx-pink/25",   bg: "bg-maxx-pink/10"   },
};

const MultiplierRow = ({
  label,
  sublabel,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  sublabel?: string;
  value: string;
  icon: any;
  color: string;
}) => {
  const c = colorMap[color] ?? colorMap.violet;
  return (
    <div className="group flex items-center justify-between px-3.5 py-3 rounded-md bg-maxx-bg0/40 border border-maxx-violet/10 transition-all duration-200 hover:border-maxx-violet/25 hover:bg-maxx-bg0/60">
      <div className="flex items-center gap-3">
        <div className={`w-7 h-7 rounded-sm border flex items-center justify-center shrink-0 transition-colors duration-200 ${c.bg} ${c.border} group-hover:opacity-90`}>
          <Icon size={13} className={c.icon} />
        </div>
        <div>
          <span className="text-sm text-maxx-mid transition-colors group-hover:text-maxx-bright">
            {label}
          </span>
          {sublabel && (
            <div className="font-mono text-[0.65rem] tracking-wide text-maxx-sub mt-0.5">
              {sublabel}
            </div>
          )}
        </div>
      </div>
      <span className="font-mono text-sm font-bold text-maxx-bright transition-colors group-hover:text-maxx-white">
        {value}
      </span>
    </div>
  );
};
