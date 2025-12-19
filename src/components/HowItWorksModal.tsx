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
  Trophy,
  Clock,
  Gift,
  Castle,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  X,
} from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import EventBus from "@/core/EventBus";

const HowItWorksModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let autoOpen = localStorage.getItem("dont_autopen_hiw") || "0";

    if (autoOpen == "0") {
      setOpen(true);
    }

    EventBus.on("open_hiw", () => {
      setOpen(true);
    });

    return () => {
      window.removeEventListener("load", () => {});
      EventBus.off("open_hiw");
    };
  }, []);

  const onDontAutoOpenChecked = () => {
    localStorage.setItem("dont_autopen_hiw", "1");
  };

  const steps = [
    {
      icon: Wallet,
      title: "Connect Your Wallet",
      description: "Link your Solana wallet to begin your pain journey",
      color: "purple",
    },
    {
      icon: Castle,
      title: "Select Your Clan",
      description: "Show your loyalty, Select the clan you want to mint with",
      color: "blue",
    },
    {
      icon: Clock,
      title: "Select Lock Duration",
      description: "Choose how long you're willing to endure the pain",
      color: "pink",
    },
    {
      icon: Gift,
      title: "Wait & Withdraw",
      description: "Patience pays off - claim your MAXXPAINN tokens",
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
      <DialogContent className="p-0 m-0 flex flex-col overflow-hidden max-w-5xl max-h-[85vh] bg-gradient-to-b from-black via-gray-900 to-black border-2 border-purple-500/30 rounded-3xl">
        {/* --- BACKGROUND --- */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <div className="absolute inset-0 opacity-15">
            <div
              className="absolute top-10 right-10 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
              style={{ animationDuration: "8s" }}
            />
            <div
              className="absolute bottom-10 left-10 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
              style={{ animationDuration: "10s", animationDelay: "2s" }}
            />
            <div
              className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
              style={{ animationDuration: "12s", animationDelay: "4s" }}
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
        </div>

        {/* --- HEADER --- */}
        <DialogHeader className="relative z-5 p-2 pt-4">
          <div className="text-center">
            <DialogTitle className="text-xl xs:text-2xl  md:text-4xl font-bold tracking-tighter">
              <span className="text-white">HOW IT </span>
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                WORKS
              </span>
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="relative z-5 px-8 pb-6 overflow-y-auto overflow-x-hidden flex-1 space-y-6">
          {/* Protocol Introduction */}
          <div className="relative bg-gray-900/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Info className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-bold text-white  uppercase tracking-tight">
                  Welcome to MAXXPAINN
                </h3>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed mb-3">
              Inspired by the revolutionary{" "}
              <span className="text-purple-400 font-bold">XEN Network</span> but
              built for the lightning-fast{" "}
              <span className="bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#00FFA3] bg-clip-text text-transparent font-bold">
                Solana blockchain
              </span>
              ,<span className="font-bold">MAXXPAINN</span> is a free-to-mint
              token protocol that rewards those brave enough to endure the pain
              of time-locked staking.
            </p>

            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-950/30 border border-green-500/20">
              <Gift className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-green-400 font-bold text-sm">
                💎 100% FREE MINTING - You only pay network gas & storage fees!
              </span>
            </div>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step, index) => {
              const colorClasses = getColorClasses(step.color);
              return (
                <div
                  key={index}
                  className="relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group overflow-hidden"
                >
                  {/* Step Number Badge */}
                  <div
                    className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br ${colorClasses} flex items-center justify-center text-white font-black text-xs border-2 border-white/20`}
                  >
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div
                    className={`inline-flex p-3 rounded-xl ${colorClasses} border mb-4`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <h4 className="text-lg font-black text-white mb-2 uppercase tracking-tight pr-10">
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Hover gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${colorClasses} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
                  />
                </div>
              );
            })}
          </div>

          {/* Anti-Bot Protection */}
          <div className="relative bg-gray-900/40 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 overflow-hidden group hover:border-red-500/30 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">
                  🛡️ Supply-Based Mint Difficulty
                </h3>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed">
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

          {/* CTA Section */}
          <div className="relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

            <Sparkles className="w-10 h-10 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-black mb-3">
              Ready to Transform Pain into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                Profit?
              </span>
            </h3>
            <p className="text-gray-400 mb-6">
              Join thousands of pain warriors who've already started their
              journey to MAXX rewards!
            </p>

            <Button
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white font-bold uppercase tracking-wider transition-all duration-300 group border-2 border-white/20"
            >
              Start Minting Now
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* --- FOOTER --- */}
        <DialogFooter className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-md px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="donot_autopen"
                onCheckedChange={onDontAutoOpenChecked}
                className="border-white/20 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
              />
              <label
                htmlFor="donot_autopen"
                className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors"
              >
                Don't show this again
              </label>
            </div>

            <Button
              onClick={() => setOpen(false)}
              className="px-6 py-2 rounded-full bg-gray-900/80 border border-white/10 text-white font-bold uppercase tracking-wider hover:bg-gray-800 hover:border-white/20 transition-all duration-300"
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HowItWorksModal;
