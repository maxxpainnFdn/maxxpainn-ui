import React from 'react';
import { Scale, Ban, Coins, Flame, Vote, Wallet, FileText, Sparkles, Zap, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const PRINCIPLES = [
  { title: "Fair Launch", icon: Scale, color: "#ff2d78", desc: "No pre-sales, no insider allocations. Every degen starts equal." },
  { title: "No VCs Allowed", icon: Ban, color: "#f87171", desc: "We don't take VC money or their 'strategic partnerships'." },
  { title: "Free Forever", icon: Coins, color: "#8b5cf6", desc: "Your pain is your ticket. We want your rage, not your rent." },
  { title: "Deflationary", icon: Flame, color: "#fb923c", desc: "Aggressive buyback & burn. Supply only goes one way: down." },
  { title: "DAO Governed", icon: Vote, color: "#34d399", desc: "Community calls the shots. No suits, no ties." },
  { title: "100% Open Source", icon: Code,  color: "#60a5fa", desc: "All code is public on GitHub. Anyone can read, verify, or audit it." }
];

const MINT_STEPS = [
  { n: "01", icon: Wallet, title: "CONNECT", sub: "Link your Solana wallet — any will do" },
  { n: "02", icon: FileText, title: "SHARE PAIN", sub: "Tell your crypto horror story in full" },
  { n: "03", icon: Sparkles, title: "MINT", sub: "Receive liquid $PAINN tokens instantly" },
];

export default function Tokenomics() {
  
  const P4Icon = PRINCIPLES[4].icon;
  
  return (
    <section className="bg-maxx-bg3 relative">
      <div className="max-w-7xl mx-auto px-6 py-20">
        
        <div className="grid md:grid-cols-2 gap-6 items-end mb-10">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" />// TOKENOMICS</div>
            <h2 className="font-sans font-black text-[clamp(2.6rem,6.5vw,5rem)] leading-[0.94] uppercase text-maxx-white">
              NO <span className="bg-grad-accent bg-clip-text text-transparent">FLUFF</span>
            </h2>
          </div>
          <p className="font-sans font-medium text-[clamp(0.96rem,1.8vw,1.08rem)] text-maxx-bright leading-[1.8] max-w-sm">
            Built by degens, for degens. No suits, no pre-sales, no VC influence. Just raw community power.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 border border-maxx-violet/15 rounded-sm overflow-hidden mb-3">
          {[
            { v: "100%", l: "Fair Launch", pink: true },
            { v: "0%", l: "VC Allocation", pink: false },
            { v: "$0", l: "Funds Raised", pink: false },
            { v: "∞", l: "Degen Power", pink: true },
          ].map((s, i) => (
            <div key={i} className={`p-6 text-center border-maxx-violet/15 ${i % 2 === 0 ? 'bg-maxx-violet/5' : 'bg-transparent'} sm:border-r ${i === 1 || i === 3 ? 'border-r-0' : ''} ${i < 2 ? 'border-b sm:border-b-0' : ''}`}>
              <div className={`font-sans font-black text-[clamp(2rem,4vw,3rem)] leading-none mb-1.5 ${s.pink ? 'text-maxx-pinkLt' : 'text-maxx-violetLt'}`}>{s.v}</div>
              <div className="font-mono text-[0.7rem] tracking-widest uppercase text-maxx-mid">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Principles */}
          <div className="md:col-span-2 bg-maxx-violet/5 border border-maxx-violet/15 rounded-sm p-6">
            <span className="eyebrow block mb-4"><span className="eyebrow-dot" />CORE PRINCIPLES</span>
            <div className="grid sm:grid-cols-2 gap-2 mb-2">
              {PRINCIPLES.map((p, i) => {
                
                const PIcon = PRINCIPLES[4].icon;
                
                return (
                  <div key={i} className="flex gap-3 items-start p-3.5 border border-maxx-violet/15 rounded-sm bg-white/[0.015] hover:bg-white/5 transition-colors">
                    <div className="w-8 h-8 rounded-sm border flex items-center justify-center shrink-0" style={{ backgroundColor: `${p.color}18`, borderColor: `${p.color}35`, color: p.color }}>
                      <PIcon size={14} />
                    </div>
                    <div>
                      <div className="font-sans font-bold text-[0.875rem] uppercase tracking-wide text-maxx-white mb-1">{p.title}</div>
                      <p className="text-[0.875rem] text-maxx-bright leading-[1.65]">{p.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            {/* 
              <div className="flex gap-3 items-center p-3.5 border border-maxx-violet/15 rounded-sm bg-white/[0.015] hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 rounded-sm border flex items-center justify-center shrink-0" style={{ backgroundColor: `${PRINCIPLES[4].color}18`, borderColor: `${PRINCIPLES[4].color}35`, color: PRINCIPLES[4].color }}>
                  <P4Icon size={14} />
                </div>
                <div>
                  <div className="font-sans font-bold text-[0.875rem] uppercase tracking-wide text-maxx-white mb-0.5">{PRINCIPLES[4].title}</div>
                  <p className="text-[0.875rem] text-maxx-bright leading-[1.65]">{PRINCIPLES[4].desc}</p>
                </div>
              </div>
              */}
          </div>

          {/* How to Mint */}
          <div className="bg-maxx-violet/5 border border-maxx-violet/15 rounded-sm p-6 flex flex-col">
            <span className="eyebrow block mb-5"><span className="eyebrow-dot" />HOW TO MINT</span>
            <div className="flex-1">
              {MINT_STEPS.map((s, i) => (
                <div key={i} className="flex gap-3.5 items-start">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-8 h-8 rounded-sm bg-grad-btn flex items-center justify-center font-mono font-bold text-[0.72rem] text-white">{s.n}</div>
                    {i < MINT_STEPS.length - 1 && <div className="w-px h-7 mt-1 bg-gradient-to-b from-maxx-violet/50 to-transparent" />}
                  </div>
                  <div className={`pt-1 ${i < MINT_STEPS.length - 1 ? 'pb-6' : ''}`}>
                    <div className="font-sans font-bold text-[0.9rem] uppercase tracking-wide text-maxx-white mb-1">{s.title}</div>
                    <p className="text-[0.875rem] text-maxx-bright leading-[1.65]">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/mint" className="btn-p justify-center text-[0.9rem] p-3 mt-3">
              <Flame size={14} /> CLAIM YOUR ALLOCATION 
            </Link>
          </div>

          {/* 100% Allocation */}
          <div className="md:col-span-2 bg-maxx-violet/5 border border-maxx-violet/15 rounded-sm p-6 flex flex-col sm:flex-row items-center gap-10">
            <div className="shrink-0 text-center sm:text-left">
              <div className="font-sans font-black text-[clamp(3.5rem,8vw,6rem)] leading-none bg-grad-accent bg-clip-text text-transparent mb-1.5">100%</div>
              <div className="font-mono text-[0.72rem] tracking-widest uppercase text-maxx-sub">Supply Allocation</div>
            </div>
            <div className="hidden sm:block w-px h-20 bg-maxx-violet/15 shrink-0" />
            <div className="flex-1 min-w-[220px]">
              <div className="font-sans font-bold text-[1.1rem] text-maxx-white mb-2.5">Goes directly to the community.</div>
              <p className="text-[0.94rem] text-maxx-bright leading-[1.75] mb-4">
                No team allocation. No VC slice. No advisor wallets. No pre-sale. Every single token minted goes to a degen who shared their pain story — full stop.
              </p>
              <div className="flex flex-wrap gap-2">
                {["0% Team", "0% VCs", "0% Pre-sale", "0% Advisors"].map(t => (
                  <span key={t} className="font-mono text-[0.7rem] tracking-widest uppercase px-2.5 py-1 border border-maxx-violet/25 text-maxx-mid rounded-sm">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Pain to Power CTA */}
          <div className="bg-maxx-pink/5 border border-maxx-pink/20 rounded-sm p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 w-[180px] h-[180px] bg-[radial-gradient(circle,rgba(255,45,120,0.2)_0%,transparent_70%)] pointer-events-none" />
            <div className="relative z-10">
              <div className="font-sans font-black uppercase leading-[0.95] text-[clamp(2rem,3.5vw,2.8rem)] mb-3">
                <span className="text-maxx-pink">PAIN</span><br />
                <span className="text-[0.7em] text-maxx-sub">→</span><br />
                <span className="bg-grad-accent bg-clip-text text-transparent">POWER</span>
              </div>
              <p className="text-[0.88rem] text-maxx-bright leading-[1.7]">
                No wallet drain. No hidden fees. Your story is all you need.
              </p>
            </div>
            <Link to="/mint" className="btn-p justify-center text-[0.88rem] p-3 mt-6 relative z-10">
              <Zap size={14} /> Enter the Gauntlet
            </Link>
          </div>
        </div>
      </div>
      <div className="h-[52px] bg-[linear-gradient(to_bottom_right,#120a10_49.5%,#0d080c_50%)]" />
    </section>
  );
}
