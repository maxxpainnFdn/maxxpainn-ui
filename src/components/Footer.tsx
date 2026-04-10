/**
 * MAXXPAINN — Footer
 *
 * Design system: maxx-* tokens, eyebrow / pill classes.
 * No inline styles. No raw hex codes. No Tailwind color names.
 * Minimum text size: text-sm.
 */

import React from 'react';
import {  MessageCircle, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SiTelegram, SiX, SiReddit, SiMedium, SiYoutube } from '@icons-pack/react-simple-icons';
import socials from "@/config/socials"

const FOOTER_COLS = [
  {
    title: "Platform",
    links: [
      { label: "How It Works", to: "/how-it-works" },
      { label: "Mint",         to: "/mint"         },
      { label: "Clans",        to: "/clans"        },
     // { label: "Leaderboard",  to: "/leaderboard"  },
      { label: "Staking",      to: "/staking"      },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Manifesto",   to: "/manifesto"   },
      { label: "Whitepaper",  to: "/whitepaper"  },
      { label: "Tokenomics",  to: "/tokenomics"  },
      { label: "Roadmap",     to: "/roadmap"     },
      { label: "FAQ",         to: "/faq"         },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy",    to: "/privacy" },
      { label: "Terms of Service",  to: "/terms"   },
    ],
  },
];

const SOCIALS = [
  { Icon: SiX,        href: `https://x.com/${socials.x}`, label: "X (Prev. Twitter)"  },
  { Icon: SiTelegram, href: `https://t.me/${socials.telegram}`, label: "Telegram" },
  { Icon: SiReddit, href: socials.reddit, label: "Reddit" },
  { Icon: SiMedium, href: socials.medium, label: "Medium" },
  { Icon: SiYoutube, href: socials.youtube, label: "Youtube"  },
  { Icon: MessageCircle, href: `https://mailto:${socials.email}`, label: "Email"  },
];

export default function Footer() {
  return (
    <footer className="bg-maxx-bg0 border-t border-maxx-violet/12 relative z-10 pb-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* brand column */}
          <div className="md:col-span-1 flex flex-col gap-5">

            {/* logo */}
            <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0 group w-fit">
              <Zap
                className="text-maxx-violet w-6 h-6 group-hover:scale-110 transition-transform duration-300"
                fill="currentColor"
              />
              <span className="font-sans font-black text-xl tracking-tighter text-maxx-white">
                MAXX<span className="bg-grad-accent bg-clip-text text-transparent">PAINN</span>
              </span>
            </Link>

            {/* tagline */}
            <p className="text-sm text-maxx-sub leading-relaxed max-w-[200px]">
              Transforming crypto pain into unstoppable power. Built by degens, for degens.
            </p>

            {/* socials */}
            <div className="flex gap-2">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-md border border-maxx-violet/15 flex items-center justify-center text-maxx-dim no-underline transition-all duration-200 hover:border-maxx-violet/40 hover:bg-maxx-violet/8 hover:text-maxx-sub"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* link columns */}
          {FOOTER_COLS.map(({ title, links }) => (
            <div key={title}>
              <div className="eyebrow mb-5">
                <span className="eyebrow-dot" />
                {title}
              </div>
              <ul className="space-y-3 list-none">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-maxx-mid no-underline transition-colors duration-200 hover:text-maxx-bright"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── DIVIDER ── */}
        <div className="h-px bg-maxx-violet/10 mb-6" />

        {/* ── BOTTOM ROW ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <span className="font-mono text-sm text-purple-400 tracking-wider">
            © 2025 MAXXPAINN · Built by degens for degens.
          </span>
          <div className="flex items-center gap-2 px-3 py-1.5 border border-maxx-violet/15 rounded-md">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="font-mono text-sm text-maxx-sub tracking-widest">Live on Solana</span>
          </div>
        </div>

        {/* ── DISCLAIMER ── */}
        <div className="border-l-2 border-maxx-violet/25 bg-maxx-violet/4 rounded-r-md px-4 py-3">
          <p className="text-sm text-maxx-mid leading-relaxed">
            <span className="font-bold text-maxx-sub">Disclaimer:</span>{" "}
            MAXXPAINN is an experimental project. Not financial advice. Cryptocurrency investments
            carry extreme risk. Only allocate what you can afford to lose. This is therapy for
            degens, not a retirement plan.
          </p>
        </div>

      </div>
    </footer>
  );
}
