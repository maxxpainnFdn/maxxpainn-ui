import React, { useState } from 'react';
import { ChevronRight, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/button/Button';

const PAIN_EVENTS = [
  { code: "DEFI-007", emoji: "🌀", name: "DeFi Protocol Death Spirals", loss: "$60B+", year: "2021–2023", color: "#818cf8", tagline: "Luna, UST, Iron Finance, Basis Cash — code turned to craters.", detail: "Algorithmic stablecoins and unstable tokenomics collapsed across multiple protocols: Luna/UST, Iron Finance/TITAN, Basis Cash, ESD, and more. Billions vanished as promises of magic money proved fragile." },
  { code: "HACK-005", emoji: "💀", name: "Mega DeFi Hacks", loss: "$20B+", year: "2016–2023", color: "#f87171", tagline: "PolyNetwork, Wormhole, Ronin… billions siphoned in the night.", detail: "Smart contract exploits, cross-chain bridge hacks, and misconfigurations drained billions across multiple platforms, leaving investors scrambling." },
  { code: "SCAM-006", emoji: "🎭", name: "Ponzi & Exit Scams", loss: "$15B+", year: "2017–2023", color: "#fbbf24", tagline: "BitConnect, PlusToken, OneCoin — the hall of fame of fraud.", detail: "From promise-heavy MLM schemes to classic Ponzi mechanics, unsuspecting investors lost fortunes while founders vanished." },
  { code: "RUG-003", emoji: "🪦", name: "Endless Rug Pulls", loss: "$10B+", year: "ongoing", color: "#ff2d78", tagline: "SafeMoon, Iron Finance, Titan — the graveyard grows.", detail: "Exit liquidity wears many masks: 'revolutionary DeFi', 'community-driven', 'audited by top firms'." },
  { code: "LIQ-004", emoji: "⚡", name: "Liquidation Hell", loss: "$50B+", year: "every cycle", color: "#8b5cf6", tagline: "One red candle. Years of savings. Gone in milliseconds.", detail: "100x leverage feels genius until it isn't. The cascade: funding rate spikes, bots fire, liquidations run." },
];

const StoryDetail = ({ ev }: { ev: typeof PAIN_EVENTS[0] }) => (
  <div className="bg-maxx-violet/5 border border-maxx-violet/15 rounded p-4 sm:p-[clamp(20px,3.5vw,30px)] flex flex-col relative overflow-hidden">
    <div className="absolute top-0 inset-x-0 h-0.5" style={{ background: `linear-gradient(90deg, ${ev.color}, transparent)` }} />
    <div className="absolute -top-10 -right-10 w-[160px] h-[160px] pointer-events-none" style={{ background: `radial-gradient(circle, ${ev.color}1e 0%, transparent 70%)` }} />

    <div className="relative z-10 flex-1">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl sm:text-3xl leading-none shrink-0">{ev.emoji}</span>
        <div>
          <div className="font-mono text-[0.65rem] sm:text-[0.7rem] tracking-widest uppercase mb-1" style={{ color: ev.color }}>{ev.code} · {ev.year}</div>
          <h3 className="font-sans font-extrabold text-[clamp(0.95rem,2.5vw,1.45rem)] uppercase text-maxx-white leading-[1.1]">{ev.name}</h3>
        </div>
      </div>
      <p className="font-sans font-semibold italic text-[clamp(0.82rem,2vw,1.02rem)] text-maxx-white leading-relaxed pl-3 mb-3 border-l-2" style={{ borderColor: ev.color }}>
        "{ev.tagline}"
      </p>
      <p className="text-[clamp(0.8rem,1.5vw,0.94rem)] text-maxx-bright leading-[1.7]">
        {ev.detail}
      </p>
    </div>

    <div className="relative z-10 mt-4 pt-3 border-t border-maxx-violet/15 flex justify-between items-end flex-wrap gap-2">
      <div>
        <div className="font-sans font-black text-[clamp(1.4rem,5vw,2.6rem)] leading-none" style={{ color: ev.color }}>{ev.loss}</div>
        <div className="font-mono text-[0.65rem] text-maxx-sub tracking-widest uppercase mt-1">Lost Forever</div>
      </div>
      <span className="font-mono text-[0.65rem] tracking-widest opacity-70" style={{ color: ev.color }}>{ev.code}</span>
    </div>
  </div>
);

export default function StorySection() {
  const [activeTab, setActiveTab] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  return (
    <section className="bg-maxx-bg1 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        {/* Header */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 items-end mb-8 sm:mb-12">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" />// INCIDENT REPORT</div>
            <h2 className="font-sans font-black text-[clamp(2rem,6.5vw,5rem)] leading-[0.94] uppercase text-maxx-white">
              THE PAIN<br /><span className="text-maxx-violet">WE CARRY</span>
            </h2>
          </div>
          <p className="font-sans font-medium text-[clamp(0.88rem,1.8vw,1.08rem)] text-maxx-bright leading-[1.8] max-w-md">
            Every crash carved deeper scars. Every rug made us wiser. From this collective wreckage, we build something the system can't ruin.
          </p>
        </div>

        {/* Desktop Tab View */}
        <div className="hidden md:grid grid-cols-2 gap-5 items-start mb-10">
          <div className="flex flex-col gap-1">
            {PAIN_EVENTS.map((ev, i) => {
              const isActive = activeTab === i;
              return (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`flex items-center gap-3 w-full p-3.5 rounded-sm text-left transition-all outline outline-1 outline-offset-[-1px] border-l-[3px] ${
                    isActive ? 'bg-maxx-violet/10 outline-maxx-violet/30' : 'bg-white/5 outline-maxx-violet/15 border-l-transparent hover:bg-white/10'
                  }`}
                  style={{ borderLeftColor: isActive ? ev.color : 'transparent' }}
                >
                  <span className="text-xl shrink-0">{ev.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-2">
                      <span className={`font-sans font-bold text-[0.9rem] truncate transition-colors ${isActive ? 'text-maxx-white' : 'text-maxx-mid'}`}>{ev.name}</span>
                      <span className="font-mono text-[0.72rem] font-bold shrink-0" style={{ color: ev.color }}>{ev.loss}</span>
                    </div>
                    <div className="font-mono text-[0.66rem] text-maxx-mid tracking-widest mt-0.5">{ev.code} · {ev.year}</div>
                  </div>
                  <ChevronRight size={14} className={isActive ? 'text-maxx-pink' : 'text-maxx-sub'} />
                </button>
              );
            })}
          </div>
          <StoryDetail ev={PAIN_EVENTS[activeTab]} />
        </div>

        {/* Mobile Accordion View */}
        <div className="md:hidden flex flex-col gap-1.5 mb-8">
          {PAIN_EVENTS.map((ev, i) => {
            const isOpen = openAccordion === i;
            return (
              <div key={i} className={`border rounded transition-colors ${isOpen ? 'border-maxx-violet/40' : 'border-maxx-violet/15'}`}>
                <button
                  onClick={() => setOpenAccordion(isOpen ? null : i)}
                  className={`rounded w-full flex items-center gap-2.5 p-3 text-left border-l-[3px] transition-colors ${isOpen ? 'bg-maxx-violet/10' : 'bg-transparent'}`}
                  style={{ borderLeftColor: isOpen ? ev.color : 'transparent' }}
                >
                  <span className="text-lg shrink-0">{ev.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-2">
                      <span className={`font-sans font-bold text-[0.85rem] truncate ${isOpen ? 'text-maxx-white' : 'text-maxx-mid'}`}>{ev.name}</span>
                      <span className="font-mono text-[0.7rem] font-bold shrink-0" style={{ color: ev.color }}>{ev.loss}</span>
                    </div>
                    <div className="font-mono text-[0.62rem] text-maxx-mid tracking-widest mt-0.5">{ev.code} · {ev.year}</div>
                  </div>
                  <ChevronRight size={13} className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-90 text-maxx-pink' : 'text-maxx-sub'}`} />
                </button>
                <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${isOpen ? 'max-h-[600px]' : 'max-h-0'}`}>
                  <div className="p-2.5">
                    <StoryDetail ev={ev} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner */}
        <div className="p-4 sm:p-[clamp(24px,3.5vw,40px)] bg-maxx-violet/5 border border-maxx-violet/20 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-5">
          <div>
            <h3 className="font-sans font-black text-[clamp(1.3rem,3.5vw,2.4rem)] uppercase tracking-tight text-maxx-white mb-1">
              FROM ASHES, <span className="text-maxx-violet">WE RISE</span>
            </h3>
            <p className="text-maxx-bright text-[clamp(0.85rem,1.8vw,1rem)] leading-relaxed">
              MAXXPAINN is our collective pushback against the system.
            </p>
          </div>
          <Link to="/mint" className="w-full sm:w-auto shrink-0">
            <Button variant="primary" skewed fullWidth>
              <Flame size={15} /> Tell Your Story
            </Button>
          </Link>
        </div>

      </div>
      <div className="h-[52px] bg-[linear-gradient(to_bottom_right,#120a10_49.5%,#0f0810_50%)]" />
    </section>
  );
}
