import React from 'react';
import { Info, TrendingUp, Clock, Network, Layers } from 'lucide-react';

export interface MintPreviewData {
  baseReward: number;
  earlyAdopterMultiplier: number;
  lockPeriodMultiplier: number;
  networkMultiplier: number;
  minRewardAmount: number | string;
}

const MULTIPLIER_META = [
  {
    key: 'base',
    label: 'Base Reward',
    abbr: 'BASE',
    icon: Layers,
    info: 'Base reward decreases as token supply increases — early is better.',
    accentCol: '#8b5cf6',
  },
  {
    key: 'eam',
    label: 'Early Adopter',
    abbr: 'EAM',
    icon: TrendingUp,
    info: 'Early Adopter Multiplier gives early minters an extra boost over later arrivals.',
    accentCol: '#ff2d78',
  },
  {
    key: 'lpm',
    label: 'Lock Period',
    abbr: 'LPM',
    icon: Clock,
    info: 'Lock Period Multiplier rewards patience — longer wait = larger final payout.',
    accentCol: '#f97316',
  },
  {
    key: 'nem',
    label: 'Network Effect',
    abbr: 'NEM',
    icon: Network,
    info: 'Network Effect Multiplier grows as more degens join the protocol.',
    accentCol: '#14b8a6',
  },
];

const TooltipRow = ({ meta, value }: { meta: typeof MULTIPLIER_META[0]; value: string }) => {
  const Icon = meta.icon;
  return (
    <div className="group/row flex items-center gap-3 p-3.5 rounded-md border border-maxx-violet/10 bg-maxx-bg0/40 hover:border-maxx-violet/25 hover:bg-maxx-bg0/60 transition-all duration-200">
      {/* icon */}
      <div
        className="w-8 h-8 rounded-sm border flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${meta.accentCol}18`, borderColor: `${meta.accentCol}35`, color: meta.accentCol }}
      >
        <Icon size={13} />
      </div>

      {/* label + tooltip trigger */}
      <div className="flex-1 min-w-0 relative">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[0.7rem] font-semibold tracking-widest uppercase text-maxx-mid">
            {meta.abbr}
          </span>
          <div className="relative">
            <Info size={11} className="text-maxx-dim cursor-help" />
            {/* tooltip */}
            <div className="
              hidden group-hover/row:block
              absolute left-5 -top-1 w-52
              bg-maxx-bg1 border border-maxx-violet/25
              text-[0.75rem] text-maxx-bright leading-relaxed p-3 rounded-md
              shadow-xl z-20 pointer-events-none
            ">
              {meta.info}
            </div>
          </div>
        </div>
        <div className="font-sans text-[0.78rem] text-maxx-sub truncate mt-0.5">{meta.label}</div>
      </div>

      {/* value */}
      <span className="font-sans font-black text-[1rem] text-maxx-white shrink-0">
        {value}
      </span>
    </div>
  );
};

export default function MintPreview({
  baseReward,
  earlyAdopterMultiplier,
  lockPeriodMultiplier,
  networkMultiplier,
  minRewardAmount,
}: MintPreviewData) {

  const rows = [
    { meta: MULTIPLIER_META[0], value: baseReward.toLocaleString() },
    { meta: MULTIPLIER_META[1], value: `${earlyAdopterMultiplier.toFixed(2)}x` },
    { meta: MULTIPLIER_META[2], value: `${lockPeriodMultiplier.toFixed(2)}x` },
    { meta: MULTIPLIER_META[3], value: `${networkMultiplier}x` },
  ];

  return (
    <div className="bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-6 shadow-2xl relative overflow-hidden">

      {/* top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet/60 via-maxx-pink/30 to-transparent" />

      {/* header */}
      <div className="mb-5">
        <div className="eyebrow mb-1"><span className="eyebrow-dot" />REWARD BREAKDOWN</div>
        <h3 className="font-sans font-black text-[1.1rem] uppercase tracking-tight text-maxx-white">
          Reward Preview
        </h3>
      </div>

      {/* rows */}
      <div className="space-y-2 mb-5">
        {rows.map(r => <TooltipRow key={r.meta.key} meta={r.meta} value={r.value} />)}
      </div>

      {/* divider */}
      <div className="h-px bg-maxx-violet/15 mb-5" />

      {/* min reward callout */}
      <div className="bg-maxx-violet/5 border border-maxx-violet/20 rounded-md p-4 flex items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[0.65rem] tracking-widest uppercase text-maxx-sub mb-1">
            Minimum Reward
          </div>
          <div className="font-mono text-[0.7rem] text-maxx-mid leading-relaxed">
            Based on your selected wait period
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-sans font-black text-[clamp(1.3rem,3.5vw,1.8rem)] leading-none bg-grad-accent bg-clip-text text-transparent">
            {Number(minRewardAmount).toLocaleString()}
          </div>
          <div className="font-mono text-[0.62rem] text-maxx-sub tracking-widest uppercase mt-0.5">
            $PAINN
          </div>
        </div>
      </div>
    </div>
  );
}
