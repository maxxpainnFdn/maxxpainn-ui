import React from 'react';
import {
  Scale,
  Ticket,
  Flame,
  Vote,
  Wallet,
  FileText,
  Sparkles,
  Zap,
  Ban,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';

const Tokenomics = () => {
  const isMobile = useIsMobile();

  const features = [
    {
      title: 'Fair Launch',
      description:
        'No pre-sales, no insider allocations. Equal opportunity for every degen.',
      icon: <Scale className="w-6 h-6" />,
      accent: 'purple',
    },
    {
      title: 'No VCs Allowed',
      description:
        "We don't take VC money. We don't want their 'strategic partnerships'. F*ck 'em.",
      icon: <Ban className="w-6 h-6" />,
      accent: 'red',
    },
    {
      title: 'Free Forever',
      description:
        'Your pain is your ticket in. We want your rage, not your rent money.',
      icon: <Ticket className="w-6 h-6" />,
      accent: 'pink',
    },
    {
      title: 'Deflationary',
      description:
        'Aggressive buyback & burn. The supply only goes one way: Down.',
      icon: <Flame className="w-6 h-6" />,
      accent: 'orange',
    },
    {
      title: 'DAO Governed',
      description:
        'Community calls the shots. No suits, no ties, just pure chaos.',
      icon: <Vote className="w-6 h-6" />,
      accent: 'blue',
    },
  ];

  return (
    <section className="relative pb-32 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* ===== BACKGROUND ===== */}
      <div className="absolute inset-0 pointer-events-none">
        {!isMobile ? (
          <>
            <div className="absolute inset-0 opacity-15">
              <div
                className="absolute top-40 right-10 w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"
                style={{ animationDuration: '8s' }}
              />
              <div
                className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-red-500 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"
                style={{ animationDuration: '10s', animationDelay: '2s' }}
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-red-900/10" />
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gray-900/50 border border-purple-500/20 mb-8 backdrop-blur-md">
            <Zap className="w-4 h-4 text-purple-500 animate-pulse" />
            <span className="text-xs font-bold tracking-[0.3em] bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent uppercase">
              The Tokenomics
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none">
            <span className="text-white">NO</span>{' '}
            <span className="bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              BULLSHIT
            </span>
          </h2>

          <p className="text-xl sm:text-2xl text-gray-400 max-w-2xl mx-auto font-light">
            Built by degens,{' '}
            <span className="text-white font-bold">for degens.</span> No suits
            allowed.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* LEFT: Feature Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-red-500/30 hover:bg-gray-900/60 transition-all duration-300 hover:-translate-x-1"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl bg-black/40 border border-white/10 text-gray-400 group-hover:text-${feature.accent}-400 group-hover:border-${feature.accent}-500/30 transition-all shrink-0`}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold sm:font-black text-white mb-1 uppercase tracking-wide group-hover:text-red-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Mint Process Card */}
          <div className="lg:col-span-7">
            <div className="relative md:h-full bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-12 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

              <div className="relative space-y-8 z-10">
                <div className="mb-15">
                  <div className="inline-flex px-4 py-2 rounded-full bg-gradient-to-r from-red-950/50 to-purple-950/50 border border-red-500/20 mb-4">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
                      How It Works
                    </span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
                    Mint in{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
                      3 Steps
                    </span>
                  </h3>
                  <p className="text-gray-400">Pain → Power → Profit</p>
                </div>

                <div className="space-y-10 mb-15">
                  {/* Step 1 */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-black text-sm shadow-lg">
                      1
                    </div>
                    <div className="pt-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Wallet className="w-5 h-5 text-purple-400" />
                        <h4 className="text-lg font-bold text-white uppercase tracking-wide">
                          Connect
                        </h4>
                      </div>
                      <p className="text-sm text-gray-400">
                        Link your Solana wallet
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-white font-black text-sm shadow-lg">
                      2
                    </div>
                    <div className="pt-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-5 h-5 text-red-400" />
                        <h4 className="text-lg font-bold text-white uppercase tracking-wide">
                          Share
                        </h4>
                      </div>
                      <p className="text-sm text-gray-400">
                        Tell your crypto horror story
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-lg">
                      3
                    </div>
                    <div className="pt-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-5 h-5 text-green-400" />
                        <h4 className="text-lg font-bold text-white uppercase tracking-wide">
                          Mint
                        </h4>
                      </div>
                      <p className="text-sm text-gray-400">
                        Initiate Your $PAINN Mint
                      </p>
                    </div>
                  </div>
                </div>

                <button className="w-full group/btn relative px-8 py-5 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-black text-xl rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-[0_0_40px_rgba(220,38,38,0.3)] hover:shadow-[0_0_60px_rgba(220,38,38,0.5)] flex items-center justify-center gap-3">
                  <Flame className="w-6 h-6 animate-pulse" />
                  START MINTING
                  <Sparkles className="w-6 h-6 group-hover/btn:rotate-12 transition-transform" />
                </button>

                <p className="text-center text-xs text-gray-500 mt-4 font-bold uppercase tracking-widest">
                  100% Free • No Hidden Fees • Pure Degen Energy
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stat Bar */}
        <div className="relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x-0 md:divide-x divide-white/10">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-1">
                100%
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                Fair Launch
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 mb-1">
                0%
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                Team & VC Allocation
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-1">
                $0
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                VC Funds
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500 mb-1">
                ∞
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                Degen Power
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tokenomics;
