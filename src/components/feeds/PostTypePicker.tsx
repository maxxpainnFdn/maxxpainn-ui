import { ChevronRight, FileText, Zap } from "lucide-react";
import Modal from "../modal/Modal";
import { useState } from "react";
import { tokenConfig } from "@/config/token";
import { useNavigate } from "react-router-dom";

export interface PostTypePickerProps {
  isOpen: boolean;
  onSelect: (t: "normal" | "rewarded") => void;
  onClose: () => void 
}

export default function PostTypePicker({ isOpen, onSelect, onClose }: PostTypePickerProps) {
    
  const navigate = useNavigate()
  
  return (
    <Modal
      title="Select Post Type"
      open={isOpen}
      onOpenChange={onClose} 
      desktopClass="w-[420px]"
    >
      <div className="p-5 flex flex-col gap-3">

        <button
          onClick={() => onSelect("normal")}
          className="w-full text-left rounded-2xl p-4 transition-all cursor-pointer bg-white/[0.02] border border-maxx-violet/[0.14] hover:border-maxx-violet/[0.45] hover:bg-maxx-violet/[0.06]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-maxx-violet/10 border border-maxx-violet/[0.22]">
              <FileText size={16} className="text-maxx-violet" />
            </div>
            <div>
              <p className="font-mono font-bold text-maxx-bright uppercase tracking-wider mb-0.5 text-[0.85rem]">Normal Post</p>
              <p className="text-maxx-sub text-[0.82rem]">Share a thought or update with your timeline or clan.</p>
            </div>
            <ChevronRight size={14} className="text-maxx-dim ml-auto flex-shrink-0" />
          </div>
        </button>

        <button
          onClick={() => navigate("/mint") }
          className="w-full text-left rounded-2xl p-4 transition-all relative overflow-hidden cursor-pointer bg-maxx-pink/[0.04] border border-maxx-pink/20 hover:border-maxx-pink/50 hover:bg-maxx-pink/[0.08]"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-maxx-pink to-maxx-violet" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-maxx-pink/[0.12] border border-maxx-pink/[0.28]">
              <Zap size={16} className="text-maxx-pink" fill="currentColor" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-mono font-bold text-maxx-pink uppercase tracking-wider text-[0.85rem]">Pain Story</p>
                <span className="font-mono font-bold text-maxx-pink rounded px-1.5 py-0.5 text-[0.48rem] tracking-[0.12em] uppercase bg-maxx-pink/[0.12] border border-maxx-pink/[0.28]">
                  Rewarded
                </span>
              </div>
              <p className="text-maxx-sub text-[0.82rem]">
                Share your crypto pain. Earn ${tokenConfig.symbol} via <span className="text-maxx-violet-lt">/mint</span>.
              </p>
            </div>
            <ChevronRight size={14} className="text-maxx-pink/50 ml-auto flex-shrink-0" />
          </div>
        </button>

      </div>
    </Modal>
  );
}
