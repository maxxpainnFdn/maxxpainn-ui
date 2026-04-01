import { cn } from "@/lib/utils";
import { Clock, Flame, Menu, Search } from "lucide-react";
import { useState } from "react";

const MAIN_TABS = [
  { id: "foryou",   label: "For You"  },
  { id: "clans",    label: "Clans"    },
  { id: "trending", label: "Trending" },
];

export default function SubHeader({
  onMenuClick
}) {
  
  const [activeTab, setActiveTab]   = useState("foryou");
  const [sort, setSort] = useState<"recent" | "top">("recent");
  const [showSearch, setShowSearch] = useState(false);
  
  return (
    <div className="sticky top-[0px] z-40 bg-maxx-bg0/[0.94] backdrop-blur-xl border-b border-maxx-violet/10">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-12 gap-1">

        {/* Hamburger */}
        <button
          onClick={() => onMenuClick()}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg mr-2 flex-shrink-0 bg-white/[0.03] border border-maxx-violet/[0.18] text-maxx-sub hover:border-maxx-violet/[0.45] hover:text-maxx-mid transition-all cursor-pointer"
        >
          <Menu size={15} />
        </button>

        <span className="font-black text-maxx-white uppercase tracking-tight mr-4 hidden sm:block font-mono text-base tracking-[0.02em]">
          Stories
        </span>

        {MAIN_TABS.map(t => {
          const on = activeTab === t.id;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={cn(
                "relative h-full px-4 font-mono font-bold uppercase tracking-[0.08em] text-[0.8rem] transition-colors bg-transparent border-none cursor-pointer",
                on ? "text-maxx-white" : "text-maxx-sub hover:text-maxx-mid"
              )}>
              {t.label}
              {on && <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-t-sm bg-gradient-to-r from-maxx-violet to-maxx-pink" />}
            </button>
          );
        })}

        <div className="flex-1" />

        {/* Search */}
        <button
          onClick={() => setShowSearch(true)}
          className="flex items-center gap-2 rounded-xl px-3 py-1.5 font-mono text-[0.67rem] tracking-[0.07em] mr-2 bg-white/[0.03] border border-maxx-violet/[0.15] text-maxx-sub hover:border-maxx-violet/40 hover:text-maxx-mid transition-all cursor-pointer"
        >
          <Search size={13} />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded font-mono font-bold text-maxx-dim text-[0.6rem] bg-maxx-violet/10">/</kbd>
        </button>

        {/* Sort */}
        <div className="flex gap-1.5">
          {([["recent", "Recent", Clock], ["top", "Top", Flame]] as const).map(([id, label, Icon]) => (
            <button key={id} onClick={() => setSort(id)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-[5px] rounded-lg font-mono font-bold text-[0.72rem] tracking-[0.08em] uppercase transition-all bg-transparent border-none cursor-pointer",
                sort === id ? "bg-maxx-violet/[0.12] text-maxx-white" : "text-maxx-sub hover:text-maxx-mid"
              )}>
              <Icon size={10} />{label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
