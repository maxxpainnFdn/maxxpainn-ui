import { cn } from "@/lib/utils";
import { Flame, Castle, TrendingUp, Award, Bookmark, ArrowRight } from "lucide-react";

const CLANS = [
  { id: "luna-fallen",   name: "Luna Fallen",   emoji: "🌙", members: 4821,  posts: 1204 },
  { id: "ftx-creditors", name: "FTX Creditors", emoji: "💔", members: 11203, posts: 3891 },
  { id: "rug-survivors", name: "Rug Survivors", emoji: "🪦", members: 7654,  posts: 2110 },
  { id: "liq-gang",      name: "Liq Gang",      emoji: "⚡", members: 3390,  posts: 987  },
];

function SBtn({ label, Icon, isActive, onClick, size = "md" }: { label: string; Icon: any; isActive: boolean; onClick: () => void; size?: "sm" | "md" }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center w-full rounded-xl transition-all text-left bg-transparent border-none cursor-pointer font-sans font-semibold",
        isActive ? "bg-maxx-violet/[0.12] text-maxx-white" : "text-maxx-sub hover:text-maxx-mid hover:bg-white/[0.03]",
        size === "md" ? "gap-2.5 px-3 py-2.5 text-[0.9rem]" : "gap-3 px-4 py-3 text-[0.95rem]"
      )}>
      <Icon size={size === "md" ? 15 : 16} className={cn("shrink-0", isActive ? "text-maxx-violet" : "text-maxx-dim")} />
      {label}
    </button>
  );
}

export default function LeftSidebar({ activeTab, setActiveTab }: any) {
  
  const navItems = [
    { id: "foryou",   label: "For You",          Icon: Flame      },
    { id: "clans",    label: "Clans",            Icon: Castle     },
    { id: "trending", label: "Trending",         Icon: TrendingUp },
    { id: "rewarded", label: "Rewarded Stories", Icon: Award      },
    { id: "saved",    label: "Saved",            Icon: Bookmark   },
  ];

  return (
    <div className="hidden lg:block flex-shrink-0 w-[210px] sticky top-[116px]">
      <div className="mb-5">
        <div className="eyebrow mb-2"><span className="eyebrow-dot" />Feed</div>
        <div className="flex flex-col gap-0.5">
          {navItems.map(({ id, label, Icon }) => (
            <SBtn key={id} label={label} Icon={Icon} isActive={activeTab === id} onClick={() => setActiveTab(id)} />
          ))}
        </div>
      </div>
      <div>
        <div className="eyebrow mb-2"><span className="eyebrow-dot" />My Clans</div>
        <div className="flex flex-col gap-0.5">
          {CLANS.slice(0, 3).map(c => (
            <a key={c.id} href={`/clans/${c.id}`}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl no-underline transition-all font-semibold text-[0.9rem] text-maxx-sub hover:text-maxx-mid hover:bg-white/[0.03]">
              <span className="text-[0.88rem]">{c.emoji}</span>
              <span className="flex-1 truncate">{c.name}</span>
              <span className="font-mono text-maxx-dim text-[0.72rem]">{(c.members / 1000).toFixed(1)}k</span>
            </a>
          ))}
          <a href="/clans" className="flex items-center gap-2 px-3 py-2 rounded-xl no-underline text-maxx-violet hover:text-maxx-violet-lt transition-colors font-semibold text-[0.85rem]">
            <ArrowRight size={12} /> All clans
          </a>
        </div>
      </div>
    </div>
  );
}
