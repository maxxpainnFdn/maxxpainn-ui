// Navigation.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Zap, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import HowItWorksModal from '../HowItWorksModal';
import Account from './Account';
import BottomNav from './BottomNav';
import app from '@/config/app';
import EventBus from '@/core/EventBus';
import Button from '../button/Button';
import { tokenConfig } from '@/config/token';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const scrollRef = useRef(null);
  const docsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleResize = () => {
      setShowBottomNav(window.innerWidth <= 1200);
      updateFades();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close docs dropdown on outside tap
  useEffect(() => {
    if (!docsOpen) return;
    const handleOutside = (e) => {
      if (docsRef.current && !docsRef.current.contains(e.target)) {
        setDocsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [docsOpen]);

  const updateFades = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 5);
    setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  // Initial fade check after mount
  useEffect(() => {
    // Small delay to ensure layout is painted
    const t = setTimeout(updateFades, 50);
    return () => clearTimeout(t);
  }, []);

  const navItems = [
    { name: 'FAQ', href: '/faq' },
    { name: 'Clans', href: '/clans' },
    { name: 'Staking', href: '/staking' },
  ];

  const docsLinks = [
    { name: 'Whitepaper', href: '/whitepaper' },
    { name: 'Manifesto', href: '/manifesto' },
    { name: 'Tokenomics', href: '/#tokenomics' },
    { name: 'Roadmap', href: '/roadmap' },
  ];

  const pillClass =
    'shrink-0 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide ' +
    'text-gray-300 bg-white/[0.06] border border-white/10 rounded-full ' +
    'hover:border-purple-500/40 hover:text-purple-300 active:bg-purple-500/10 ' +
    'transition-all whitespace-nowrap';

  return (
    <>
      <nav
        className={`top-nav fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/95 backdrop-blur-xl border-b-2 border-purple-500/30 shadow-[0_4px_20px_rgba(168,85,247,0.2)]'
            : 'bg-black/70 backdrop-blur-md border-b border-purple-500/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative">
                <Zap
                  className="text-purple-500 w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform duration-300"
                  fill="currentColor"
                />
                <div className="absolute inset-0 bg-purple-500 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              </div>
              <span className="hidden sm:inline-block sm:text-2xl md:text-3xl font-black">
                <span className="white-text">MAXX</span>
                <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  PAINN
                </span>
              </span>
            </Link>

            {/* ═══════════════════════════════════════════
                DESKTOP NAV (md+) — unchanged
            ═══════════════════════════════════════════ */}
            <div className="hidden md:flex items-center flex-1 justify-center gap-8 mx-8">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  EventBus.emit('open_hiw');
                }}
                className="text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 transition-all duration-200 font-semibold text-sm uppercase tracking-wide"
              >
                How it works
              </a>

              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 transition-all duration-200 font-semibold text-sm uppercase tracking-wide"
                >
                  {item.name}
                </Link>
              ))}

              {/* Docs Dropdown (hover) */}
              <div className="relative group">
                <button className="text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 transition-all duration-200 font-semibold text-sm uppercase tracking-wide flex items-center gap-1">
                  Docs
                  <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                </button>
                <div className="absolute left-0 top-full mt-3 w-56 bg-gray-900/95 backdrop-blur-xl border-2 border-purple-500/30 rounded-2xl shadow-[0_8px_32px_rgba(168,85,247,0.3)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden">
                  <div className="p-2">
                    {docsLinks.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.href}
                        className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 rounded-xl transition-all duration-200 font-medium border border-transparent hover:border-purple-500/30"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════
                MOBILE SCROLLABLE NAV (<md)
            ═══════════════════════════════════════════ */}
            <div className="flex md:hidden flex-1 items-center ml-3 relative overflow-hidden">
              {/* Left fade */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/90 to-transparent z-10 pointer-events-none transition-opacity duration-200 ${
                  showLeftFade ? 'opacity-100' : 'opacity-0'
                }`}
              />
              {/* Right fade */}
              <div
                className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/90 to-transparent z-10 pointer-events-none transition-opacity duration-200 ${
                  showRightFade ? 'opacity-100' : 'opacity-0'
                }`}
              />

              <div
                ref={scrollRef}
                onScroll={updateFades}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 pr-3"
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    EventBus.emit('open_hiw');
                  }}
                  className={pillClass}
                >
                  How it works
                </button>

                {navItems.map((item) => (
                  <Link key={item.name} to={item.href} className={pillClass}>
                    {item.name}
                  </Link>
                ))}

                {/* Docs — tap dropdown */}
                <div ref={docsRef} className="relative shrink-0">
                  <button
                    onClick={() => setDocsOpen((v) => !v)}
                    className={`${pillClass} flex items-center gap-1 ${
                      docsOpen ? 'border-purple-500/50 text-purple-300' : ''
                    }`}
                  >
                    Docs
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${
                        docsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {docsOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-[0_8px_32px_rgba(168,85,247,0.3)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="py-1">
                        {docsLinks.map((item, idx) => (
                          <Link
                            key={idx}
                            to={item.href}
                            className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-purple-600/20 transition-all"
                            onClick={() => setDocsOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Right Side */}
            <div className="hidden screen-width-900:flex items-center gap-3 shrink-0">
              <a
                href={app.tokenBuyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="md" className="gap-x-1">
                  <span>BUY</span>
                  <span className="hidden lg:inline-block">
                    ${tokenConfig.symbol}
                  </span>
                </Button>
              </a>

              {!showBottomNav && (
                <>
                  <Link to="/mint">
                    <Button variant="primary" size="md">
                      MINT
                    </Button>
                  </Link>
                  <Account />
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showBottomNav && <BottomNav />}
      <HowItWorksModal />
    </>
  );
}
