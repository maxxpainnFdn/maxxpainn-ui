import { Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { stakingConfig } from "@/config/staking";

const { minTermDays, maxTermDays } = stakingConfig;

export interface StakingSliderProps {
  defaultTermDays: number;
  badge: { color: string; label: string; border: string } | undefined;
  disabled: boolean;
  onChange: (v: number) => void;
}

export default function StakingSlider({
  defaultTermDays,
  badge,
  disabled=false,
  onChange,
}: StakingSliderProps) {
  const [termDays, setTermDays] = useState(defaultTermDays);

  const [isDisabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(disabled);
  }, [disabled]);

  const sliderPercentage =
    ((termDays - minTermDays) / (maxTermDays - minTermDays)) * 100;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;
    const v = Number(e.target.value);
    setTermDays(v);
    onChange?.(v);
  };

  return (
    <div className={isDisabled ? "opacity-50 pointer-events-none" : ""}>
      <div className="flex justify-between mb-6">
        <label className="text-sm font-bold text-gray-400 uppercase flex items-center gap-2">
          <Timer className="w-4 h-4" /> Staking Term
        </label>
        <span
          className={`text-lg sm:text-xl md:text-2xl font-bold md:font-black ${badge?.color || ""}`}
        >
          {termDays} Days
        </span>
      </div>

      <div
        className={`bg-black/20 border border-white/5 rounded-3xl p-8 relative transition-all select-none ${
          isDisabled ? "cursor-not-allowed" : "hover:border-white/10"
        }`}
      >
        <div className="relative w-full h-8 mb-4 flex items-center">
          <input
            type="range"
            min={minTermDays}
            max={maxTermDays}
            step={1}
            value={termDays}
            onChange={handleSliderChange}
            disabled={isDisabled}
            className={`absolute inset-0 w-full h-full opacity-0 z-20 ${
              isDisabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          />

          <div className="absolute left-0 right-0 h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                isDisabled
                  ? "bg-gray-600"
                  : "bg-gradient-to-r from-purple-600 to-pink-600"
              }`}
              style={{ width: `${sliderPercentage}%` }}
            />
          </div>

          <div
            className={`absolute h-8 w-8 rounded-full border-4 border-gray-900 z-10 pointer-events-none flex items-center justify-center ${
              isDisabled
                ? "bg-gray-400"
                : "bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            }`}
            style={{ left: `calc(${sliderPercentage}% - 16px)` }}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isDisabled ? "bg-gray-500" : "bg-purple-500"
              }`}
            />
          </div>
        </div>

        <div className="flex justify-between text-xs font-mono font-bold text-gray-500 tracking-widest pt-2">
          <span>{minTermDays}d</span>
          <span>~1y</span>
          <span>~2y</span>
          <span>3y</span>
        </div>
      </div>
    </div>
  );
}
