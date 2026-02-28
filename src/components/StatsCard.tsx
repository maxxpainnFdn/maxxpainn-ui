import React from "react";

export interface StatCardProps {
  title: string;
  color?: keyof typeof PALETTE;
  value: React.ReactNode;
  icon: React.ComponentType<{
    className?: string;
    strokeWidth?: number;
    style?: React.CSSProperties;
  }>;
}

const PALETTE = {
  plasma:  { hex: "#c084fc", rgb: "192,132,252", pair: "#ec4899" },
  neon:    { hex: "#a3e635", rgb: "163,230,53",  pair: "#10b981" },
  magenta: { hex: "#ff006e", rgb: "255,0,110",   pair: "#a855f7" },
  ice:     { hex: "#22d3ee", rgb: "34,211,238",  pair: "#3b82f6" },
  gold:    { hex: "#fbbf24", rgb: "251,191,36",  pair: "#f97316" },
  ember:   { hex: "#fb923c", rgb: "251,146,60",  pair: "#ef4444" },
  mint:    { hex: "#34d399", rgb: "52,211,153",  pair: "#06b6d4" },
  indigo:  { hex: "#818cf8", rgb: "129,140,248", pair: "#6366f1" },
};

export const StatsCard = ({
  title,
  color = "plasma",
  value,
  icon,
}: StatCardProps) => {
  const Icon = icon;
  const c = PALETTE[color] ?? PALETTE.plasma;

  return (
    <div className="group relative rounded-2xl p-px cursor-default hover:-translate-y-1 transition-transform duration-300 ease-out">

      {/* ▸ Spinning conic-gradient border — paused until hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
        <div
          className="absolute inset-[-80%] animate-[spin_8s_linear_infinite] [animation-play-state:paused] group-hover:[animation-play-state:running]"
          style={{
            background: `conic-gradient(from 0deg, ${c.hex}, transparent 25%, ${c.pair}, transparent 50%, ${c.hex}, transparent 75%, ${c.pair}, transparent)`,
          }}
        />
      </div>

      {/* ▸ Static fallback border */}
      <div
        className="absolute inset-0 rounded-2xl border opacity-100 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none"
        style={{ borderColor: `rgba(${c.rgb}, 0.1)` }}
      />

      {/* ── Inner card ──bg-[#08080f] */}
      <div className="relative rounded-2xl bg-[#1a141f] overflow-hidden">

        {/* ▸ Dot-matrix texture */}
        <div
          className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500"
          style={{
            backgroundImage: `radial-gradient(${c.hex} 0.8px, transparent 0.8px)`,
            backgroundSize: "14px 14px",
          }}
        />

        {/* ▸ Floating accent orb */}
        <div
          className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl opacity-[0.08] group-hover:opacity-[0.22] group-hover:scale-110 transition-all duration-700"
          style={{ background: `radial-gradient(circle, ${c.hex}, ${c.pair})` }}
        />

        {/* ▸ Secondary orb */}
        <div
          className="absolute -bottom-12 -left-12 w-28 h-28 rounded-full blur-3xl opacity-0 group-hover:opacity-[0.12] transition-all duration-700 delay-100"
          style={{ background: `radial-gradient(circle, ${c.pair}, transparent)` }}
        />

        {/* ▸ Corner HUD brackets */}
        {[
          "top-2.5 left-2.5 border-t border-l rounded-tl",
          "top-2.5 right-2.5 border-t border-r rounded-tr",
          "bottom-2.5 left-2.5 border-b border-l rounded-bl",
          "bottom-2.5 right-2.5 border-b border-r rounded-br",
        ].map((pos, i) => (
          <div
            key={i}
            className={`absolute w-2.5 h-2.5 ${pos} opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
            style={{ borderColor: c.hex }}
          />
        ))}

        {/* ── Content ── */}
        <div className="relative z-10 p-5 md:p-7">

          <div className="flex items-start justify-between mb-6">
            <div className="relative">
              {/* Ping ring — paused until hover */}
              <div
                className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] [animation-play-state:paused] group-hover:[animation-play-state:running]"
                style={{ backgroundColor: `rgba(${c.rgb}, 0.12)` }}
              />
              {/* Icon box */}
              <div
                className="relative w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:shadow-lg"
                style={{
                  backgroundColor: `rgba(${c.rgb}, 0.06)`,
                  borderColor: `rgba(${c.rgb}, 0.15)`,
                }}
              >
                <Icon
                  className="w-5 h-5 md:w-[22px] md:h-[22px]"
                  strokeWidth={1.6}
                  style={{ color: c.hex }}
                />
              </div>
            </div>

            {/* Live pulse — paused until hover */}
            <div className="relative mt-1.5 mr-0.5">
              <span
                className="absolute inset-0 w-2 h-2 rounded-full animate-ping [animation-play-state:paused] group-hover:[animation-play-state:running]"
                style={{ backgroundColor: `rgba(${c.rgb}, 0.35)` }}
              />
              <span
                className="block w-2 h-2 rounded-full"
                style={{ backgroundColor: c.hex }}
              />
            </div>
          </div>

          {/* Value */}
          <p
            className="text-[1.75rem] md:text-[2rem] font-black tracking-tight leading-none mb-2.5"
            style={{
              background: `linear-gradient(135deg, #ffffff 0%, ${c.hex} 50%, ${c.pair} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: `drop-shadow(0 0 24px rgba(${c.rgb}, 0.35))`,
            }}
          >
            {value}
          </p>

          {/* Accent divider */}
          <div className="flex items-center gap-2 mb-2.5">
            <div
              className="h-px w-10 rounded-full group-hover:w-16 transition-all duration-500"
              style={{ background: `linear-gradient(90deg, ${c.hex}, transparent)` }}
            />
            <div
              className="w-1 h-1 rounded-full opacity-40"
              style={{ backgroundColor: c.hex }}
            />
          </div>

          {/* Label */}
          <p className="font-mono text-[0.6rem] md:text-[0.68rem] font-semibold text-white/60 uppercase tracking-[0.2em] group-hover:text-white/55 transition-colors duration-300">
            {title}
          </p>
        </div>

        {/* ▸ Bottom edge glow */}
        <div
          className="absolute bottom-0 left-[10%] right-[10%] h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${c.rgb}, 0.4), transparent)`,
          }}
        />
      </div>
    </div>
  );
};

export default StatsCard;
