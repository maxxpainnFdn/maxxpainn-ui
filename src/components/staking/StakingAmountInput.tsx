import utils from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import CurrencyInput from "react-currency-input-field";

export interface StakingAmountInputProps {
  disabled?: boolean;
  isStaking: boolean;
  tokenBalanceInfo: { value: string; valueRaw: bigint } | undefined;
  defaultValue?: number | string;
  onChange: (v: any) => void;
}

export default function StakingAmountInput({
  isStaking,
  tokenBalanceInfo,
  defaultValue = 0,
  disabled = false,
  onChange,
}: StakingAmountInputProps) {
  const [stakeAmount, setStakeAmount] = useState<number | any>(defaultValue);
  const amountInputRef = useRef<HTMLInputElement>();

  const setMaxInputValue = (e: React.MouseEvent) => {
    e.preventDefault();
    const value = tokenBalanceInfo?.value || 0;
    setStakeAmount(Number(value));
  };

  useEffect(() => {
    onChange(stakeAmount);
  }, [stakeAmount]);

  const isDisabled = disabled || isStaking;

  return (
    <div className={isDisabled ? "opacity-50 pointer-events-none" : ""}>

      {/* Label row */}
      <label className="flex justify-between items-center text-sm font-semibold tracking-wider uppercase text-maxx-mid mb-3">
        <span>Amount</span>
        {tokenBalanceInfo && (
          <a
            href="#"
            onClick={setMaxInputValue}
            className="flex items-center gap-1 font-mono text-xs tracking-widest text-maxx-sub hover:text-maxx-violet transition-colors"
          >
            <span className="text-maxx-dim">BAL:</span>
            <span className="hidden xs:inline">
              {utils.toLocaleString(tokenBalanceInfo.value)}
            </span>
            <span className="xs:hidden">
              {utils.toShortNumber(tokenBalanceInfo.value)}
            </span>
          </a>
        )}
      </label>

      {/* Input container */}
      <div className="relative bg-maxx-bg0/60 border border-maxx-violet/20 rounded-md overflow-hidden transition-all duration-200 focus-within:border-maxx-violet/55 focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] hover:border-maxx-violet/35">

        <CurrencyInput
          ref={amountInputRef}
          value={stakeAmount}
          onValueChange={(v) => setStakeAmount(v ?? 0)}
          allowNegativeValue={false}
          decimalsLimit={4}
          decimalSeparator="."
          groupSeparator=","
          placeholder="0.00"
          disabled={isDisabled}
          defaultValue={0}
          className="
            w-full bg-transparent
            px-5 py-4 pr-[90px]
            text-xl sm:text-2xl font-black text-maxx-white font-mono
            placeholder:text-maxx-dim
            focus:outline-none
          "
        />

        {/* MAX button */}
        {tokenBalanceInfo && (
          <button
            onClick={setMaxInputValue}
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              px-3 py-1.5
              bg-maxx-violet/10 hover:bg-maxx-violet/20
              border border-maxx-violet/25 hover:border-maxx-violet/50
              text-maxx-violet text-xs font-mono font-bold tracking-widest uppercase
              rounded-sm transition-all duration-200
            "
          >
            MAX
          </button>
        )}
      </div>
    </div>
  );
}
