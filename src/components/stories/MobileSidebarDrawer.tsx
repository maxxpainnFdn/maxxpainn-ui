import { cn } from "@/lib/utils";
import { ArrowRight, Award, Bookmark, Castle, Flame, TrendingUp, X, Zap } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";


export default function MobileSidebarDrawer({ activeTab, setActiveTab, onClose }: any) {

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

        <LeftSidebar />

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
