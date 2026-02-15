import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Info,
  Wallet,
  Clock,
  Gift,
  Castle,
  ShieldAlert,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import EventBus from "@/core/EventBus";
import app from "@/config/app";

const HowItWorksModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let autoOpen = localStorage.getItem("dont_autopen_hiw") || "0";

    if (autoOpen === "0") {
      setOpen(true);
    }

    const openHandler = () => setOpen(true);
    EventBus.on("open_hiw", openHandler);

    return () => {
      EventBus.off("open_hiw", openHandler);
    };
  }, []);

  const onDontAutoOpenChecked = (checked) => {
    if (checked) {
      localStorage.setItem("dont_autopen_hiw", "1");
    } else {
      localStorage.setItem("dont_autopen_hiw", "0");
    }
  };

  const steps = [
    {
      icon: Wallet,
      title: "Connect Wallet",
      description: "Connect your Solana wallet to begin your pain journey.",
      color: "purple",
    },
    {
      icon: Castle,
      title: "Select Clan",
      description: "Show your loyalty. Select the clan you want to mint with.",
      color: "blue",
    },
    {
      icon: Clock,
      title: "Lock Duration",
      description: "Choose how long you're willing to endure the pain.",
      color: "pink",
    },
    {
      icon: Gift,
      title: "Wait & Withdraw",
      description: `Patience pays off - claim your ${app.name} tokens.`,
      color: "green",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      purple:
        "from-purple-500 to-purple-600 bg-purple-500/10 border-purple-500/20 text-purple-400",
      blue: "from-blue-500 to-blue-600 bg-blue-500/10 border-blue-500/20 text-blue-400",
      pink: "from-pink-500 to-pink-600 bg-pink-500/10 border-pink-500/20 text-pink-400",
      green:
        "from-green-500 to-green-600 bg-green-500/10 border-green-500/20 text-green-400",
    };
    return colors[color] || colors.purple;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 gap-0 border-none bg-transparent shadow-none max-w-[95vw] md:max-w-4xl h-[85vh] flex flex-col">
        <div className="relative flex flex-col w-full h-full overflow-hidden bg-gray-950 border border-purple-500/30 rounded-3xl shadow-2xl">
          
          {/* --- STATIC BACKGROUND (Optimization: No blur on scroll) --- */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Dark gradient base */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />
            
            {/* Subtle Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

            {/* Static Orbs (Replaced animation with static layout for performance) */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-900/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-900/20 rounded-full blur-3xl" />
          </div>

          {/* --- HEADER --- */}
          <DialogHeader className="relative z-10 px-6 py-5 border-b border-white/5 bg-gray-900/50 backdrop-blur-sm shrink-0">
            <DialogTitle className="text-xl md:text-3xl font-black tracking-tighter text-center uppercase">
              <span className="text-white">How It </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                Works
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* --- SCROLLABLE CONTENT --- */}
          <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent">
            
            {/* Intro Card */}
            <div className="relative bg-gray-900/80 border border-purple-500/20 rounded-2xl p-5 md:p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="hidden sm:flex p-3 h-fit rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2">
                    Welcome to { app.name }
                  </h3>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-4">
                    Inspired by <span className="text-purple-400 font-bold">XEN Network</span> but built for{" "}
                    <span className="text-green-400 font-bold">Solana</span>. <span className="font-bold">{ app.name }</span> is a free-to-mint
                    token protocol that rewards those brave enough to endure the pain of time-locked staking.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-950/40 border border-green-500/20">
                    <Gift className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-bold text-xs md:text-sm">
                      100% Free Mint (Pay only tx fee)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {steps.map((step, index) => {
                const colorClasses = getColorClasses(step.color);
                return (
                  <div
                    key={index}
                    className="relative bg-gray-900/80 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2.5 rounded-lg border ${colorClasses}`}>
                        <step.icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-gray-600 bg-gray-950 px-2 py-1 rounded border border-white/5">
                        0{index + 1}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white uppercase mb-1">
                      {step.title}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Warning / Info */}
            <div className="bg-gray-900/80 border border-red-500/20 rounded-2xl p-5 md:p-6">
              <div className="flex gap-4">
                <div className="shrink-0 pt-1">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-white uppercase mb-1">
                    Supply-Based Difficulty
                  </h3>
                  <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                    Our protocol includes a dynamic, on-chain difficulty adjustment
                    system. As the total supply increases, the cost of computation and
                    on-chain storage rises significantly. This makes minting
                    progressively less attractive due to higher gas and storage costs.
                    Over time, it becomes more cost-effective to{" "}
                    <span className="text-green-400 font-bold">
                      purchase tokens from the market
                    </span>{" "}
                    rather than minting new ones—creating natural price support and
                    incentivizing early participation.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center py-4">
              <Button
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-6 rounded-xl bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-500 hover:to-red-500 text-white font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-purple-900/20"
              >
                <Sparkles className="w-4 h-4" />
                Start Minting Now
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* --- FOOTER --- */}
          <DialogFooter className="relative z-10 p-4 border-t border-white/5 bg-gray-900/95 shrink-0">
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between w-full gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="donot_autopen"
                  onCheckedChange={onDontAutoOpenChecked}
                  className="border-white/20 data-[state=checked]:bg-purple-600"
                />
                <label
                  htmlFor="donot_autopen"
                  className="text-xs md:text-sm text-gray-400 hover:text-white cursor-pointer select-none"
                >
                  Don't show this again
                </label>
              </div>

              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-white/5"
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
