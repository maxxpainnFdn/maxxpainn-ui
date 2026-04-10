/**
 * MAXXPAINN — How It Works Modal
 *
 * Design system: maxx-* tokens, btn-p / btn-s classes, eyebrow, pill
 * No raw Tailwind colors, no hex codes in JSX.
 */

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Wallet,
  Clock,
  Gift,
  Castle,
  ShieldAlert,
  Zap,
  ChevronRight,
  Info,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import EventBus from "@/core/EventBus";
import app from "@/config/app";
import Button from "./button/Button";

const steps = [
  {
    icon: Wallet,
    title: "Connect Wallet",
    description: "Connect your Solana wallet to access the platform and start your journey.",
    tw: {
      icon: "text-maxx-violet",
      badge: "bg-maxx-violet/10 border-maxx-violet/25",
      num: "text-maxx-violet/40",
    },
  },
  {
    icon: Castle,
    title: "Choose Your Clan",
    description: "Pick a clan to represent your story and join its community.",
    tw: {
      icon: "text-blue-400",
      badge: "bg-blue-500/10 border-blue-500/20",
      num: "text-blue-400/40",
    },
  },
  {
    icon: Clock,
    title: "Set Lock Duration",
    description: "Decide how long your tokens will stay locked before you can claim them.",
    tw: {
      icon: "text-maxx-pink",
      badge: "bg-maxx-pink/10 border-maxx-pink/20",
      num: "text-maxx-pink/40",
    },
  },
  {
    icon: Gift,
    title: "Earn & Claim",
    description: `After the lock period ends, claim your ${app.name} tokens instantly.`,
    tw: {
      icon: "text-green-400",
      badge: "bg-green-500/10 border-green-500/20",
      num: "text-green-400/40",
    },
  },
];

const HowItWorksModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const autoOpen = localStorage.getItem("dont_autopen_hiw") || "0";
    if (autoOpen === "0") setOpen(true);

    const openHandler = () => setOpen(true);
    EventBus.on("open_hiw", openHandler);
    return () => EventBus.off("open_hiw", openHandler);
  }, []);

  const onDontAutoOpenChecked = (checked) => {
    localStorage.setItem("dont_autopen_hiw", checked ? "1" : "0");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 gap-0 border-none bg-transparent shadow-none max-w-[95vw] md:max-w-3xl h-[85vh] flex flex-col">
        <div className="relative flex flex-col w-full h-full overflow-hidden bg-maxx-bg1 border border-maxx-violet/25 rounded-lg shadow-2xl shadow-maxx-violet/10">

          {/* ── ambient glows ── */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-maxx-violet/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-maxx-pink/8 rounded-full blur-3xl" />
          </div>

          {/* top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet/60 via-maxx-pink/60 to-transparent" />

          {/* ── HEADER ── */}
          <DialogHeader className="relative z-1 px-6 py-5 border-b border-maxx-violet/15 shrink-0">
            
            <DialogTitle className="text-2xl md:text-4xl font-black tracking-tighter text-center uppercase leading-none">
              <span className="text-maxx-white">HOW IT </span>
              <span className="bg-grad-accent bg-clip-text text-transparent">
                WORKS
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* ── SCROLLABLE CONTENT ── */}
          <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 space-y-4">

            {/* Intro card */}
            <div className="bg-maxx-bg0/60 border border-maxx-violet/20 rounded-lg p-5">
              <div className="flex gap-4">
                <div className="hidden sm:flex p-2.5 h-fit rounded-lg bg-maxx-violet/10 border border-maxx-violet/20 text-maxx-violet shrink-0">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-maxx-white uppercase tracking-tight text-sm mb-2">
                    Welcome to {app.name}
                  </h3>
                  <div className="text-md text-maxx-mid mb-4">
                    <p>
                      <span className="font-bold text-maxx-bright">{app.name}</span> is a native{" "}
                      <span className="text-green-400 font-bold">Solana</span> protocol built for users who’ve been through the trenches.
                      It turns real crypto experiences and losses into token allocation opportunities.
                    </p>
                  
                    <p className="mt-2">
                      Share your story, lock your position, and earn allocation based on participation — not capital size.
                    </p>
                  
                    <p className="mt-2">
                      Powered by Proof-of-Patience (PoP), the protocol rewards conviction over capital: the longer you commit and endure time-locked staking, the higher your reward weight.
                    </p>
                  </div>
                  <div className="pill inline-flex gap-2">
                    <Gift className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">100% Free Allocation — pay only tx fee</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative bg-maxx-bg0/60 border border-maxx-violet/15 rounded-lg p-5 hover:border-maxx-violet/30 transition-colors duration-200 group"
                >
                  {/* top accent */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-lg border ${step.tw.badge}`}>
                      <step.icon className={`w-4 h-4 ${step.tw.icon}`} />
                    </div>
                    <span className={`font-mono font-black text-2xl leading-none ${step.tw.num}`}>
                      0{index + 1}
                    </span>
                  </div>

                  <h4 className="font-black text-maxx-white uppercase tracking-tight text-sm mb-1.5">
                    {step.title}
                  </h4>
                  <p className="text-md text-maxx-mid leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Warning */}
            <div className="bg-maxx-bg0/60 border border-red-500/20 rounded-lg p-5">
              <div className="flex gap-4">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-black text-maxx-white uppercase tracking-tight text-sm mb-1.5">
                    Supply-Based Difficulty
                  </h3>
              
                  <p className="text-sm text-maxx-mid leading-relaxed">
                    The protocol adjusts minting cost based on total supply. As supply increases,
                    minting becomes progressively more expensive on-chain.
                  </p>
              
                  <p className="text-sm text-maxx-mid leading-relaxed mt-2">
                    Eventually, it becomes cheaper to{" "}
                    <span className="text-green-400 font-bold">buy tokens on the market</span>{" "}
                    than to mint them — creating natural price support and rewarding early participants.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2 pb-1  flex justify-center">
              <Button
                variant="primary"
                skewed
                onClick={() => setOpen(false)}
                className="h-12 shadow-[0_0_20px_rgba(255,45,120,0.2)]"
              >
                <Zap size={16} fill="currentColor" />
                Claim your allocation now
                <ChevronRight size={16} />
              </Button>
            </div>

          </div>

          {/* ── FOOTER ── */}
          <DialogFooter className="relative z-10 px-5 py-3.5 border-t border-maxx-violet/15 shrink-0">
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between w-full gap-3">

              <div className="flex items-center gap-2.5">
                <Checkbox
                  id="donot_autopen"
                  onCheckedChange={onDontAutoOpenChecked}
                  className="border-maxx-violet/30 data-[state=checked]:bg-maxx-violet data-[state=checked]:border-maxx-violet"
                />
                <label
                  htmlFor="donot_autopen"
                  className="text-xs text-maxx-sub hover:text-maxx-bright cursor-pointer select-none transition-colors"
                >
                  Don't show this again
                </label>
              </div>

              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                className="text-maxx-sub hover:text-maxx-white hover:bg-maxx-violet/10 text-xs"
              >
                Close
              </Button>

            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HowItWorksModal;
