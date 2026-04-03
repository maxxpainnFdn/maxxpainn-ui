// ---------------------------------------------------------------------------
// Minimal emoji picker (no external dep)

import { useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
const EMOJI_LIST = [
  "😀","😂","😍","🥺","😭","😡","🔥","❤️","👍","👎",
  "🙌","💀","😤","🥲","😎","🤔","💯","✨","🎉","🫶",
];

export default function EmojiPicker({ onSelect, onClose }: { onSelect: (em: string) => void; onClose: () => void }) {
  
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Use capture so it fires before the toggle button's own handler
    document.addEventListener("mousedown", handler, true);
    return () => document.removeEventListener("mousedown", handler, true);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute bottom-full mb-2 left-0 z-50 bg-maxx-bg2 border border-maxx-violet/20 rounded-2xl p-3 shadow-2xl shadow-black/40 w-[236px] animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      <div className="grid grid-cols-10 gap-1">
        {EMOJI_LIST.map((em) => (
          <button
            key={em}
            onClick={() => onSelect(em)}
            className="text-[1.1rem] p-0.5 rounded hover:bg-maxx-violet/10 transition-colors bg-transparent border-none cursor-pointer leading-none"
          >
            {em}
          </button>
        ))}
      </div>
    </div>
  );
}
