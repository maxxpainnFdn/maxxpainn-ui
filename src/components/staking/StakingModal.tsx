import React, { useState, useMemo, useEffect } from "react";
import Modal from "../modal/Modal"; // Assuming this is in the same directory
import {
  Lock,
  Flame,
  Zap,
  TrendingUp,
  Calendar,
  Info,
  ArrowRight,
  Timer,
  Trophy,
} from "lucide-react";
import Button from "../button/Button";
import { StakingMath } from "@/core/StakingMath";
import { Input } from "../ui/input";
import { stakingConfig } from "@/config/staking";
import StakingAmountInput from "./StakingAmountInput";
import StakingSlider from "./StakingSlider";
import { tokenConfig } from "@/config/token";
import utils from "@/lib/utils";

const { maxTermDays, minTermDays } = stakingConfig;

export interface StakingModalProps {
  open: boolean,
  amount: { valueRaw: bigint, valueFormatted: string | number },
  onChange: (state: boolean) => void | undefined,
  executeStake: (stakeTermDays: number) => Promise<void>
}

const StakingModal = ({
  open,
  onChange,
  amount,
  executeStake
}) => {
    
  const [isOpen, setIsOpen] = useState(false);
  const [termDays, setTermDays] = useState(30); // Default 30 days
  const [stakeAmount] = useState<number>(Number(amount.valueFormatted));
  const [isStaking, setStaking] = useState(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  // Real-time Calculations
  const currentYield = useMemo(
    () => StakingMath.getFixedYieldPercent(termDays),
    [termDays],
  );
  const currentMultiplier = useMemo(
    () => StakingMath.getMultiplier(termDays),
    [termDays],
  );

  const handleStake = async () => {
    setStaking(true);
    await executeStake(termDays)
    setStaking(false)
  };
  
  return (
    <>
      {/* Modal */}
      <Modal
        open={isOpen}
        onOpenChange={(state) => {
          setIsOpen(state);
          onChange?.(state);
        }}
        // Badge removed from title
        title={`Stake Your Tokens`}
        description="Select your staking term."
        icon={Lock}
        size={800}
        className="p-0 "
      >
        <div className="space-y-6 mb-[55px]">

          <StakingAmountInput 
            isStaking={false}
            tokenBalanceInfo={undefined}
            onChange={() => { }}
            defaultValue={stakeAmount}
            disabled={true}
          />

          {/* 2. Duration Slider */}
          <StakingSlider
            badge={null}
            defaultTermDays={maxTermDays}
            onChange={(_termDays) => setTermDays(_termDays) }
            disabled={isStaking}
          />

          {/* 3. Live Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* APY Card */}
            <div className="bg-gray-900/60 border border-purple-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center group hover:bg-purple-900/10 transition-colors">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                Yield
              </div>
              <div className="text-3xl font-black text-green-400 drop-shadow-sm">
                {currentYield.toFixed(2)}%
              </div>
              <div className="text-[10px] text-green-500/60 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Yield Rate
              </div>
            </div>

            {/* Multiplier Card */}
            <div className="bg-gray-900/60 border border-pink-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center group hover:bg-pink-900/10 transition-colors">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                Multiplier
              </div>
              <div className="text-3xl font-black text-pink-400 drop-shadow-sm">
                {currentMultiplier}x
              </div>
              <div className="text-[10px] text-pink-500/60 mt-1 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Boost Active
              </div>
            </div>
          </div>

          {/* 4. Rewards Summary */}
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Unlock Date</span>
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                {new Date(
                  Date.now() + termDays * 24 * 60 * 60 * 1000,
                ).toLocaleDateString()}
              </span>
            </div>
            <div className="h-px w-full bg-white/5 my-4"></div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xs text-gray-500 uppercase mb-1">
                  Estimated Returns
                </div>
                <div className="text-3xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {utils.toLocaleString(
                    StakingMath.getReward(
                      Number(stakeAmount),
                      Number(termDays),
                      utils.daysToSeconds(termDays),
                    ),
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 uppercase mb-1">
                  Token
                </div>
                <div className="text-xl font-bold text-purple-400">
                  ${ tokenConfig.symbol }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute mt-10 bottom-0 left-0 w-full p-2 bg-gray-950/95 backdrop-blur-md">
          <div className="flex justify-end gap-x-1">
            <Button
              onClick={() => setIsOpen(false)}
              variant="secondary"
              className="me-2"
              disabled={isStaking}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={isStaking || stakeAmount <= 0 || termDays < minTermDays}
              onClick={handleStake}
              loading={isStaking}
            >
              Stake {termDays} Days{" "}
              <ArrowRight className="inline w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Modal>

      <style>{`
        /* Removing default slider styling to use custom one */
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
        }
        input[type=range]::-moz-range-thumb {
            opacity: 0;
        }
        input[type=range]::-ms-thumb {
            opacity: 0;
        }
      `}</style>
    </>
  );
};

export default StakingModal;
