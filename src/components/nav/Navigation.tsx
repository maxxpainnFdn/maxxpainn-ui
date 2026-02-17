import React, { useState, useEffect, useRef } from 'react';
import { Zap, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [docsPos, setDocsPos] = useState({ top: 0, right: 0 });

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scrollRef = useRef(null);
  const docsRef = useRef(null);

  // Inject gradient scrollbar styles
  useEffect(() => {
    const styleId = 'nav-scrollbar-styles';
    const existing = document.getElementById(styleId);
    if (existing) existing.remove();

    const styleSheet = document.createElement('style');
    styleSheet.id = styleId;
    styleSheet.innerText = `
      .nav-scroll-container::-webkit-scrollbar {
        height: 2px;
      }
      .nav-scroll-container::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 2px;
      }
      .nav-scroll-container::-webkit-scrollbar-thumb {
        background: linear-gradient(90deg, #a855f7, #E9499D) !important;
        border-radius: 2px !important;
      }
      .nav-scroll-container {
        scrollbar-width: thin;
        scrollbar-color: #a855f7 rgba(255, 255, 255, 0.05) !important;
      }
    `;
    document.head.appendChild(styleSheet);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleResize = () => {
      setShowBottomNav(window.innerWidth <= 1200);
      setDocsOpen(false); // close dropdown on resize
      checkScrollArrows();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    handleResize();
    setTimeout(checkScrollArrows, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const checkScrollArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 5);
    const remaining = el.scrollWidth - Math.ceil(el.scrollLeft) - el.clientWidth;
    setShowRightArrow(remaining > 5);
  };

  const scrollNav = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 150;
    const target =
      direction === 'right'
        ? el.scrollLeft + scrollAmount
        : el.scrollLeft - scrollAmount;
    el.scrollTo({ left: target, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollArrows);
      return () => el.removeEventListener('scroll', checkScrollArrows);
    }
  }, []);

  // Toggle docs & calculate position from the button's bounding rect
  const toggleDocs = () => {
    setDocsOpen((prev) => {
      const next = !prev;
      if (next && docsRef.current) {
        const rect = docsRef.current.getBoundingClientRect();
        setDocsPos({
          top: rect.bottom + 8,
          right: Math.max(8, window.innerWidth - rect.right),
        });
      }
      return next;
    });
  };

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
    'transition-all whitespace-nowrap cursor-pointer select-none';

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/95 backdrop-blur-xl border-b-2 border-purple-500/30 shadow-[0_4px_20px_rgba(168,85,247,0.2)]'
            : 'bg-black/70 backdrop-blur-md border-b border-purple-500/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0 z-20">
              <div className="relative">
                <Zap
                  className="text-purple-500 w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform duration-300"
                  fill="currentColor"
                />
              </div>
              <span className="hidden sm:inline-block sm:text-2xl md:text-3xl font-black">
                <span className="text-white">MAXX</span>
                <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  PAINN
                </span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center flex-1 justify-center gap-8 mx-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-300 font-semibold text-sm uppercase hover:text-purple-400 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* ═══════════════════════════════════════════
                MOBILE SCROLLABLE NAV
            ═══════════════════════════════════════════ */}
            <div className="flex md:hidden flex-1 items-center ml-3 relative min-w-0 h-full">
              {/* Left Arrow */}
              <div
                className={`absolute left-0 z-20 transition-all duration-300 ${
                  showLeftArrow
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-2 pointer-events-none'
                }`}
              >
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black via-black/80 to-transparent -z-10 pointer-events-none" />
                <button
                  onClick={() => scrollNav('left')}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/90 border border-purple-500/40 text-purple-400 shadow-lg active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>

              {/* Scroll Container */}
              <div
                ref={scrollRef}
                className="nav-scroll-container flex items-center gap-2 overflow-x-auto w-full px-2 py-3 scroll-smooth"
                style={{ scrollBehavior: 'smooth' }}
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

                {/* Docs button only — dropdown renders outside */}
                <div ref={docsRef} className="shrink-0">
                  <button
                    onClick={toggleDocs}
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
                </div>

                <div className="w-6 shrink-0" />
              </div>

              {/* Right Arrow */}
              <div
                className={`absolute right-0 z-20 transition-all duration-300 ${
                  showRightArrow
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-2 pointer-events-none'
                }`}
              >
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black via-black/80 to-transparent -z-10 pointer-events-none" />
                <button
                  onClick={() => scrollNav('right')}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/90 border border-purple-500/40 text-purple-400 shadow-lg active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              {/* Desktop Buttons... */}
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
          DOCS DROPDOWN — rendered FIXED, outside
          the overflow container so it can't be clipped
      ═══════════════════════════════════════════ */}
      {docsOpen && (
        <>
          {/* Invisible backdrop to close on tap-away */}
          <div
            className="fixed inset-0 z-[99]"
            onClick={() => setDocsOpen(false)}
          />
          <div
            className="fixed w-48 bg-gray-900/95 backdrop-blur-sm border border-purple-500/30 rounded-xl shadow-2xl z-[100] overflow-hidden"
            style={{ top: docsPos.top, right: docsPos.right }}
          >
            {docsLinks.map((item, idx) => (
              <Link
                key={idx}
                to={item.href}
                className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-purple-900/30 transition-colors"
                onClick={() => setDocsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </>
      )}

      {showBottomNav && <BottomNav />}
      <HowItWorksModal />
    </>
  );
}
