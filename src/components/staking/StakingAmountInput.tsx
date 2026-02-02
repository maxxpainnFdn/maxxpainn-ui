import utils from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import CurrencyInput from "react-currency-input-field";

export interface StakingAmountInput{
  disabled: boolean;
  isStaking: boolean;
  tokenBalanceInfo: { value: string, valueRaw: bigint } | undefined;
  defaultValue: number | string;
  onChange: () => void;
};

export default function StakingAmountInput({ 
  isStaking,
  tokenBalanceInfo,
  defaultValue = 0,
  disabled=false,
  onChange 
}) {
  
  const [stakeAmount, setStakeAmount] = useState<number | any>(defaultValue);
  const amountInputRef = useRef<HTMLInputElement>();

  const setMaxInputValue = (e) => {
    e.preventDefault();
    const value = tokenBalanceInfo?.value || 0;
    setStakeAmount(Number(value));
  };
  
  useEffect(() => {
    onChange(stakeAmount)
  }, [stakeAmount])
  
  return (
    <div
      className={`${isStaking ? "opacity-50 pointer-events-none" : ""} bg-black/20 rounded-3xl p-8 border border-white/5`}
    >
      <label className="flex justify-between text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">
        <span>Amount</span>
        
        { tokenBalanceInfo &&
          <a className="flex" href="#" onClick={setMaxInputValue}>
            <span className="pe-1">Bal:</span>
            <span className="hidden xs:block">
              {utils.toLocaleString(tokenBalanceInfo.value)}
            </span>
            <span className="block xs:hidden">
              {utils.toShortNumber(tokenBalanceInfo.value)}
            </span>
          </a>
        }
      </label>
      <div className="relative">
        <CurrencyInput
          ref={amountInputRef}
          value={stakeAmount}
          onValueChange={(v) => setStakeAmount(v ?? 0)}
          allowNegativeValue={false}
          decimalsLimit={4}
          decimalSeparator="."
          groupSeparator=","
          placeholder="0.00"
          disabled={disabled || isStaking}
          defaultValue={0}
          className={`
            w-full bg-gray-800/60 border-2 border-purple-500/10 
            rounded-2xl px-6 py-4 pr-[100px] text-white text:lg sm:text-xl 
            md:text-2xl font-black focus:border-purple-500/60 
            focus:outline-none  placeholder:text-gray-700
          `}
        />
        
        {tokenBalanceInfo &&
          <button
            onClick={setMaxInputValue}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 text-sm font-bold rounded-xl transition-all"
          >
            MAX
          </button>
        }
      </div>
    </div>
  )
}
