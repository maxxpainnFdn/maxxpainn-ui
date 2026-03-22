import { Send, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "../modal/Modal";
import { cn } from "@/lib/utils";

export interface ComposeModalProps {
  isOpen: boolean;
  type: "normal" | "rewarded";
  onPost: (p: any) => void;
  onClose: () => void 
}

export default function ComposeModal({ isOpen, type, onPost, onClose }: ComposeModalProps) {
  
  const [text, setText] = useState("");
  const [loss, setLoss] = useState("");
  const [target, setTarget] = useState<"timeline" | "clan">("timeline");
  const taRef = useRef<HTMLTextAreaElement>(null);
  const isR = type === "rewarded";

  useEffect(() => { taRef.current?.focus(); }, []);

  function autoH() {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  function submit() {
  }

  
  return (
    <Modal
      title="New Post"
      open={isOpen}
      onOpenChange={onClose} 
      desktopClass="w-[540px]"
    >
      <div className="p-5">
        {/* Post-to */}
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <span className="font-mono text-maxx-violetLt uppercase tracking-widest text-[0.65rem]">Post to</span>
          {(["timeline", "clan"] as const).map(t => (
            <button key={t} onClick={() => setTarget(t)}
              className={cn(
                "px-3 py-1.5 rounded-full font-mono font-bold transition-all cursor-pointer text-[0.6rem] tracking-[0.07em] uppercase border",
                target === t
                  ? "bg-maxx-violet/[0.12] border-maxx-violet/40 text-maxx-violet-lt"
                  : "bg-white/[0.03] border-white/[0.06] text-maxx-sub"
              )}>
              {t === "timeline" ? "🌐 Timeline" : "🛡 Clan"}
            </button>
          ))}
       
        </div>

        {/* Textarea */}
        <textarea
          ref={taRef}
          placeholder={"What's on your mind?"}
          value={text}
          onChange={e => { setText(e.target.value); autoH(); }}
          rows={5}
          className="w-full bg-transparent border-none text-maxx-bright outline-none resize-none leading-relaxed font-light mb-4 font-sans text-[0.9375rem] min-h-[110px]"
        />

        {/* Controls */}
        <div className="flex flex-wrap gap-2 items-center pt-3 border-t border-maxx-violet/[0.08]">
          <div className="flex-1" />
          <span className={cn("text-[0.75rem]", text.length > 400 ? "text-red-400" : "text-maxx-dim")}>
            {text.length}/500
          </span>
          <button className="btn-p" onClick={submit} disabled={!text.trim() || text.length > 500}>
            <Send size={12} /> Post
          </button>
        </div>
      </div>
    </Modal>
  );
}
