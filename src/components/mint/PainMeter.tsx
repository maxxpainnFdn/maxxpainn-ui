import React from 'react';
import { Zap, Flame, Skull } from 'lucide-react';

interface PainMeterProps {
  lockPeriod: number;
  maxLockPeriod: number;
}

const LEVELS = [
  { label: 'MILD',      max: 15,  color: '#eab308', from: '#ca8a04', to: '#eab308', icon: Zap    },
  { label: 'MODERATE',  max: 35,  color: '#f97316', from: '#ea580c', to: '#f97316', icon: Flame  },
  { label: 'INTENSE',   max: 65,  color: '#ef4444', from: '#dc2626', to: '#ef4444', icon: Flame  },
  { label: 'EXTREME',   max: 85,  color: '#ff2d78', from: '#c0003c', to: '#ff2d78', icon: Flame  },
  { label: 'LEGENDARY', max: 100, color: '#8b5cf6', from: '#8b5cf6', to: '#ff2d78', icon: Skull  },
];

const PainMeter = ({ lockPeriod, maxLockPeriod }: PainMeterProps) => {
  const pct = Math.min(100, Number(((lockPeriod / maxLockPeriod) * 100).toFixed(1)));
  const level = LEVELS.find(l => pct < l.max) ?? LEVELS[LEVELS.length - 1];
  const Icon = level.icon;

  return (
    <div className="bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-6 shadow-2xl relative overflow-hidden">

      {/* top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, ${level.from}, ${level.to}, transparent)` }}
      />

      {/* corner glow */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: level.color }}
      />

      {/* header */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div>
          <div className="eyebrow mb-1"><span className="eyebrow-dot" />COMMITMENT METER</div>
          <h3 className="font-sans font-bold text-lg uppercase tracking-tight text-maxx-white">
            Pain Intensity
          </h3>
        </div>
        <div
          className="w-10 h-10 rounded-sm border flex items-center justify-center"
          style={{ backgroundColor: `${level.color}20`, borderColor: `${level.color}40`, color: level.color }}
        >
          <Icon size={18} />
        </div>
      </div>

      {/* big meter bar */}
      <div className="relative z-10 mb-4">
        <div className="pain-track h-4 rounded-sm">
          <div
            className="h-full rounded-sm transition-[width] duration-500 ease-out relative overflow-hidden"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${level.from}, ${level.to})`,
            }}
          >
            {/* shine sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shine_2.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      {/* labels row */}
      <div className="relative z-10 flex justify-between items-end">
        <div>
          <div
            className="font-sans font-black text-[1.6rem] leading-none tracking-tight"
            style={{ color: level.color }}
          >
            {level.label}
          </div>
          <div className="font-mono text-[0.65rem] text-maxx-sub tracking-widest uppercase mt-0.5">
            Pain Level
          </div>
        </div>
        <div className="text-right">
          <div className="font-sans font-black text-[1.4rem] leading-none text-maxx-white">
            {Math.round(pct)}%
          </div>
          <div className="font-mono text-[0.65rem] text-maxx-sub tracking-widest uppercase mt-0.5">
            Commitment
          </div>
        </div>
      </div>

      {/* tick marks */}
      <div className="relative z-10 flex justify-between mt-3 px-0.5">
        {LEVELS.map((l, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className="w-px h-2"
              style={{ background: pct >= (i === 0 ? 0 : LEVELS[i-1].max) ? l.color : '#3d2b5c' }}
            />
            <span
              className="font-mono text-[0.55rem] tracking-wider uppercase hidden sm:block"
              style={{ color: pct >= (i === 0 ? 0 : LEVELS[i-1].max) ? l.color : '#3d2b5c' }}
            >
              {l.label.slice(0, 4)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PainMeter;
