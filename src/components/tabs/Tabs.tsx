import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export interface TabItemProps {
  id: string;
  label: string;
  icon: any;
  component: any;
  args: Record<string, any>
}

export interface TabsProps {
  items: TabItemProps[],
  sticky?: boolean
}

export default function Tabs({ items = [], sticky = true }: TabsProps) {

  const [activeTab, setActiveTab] = useState<string>((items[0]?.id || ""));
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    if (!sticky) return;

    const sentinel = sentinelRef.current;
    const wrapperEl = wrapperRef.current;

    if (!sentinel || !wrapperEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isStuck = !entry.isIntersecting;
        wrapperEl.classList.toggle("is-stuck", isStuck);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "-65px 0px 0px 0px",
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [sticky]);

  const stickyClass = sticky
    ? "sticky top-[65px] z-10 [&.is-stuck]:bg-maxx-bg1/80 [&.is-stuck]:backdrop-blur [&.is-stuck]:shadow"
    : "";

  const checkScrollArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 5);
    setShowRightArrow(el.scrollWidth - Math.ceil(el.scrollLeft) - el.clientWidth > 5);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Initial check
    checkScrollArrows();

    el.addEventListener("scroll", checkScrollArrows);
    window.addEventListener("resize", checkScrollArrows);

    return () => {
      el.removeEventListener("scroll", checkScrollArrows);
      window.removeEventListener("resize", checkScrollArrows);
    };
  }, [items]);

  const scrollNav = (direction: string) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      left: direction === "right" ? el.scrollLeft + 150 : el.scrollLeft - 150,
      behavior: "smooth",
    });
  };

  const ArrowBtn = ({ direction, show, onClick }) => (
    <div
      className={`absolute ${direction === "left" ? "left-0" : "right-0"} top-0 bottom-0 z-20 flex items-center transition-all duration-300 ${
        show
          ? "opacity-100 translate-x-0"
          : `opacity-0 ${direction === "left" ? "-translate-x-2" : "translate-x-2"} pointer-events-none`
      }`}
    >
      {/* fade scrim */}
      <div
        className={`absolute inset-y-0 ${direction === "left" ? "left-0 bg-gradient-to-r" : "right-0 bg-gradient-to-l"} from-[#0d080c] via-[#0d080c]/80 to-transparent w-10 -z-10 pointer-events-none`}
      />
      <button
        onClick={onClick}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-maxx-bg0/10 border border-purple-500/60 hover:border-purple-500/90 shadow-xl text-purple-400 hover:text-purple-300 active:scale-95 transition-all duration-200"
      >
        {direction === "left" ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
    </div>
  );

  return (
    <>
      {sticky && <div ref={sentinelRef} />}
  
      {/* Sticky wrapper — only the nav bar, NOT the content */}
      <div ref={wrapperRef} className={stickyClass}>
        <div className="relative">
          <ArrowBtn direction="left"  show={showLeftArrow}  onClick={() => scrollNav('left')}  />
          <ArrowBtn direction="right" show={showRightArrow} onClick={() => scrollNav('right')} />
  
          <div
            ref={scrollRef}
            className="overflow-x-auto nav-scroll-container  border-b border-maxx-violet/15"
          >
            <div ref={tabsRef} className="flex items-end gap-0 w-max">
              {items.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "relative flex items-center gap-2 px-5 py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap",
                      isActive ? "text-maxx-white" : "text-maxx-sub hover:text-maxx-mid"
                    )}
                  >
                    <tab.icon className={cn("w-4 h-4", isActive ? "text-maxx-pink" : "")} />
                    {tab.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-maxx-violet via-maxx-pink to-transparent rounded-t-sm" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
  
      {/* ✅ Content is OUTSIDE the sticky wrapper */}
      <div className="animate-fade-up mt-6" key={activeTab}>
        {items.map((tab) => {
          const Component = tab?.component || (() => <div />);
          const args = tab?.args || {};
          return (
            <div key={tab.id}>
              {tab.id === activeTab && <Component {...args} />}
            </div>
          );
        })}
      </div>
    </>
  );
}
