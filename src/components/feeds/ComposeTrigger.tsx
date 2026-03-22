import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

function Av({ initials, color, size = 40, round = false }: { initials: string; color: string; size?: number; round?: boolean }) {
  return (
    <div
      className={cn("flex-shrink-0 flex items-center justify-center font-mono font-bold tracking-[0.03em]", round ? "rounded-full" : "rounded-lg")}
      style={{
        width: size, height: size,
        background: `${color}1a`,
        border: `1.5px solid ${color}50`,
        fontSize: size * 0.3,
        color,
      }}
    >
      {initials}
    </div>
  );
}

export default function ComposeTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left group mb-4 relative overflow-hidden rounded-[18px] bg-maxx-bg2/90 border border-maxx-violet/[0.14] cursor-pointer transition-[border-color,background] duration-300 hover:border-maxx-violet/[0.36] hover:bg-maxx-bg1 px-[18px] py-[14px]"
    >
      <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-maxx-violet to-transparent" />
      <div className="flex items-center gap-3">
        <Av initials="YO" color="#8b5cf6" size={36} round />
        <span className="flex-1 font-light text-[0.9375rem] text-maxx-violet/40 font-sans">Share your pain story...</span>
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-mono font-bold rounded-lg px-3 py-1.5 bg-maxx-violet/10 text-maxx-violet-lt text-[0.68rem] tracking-[0.06em] uppercase">
            <Pencil size={11} /> Post
          </div>
        </div>
      </div>
    </button>
  );
}
