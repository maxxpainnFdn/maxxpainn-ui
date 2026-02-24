import React, { useState } from 'react';
import { ChevronRight, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

const PAIN_EVENTS = [
  { code: "LUNA-001", emoji: "🌙", name: "The Luna Massacre", loss: "$60B", year: "2022", color: "#818cf8", tagline: "Do Kwon promised the moon. Delivered a crater.", detail: "280,000 BTC couldn't stop the death spiral. Algorithmic stablecoins met reality and reality won." },
  { code: "FTX-002", emoji: "💔", name: "FTX Betrayal", loss: "$8B", year: "2022", color: "#f87171", tagline: "The golden boy was just a fraud in a hoodie.", detail: "SBF's media tour couldn't hide the $8 billion hole. Customers trusted, regulators slept, billions vanished." },
  { code: "RUG-003", emoji: "🪦", name: "Endless Rug Pulls", loss: "$10B+", year: "ongoing", color: "#ff2d78", tagline: "SafeMoon, Iron Finance, Titan — the graveyard grows.", detail: "Exit liquidity wears many masks: 'revolutionary DeFi', 'community-driven', 'audited by top firms'." },
  { code: "LIQ-004", emoji: "⚡", name: "Liquidation Hell", loss: "$50B+", year: "every cycle", color: "#8b5cf6", tagline: "One red candle. Years of savings. Gone in milliseconds.", detail: "100x leverage feels genius until it isn't. The cascade: funding rate spikes, bots fire, liquidations run." },
];

const StoryDetail = ({ ev }: { ev: typeof PAIN_EVENTS[0] }) => (
  <div className="bg-maxx-violet/5 border border-maxx-violet/15 rounded p-[clamp(20px,3.5vw,30px)] flex flex-col min-h-[290px] relative overflow-hidden">
    <div className="absolute top-0 inset-x-0 h-0.5" style={{ background: `linear-gradient(90deg, ${ev.color}, transparent)` }} />
    <div className="absolute -top-10 -right-10 w-[160px] h-[160px] pointer-events-none" style={{ background: `radial-gradient(circle, ${ev.color}1e 0%, transparent 70%)` }} />
    
    <div className="relative z-10 flex-1">
      <div className="flex items-start gap-3.5 mb-3.5">
        <span className="text-3xl leading-none shrink-0">{ev.emoji}</span>
        <div>
          <div className="font-mono text-[0.7rem] tracking-widest uppercase mb-1" style={{ color: ev.color }}>{ev.code} · {ev.year}</div>
          <h3 className="font-sans font-extrabold text-[clamp(1.05rem,2.5vw,1.45rem)] uppercase text-maxx-white leading-[1.1]">{ev.name}</h3>
        </div>
      </div>
      <p className="font-sans font-semibold italic text-[clamp(0.9rem,2vw,1.02rem)] text-maxx-white leading-relaxed pl-3.5 mb-3 border-l-2" style={{ borderColor: ev.color }}>
        "{ev.tagline}"
      </p>
      <p className="text-[clamp(0.86rem,1.5vw,0.94rem)] text-maxx-bright leading-[1.8]">
        {ev.detail}
      </p>
    </div>

    <div className="relative z-10 mt-5 pt-3.5 border-t border-maxx-violet/15 flex justify-between items-end flex-wrap gap-2">
      <div>
        <div className="font-sans font-black text-[clamp(1.6rem,5vw,2.6rem)] leading-none" style={{ color: ev.color }}>{ev.loss}</div>
        <div className="font-mono text-[0.68rem] text-maxx-sub tracking-widest uppercase mt-1">Lost Forever</div>
      </div>
      <span className="font-mono text-[0.68rem] tracking-widest opacity-70" style={{ color: ev.color }}>{ev.code}</span>
    </div>
  </div>
);

export default function StorySection() {
  const [activeTab, setActiveTab] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  return (
    <section className="bg-maxx-bg1 relative">
      <div className="max-w-7xl mx-auto px-6 py-20">
        
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-6 items-end mb-12">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" />// INCIDENT REPORT</div>
            <h2 className="font-sans font-black text-[clamp(2.6rem,6.5vw,5rem)] leading-[0.94] uppercase text-maxx-white">
              THE PAIN<br /><span className="text-maxx-violet">WE CARRY</span>
            </h2>
          </div>
          <p className="font-sans font-medium text-[clamp(0.96rem,1.8vw,1.08rem)] text-maxx-bright leading-[1.8] max-w-md">
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
                  className={`flex items-center gap-3 w-full p-3.5 rounded-sm text-left transition-all outline outline-1 outline-offset-[-1px] ${
                    isActive ? 'bg-maxx-violet/10 outline-maxx-violet/30 border-l-[3px]' : 'bg-white/5 outline-maxx-violet/15 border-l-[3px] border-l-transparent hover:bg-white/10'
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
        <div className="md:hidden flex flex-col gap-1.5 mb-10">
          {PAIN_EVENTS.map((ev, i) => {
            const isOpen = openAccordion === i;
            return (
              <div key={i} className={`border rounded transition-colors ${isOpen ? 'border-maxx-violet/40' : 'border-maxx-violet/15'}`}>
                <button
                  onClick={() => setOpenAccordion(isOpen ? null : i)}
                  className={`rounded w-full flex items-center gap-3 p-3.5 text-left border-l-[3px] transition-colors ${isOpen ? 'bg-maxx-violet/10' : 'bg-transparent'}`}
                  style={{ borderLeftColor: isOpen ? ev.color : 'transparent' }}
                >
                  <span className="text-xl shrink-0">{ev.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-2">
                      <span className={`font-sans font-bold text-[0.92rem] ${isOpen ? 'text-maxx-white' : 'text-maxx-mid'}`}>{ev.name}</span>
                      <span className="font-mono text-[0.72rem] font-bold shrink-0" style={{ color: ev.color }}>{ev.loss}</span>
                    </div>
                    <div className="font-mono text-[0.66rem] text-maxx-mid tracking-widest mt-0.5">{ev.code} · {ev.year}</div>
                  </div>
                  <ChevronRight size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-90 text-maxx-pink' : 'text-maxx-sub'}`} />
                </button>
                <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${isOpen ? 'max-h-[600px]' : 'max-h-0'}`}>
                  <div className="p-3">
                    <StoryDetail ev={ev} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner */}
        <div className="p-[clamp(24px,3.5vw,40px)] bg-maxx-violet/5 border border-maxx-violet/20 rounded-sm flex justify-between items-center flex-wrap gap-5">
          <div>
            <h3 className="font-sans font-black text-[clamp(1.5rem,3.5vw,2.4rem)] uppercase tracking-tight text-maxx-white mb-1.5">
              FROM ASHES, <span className="text-maxx-violet">WE RISE</span>
            </h3>
            <p className="text-maxx-bright text-[clamp(0.9rem,1.8vw,1rem)] leading-relaxed">
              MAXXPAINN is our collective middle finger to the system.
            </p>
          </div>
          <Link to="/mint" className="btn-p">
            <Flame size={15} /> JOIN THE REVOLUTION
          </Link>
        </div>
      </div>
      <div className="h-[52px] bg-[linear-gradient(to_bottom_right,#120a10_49.5%,#0f0810_50%)]" />
    </section>
  );
}
