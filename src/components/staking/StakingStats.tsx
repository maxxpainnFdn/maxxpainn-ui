import { Flame, Lock, TrendingUp, Wallet } from "lucide-react";
import { stakingConfig } from "@/config/staking";
import { StakingMath } from "@/core/StakingMath";
import utils from "@/lib/utils";
import { tokenConfig } from "@/config/token";
import { StatsCard } from "../StatsCard";

const { minTermDays } = stakingConfig;

export default function StakingStats({ data }: Record<string, any>) {
  
  const symbol = "$"+tokenConfig.symbol;
  
  const metadataObj = {
    tvl: {
      label: "TVL",
      icon: Lock,
      color: "purple",
      subValue: `${symbol} TOKENS`,
    },
    userStake: {
      label: "My Stake",
      icon: Wallet,
      color: "pink",
      subValue: `${symbol}`,
    },

    userRewards: {
      label: "My Rewards",
      icon: Flame,
      color: "red",
      subValue: `${symbol}`,
    },
    maxYield: {
      label: "Max Yield",
      icon: TrendingUp,
      color: "green",
      subValue: "",
    },
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5 mb-12">
      {Object.keys(data).map((key) => {
        
        let { label, subValue, icon, color } = metadataObj[key];

        if (key == "maxYield") {
          subValue = StakingMath.getMultiplier(stakingConfig.maxTermDays) + "x MULTIPLIER";
        } else if (key == "minYield") {
          subValue = StakingMath.getMultiplier(minTermDays) + "x MULTIPLIER";
        }
        
        let value = data[key]
        
        if (typeof value == 'number') {
          value = utils.toLocaleString(value)
        }
        
        label = <>
          {label}  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/5 bg-white/5 text-${color}-400`}>
            {subValue}
          </span>
        </>

        return (
          <StatsCard
            title={label}
            icon={icon}
            value={value}
            color={color}
          />
        );
      })}
    </div>
  );
}
