import { useState } from 'react';
import { ExternalLink, ArrowRight, Flame, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SiGithub, SiTelegram, SiX } from '@icons-pack/react-simple-icons';
import socials from "@/config/socials";
import Button from '@/components/button/Button';

const socialChannels = [
  {
    icon: SiX,
    label: "X / TWITTER",
    col: "#ff2d78",
    title: "The Signal Feed",
    link: "Follow on X",
    url: `https://x.com/${socials.x}`,
    desc: "Proof-of-Patience updates, rank milestones, and community pain stories in motion.",
  },
  {
    icon: SiTelegram,
    label: "TELEGRAM",
    col: "#8b5cf6",
    title: "The Conviction Room",
    link: "Join the Conviction Room",
    url: `https://t.me/${socials.telegram}`,
    desc: "Live protocol discussions, clan coordination, and real talk from the trenches.",
  },
  {
    icon: SiGithub,
    label: "GITHUB",
    col: "#60a5fa",
    title: "The Open Vault",
    link: "View the Source",
    url: socials.github,
    desc: "100% open source. Read the contracts, audit the code, verify every claim we make.",
  },
];


//const mediumUrl = `https://medium.com/@${socials.medium ?? 'maxxpainn'}`;

export default function Community() {
  return (
    <section className="bg-maxx-bg4 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        {/* Header */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 items-end mb-10 sm:mb-14">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" />// JOIN THE MOVEMENT</div>
            <h2 className="font-sans font-black text-[clamp(2rem,6.5vw,5rem)] leading-[0.94] uppercase text-maxx-white">
              WE ARE <span className="text-maxx-violet">LEGION</span>
            </h2>
          </div>
          <p className="font-sans font-medium text-[clamp(0.88rem,1.8vw,1.08rem)] text-maxx-bright leading-[1.8] max-w-sm">
            <strong className="text-maxx-pinkLt font-bold">Thousands of degens</strong> who earned their spot through pain, not promises.
          </p>
        </div>

        {/* Social Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-10 sm:mb-16">
          {socialChannels.map((ch, i) => {
            const Icon = ch.icon;
            return (
              <a
                key={i}
                href={ch.url}
                target="_blank"
                rel="noreferrer"
                className="bg-maxx-violet/5 border border-maxx-violet/15 rounded-sm p-5 sm:p-7 no-underline block transition-all hover:border-maxx-pink/50 hover:bg-maxx-pink/5 relative overflow-hidden group"
              >
                <div className="absolute left-0 inset-y-0 w-0.5 bg-grad-accent scale-y-0 origin-bottom transition-transform duration-300 group-hover:scale-y-100" />
                <div className="flex justify-between items-start mb-4">
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-sm border border-maxx-violet/15 bg-maxx-violet/10 flex items-center justify-center"
                    style={{ color: ch.col }}
                  >
                    <Icon size={17} />
                  </div>
                  <ExternalLink size={13} className="text-maxx-sub" />
                </div>
                <div className="font-mono text-[0.7rem] sm:text-[0.8rem] font-semibold tracking-widest uppercase mb-1.5" style={{ color: ch.col }}>
                  {ch.label}
                </div>
                <h3 className="font-sans font-bold text-[0.95rem] sm:text-[1.05rem] uppercase tracking-wide text-maxx-white mb-2">
                  {ch.title}
                </h3>
                <p className="text-[0.82rem] sm:text-[0.9rem] text-maxx-bright leading-[1.75] mb-3.5">
                  {ch.desc}
                </p>
                <span className="font-mono text-[0.68rem] sm:text-[0.72rem] tracking-widest" style={{ color: ch.col }}>
                  {'-> '}{ch.link}
                </span>
              </a>
            );
          })}
        </div>

        {/* Pain to Power CTA */}
        <div className="text-center p-8 sm:p-[clamp(40px,5vw,64px)_20px] bg-maxx-violet/5 border border-maxx-violet/15 rounded-sm relative overflow-hidden mb-10 sm:mb-16">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-[radial-gradient(ellipse,rgba(139,92,246,0.1)_0%,rgba(255,45,120,0.06)_50%,transparent_70%)] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="font-sans font-black text-[clamp(1.8rem,5vw,4.5rem)] uppercase tracking-tight leading-[0.96] mb-3">
              YOUR PAIN.{' '}
              <span className="bg-grad-accent bg-clip-text text-transparent">YOUR POWER.</span>
            </h2>
            <p className="text-maxx-bright text-[clamp(0.88rem,1.8vw,1.08rem)] font-medium leading-[1.75] max-w-[480px] mx-auto mb-6 sm:mb-8">
              Token allocation & claim is free. The redemption arc is yours. Join thousands of degens who turned their worst crypto memories into something unstoppable.
            </p>
            <Link to="/mint" className="inline-block w-full sm:w-auto">
              <Button variant="primary" skewed fullWidth className="sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base">
                <Flame size={16} />
                <span>Get Started</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
