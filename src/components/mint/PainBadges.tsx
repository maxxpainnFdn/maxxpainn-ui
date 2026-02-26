import React from 'react';
import { Shield, Crown, Flame, Star, Zap, Anchor, Target } from 'lucide-react';

interface PainBadgesProps {
  lockPeriod: number;
}

const BADGES = [
  {
    name: 'Pain Initiate',
    icon: Shield,
    accentCol: '#9d7fba',        // maxx-sub
    minDays: 1,
    maxDays: 7,
    label: '1–7 days',
  },
  {
    name: 'Weekly Warrior',
    icon: Zap,
    accentCol: '#eab308',
    minDays: 8,
    maxDays: 29,
    label: '8–29 days',
  },
  {
    name: 'Monthly Martyr',
    icon: Flame,
    accentCol: '#f97316',
    minDays: 30,
    maxDays: 89,
    label: '30–89 days',
  },
  {
    name: 'Quarterly Crusher',
    icon: Target,
    accentCol: '#3b82f6',
    minDays: 90,
    maxDays: 179,
    label: '90–179 days',
  },
  {
    name: 'Half-Year Hardliner',
    icon: Anchor,
    accentCol: '#14b8a6',
    minDays: 180,
    maxDays: 364,
    label: '180–364 days',
  },
  {
    name: 'Yearly Legend',
    icon: Crown,
    accentCol: '#8b5cf6',        // maxx-violet
    minDays: 365,
    maxDays: 999,
    label: '365–999 days',
  },
  {
    name: 'Ultimate Degen',
    icon: Star,
    accentCol: '#ff2d78',        // maxx-pink
    minDays: 1000,
    maxDays: Infinity,
    label: '1000+ days',
  },
];

const PainBadges = ({ lockPeriod }: PainBadgesProps) => {
  const badges = BADGES.map(b => ({ ...b, unlocked: lockPeriod >= b.minDays }));
  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-6 shadow-2xl relative overflow-hidden">

      {/* top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet/60 via-maxx-pink/30 to-transparent" />

      {/* header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="eyebrow mb-1"><span className="eyebrow-dot" />RANK BADGES</div>
          <h3 className="font-sans font-black text-[1.1rem] uppercase tracking-tight text-maxx-white">
            Pain Badges
          </h3>
        </div>
        <div className="text-right">
          <div className="font-sans font-black text-[1.6rem] leading-none bg-grad-accent bg-clip-text text-transparent">
            {unlockedCount}/{badges.length}
          </div>
          <div className="font-mono text-[0.65rem] text-maxx-sub tracking-widest uppercase">Unlocked</div>
        </div>
      </div>

      {/* progress strip */}
      <div className="pain-track mb-5">
        <div
          className="pain-fill"
          style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
        />
      </div>

      {/* badge list */}
      <div className="space-y-2">
        {badges.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div
              key={idx}
              className={`
                group flex items-center gap-3.5 p-3.5 rounded-md border transition-all duration-300
                ${badge.unlocked
                  ? 'border-[color-mix(in_srgb,var(--badge-col)_35%,transparent)] bg-[color-mix(in_srgb,var(--badge-col)_8%,transparent)]'
                  : 'border-maxx-violet/10 bg-transparent opacity-35 grayscale'
                }
              `}
              style={{ '--badge-col': badge.accentCol } as React.CSSProperties}
            >
              {/* icon */}
              <div
                className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0 border"
                style={
                  badge.unlocked
                    ? { backgroundColor: `${badge.accentCol}20`, borderColor: `${badge.accentCol}40`, color: badge.accentCol }
                    : { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(139,92,246,0.12)', color: '#3d2b5c' }
                }
              >
                <Icon size={15} />
              </div>

              {/* info */}
              <div className="flex-1 min-w-0">
                <div className={`font-sans font-bold text-[0.85rem] uppercase tracking-wide leading-none ${badge.unlocked ? 'text-maxx-white' : 'text-maxx-dim'}`}>
                  {badge.name}
                </div>
                <div className="font-mono text-[0.65rem] tracking-widest mt-0.5" style={{ color: badge.unlocked ? badge.accentCol : '#3d2b5c' }}>
                  {badge.unlocked ? '✓ UNLOCKED' : `REQUIRES ${badge.minDays} DAYS`}
                </div>
              </div>

              {/* day range pill */}
              <span className="font-mono text-[0.62rem] tracking-widest uppercase px-2 py-1 rounded-sm border border-maxx-violet/12 text-maxx-sub shrink-0 hidden sm:inline-flex">
                {badge.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PainBadges;
