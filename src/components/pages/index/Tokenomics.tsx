import React from 'react';
import { Scale, Ban, Coins, Flame, Vote, Wallet, FileText, Sparkles, Zap, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import { tokenConfig } from '@/config/token';
import Button from '@/components/button/Button';

const PRINCIPLES = [
  { title: "Fair Launch",      icon: Scale,  color: "#ff2d78", desc: "No pre-sales, no insider allocations. Every degen starts equal." },
  { title: "No VCs Allowed",   icon: Ban,    color: "#f87171", desc: "We don't take VC money or their 'strategic partnerships'." },
  { title: "Free Forever",     icon: Coins,  color: "#8b5cf6", desc: "Your pain is your ticket. We want your rage, not your rent." },
  { title: "Deflationary",     icon: Flame,  color: "#fb923c", desc: "Aggressive buyback & burn. Supply only goes one way: down." },
  { title: "DAO Governed",     icon: Vote,   color: "#34d399", desc: "Community calls the shots. No suits, no ties." },
  { title: "100% Open Source", icon: Code,   color: "#60a5fa", desc: "All code is public on GitHub. Anyone can read, verify, or audit it." },
];

const MINT_STEPS = [
  { n: "01", icon: Wallet,    title: "CONNECT WALLET",   sub: "Any Solana wallet. No barriers." },
  { n: "02", icon: FileText,  title: "DROP YOUR STORY",  sub: "Your worst crypto loss, fully verified." },
  { n: "03", icon: FileText,  title: "LOCK ALLOCATION",  sub: "Choose your mint window and secure rank." },
  { n: "04", icon: Sparkles,  title: "MINT",             sub: `Your ${tokenConfig.symbol} allocation unlocks on schedule.` },
];

export default function Tokenomics() {
  return (
    <section className="bg-maxx-bg3 relative" id="tokenomics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        {/* Header */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 items-end mb-8 sm:mb-10">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" />// TOKENOMICS</div>
            <h2 className="font-sans font-black text-[clamp(2rem,6.5vw,5rem)] leading-[0.94] uppercase text-maxx-white">
              NO <span className="bg-grad-accent bg-clip-text text-transparent">FLUFF</span>
            </h2>
          </div>
          <p className="font-sans font-medium text-[clamp(0.88rem,1.8vw,1.08rem)] text-maxx-bright leading-[1.8] max-w-sm">
            Built by degens, for degens. No suits, no pre-sales, no VC influence. Just raw community power.
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border border-maxx-violet/15 rounded-sm overflow-hidden mb-3">
          {[
            { v: "100%", l: "Fair Launch",   pink: true },
            { v: "0%",   l: "VC Allocation", pink: false },
            { v: "$0",   l: "Funds Raised",  pink: false },
            { v: "∞",    l: "Degen Power",   pink: true },
          ].map((s, i) => (
            <div
              key={i}
              className={[
                'p-4 sm:p-6 text-center border-maxx-violet/15',
                i % 2 === 0 ? 'bg-maxx-violet/5' : 'bg-transparent',
                'sm:border-r',
                i === 1 || i === 3 ? 'sm:border-r-0' : '',
                i < 2 ? 'border-b sm:border-b-0' : '',
                i % 2 === 0 ? 'border-r' : '',
              ].join(' ')}
            >
              <div className={`font-sans font-black text-[clamp(1.5rem,4vw,3rem)] leading-none mb-1 sm:mb-1.5 ${s.pink ? 'text-maxx-pinkLt' : 'text-maxx-violetLt'}`}>{s.v}</div>
              <div className="font-mono text-[0.6rem] sm:text-[0.7rem] tracking-widest uppercase text-maxx-mid leading-tight">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">

          {/* Principles */}
          <div className="md:col-span-2 bg-maxx-violet/5 border border-maxx-violet/15 rounded-sm p-4 sm:p-6">
            <span className="eyebrow block mb-4"><span className="eyebrow-dot" />CORE PRINCIPLES</span>
            <div className="grid sm:grid-cols-2 gap-2">
              {PRINCIPLES.map((p, i) => {
                const PIcon = p.icon;
                return (
                  <div key={i} className="flex gap-3 items-start p-3 sm:p-3.5 border border-maxx-violet/15 rounded-sm bg-white/[0.015] hover:bg-white/5 transition-colors">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm border flex items-center justify-center shrink-0" style={{ backgroundColor: `${p.color}18`, borderColor: `${p.color}35`, color: p.color }}>
                      <PIcon size={13} />
                    </div>
                    <div>
                      <div className="font-sans font-bold text-[0.82rem] sm:text-[0.875rem] uppercase tracking-wide text-maxx-white mb-0.5 sm:mb-1">{p.title}</div>
                      <p className="text-[0.8rem] sm:text-[0.875rem] text-maxx-bright leading-[1.6]">{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How to Mint */}
          <div className="bg-maxx-violet/5 border border-maxx-violet/15 rounded-sm p-4 sm:p-6 flex flex-col">
            <span className="eyebrow block mb-4 sm:mb-5"><span className="eyebrow-dot" />HOW TO MINT</span>
            <div className="flex-1">
              {MINT_STEPS.map((s, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-grad-btn flex items-center justify-center font-mono font-bold text-[0.68rem] sm:text-[0.72rem] text-white">{s.n}</div>
                    {i < MINT_STEPS.length - 1 && <div className="w-px h-6 sm:h-7 mt-1 bg-gradient-to-b from-maxx-violet/50 to-transparent" />}
                  </div>
                  <div className={`pt-0.5 sm:pt-1 ${i < MINT_STEPS.length - 1 ? 'pb-4 sm:pb-6' : ''}`}>
                    <div className="font-sans font-bold text-[0.82rem] sm:text-[0.9rem] uppercase tracking-wide text-maxx-white mb-0.5 sm:mb-1">{s.title}</div>
                    <p className="text-[0.8rem] sm:text-[0.875rem] text-maxx-bright leading-[1.6]">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/mint" className="mt-4 sm:mt-3 w-full">
              <Button variant="primary" skewed fullWidth size="sm">
                <Flame size={14} /> Claim Your Allocation
              </Button>
            </Link>
          </div>

          {/* 100% Allocation */}
          <div className="md:col-span-2 bg-maxx-violet/5 border border-maxx-violet/15 rounded-sm p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            <div className="shrink-0 text-center sm:text-left">
              <div className="font-sans font-black text-[clamp(3rem,8vw,6rem)] leading-none bg-grad-accent bg-clip-text text-transparent mb-1">100%</div>
              <div className="font-mono text-[0.65rem] sm:text-[0.72rem] tracking-widest uppercase text-maxx-sub">Supply Allocation</div>
            </div>
            <div className="hidden sm:block w-px h-20 bg-maxx-violet/15 shrink-0" />
            <div className="flex-1">
              <div className="font-sans font-bold text-[1rem] sm:text-[1.1rem] text-maxx-white mb-2">Goes directly to the community.</div>
              <p className="text-[0.85rem] sm:text-[0.94rem] text-maxx-bright leading-[1.75] mb-3 sm:mb-4">
                No team allocation. No VC slice. No advisor wallets. No pre-sale. Every single token minted goes to a degen who shared their pain story — full stop.
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {["0% Team", "0% VCs", "0% Pre-sale", "0% Advisors"].map(t => (
                  <span key={t} className="font-mono text-[0.63rem] sm:text-[0.7rem] tracking-widest uppercase px-2 sm:px-2.5 py-1 border border-maxx-violet/25 text-maxx-mid rounded-sm">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Pain to Power CTA */}
          <div className="bg-maxx-pink/5 border border-maxx-pink/20 rounded-sm p-4 sm:p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 w-[180px] h-[180px] bg-[radial-gradient(circle,rgba(255,45,120,0.2)_0%,transparent_70%)] pointer-events-none" />
            <div className="relative z-10">
              <div className="font-sans font-black uppercase leading-[0.95] text-[clamp(1.8rem,3.5vw,2.8rem)] mb-2 sm:mb-3">
                <span className="text-maxx-pink">PAIN</span><br />
                <span className="text-[0.7em] text-maxx-sub">→</span><br />
                <span className="bg-grad-accent bg-clip-text text-transparent">POWER</span>
              </div>
              <p className="text-[0.82rem] sm:text-[0.88rem] text-maxx-bright leading-[1.7]">
                No wallet drain. No hidden fees. Just your story.
              </p>
            </div>
            <Link to="/mint" className="mt-5 sm:mt-6 relative z-10 w-full">
              <Button variant="primary" skewed fullWidth size="sm">
                <Zap size={14} /> Enter the Gauntlet
              </Button>
            </Link>
          </div>

        </div>
      </div>
      <div className="h-[52px] bg-[linear-gradient(to_bottom_right,#120a10_49.5%,#0d080c_50%)]" />
    </section>
  );
}
