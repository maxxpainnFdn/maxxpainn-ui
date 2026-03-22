import { cn } from "@/lib/utils";
import { ArrowRight, Award, Bookmark, Castle, Flame, TrendingUp, X, Zap } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

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

const CLANS = [
  { id: "luna-fallen",   name: "Luna Fallen",   emoji: "🌙", members: 4821,  posts: 1204 },
  { id: "ftx-creditors", name: "FTX Creditors", emoji: "💔", members: 11203, posts: 3891 },
  { id: "rug-survivors", name: "Rug Survivors", emoji: "🪦", members: 7654,  posts: 2110 },
  { id: "liq-gang",      name: "Liq Gang",      emoji: "⚡", members: 3390,  posts: 987  },
];


export default function MobileSidebarDrawer({ activeTab, setActiveTab, onClose }: any) {
  const navItems = [
    { id: "foryou",   label: "For You",          Icon: Flame      },
    { id: "clans",    label: "Clans",            Icon: Castle     },
    { id: "trending", label: "Trending",         Icon: TrendingUp },
    { id: "rewarded", label: "Rewarded Stories", Icon: Award      },
    { id: "saved",    label: "Saved",            Icon: Bookmark   },
  ];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-[200] lg:hidden bg-black/[0.72] backdrop-blur-md" onClick={onClose} />
      <div className="_sp-sd fixed top-0 left-0 bottom-0 z-[210] lg:hidden flex flex-col overflow-y-auto w-[280px] bg-maxx-bg1 border-r border-maxx-violet/[0.18]">

        {/* Header */}
        <div className="relative flex items-center justify-between px-5 py-4 flex-shrink-0 border-b border-maxx-violet/10">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet via-maxx-pink to-transparent" />
          <span className="font-black text-maxx-white uppercase tracking-tight font-mono text-base">
            MAXX<span style={{ background: "linear-gradient(135deg,#a855f7,#ff2d78)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>PAINN</span>
          </span>
          <button onClick={onClose} className="text-maxx-sub hover:text-maxx-mid transition-colors p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] cursor-pointer">
            <X size={15} />
          </button>
        </div>

        {/* Nav */}
        <div className="flex flex-col gap-6 px-3 py-5 flex-1">
          <div>
            <div className="eyebrow mb-2 px-1"><span className="eyebrow-dot" />Feed</div>
            <div className="flex flex-col gap-0.5">
              {navItems.map(({ id, label, Icon }) => (
                <SBtn key={id} label={label} Icon={Icon} isActive={activeTab === id} size="sm" onClick={() => { setActiveTab(id); onClose(); }} />
              ))}
            </div>
          </div>
          <div>
            <div className="eyebrow mb-2 px-1"><span className="eyebrow-dot" />My Clans</div>
            <div className="flex flex-col gap-0.5">
              {CLANS.map(c => (
                <a key={c.id} href={`/clans/${c.id}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl no-underline transition-all font-semibold text-[0.92rem] text-maxx-sub hover:text-maxx-mid hover:bg-white/[0.04]"
                  onClick={onClose}>
                  <span className="text-[1rem]">{c.emoji}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="font-mono text-maxx-dim text-[0.72rem]">{(c.members / 1000).toFixed(1)}k</span>
                </a>
              ))}
              <a href="/clans" className="flex items-center gap-2 px-4 py-2.5 rounded-xl no-underline text-maxx-violet hover:text-maxx-violet-lt transition-colors font-semibold text-[0.85rem]" onClick={onClose}>
                <ArrowRight size={13} /> All clans
              </a>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="flex-shrink-0 mx-3 mb-5 p-4 rounded-2xl relative overflow-hidden bg-maxx-pink/[0.05] border border-maxx-pink/20">
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(255,45,120,0.18),transparent 70%)" }} />
          <Zap size={14} className="text-maxx-pink mb-2" fill="currentColor" />
          <p className="font-mono font-bold text-maxx-white uppercase mb-1 text-[0.76rem] tracking-[0.06em]">Earn From Pain</p>
          <p className="text-maxx-sub mb-3 leading-relaxed text-[0.72rem]">Post a rewarded story, mint $PAINN tokens.</p>
          <Link to="/mint" className="no-underline" onClick={onClose}>
            <button className="btn-p w-full justify-center py-2 text-[0.7rem]">
              <Zap size={11} /> Mint Your Story
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
