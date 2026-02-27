import { stakingConfig } from "@/config/staking";
import { useMemo, useState } from "react";
import StakingSlider from "../StakingSlider";
import Button from "@/components/button/Button";
import { UserStakeInfo } from "@/types/UserStakeInfo";
import { TokenBalanceInfo } from "@/types/TokenBalanceInfo";
import { StakingMath } from "@/core/StakingMath";
import toast from "@/hooks/toast";
import StakeSummary from "../StakeSummary";
import UserStakeInfoCol from "../UserStakeInfoCol";
import StakingAmountInput from "../StakingAmountInput";
import { useStaking } from "@/hooks/useStaking";
import { getBadge } from "@/data/stakingBadges";
import { Flame } from "lucide-react";
import { tokenConfig } from "@/config/token";

export interface StakeProps {
  userStakeInfo: UserStakeInfo;
  tokenBalanceInfo: TokenBalanceInfo;
  onStakingSuccess: () => void | undefined;
}

export default function Stake({ userStakeInfo, tokenBalanceInfo, onStakingSuccess }: StakeProps) {
  const stakingCore = useStaking();

  const [stakeAmount, setStakeAmount] = useState<number | any>(0);
  const [termDays, setTermDays]       = useState(stakingConfig.minTermDays);
  const [isStaking, setStaking]       = useState(false);

  const hasActiveStake   = useMemo(() => userStakeInfo != null, [userStakeInfo]);
  const currentYield     = useMemo<number | any>(() => StakingMath.getFixedYieldPercent(termDays), [termDays]);
  const currentMultiplier = useMemo<number | any>(() => StakingMath.getMultiplier(termDays), [termDays]);
  const badge = getBadge(hasActiveStake ? userStakeInfo.termDays : termDays);

  const handleStake = async () => {
    setStaking(true);
    const resultStatus = await stakingCore.stakeTokens(stakeAmount, termDays);
    setStaking(false);
    if (resultStatus.isError()) { toast.error(resultStatus.getMessage()); return; }
    toast.success("🎉 Staking active.");
    onStakingSuccess?.();
  };

  return (
    <div className="animate-fade-up">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── Active stake info column ── */}
        {hasActiveStake && (
          <UserStakeInfoCol badge={badge} userStakeInfo={userStakeInfo} />
        )}

        {/* ── Form column ── */}
        <div className="lg:col-span-7 space-y-6">

          <StakingAmountInput
            tokenBalanceInfo={tokenBalanceInfo}
            isStaking={isStaking}
            onChange={(value) => setStakeAmount(value)}
          />

          {!hasActiveStake && (
            <StakingSlider
              defaultTermDays={termDays}
              badge={badge}
              disabled={isStaking}
              onChange={(value) => setTermDays(value)}
            />
          )}

          <Button
            variant="primary"
            fullWidth
            size="lg"
            className="py-4 text-base"
            onClick={handleStake}
            loading={isStaking}
          >
            <Flame size={16} />
            Stake ${tokenConfig.symbol}
          </Button>
        </div>

        {/* ── Summary column ── */}
        {!hasActiveStake && (
          <StakeSummary
            currentMultiplier={currentMultiplier}
            stakeAmount={stakeAmount}
            currentYield={currentYield}
            badge={badge}
            termDays={termDays}
          />
        )}
      </div>
    </div>
  );
}
