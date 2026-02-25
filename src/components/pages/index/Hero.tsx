import React, { useState, useEffect, useRef } from 'react';
import { Skull, Zap, Flame, ArrowRight, FileText, Map, Book, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const STORIES = [
  "LOST 80 SOL IN LUNA COLLAPSE",
  "FTX FROZE MY FUNDS — STILL WAITING",
  "RUGGED BY 'AUDITED' PROJECT",
  "100X LONG: LIQUIDATED IN MY SLEEP",
  "BRIDGE EXPLOIT: 24 ETH TO VOID",
];

export default function Hero() {
  const [storyIdx, setStoryIdx] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const valRef = useRef<HTMLSpanElement>(null);
  const levelRef = useRef(0);
  const lastRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const tick = (timestamp: number) => {
      if (!lastRef.current) lastRef.current = timestamp;
      const delta = timestamp - lastRef.current;
      levelRef.current = (levelRef.current + delta * 0.012) % 100;

      if (barRef.current) barRef.current.style.width = `${levelRef.current}%`;
      if (valRef.current) valRef.current.textContent = `${Math.round(levelRef.current)}%`;

      lastRef.current = timestamp;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setStoryIdx((i) => (i + 1) % STORIES.length), 3800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-[68px] bg-maxx-bg0 overflow-hidden">
      {/* Gridlines */}
      <div className="hidden md:block absolute top-0 bottom-0 w-px left-[18%] bg-gradient-to-b from-transparent via-maxx-violet/10 to-transparent" />
      <div className="hidden md:block absolute top-0 bottom-0 w-px left-[82%] bg-gradient-to-b from-transparent via-maxx-violet/10 to-transparent" />

      {/* Glows */}
      <div className="absolute -top-[100px] -right-[100px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,45,120,0.08)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute top-[80px] -left-[80px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(139,92,246,0.07)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-16 relative z-10">
        
        {/* Eyebrow & Meter */}
        <div className="flex justify-between items-start flex-wrap gap-5 mb-10 animate-fade-up">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" /> FREE-TO-MINT SPL TOKEN · SOLANA
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-[7px] h-[7px] bg-maxx-pink rounded-full animate-pulse-slow" />
              <span className="font-mono text-[0.72rem] text-maxx-sub tracking-widest uppercase">
                MINTING LIVE NOW
              </span>
            </div>
          </div>

          <div className="min-w-[240px]">
            <div className="flex justify-between font-mono text-[0.72rem] tracking-widest uppercase text-maxx-sub mb-2">
              <span className="flex items-center gap-1.5"><Skull size={11} className="text-maxx-sub" /> PAIN</span>
              <span ref={valRef} className="text-maxx-pinkLt font-bold">0%</span>
              <span className="flex items-center gap-1.5">GAIN <Zap size={11} className="text-yellow-400" /></span>
            </div>
            <div className="maxx-track">
              <div ref={barRef} className="maxx-fill w-0" />
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="mb-7 animate-fade-up [animation-delay:120ms]">
          <h1 className="font-sans font-black text-[clamp(2rem,11vw,9rem)] leading-[0.94] tracking-tight text-maxx-white uppercase">
            FORGE YOUR<br />
            <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #ff2d78' }}>PAIN</span>
            <span className="text-[0.5em] align-middle text-maxx-sub font-normal tracking-normal mx-2">INTO</span>
            <span className="bg-grad-accent bg-clip-text text-transparent">POWER</span>
          </h1>
        </div>

        {/* Ticker */}
        <div className="mb-12 animate-fade-up [animation-delay:240ms] rounded">
          <div className="rounded inline-flex items-center gap-2.5 bg-maxx-violet/5 border border-maxx-violet/15 px-4 py-2.5 max-w-[92vw]">
            <TrendingDown size={14} className="text-maxx-violet shrink-0" />
            <span className="font-mono text-[clamp(0.68rem,1.4vw,0.76rem)] text-maxx-mid tracking-widest uppercase truncate">
              {STORIES[storyIdx]}
            </span>
          </div>
        </div>

        {/* CTA Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-fade-up [animation-delay:360ms]">
          <div>
            <p className="font-sans font-medium text-[clamp(1rem,2vw,1.15rem)] leading-relaxed text-maxx-bright mb-6">
              Every degen carries the weight of rugs, liquidations, and betrayals. MAXXPAINN converts that collective trauma into liquid tokens. <strong className="text-maxx-white font-bold">Share your pain story to mint.</strong>
            </p>
            <div className="flex flex-wrap gap-2.5">
              {["100% FREE MINT", "LIQUID TOKENS · NO NFTS", "ON SOLANA", "NO VCs"].map((tag) => (
                <span key={tag} className="pill rounded">{tag}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link to="/mint" className="btn-p btn-skewed text-[1.05rem] py-4">
              <Flame size={18} /> MINT FOR FREE <ArrowRight size={18} />
            </Link>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Link to="/whitepaper" className="btn-s rounded-lg"><FileText size={14} className="hidden sm:block" /> Whitepaper</Link>
              <Link to="/roadmap" className="btn-s rounded-lg"><Map size={14} className="hidden sm:block" /> Roadmap</Link>
              <Link to="/manifesto" className="btn-s rounded-lg"><Book size={14} className="hidden sm:block" /> Manifesto</Link>
            </div>
            <p className="font-mono text-[0.72rem] text-maxx-sub tracking-widest text-center uppercase mt-1">
              No wallet drain · No hidden fees · Pure degen energy
            </p>
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="border-y border-maxx-violet/15">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4">
          {[
            { v: "$2.1T+", l: "Crypto Losses Tracked", text: "text-maxx-pinkLt" },
            { v: "1M+", l: "Degens United", text: "text-maxx-violetLt" },
            { v: "∞", l: "Free Mints Available", text: "text-maxx-white" },
            { v: "24/7", l: "Revenge Mode", text: "text-maxx-pinkLt" },
          ].map((s, i) => (
            <div key={i} className={`p-6 text-center border-maxx-violet/15 ${i % 2 === 0 ? 'bg-maxx-violet/5' : 'bg-transparent'} sm:border-r ${i === 1 || i === 3 ? 'border-r-0' : ''} ${i < 2 ? 'border-b sm:border-b-0' : ''}`}>
              <div className={`font-sans font-black text-[clamp(2rem,4vw,3rem)] leading-none ${s.text}`}>{s.v}</div>
              <div className="font-mono text-[0.72rem] tracking-widest uppercase text-maxx-mid mt-1.5">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-[52px] bg-[linear-gradient(to_bottom_right,#0d080c_49.5%,#120a10_50%)]" />
    </section>
  );
}
