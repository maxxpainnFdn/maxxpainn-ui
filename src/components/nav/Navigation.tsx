import React, { useState, useEffect } from 'react';
import { Menu, X, Zap, ChevronDown } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      setShowBottomNav(window.innerWidth <= 1200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
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
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Zap
                  className="text-purple-500 w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform duration-300"
                  fill="currentColor"
                />
                <div className="absolute inset-0 bg-purple-500 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>
              <span className="hidden sm:inline-block sm:text-2xl md:text-3xl font-black">
                <span className="white-text">MAXX</span>
                <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  PAINN
                </span>
              </span>
            </Link>

            {/* Desktop Menu */}
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

              {/* Docs Dropdown */}
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

            {/* Desktop Right Side */}
            <div className="hidden md:flex items-center gap-3">
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
            
            <MobileNav
              navItems={navItems}
              docsLinks={docsLinks}
            />
          </div>
        </div>
      </nav>

      {showBottomNav && <BottomNav />}
      <HowItWorksModal />
    </>
  );
}
