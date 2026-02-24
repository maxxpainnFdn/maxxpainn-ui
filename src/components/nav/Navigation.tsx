/**
 * MAXXPAINN — Navigation
 * No hex codes. All maxx-* tokens + CSS variables.
 */

import React, { useState, useEffect } from 'react';
import { ChevronDown, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import HowItWorksModal from '../HowItWorksModal';
import Account from './Account';
import BottomNav from './BottomNav';
import app from '@/config/app';
import EventBus from '@/core/EventBus';
import Button from '../button/Button';
import { tokenConfig } from '@/config/token';
import { MobileNav } from './MobileNav';

export default function Navigation() {
  const [scrolled, setScrolled]           = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleResize = () => setShowBottomNav(window.innerWidth <= 1200);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navItems = [
    { name: 'FAQ',     href: '/faq'     },
    { name: 'Clans',   href: '/clans'   },
    { name: 'Staking', href: '/staking' },
  ];

  const docsLinks = [
    { name: 'Whitepaper', href: '/whitepaper'  },
    { name: 'Manifesto',  href: '/manifesto'   },
    { name: 'Tokenomics', href: '/#tokenomics' },
    { name: 'Roadmap',    href: '/roadmap'     },
  ];

  const linkClass =
    'font-sans font-semibold text-[0.85rem] tracking-wide uppercase ' +
    'text-maxx-bright no-underline transition-colors hover:text-maxx-violet';

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-maxx-violet/20'
            : 'bg-transparent border-transparent'
        }`}
      >
        {/* top accent line — visible when scrolled */}
        {scrolled && (
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet/40 via-maxx-pink/40 to-transparent pointer-events-none" />
        )}

        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center h-[68px]">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0 group">
              <Zap
                className="text-purple-500 w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform duration-300"
                fill="currentColor"
              />
              <span className="hidden sm:inline-block font-sans font-black text-xl sm:text-2xl tracking-tighter text-maxx-white">
                <span className="text-maxx-white">MAXX</span>
                <span className="bg-gradient-to-r from-purple-400 via-pink-600 to-rose-500 bg-clip-text text-transparent">
                  PAINN
                </span>
              </span>
            </Link>

            {/* ── Desktop nav links ── */}
            <div className="hidden lg:flex items-center flex-1 justify-center gap-8 mx-8">

              <a
                href="#"
                onClick={(e) => { e.preventDefault(); EventBus.emit('open_hiw'); }}
                className={linkClass}
              >
                How it works
              </a>

              {navItems.map((item) => (
                <Link key={item.name} to={item.href} className={linkClass}>
                  {item.name}
                </Link>
              ))}

              {/* Docs dropdown */}
              <div className="relative group h-full flex items-center">
                <button className={`${linkClass} flex items-center gap-1.5 cursor-pointer bg-transparent border-none`}>
                  Docs
                  <ChevronDown className="h-[14px] w-[14px] group-hover:rotate-180 transition-transform duration-300" />
                </button>

                <div className="
                  absolute left-0 top-[40px] w-48 p-2
                  bg-background/[.98] backdrop-blur-xl
                  border border-maxx-violet/20
                  opacity-0 invisible translate-y-2
                  group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                  transition-all duration-300
                ">
                  {docsLinks.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.href}
                      className="
                        block px-4 py-2.5 no-underline
                         font-semibold text-[0.82rem] tracking-wider uppercase
                        text-white hover:text-maxx-white hover:bg-maxx-violet/10
                        transition-colors
                      "
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Desktop right actions ── */}
            <div className="hidden md:flex items-center gap-2.5">
              <a href={app.tokenBuyUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="!px-4">
                  <span>BUY</span>
                  <span className="hidden xl:inline-block">${tokenConfig.symbol}</span>
                </Button>
              </a>

              {!showBottomNav && (
                <>
                  <Link to="/mint"  className="no-underline">
                    <Button variant="primary" className="!px-6 shadow-[0_0_15px_rgba(255,45,120,0.2)]">
                      MINT
                    </Button>
                  </Link>
                  <Account />
                </>
              )}
            </div>

            {/* ── Mobile scrolling pills ── */}
            <MobileNav navItems={[...navItems, ...docsLinks]} />

          </div>
        </div>
      </nav>

      {showBottomNav && <BottomNav />}
      <HowItWorksModal />
    </>
  );
}
