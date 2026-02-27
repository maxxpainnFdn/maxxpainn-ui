import { Timer } from "lucide-react";
import { useRef, useState } from "react";
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
  disabled = false,
  onChange,
}: StakingSliderProps) {
  // Single source of truth — the committed numeric value
  const [termDays, setTermDays] = useState(defaultTermDays);

  // The text shown in the input while the user is typing (may be incomplete, e.g. "")
  const [draft, setDraft] = useState(String(defaultTermDays));
  const [inputFocused, setInputFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const sliderPct = ((termDays - minTermDays) / (maxTermDays - minTermDays)) * 100;

  /* ── Commit a new value ─────────────────────────────────── */
  const commit = (raw: number) => {
    const clamped = Math.min(maxTermDays, Math.max(minTermDays, Math.round(raw)));
    setTermDays(clamped);
    setDraft(String(clamped));   // always sync draft back to committed value
    onChange?.(clamped);
  };

  /* ── Slider handlers ────────────────────────────────────── */
  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    commit(Number(e.target.value));
  };

  /* ── Input handlers ─────────────────────────────────────── */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const raw = e.target.value.replace(/\D/g, "");
    setDraft(raw);

    // Live-sync slider while typing if value is in range
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed >= minTermDays && parsed <= maxTermDays) {
      setTermDays(parsed);
      onChange?.(parsed);
    }
  };

  const handleInputBlur = () => {
    setInputFocused(false);
    const parsed = parseInt(draft, 10);
    if (!isNaN(parsed)) {
      commit(parsed);           // clamp + sync on blur
    } else {
      setDraft(String(termDays)); // reset to last good value if left empty/invalid
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter")     { inputRef.current?.blur(); return; }
    if (e.key === "ArrowUp")   { e.preventDefault(); commit(termDays + 1); }
    if (e.key === "ArrowDown") { e.preventDefault(); commit(termDays - 1); }
  };

  return (
    <div className={disabled ? "opacity-50 pointer-events-none" : ""}>

      {/* ── Label row ── */}
      <div className="flex justify-between items-center flex-wrap mb-2">
        <div className="mb-2">
          <label className="text-sm font-semibold tracking-wider uppercase text-maxx-mid flex items-center gap-2">
            <Timer size={14} className="text-maxx-violet" />
            Staking Term
          </label>
        </div>

        {/* Inline day input + badge */}
        <div className="flex items-center gap-2 align-middle mb-1">
          <div className={`
            flex items-center gap-1.5 border rounded-md px-3 py-1.5
            transition-all duration-200
            ${inputFocused
              ? "bg-maxx-bg0/80 border-maxx-violet/55 shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
              : "bg-maxx-bg0/60 border-maxx-violet/25 hover:border-maxx-violet/40"
            }
          `}>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={inputFocused ? draft : String(termDays)}
              onChange={handleInputChange}
              onFocus={() => { setInputFocused(true); setDraft(String(termDays)); }}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              disabled={disabled}
              className="w-12 bg-transparent text-right font-mono font-bold text-base text-maxx-white outline-none"
              aria-label="Staking term in days"
            />
            <span className="font-mono text-xs text-maxx-sub tracking-widest uppercase select-none">
              days
            </span>
          </div>

          {badge && (
            <span className={`font-mono text-xs tracking-widest uppercase px-2.5 py-1.5 border rounded-sm ${badge.border} ${badge.color}`}>
              {badge.label}
            </span>
          )}
        </div>
      </div>

      {/* ── Slider card ── */}
      <div className={`
        bg-maxx-bg0/60 border border-maxx-violet/15 rounded-lg px-6 py-5
        transition-all duration-200
        ${!disabled ? "hover:border-maxx-violet/25" : "cursor-not-allowed"}
      `}>

        {/* Custom slider track */}
        <div className="relative w-full h-8 flex items-center mb-3">

          {/* Hidden native input — drives all drag/click interaction */}
          <input
            type="range"
            min={minTermDays}
            max={maxTermDays}
            step={1}
            value={termDays}
            onChange={handleSlider}
            disabled={disabled}
            className={`absolute inset-0 w-full h-full opacity-0 z-20 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          />

          {/* Track */}
          <div className="absolute left-0 right-0 h-[6px] bg-maxx-dim/50 rounded-sm overflow-hidden">
            <div
              className="h-full rounded-sm transition-[width] duration-75"
              style={{
                width: `${sliderPct}%`,
                background: disabled
                  ? "rgba(61,43,92,0.6)"
                  : "linear-gradient(90deg, #8b5cf6, #ff2d78)",
              }}
            />
          </div>

          {/* Box thumb */}
          <div
            className="absolute z-10 pointer-events-none transition-[left] duration-75"
            style={{ left: `calc(${sliderPct}% - 10px)` }}
          >
            <div
              className={`
                w-5 h-7 rounded-sm border-2 flex items-center justify-center
                shadow-[0_0_0_1px_rgba(139,92,246,0.4),0_4px_14px_rgba(139,92,246,0.45)]
                ${disabled ? "bg-maxx-dim border-maxx-dim/60" : "border-white/15"}
              `}
              style={disabled ? {} : {
                background: "linear-gradient(180deg, #c4b5fd 0%, #8b5cf6 45%, #ff2d78 100%)",
              }}
            />
          </div>
        </div>

        {/* Range labels */}
        <div className="flex justify-between font-mono text-xs tracking-widest uppercase text-maxx-dim">
          <span>{minTermDays}d</span>
          <span>~1y</span>
          <span>~2y</span>
          <span>{maxTermDays}d</span>
        </div>
      </div>
    </div>
  );
}
