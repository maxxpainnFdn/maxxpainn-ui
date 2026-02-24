import  { useState } from 'react';
import {  ExternalLink, ArrowRight, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SiMedium, SiTelegram, SiX } from '@icons-pack/react-simple-icons';
import socials from "@/config/socials"

const socialChannels = [
  {
    icon: SiX,
    label: "X / TWITTER",
    col:    "#ff2d78",
    title:  "The Signal Feed",
    link:   "Follow on X",
    url:    `https://x.com/${socials.x}`,
    desc:   "Proof-of-Patience updates, rank milestones, and community pain stories in motion.",
  },
  {
    icon: SiTelegram,
    label: "TELEGRAM",
    col: "#8b5cf6",
    title: "The Conviction Room",
    link: "Join the Conviction Room",
    url:  `https://x.com/${socials.telegram}`,
    desc: "Live protocol discussions, clan coordination, and real talk from the trenches.",
  },
  {
    icon: SiMedium,
    label: "MEDIUM BLOG",
    col: "#ff2d78",
    title: "The Protocol Archives",
    link: "Read the Archives",
    url:  `https://x.com/${socials.medium}`,
    desc: "Deep dives into token mechanics, reward algorithms, governance, and economic design.",
  },
];

export default function Community() {

  return (
    <section className="bg-maxx-bg4 relative">
      <div className="max-w-7xl mx-auto px-6 py-20">
        
        <div className="grid md:grid-cols-2 gap-6 items-end mb-14">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" />// JOIN THE MOVEMENT</div>
            <h2 className="font-sans font-black text-[clamp(2.6rem,6.5vw,5rem)] leading-[0.94] uppercase text-maxx-white">
              WE ARE <span className="text-maxx-violet">LEGION</span>
            </h2>
          </div>
          <p className="font-sans font-medium text-[clamp(0.96rem,1.8vw,1.08rem)] text-maxx-bright leading-[1.8] max-w-sm">
            <strong className="text-maxx-pinkLt font-bold">Thousands of degens</strong> who earned their spot through pain, not promises.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-16">
          {socialChannels.map((ch, i) => {
            
            const Icon = ch.icon;
            
            return (
              <a key={i}
                href={ch.url}
                target="_blank"
                className="bg-maxx-violet/5 border border-maxx-violet/15 rounded-sm p-7 no-underline block transition-all hover:border-maxx-pink/50 hover:bg-maxx-pink/5 relative overflow-hidden group"
              >
                <div className="absolute left-0 inset-y-0 w-0.5 bg-grad-accent scale-y-0 origin-bottom transition-transform duration-300 group-hover:scale-y-100" />
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-sm border border-maxx-violet/15 bg-maxx-violet/10 flex items-center justify-center" style={{ color: ch.col }}>
                    <Icon size={18} />
                  </div>
                  <ExternalLink size={13} className="text-maxx-sub" />
                </div>
                <div className="font-mono text-[0.8rem] font-semibold tracking-widest uppercase mb-1.5" style={{ color: ch.col }}>{ch.label}</div>
                <h3 className="font-sans font-bold text-[1.05rem] uppercase tracking-wide text-maxx-white mb-2">{ch.title}</h3>
                <p className="text-[0.9rem] text-maxx-bright leading-[1.75] mb-3.5">{ch.desc}</p>
                <span className="font-mono text-[0.72rem] tracking-widest" style={{ color: ch.col }}>→ {ch.link}</span>
              </a>
            )
          })}
        </div>

        <div className="text-center p-[clamp(40px,5vw,64px)_20px] bg-maxx-violet/5 border border-maxx-violet/15 rounded-sm relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-[radial-gradient(ellipse,rgba(139,92,246,0.1)_0%,rgba(255,45,120,0.06)_50%,transparent_70%)] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="font-sans font-black text-[clamp(2rem,5vw,4.5rem)] uppercase tracking-tight leading-[0.96] mb-3.5">
              YOUR PAIN. <span className="bg-grad-accent bg-clip-text text-transparent">YOUR POWER.</span>
            </h2>
            <p className="text-maxx-bright text-[clamp(0.96rem,1.8vw,1.08rem)] font-medium leading-[1.75] max-w-[480px] mx-auto mb-8">
              Mint is free. The redemption arc is yours. Join thousands of degens who turned their worst crypto memories into something unstoppable.
            </p>
            <Link to="/mint" className="btn-p justify-center text-[1rem] px-10 py-4">
              <Flame size={17} /> CLAIM YOUR FREE MINT <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
