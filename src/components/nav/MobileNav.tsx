import EventBus from "@/core/EventBus";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';

export const MobileNav = ({ navItems, docsLinks }) => {
  
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [docsOpen, setDocsOpen] = useState(false);
  const [docsPos, setDocsPos] = useState({ top: 0, right: 0 });


  const scrollRef = useRef(null);
  const docsRef = useRef(null);
  const dropdownRef = useRef(null);

  
  const pillClass =
    'shrink-0 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide ' +
    'text-gray-300 bg-white/[0.06] border border-white/10 rounded-full ' +
    'hover:border-purple-500/40 hover:text-purple-300 active:bg-purple-500/10 ' +
    'transition-all whitespace-nowrap cursor-pointer select-none';


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

  
  // Toggle docs & calculate position from the button's bounding rect (For Mobile)
  const toggleDocsMobile = () => {
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
  
  const checkScrollArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 5);
    const remaining = el.scrollWidth - Math.ceil(el.scrollLeft) - el.clientWidth;
    setShowRightArrow(remaining > 5);
  };
  
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollArrows);
      return () => el.removeEventListener('scroll', checkScrollArrows);
    }
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the menu is open and the click is NOT inside the dropdownRef
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDocsOpen(false);
      }
    };
  
    // Add listener to the document
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up listener on unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setDocsOpen]);
  
  return (
    <>
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
    
          {/* Docs button (Mobile) */}
          <div ref={docsRef} className="shrink-0">
            <button
              onClick={toggleDocsMobile}
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
      <div>
        {docsOpen && (
          <>
            {/* Backdrop for both desktop and mobile */}
            <div
              className="fixed inset-0 z-[99]"
              onClick={() => setDocsOpen(false)}
            />
            
            {/* Mobile Fixed Dropdown (Hidden on MD+) */}
            <div
              className="md:hidden py-1 fixed w-48 bg-gray-900/95 backdrop-blur-sm border border-purple-500/30 rounded-xl shadow-2xl z-[100] overflow-hidden"
              style={{ top: docsPos.top, right: docsPos.right }}
              ref={dropdownRef}
            >
              {docsLinks.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.href}
                  onClick={() => setDocsOpen(false)}
                  className="block px-4 py-3 mx-1 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 rounded-xl transition-all duration-200 font-medium border border-transparent hover:border-purple-500/30"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
