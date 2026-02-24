// components/Hero.jsx - Clean, bold hero focused on conversion
import React, { useState, useEffect, useRef } from 'react';
import { Zap, Skull, TrendingDown, ArrowRight, Clock, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/useIsMobile';
import { tokenConfig } from '@/config/token';

const painStories = [
  "RUGGED 12X → MINTING $PAINN", "LUNA LIQUIDATION → NOW PAID", "FTX FUNDS GONE → COMMUNITY WINS",
  "CEX HACKED → WE BUILD BACK", "100X LEVERAGE → PAIN POWERED", "BEAR MARKET HODL → LEGION RISES"
];

const Hero = () => {
  const [currentStory, setCurrentStory] = useState(0);
  const isMobile = useIsMobile();
  const painRef = useRef(0);
  const painTextRef = useRef(null);
  const painBarRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const animate = (now) => {
      painRef.current = (painRef.current + 0.8) % 101;
      if (painBarRef.current) painBarRef.current.style.width = `${painRef.current}%`;
      if (painTextRef.current) painTextRef.textContent = `${Math.floor(painRef.current)}%`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentStory((prev) => (prev + 1) % painStories.length), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-transparent" />
      
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Logo + Tagline */}
        <div className="flex flex-col items-center gap-6 mb-12 md:mb-20">
          <div className="flex items-center gap-4 text-2xl md:text-4xl font-black tracking-tight">
            <Zap className="w-10 h-10 md:w-12 md:h-12 text-purple-500 drop-shadow-lg" />
            <div>
              <span className="text-white">MAXX</span>
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">PAINN</span>
            </div>
          </div>
          <div className="text-sm md:text-base uppercase tracking-widest font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent max-w-md mx-auto">
            Crypto scars = your mint ticket. 100% FREE on Solana
          </div>
        </div>

        {/* Live Story */}
        <div className="w-full max-w-2xl mx-auto mb-12">
          <div className="bg-black/40 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-4 text-sm md:text-base text-red-400 uppercase tracking-wider font-mono">
              <TrendingDown className="w-5 h-5 animate-pulse" />
              <span>Live Pain Stories</span>
              <Clock className="w-4 h-4 ml-auto" />
            </div>
            <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent animate-pulse">
              {painStories[currentStory]}
            </div>
          </div>
        </div>

        {/* Pain Meter */}
        <div className="w-full max-w-lg mx-auto mb-12">
          <div className="flex justify-between items-center mb-4 text-xs uppercase tracking-wider font-bold text-gray-400">
            <span className="flex items-center gap-1.5">
              <Skull className="w-4 h-4 text-gray-600" />
              Total Pain
            </span>
            <span ref={painTextRef} className="text-2xl font-black text-purple-400 tracking-tight">0%</span>
            <span>POWER</span>
          </div>
          <div className="h-4 bg-black/60 rounded-2xl border border-white/20 overflow-hidden shadow-inner">
            <div ref={painBarRef} className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-emerald-500 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-75" style={{width: '0%'}} />
          </div>
        </div>

        {/* Core Value Prop + CTA */}
        <div className="max-w-4xl mx-auto px-4 mb-16 md:mb-24">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-8 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-300 block">PAIN</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-red-500">→ POWER → PROFIT</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-12">
            Every rug, liquidation, hack becomes your free $PAINN tokens. No VC. No presale. Pure degen energy.
          </p>
          
          <div className="flex flex-col lg:flex-row gap-6 justify-center items-stretch max-w-4xl mx-auto">
            <Link to="/mint" className="flex-1">
              <button className="group relative w-full h-20 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-2xl rounded-3xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-4 overflow-hidden">
                <Flame className="w-8 h-8 group-hover:scale-110 transition-transform" />
                MINT FREE $PAINN
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                <div className="absolute inset-0 bg-white/20 -skew-x-12 absolute left-[-100%] group-hover:left-[100%] transition-transform duration-700" />
              </button>
            </Link>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: '∞', label: 'FREE MINTS' },
                { icon: '0%', label: 'VC SHARE' },
                { icon: '🔥', label: 'BURN MECHANICS' }
              ].map((item, i) => (
                <div key={i} className="group bg-black/30 border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-all hover:-translate-y-1">
                  <div className="text-3xl md:text-4xl font-black text-purple-400 mb-2 group-hover:text-white">{item.icon}</div>
                  <div className="text-xs uppercase tracking-widest font-bold text-gray-400 group-hover:text-gray-200">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
