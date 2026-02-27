import { Lock, ShieldCheck, TrendingUp, Clock, Coins, Wallet } from "lucide-react";
import OrbitalTimer from "../OrbitalTimer";
import utils from "@/lib/utils";
import { useMemo, useState } from "react";
import Button from "@/components/button/Button";
import { useStaking } from "@/hooks/useStaking";
import toast from "@/hooks/toast";
import { useAlertDialog } from "@/hooks/useAlertDialog";
import { stakingConfig } from "@/config/staking";
import { UserStakeInfo } from "@/types/UserStakeInfo";

export interface UnstakeProps {
  hasActiveStake: boolean;
  userStakeInfo: UserStakeInfo;
  rewards: number;
  onUnstakingSuccess: () => void | undefined;
}

export default function Unstake({ hasActiveStake, userStakeInfo, rewards, onUnstakingSuccess }) {
  const alertDialog  = useAlertDialog();
  const stakingCore  = useStaking();
  const [unstaking, setUnstaking] = useState(false);

  const canUnstake = useMemo(
    () => userStakeInfo && new Date() >= userStakeInfo.unlockDate,
    [userStakeInfo],
  );
  const totalValue = useMemo(
    () => (!userStakeInfo ? 0 : Number(userStakeInfo.amountFormatted) + rewards),
    [userStakeInfo, rewards],
  );

  const unstakeToken = async (isEmergency: boolean) => {
    if (isEmergency) {
      const confirm = await alertDialog.confirm(
        "Force Unstake?",
        `Forcing an unstake will deduct and burn ${stakingConfig.earlyUnstakePenalty}% of your principal. All accrued rewards will be permanently forfeited.`,
      );
      if (!confirm) { toast.error("User cancelled action"); return; }
    }
    setUnstaking(true);
    toast.loading("Unstaking...");
    const resultStatus = await stakingCore.unstakeTokens(isEmergency);
    setUnstaking(false);
    toast.dismiss();
    if (resultStatus.isError()) { toast.error(resultStatus.getMessage()); return; }
    onUnstakingSuccess?.();
  };

  /* ── Empty state ── */
  if (!hasActiveStake) {
    return (
      <div className="text-center py-20">
        <div className="relative inline-block mb-5">
          <Lock size={48} className="text-maxx-dim mx-auto opacity-40" />
          <div className="absolute inset-0 bg-maxx-violet blur-2xl opacity-10 rounded-full" />
        </div>
        <h3 className="font-sans font-bold text-base text-maxx-white mb-1.5">
          No Active Stakes
        </h3>
        <p className="font-sans text-sm text-maxx-mid">
          Head to the Stake tab to initialise your position
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-up space-y-6 mb-10">

      {/* ── Active position header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-md bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} className="text-emerald-400" />
          </div>
          <div>
            <div className="eyebrow mb-0.5">
              <span className="eyebrow-dot" style={{ background: canUnstake ? "#10b981" : undefined }} />
              <span style={{ color: canUnstake ? "#10b981" : undefined }}>
                {canUnstake ? "Unlocked — Ready to Claim" : "Earning Rewards"}
              </span>
            </div>
            <h3 className="font-sans font-black text-lg text-maxx-white">
              Active Position
            </h3>
          </div>
        </div>

        {/* Orbital timer */}
        <div className="flex-1 w-full md:max-w-xl">
          <OrbitalTimer
            lockedDate={userStakeInfo.lockedDate}
            targetDate={userStakeInfo.unlockDate}
          />
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Principal",   value: utils.toLocaleString(userStakeInfo.amountFormatted), icon: Coins,      color: "violet"  },
          { label: "Yield",       value: `${Number(userStakeInfo.yield).toFixed(2)}%`,        icon: TrendingUp, color: "amber"   },
          { label: "Earned",      value: `+${utils.toLocaleString(rewards)}`,                 icon: TrendingUp, color: "emerald" },
          { label: "Total Value", value: utils.toLocaleString(totalValue),                    icon: Wallet,     color: "pink"    },
        ].map(({ label, value, icon: Icon, color }) => {
          const cMap: Record<string, { icon: string; border: string; bg: string }> = {
            violet:  { icon: "text-maxx-violet",  border: "border-maxx-violet/25",  bg: "bg-maxx-violet/10"  },
            amber:   { icon: "text-amber-400",     border: "border-amber-500/20",    bg: "bg-amber-500/10"    },
            emerald: { icon: "text-emerald-400",   border: "border-emerald-500/20",  bg: "bg-emerald-500/10"  },
            pink:    { icon: "text-maxx-pink",     border: "border-maxx-pink/25",    bg: "bg-maxx-pink/10"    },
          };
          const c = cMap[color];
          return (
            <div key={label} className="relative overflow-hidden bg-maxx-bg0/60 border border-maxx-violet/15 rounded-lg p-4 transition-all hover:border-maxx-violet/30">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet/30 to-transparent" />
              <div className={`absolute top-0 right-0 p-2 rounded-bl-md border-b border-l ${c.border} ${c.bg}`}>
                <Icon className={`${c.icon} h-4 w-4`} />
              </div>
              <p className="font-mono text-xs tracking-widest uppercase text-maxx-sub mb-1.5 mt-0.5">
                {label}
              </p>
              <p className={`font-mono font-bold text-base ${color === "emerald" ? "text-emerald-400" : "text-maxx-white"}`}>
                {value}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Action buttons ── */}
      <div className="flex gap-3">
        <Button
          variant={canUnstake ? "primary" : "secondary"}
          disabled={!canUnstake || unstaking}
          fullWidth
          size="lg"
          loading={unstaking}
          className="py-4 text-base flex-1"
          onClick={() => unstakeToken(false)}
        >
          <Wallet size={16} />
          {canUnstake ? "Claim & Unstake" : "Locked"}
        </Button>

        {!canUnstake && (
          <Button
            variant="danger"
            size="lg"
            loading={unstaking}
            className="py-4 text-base"
            onClick={() => unstakeToken(true)}
          >
            Force Unstake
          </Button>
        )}
      </div>

    </div>
  );
}
