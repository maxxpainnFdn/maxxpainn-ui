import React, { useState } from 'react';
import {
  ChevronRight,
  Skull,
  Zap,
  Coins,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/useIsMobile';

const EnhancedStorySection = () => {
  const [selectedPain, setSelectedPain] = useState(0);
  const isMobile = useIsMobile();

  const painPoints = [
    {
      title: 'The Luna Massacre',
      description:
        "Remember when LUNA went from $80 to $0.0001? Pepperidge Farm remembers.",
      icon: '🌙',
      loss: '$60B',
      detail:
        "Do Kwon promised the moon, delivered the grave. 280,000 BTC couldn't save us.",
      accentColor: 'from-blue-500/20 to-purple-500/20',
      borderColor: 'border-blue-500/30 hover:border-blue-500/60',
    },
    {
      title: 'FTX Betrayal',
      description:
        'Trusted SBF with our life savings. Got backstabbed by a fraud.',
      icon: '💔',
      loss: '$8B',
      detail:
        'The golden boy of crypto was just another con artist in a hoodie.',
      accentColor: 'from-red-500/20 to-orange-500/20',
      borderColor: 'border-red-500/30 hover:border-red-500/60',
    },
    {
      title: 'Endless Rugs',
      description:
        "How many 'revolutionary' projects vanished with our dreams?",
      icon: '🪦',
      loss: '$10B+',
      detail:
        'SafeMoon, Iron Finance, Titan... The graveyard keeps growing.',
      accentColor: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30 hover:border-purple-500/60',
    },
    {
      title: 'Liquidation Hell',
      description:
        "100x leverage seemed smart until it wasn't. Dreams crushed in milliseconds.",
      icon: '⚡',
      loss: '$50B+',
      detail:
        "One red candle. That's all it took to delete years of savings.",
      accentColor: 'from-yellow-500/20 to-red-500/20',
      borderColor: 'border-yellow-500/30 hover:border-yellow-500/60',
    },
    {
      title: 'Exchange Hacks',
      description:
        "Mt. Gox, Bitfinex, QuadrigaCX... Our funds, their 'mistakes'.",
      icon: '🏴‍☠️',
      loss: '$15B+',
      detail:
        'Not your keys, not your coins. We learned this the hard way.',
      accentColor: 'from-orange-500/20 to-red-500/20',
      borderColor: 'border-orange-500/30 hover:border-orange-500/60',
    },
    {
      title: 'Ponzi Paradise',
      description:
        'Bitconnect, OneCoin, PlusToken... We fell for them all.',
      icon: '🎪',
      loss: '$25B+',
      detail: 'Hey hey hey! Wassup wassup wassup! BITCONNEEEECT!',
      accentColor: 'from-pink-500/20 to-purple-500/20',
      borderColor: 'border-pink-500/30 hover:border-pink-500/60',
    },
  ];

  return (
    <section
      id="story"
      className="relative py-24 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-purple-900/20"
    >
      {/* ===== BACKGROUND ===== */}
      <div className="absolute inset-0 pointer-events-none">
        {!isMobile ? (
          <>
            <div className="absolute inset-0 opacity-15">
              <div
                className="absolute top-40 left-20 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
                style={{ animationDuration: '8s' }}
              />
              <div
                className="absolute bottom-40 right-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
                style={{ animationDuration: '10s', animationDelay: '2s' }}
              />
              <div
                className="absolute top-1/3 right-1/3 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
                style={{ animationDuration: '9s', animationDelay: '4s' }}
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
            <div className="absolute top-20 left-20 w-4 h-4 border-2 border-red-500/30 rotate-45 opacity-30" />
            <div
              className="absolute bottom-40 right-32 w-6 h-6 border-2 border-purple-500/30 rounded-full animate-pulse"
              style={{ animationDuration: '4s' }}
            />
            <div
              className="absolute top-1/2 left-16 w-3 h-3 bg-pink-500/40 rounded-full animate-pulse"
              style={{ animationDelay: '1s' }}
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-purple-900/10" />
        )}
      </div>

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gray-900/50 border border-red-500/20 mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <Skull className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="text-xs md:text-sm font-bold tracking-[0.2em] bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent uppercase">
              Our Shared Trauma
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black mb-8 tracking-tight">
            <span className="text-white">THE PAIN WE </span>
            <span className="bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
              CARRY
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed font-light">
            Every degen has scars. Every loss carved deeper wounds.
            <br className="hidden md:block" />
            <span className="text-white font-medium ms-1">
              But from this collective pain, we forge our strength.
            </span>
          </p>
        </div>

        {/* Pain Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {painPoints.map((point, index) => (
            <div
              key={index}
              onClick={() => setSelectedPain(index)}
              className={`
                group relative cursor-pointer
                bg-gray-900/40 backdrop-blur-2xl border rounded-[2rem] p-8
                transition-all duration-300
                hover:-translate-y-2 overflow-hidden
                ${
                  selectedPain === index
                    ? `${point.borderColor} scale-[1.02] shadow-[0_0_40px_rgba(168,85,247,0.15)] bg-gray-900/60`
                    : 'border-white/5 hover:border-white/20'
                }
              `}
            >
              {/* Hover glow */}
              <div
                className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b ${point.accentColor} blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
              />

              <div className="relative z-10 text-center">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
                  {point.icon}
                </div>

                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                  {point.title}
                </h3>

                <p className="text-gray-400 mb-6 leading-relaxed text-sm font-medium">
                  {point.description}
                </p>

                <div className="mb-2">
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600">
                    {point.loss}
                  </span>
                </div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">
                  Lost Forever
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    selectedPain === index
                      ? 'max-h-24 opacity-100 mt-4'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-gray-300 italic text-sm leading-relaxed">
                      "{point.detail}"
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`absolute bottom-4 right-4 transition-all duration-300 ${
                  selectedPain === index
                    ? 'rotate-90 opacity-100'
                    : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Card */}
        <div className="mx-auto">
          <div className="relative bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-16 shadow-[0_0_60px_rgba(0,0,0,0.5)] overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
              <div className="max-w-2xl text-center md:text-left">
                <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                  FROM ASHES, <br className="md:hidden" />
                  <span className="bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    WE RISE
                  </span>
                </h3>
                <p className="text-gray-400 text-lg mb-4 leading-relaxed">
                  Every crash taught us resilience. Every rug made us wiser.
                  Every liquidation forged our determination.
                </p>
                <div className="text-xl text-white font-bold">
                  MAXXPAINN is our collective middle finger to the system.
                </div>
              </div>

              <div className="shrink-0">
                <Link to="/mint">
                  <button className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-black text-lg rounded-2xl transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.4)] flex items-center gap-3">
                    <Flame className="w-5 h-5 animate-pulse" />
                    JOIN THE REVOLUTION
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedStorySection;
