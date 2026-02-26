/**
 * MAXXPAINN — Mobile Nav
 *
 * Keeps rounded-full pills, updates colors to match design system:
 *   - bg: C.bg0 tinted surfaces
 *   - borders: violet/15 → violet/40 on hover
 *   - text: maxx-mid → maxx-white on hover
 *   - arrows: cerise pink accent
 */

import EventBus from "@/core/EventBus";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';

export const MobileNav = ({ navItems }) => {

  const [showLeftArrow, setShowLeftArrow]   = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollRef = useRef(null);

  const pillClass =
    'shrink-0 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest ' +
    'font-mono text-purple-100/90 bg-violet-500/5 border border-violet-500/10 rounded-full ' +
    'hover:border-purple-500/50 hover:text-white hover:bg-purple-500/5 ' +
    'active:bg-violet-500/10 transition-all duration-200 whitespace-nowrap cursor-pointer select-none';

  const scrollNav = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      left: direction === 'right' ? el.scrollLeft + 150 : el.scrollLeft - 150,
      behavior: 'smooth',
    });
  };

  const checkScrollArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 5);
    setShowRightArrow(el.scrollWidth - Math.ceil(el.scrollLeft) - el.clientWidth > 5);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScrollArrows);
    return () => el.removeEventListener('scroll', checkScrollArrows);
  }, []);

  const ArrowBtn = ({ direction, show, onClick }) => (
    <div
      className={`absolute ${direction === 'left' ? 'left-0' : 'right-0'} z-20 transition-all duration-300 ${
        show ? 'opacity-100 translate-x-0' : `opacity-0 ${direction === 'left' ? '-translate-x-2' : 'translate-x-2'} pointer-events-none`
      }`}
    >
      {/* fade scrim */}
      <div className={`absolute inset-y-0 ${direction === 'left' ? 'left-0 bg-gradient-to-r' : 'right-0 bg-gradient-to-l'} from-[#0d080c] via-[#0d080c]/80 to-transparent w-10 -z-10 pointer-events-none`} />

      <button
        onClick={onClick}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-maxx-bg0/10 border border-purple-500/60 hover:border-purple-500/90 shadow-xl text-purple-400  hover:text-purple-300 active:scale-95 transition-all duration-200"
      >
        {direction === 'left'
          ? <ChevronLeft className="w-4 h-4" />
          : <ChevronRight className="w-4 h-4" />
        }
      </button>
    </div>
  );

  return (
    <div className="flex md:hidden flex-1 items-center ml-3 relative min-w-0 h-full">

      <ArrowBtn direction="left"  show={showLeftArrow}  onClick={() => scrollNav('left')}  />

      {/* scroll container */}
      <div
        ref={scrollRef}
        className="nav-scroll-container flex items-center gap-2 overflow-x-auto w-full px-2 py-3 scroll-smooth"
      >
        {/* How it works */}
        <button
          onClick={(e) => { e.preventDefault(); EventBus.emit('open_hiw'); }}
          className={pillClass}
        >
          How it works
        </button>

        {navItems.map((item) => (
          <Link key={item.name} to={item.href} className={pillClass}>
            {item.name}
          </Link>
        ))}

        {/* trailing spacer so last pill clears the arrow */}
        <div className="w-6 shrink-0" />
      </div>

      <ArrowBtn direction="right" show={showRightArrow} onClick={() => scrollNav('right')} />

    </div>
  );
};
