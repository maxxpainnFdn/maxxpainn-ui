
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Zap, Target, Flame, Skull, Rocket, TrendingUp } from 'lucide-react';

const Roadmap = () => {
  
  const phases = [
    {
      phase: "Phase 1",
      title: "The Pain Awakening",
      status: "completed",
      timeline: "Q1 2025",
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
      timeline: "Q2 2025",
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
      timeline: "Q3 2025",
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
      emoji: "👑",
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
      emoji: "👑",
      items: [
        "Clan token airdrop distributed based on member point scores"
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'current': return <Flame className="w-6 h-6 text-orange-400 animate-pulse" />;
      case 'upcoming': return <Rocket className="w-6 h-6 text-blue-400" />;
      case 'future': return <TrendingUp className="w-6 h-6 text-purple-400" />;
      default: return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-500/50 bg-gradient-to-br from-green-500/10 to-green-600/5 shadow-green-500/20';
      case 'current': return 'border-orange-500/50 bg-gradient-to-br from-orange-500/20 to-red-600/10 shadow-orange-500/30 shadow-2xl';
      case 'upcoming': return 'border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-purple-600/5 shadow-blue-500/20';
      case 'future': return 'border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-pink-600/5 shadow-purple-500/20';
      default: return 'border-gray-500/30 bg-gray-500/5';
    }
  };

  const getPhaseNumber = (index: number) => {
    return (
      <div className={`
        w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold
        border-2 transition-all duration-300 hover:scale-110
        ${index === 1 ? 'bg-gradient-to-br from-orange-500 to-red-600 border-orange-400 shadow-lg shadow-orange-500/50 animate-pulse' :
          index === 0 ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400' :
          index === 2 ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400' :
          'bg-gradient-to-br from-purple-500 to-pink-600 border-purple-400'}
      `}>
        {phases[index].emoji}
      </div>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-b from-black via-red-950/20 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,0,64,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="flex justify-center items-center mb-6">
            <Skull className="w-8 h-8 text-red-400 mr-3 animate-pulse" />
            <h2 className="text-5xl md:text-6xl font-bold">
              <span className="text-red-400">Roadmap</span>{' '}
              <span className="gradient-text">to Redemption</span>
            </h2>
            <Skull className="w-8 h-8 text-red-400 ml-3 animate-pulse" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From collective pain to unstoppable power. This is how we're going to make it, anon.
          </p>
          <div className="mt-6 flex justify-center">
            <Badge variant="outline" className="text-orange-400 border-orange-400/30 bg-orange-500/10 text-lg px-4 py-2">
              🔥 WAGMI MODE ACTIVATED 🔥
            </Badge>
          </div>
        </div>

        <div className="space-y-12">
          {phases.map((phase, index) => {

            
            return (            
            
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < phases.length - 1 && (
                  <div className="hidden sm:block absolute left-8 top-20 w-0.5 h-12 bg-gradient-to-b from-purple-500/50 to-transparent z-0" />
                )}
                
                <div className="flex items-start space-x-0 sm:space-x-6">
                  {/* Phase Number */}
                  <div className="hidden sm:block flex-shrink-0 relative z-10">
                    {getPhaseNumber(index)}
                  </div>
                  
                  {/* Phase Card */}
                  <Card className={`
                    flex-1 ${getStatusColor(phase.status)} backdrop-blur-sm 
                    transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl
                    ${phase.status === 'current' ? 'ring-2 ring-orange-500/30' : ''}
                  `}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="">
                        
                          <h3 
                            className={`
                              text-xl  md:text-2xl px-4 py-2 font-bold
                              ${phase.status === 'completed' ? 'text-green-400 border-green-400/30 ' : ''}
                              ${phase.status === 'current' ? 'text-orange-400 border-orange-400/30  animate-pulse' : ''}
                              ${phase.status === 'upcoming' ? 'text-blue-400 border-blue-400/30 ' : ''}
                              ${phase.status === 'future' ? 'text-purple-400 border-purple-400/30' : ''}
                            `}
                          >
                            {phase.phase}
                          </h3>
                          <div className='text-sm p-2 ps-4'>
                            { phase.phaseText }
                          </div>    
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant="outline" 
                            className={`
                              text-lg px-4 py-2 font-bold
                              flex gap-2
                              ${phase.status === 'completed' ? 'text-green-400 border-green-400/30 bg-green-500/10' : ''}
                              ${phase.status === 'current' ? 'text-orange-400 border-orange-400/30 bg-orange-500/10 animate-pulse' : ''}
                              ${phase.status === 'upcoming' ? 'text-blue-400 border-blue-400/30 bg-blue-500/10' : ''}
                              ${phase.status === 'future' ? 'text-purple-400 border-purple-400/30 bg-purple-500/10' : ''}
                            `}
                          >
                              {getStatusIcon(phase.status)}
                              {phase.status}
                          </Badge>
                      
                        </div>
                      </div>
                      <CardTitle className="text-3xl text-white font-bold">
                        {phase.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
      
                      <div className="grid md:grid-cols-2 gap-4">
                        {phase.items.map((item, itemIndex) => (
                          <div 
                            key={itemIndex}
                            className={`
                              flex items-start space-x-3 p-4 rounded-lg transition-all duration-300
                              bg-black/30 border border-gray-700/30 hover:border-gray-600/50
                              hover:bg-black/50 hover:scale-[1.02]
                            `}
                          >
                            <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                              phase.status === 'completed' ? 'bg-green-400 shadow-lg shadow-green-400/50' :
                              phase.status === 'current' ? 'bg-orange-400 shadow-lg shadow-orange-400/50 animate-pulse' :
                              phase.status === 'upcoming' ? 'bg-blue-400 shadow-lg shadow-blue-400/50' :
                              'bg-purple-400 shadow-lg shadow-purple-400/50'
                            }`} />
                            <span className="text-gray-300 font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-20 text-center">
          <div className="mb-8">
            <p className="text-gray-400 text-xl mb-4">
              This roadmap evolves with our degen community. Diamond hands only! 💎🙌
            </p>
            <p className="text-sm text-gray-500">
              *Not financial advice. DYOR, anon.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-purple-400 border-purple-400/30 bg-purple-500/10 text-lg px-6 py-3">
              🚀 Community Driven
            </Badge>
            <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-500/10 text-lg px-6 py-3">
              👀 Transparent AF
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400/30 bg-blue-500/10 text-lg px-6 py-3">
              📈 Regular Updates
            </Badge>
            <Badge variant="outline" className="text-orange-400 border-orange-400/30 bg-orange-500/10 text-lg px-6 py-3">
              💀 Degen Approved
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
