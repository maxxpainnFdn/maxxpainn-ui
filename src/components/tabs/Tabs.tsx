import { cn } from "@/lib/utils";
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

export default function Tabs({ items = [], sticky = true }: TabsProps ) {
  
  const [activeTab, setActiveTab] = useState<string>((items[0]?.id || ""));
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (!sticky) return;
  
    const sentinel = sentinelRef.current;
    const tabs = tabsRef.current;
  
    if (!sentinel || !tabs) return;
  
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isStuck = !entry.isIntersecting;
        tabs.classList.toggle("is-stuck", isStuck);
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
  
  const stickyClass = (sticky) 
    ? "sticky top-[65px] z-10 [&.is-stuck]:bg-maxx-bg1/80 [&.is-stuck]:backdrop-blur [&.is-stuck]:shadow"
    : ""

  return (
    <>
      {sticky && <div ref={sentinelRef} />}
      <div ref={tabsRef}
        className={`${stickyClass}  flex items-end gap-0 border-b border-maxx-violet/15 overflow-x-auto nav-scroll-container`}
      >
        {items.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2 px-5 py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap",
                isActive
                  ? "text-maxx-white"
                  : "text-maxx-sub hover:text-maxx-mid"
              )}
            >
              <tab.icon className={cn("w-4 h-4", isActive ? "text-maxx-pink" : "")} />
              {tab.label}

              {/* Active underline */}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-maxx-violet via-maxx-pink to-transparent rounded-t-sm" />
              )}
            </button>
          );
        })}
      </div>
      <div className="animate-fade-up mt-6" key={activeTab}>
        {items.map((tab) => {
          const Component = (tab?.component || <div></div>);
          const args = tab?.args || {}
          
          return (
            <>{ tab.id == activeTab && <Component {...args} /> }</>
          )
        })}
      </div>
    </>
  )
}
