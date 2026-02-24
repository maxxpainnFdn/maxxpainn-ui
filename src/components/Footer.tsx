import React from 'react';
import { Twitter, Send, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FOOTER_COLS = [
  { title: "PLATFORM", links: ["How It Works", "Mint", "Clans", "Leaderboard", "Staking"] },
  { title: "RESOURCES", links: ["Manifesto", "Whitepaper", "Tokenomics", "Roadmap", "FAQ"] },
  { title: "LEGAL", links: ["Privacy Policy", "Terms of Service"] },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a0507] border-t border-maxx-violet/15 relative z-10">
      <div className="max-w-7xl mx-auto px-6 pt-[52px] pb-7">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-9 mb-11">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 no-underline mb-3.5">
              <div className="w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-b-[19px] border-b-maxx-pink" />
              <span className="font-sans font-black text-[1.05rem] tracking-tight text-maxx-white">
                MAXX<span className="text-maxx-pink">PAINN</span>
              </span>
            </Link>
            <p className="font-sans text-[0.9rem] text-maxx-bright leading-[1.75] mb-4 max-w-[220px]">
              Transforming crypto pain into unstoppable power. Built by degens, for degens.
            </p>
            <div className="flex gap-1.5">
              {[Twitter, Send, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-sm border border-maxx-violet/15 flex items-center justify-center text-maxx-sub no-underline transition-all hover:border-maxx-pink hover:bg-maxx-pink/10 hover:text-maxx-pink">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Cols */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-maxx-violet mb-4">{col.title}</h4>
              <ul className="list-none space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link to="#" className="font-sans text-[0.88rem] font-medium text-maxx-bright no-underline transition-colors hover:text-maxx-pink">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px bg-maxx-violet/15 mb-5" />

        <div className="flex justify-between items-center flex-wrap gap-3 mb-4">
          <span className="font-mono text-[0.72rem] text-maxx-mid tracking-widest">
            © 2025 MAXXPAINN. BUILT WITH PAIN, POWERED BY DEGENS.
          </span>
          <div className="flex items-center gap-2 px-3 py-1 border border-maxx-violet/15 rounded-sm">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse-slow" />
            <span className="font-mono text-[0.72rem] text-maxx-mid tracking-widest">LIVE ON SOLANA</span>
          </div>
        </div>

        <div className="p-3 border-l-2 border-l-maxx-violet/30 rounded-r-sm bg-maxx-violet/5">
          <p className="text-[0.84rem] text-maxx-bright leading-[1.7]">
            <span className="text-maxx-pink font-bold">DISCLAIMER:</span> MAXXPAINN is an experimental project. Not financial advice. Cryptocurrency investments carry extreme risk. Only allocate what you can afford to lose. This is therapy for degens, not a retirement plan.
          </p>
        </div>
      </div>
    </footer>
  );
}
