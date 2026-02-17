import React from 'react';
import { CheckCircle, Clock, Flame, Rocket, TrendingUp, Zap, Target, Crown } from 'lucide-react';
import Navigation from '@/components/nav/Navigation';
import Footer from '@/components/Footer';

const Roadmap = () => {
  
  const phases = [
    {
      phase: "Phase 1",
      title: "The Pain Awakening",
      status: "completed",
      emoji: "💀",
      items: [
        "Domain secured",
        "Core website launched",
        "MAXXPAINN whitepaper + manifesto unveiled",
        "Social channels established"
      ]
    },
    {
      phase: "Phase 2",
      title: "Free Mint Liberation",
      status: "current",
      emoji: "🔥",
      items: [
        "Early degen outreach & validation",
        "Community formation and pain-story onboarding",
        "Smart contract deployment",
        "Free mint launch for all degens"
      ]
    },
    {
      phase: "Phase 3",
      title: "Ecosystem Expansion",
      status: "upcoming",
      emoji: "🚀",
      items: [
        "User onboarding & amplified marketing",
        "Exchange listings",
        "Partnership integrations with major protocols",
        "Enhanced on-chain liquidity"
      ]
    },
    {
      phase: "Phase 4",
      phaseText: "Activated at 10,000,000 Global Rank",
      title: "Protocol Upgrade",
      status: "future",
      emoji: "⚡",
      items: [
        "Clan-focused social features",
        "Live streaming for clans",
        "Advanced clan moderation tools",
        "Cross-chain deployment across multiple networks"
      ]
    },
    {
      phase: "Phase 5",
      phaseText: "Activated at 100,000,000 Global Rank",
      title: "Creator Expansion",
      status: "future",
      emoji: "👑",
      items: [
        "Clan-based token launches",
        "Creator economy toolset",
        "Creator rewards, incentives, and boosts"
      ]
    },
    {
      phase: "Phase 6",
      phaseText: "Activated at 100,000,000+ Global Rank",
      title: "THE LARGEST AIRDROP",
      status: "future",
      emoji: "💎",
      items: [
        "Clan token airdrop distributed based on member point scores"
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5" />;
      case 'current': return <Flame className="w-5 h-5 animate-pulse" />;
      case 'upcoming': return <Rocket className="w-5 h-5" />;
      case 'future': return <Crown className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status, index) => {
    // Unique colors for the last 3 phases (indices 3, 4, 5)
    if (index === 3) return 'text-cyan-400 bg-cyan-950/30 border-cyan-500/20'; // Phase 4
    if (index === 4) return 'text-pink-400 bg-pink-950/30 border-pink-500/20'; // Phase 5
    if (index === 5) return 'text-yellow-400 bg-yellow-950/30 border-yellow-500/20'; // Phase 6

    switch (status) {
      case 'completed': return 'text-green-400 bg-green-950/30 border-green-500/20';
      case 'current': return 'text-orange-400 bg-orange-950/30 border-orange-500/20';
      case 'upcoming': return 'text-blue-400 bg-blue-950/30 border-blue-500/20';
      default: return 'text-gray-400 bg-gray-950/30 border-gray-500/20';
    }
  };

  const getCardGlow = (status, index) => {
    // Unique hover glows for last 3
    if (index === 3) return 'hover:border-cyan-500/30';
    if (index === 4) return 'hover:border-pink-500/30';
    if (index === 5) return 'hover:border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.1)]';

    switch (status) {
      case 'completed': return 'hover:border-green-500/30';
      case 'current': return 'border-orange-500/30 shadow-[0_0_40px_rgba(251,146,60,0.15)]';
      case 'upcoming': return 'hover:border-blue-500/30';
      default: return '';
    }
  };

  const getAccentGradient = (status, index) => {
      if (index === 3) return 'via-cyan-500';
      if (index === 4) return 'via-pink-500';
      if (index === 5) return 'via-yellow-500';

      switch (status) {
        case 'completed': return 'via-green-500';
        case 'current': return 'via-orange-500';
        case 'upcoming': return 'via-blue-500';
        default: return 'via-purple-500';
      }
  }

  const getBulletColor = (status, index) => {
      if (index === 3) return 'bg-cyan-400 shadow-lg shadow-cyan-400/50';
      if (index === 4) return 'bg-pink-400 shadow-lg shadow-pink-400/50';
      if (index === 5) return 'bg-yellow-400 shadow-lg shadow-yellow-400/50';

      switch(status) {
          case 'completed': return 'bg-green-400 shadow-lg shadow-green-400/50';
          case 'current': return 'bg-orange-400 shadow-lg shadow-orange-400/50 animate-pulse';
          case 'upcoming': return 'bg-blue-400 shadow-lg shadow-blue-400/50';
          default: return 'bg-purple-400 shadow-lg shadow-purple-400/50';
      }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Navigation />
      
      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 right-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-40 left-10 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
      </div>
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* --- HEADER --- */}
          <div className="text-center mb-20">
    

            <h1 className="text-3xl sm:text-5xl md:text-8xl font-black mb-4 tracking-tighter leading-none">
              <span className="text-white">PROJECT'S </span>
              <span className="bg-gradient-to-r  from-purple-500 to-pink-500 bg-clip-text text-transparent">
                ROADMAP
              </span>
            </h1>
            
            <p className="text-lg sm:text-2xl text-white max-w-3xl mx-auto font-light mb-8">
              This is how we're going to make it, anon.
            </p>

         
          </div>

          {/* --- TIMELINE --- */}
          <div className="space-y-8">
            {phases.map((phase, index) => (
              <div key={index} className="relative">
                
                {/* Connection Line */}
                {index < phases.length - 1 && (
                  <div className="hidden md:block absolute left-8 top-24 w-0.5 h-12 bg-gradient-to-b from-purple-500/30 to-transparent" />
                )}
                
                <div className="flex items-start gap-6">
                  
                  {/* Phase Emoji Badge */}
                  <div className="hidden md:flex flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-white/20 items-center justify-center text-3xl shadow-lg hover:scale-110 transition-transform">
                    {phase.emoji}
                  </div>
                  
                  {/* Phase Card */}
                  <div className={`flex-1 relative bg-gray-900/40 backdrop-blur-xl border border-white/10 ${getCardGlow(phase.status, index)} rounded-3xl p-8 md:p-10 transition-all duration-500 hover:-translate-y-1 overflow-hidden group`}>
                    
                    {/* Top accent line */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent ${getAccentGradient(phase.status, index)} to-transparent opacity-50`} />

                    {/* Card Header */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                      <div className="flex-1">
                        {/* Phase Number */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(phase.status, index)} border font-bold text-sm uppercase tracking-wider mb-3`}>
                          {phase.phase}
                        </div>

                        {/* Phase Text (milestone requirement) */}
                        {phase.phaseText && (
                          <div className="text-xs text-gray-500 font-mono mb-3 uppercase tracking-widest">
                            {phase.phaseText}
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="text-xl  md:text-4xl font-bold md:font-black text-white uppercase tracking-tight">
                          {phase.title}
                        </h3>
                      </div>

                      {/* Status Badge */}
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(phase.status, index)} border font-bold text-sm uppercase tracking-wider`}>
                        {getStatusIcon(phase.status)}
                        {phase.status}
                      </div>
                    </div>

                    {/* Items Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {phase.items.map((item, itemIndex) => (
                        <div 
                          key={itemIndex}
                          className="flex items-start gap-3 p-4 rounded-xl bg-black/30 border border-white/10 hover:bg-black/50 hover:border-white/20 transition-all duration-300"
                        >
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getBulletColor(phase.status, index)}`} />
                          <span className="text-gray-300 font-medium leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- BOTTOM INFO --- */}
          <div className="mt-20 text-center">
            <div className="relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 mb-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
              
              <p className="text-xl text-gray-400 mb-4">
                This roadmap evolves with our degen community.
              </p>
              <p className="text-2xl font-black text-white mb-2">
                Diamond hands only! 💎🙌
              </p>
              <p className="text-sm text-gray-600 uppercase tracking-widest">
                *Not financial advice. DYOR, anon.
              </p>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-4">
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-purple-950/30 border border-purple-500/20 text-purple-400 font-bold text-sm uppercase tracking-wider">
                🚀 Community Driven
              </div>
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-green-950/30 border border-green-500/20 text-green-400 font-bold text-sm uppercase tracking-wider">
                👀 Transparent AF
              </div>
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-blue-950/30 border border-blue-500/20 text-blue-400 font-bold text-sm uppercase tracking-wider">
                📈 Regular Updates
              </div>
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-orange-950/30 border border-orange-500/20 text-orange-400 font-bold text-sm uppercase tracking-wider">
                💀 Degen Approved
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Roadmap;
