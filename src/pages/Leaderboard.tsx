import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Crown, Users, DollarSign, TrendingUp, Sparkles, Zap, Target, ArrowUpRight } from 'lucide-react';
import Navigation from '@/components/nav/Navigation';
import Footer from '@/components/Footer';

const Leaderboard = () => {
  const [timeframe, setTimeframe] = useState('all');

  // Mock clan leaderboard data
  const clanLeaderboardData = [
    { 
      rank: 1, 
      clanName: "The Pain Warriors", 
      mintersOnboarded: 1247, 
      totalEarnings: 62.35, 
      avatar: "🏰",
      badge: "LEGENDARY",
      accentColor: "from-yellow-400 to-orange-500",
      rewardPerMint: 0.05,
      change: "+12%"
    },
    { 
      rank: 2, 
      clanName: "Phoenix Rising", 
      mintersOnboarded: 1105, 
      totalEarnings: 55.25,
      avatar: "🦅",
      badge: "ELITE",
      accentColor: "from-gray-300 to-gray-100",
      rewardPerMint: 0.05,
      change: "+8%"
    },
    { 
      rank: 3, 
      clanName: "Rage Collective", 
      mintersOnboarded: 892, 
      totalEarnings: 44.60,
      avatar: "🔥",
      badge: "VETERAN",
      accentColor: "from-orange-700 to-amber-600",
      rewardPerMint: 0.05,
      change: "+15%"
    },
    { 
      rank: 4, 
      clanName: "Midnight Grinders", 
      mintersOnboarded: 678, 
      totalEarnings: 33.90,
      avatar: "🌙",
      badge: "Night Warriors",
      accentColor: "from-indigo-500 to-purple-500",
      rewardPerMint: 0.05,
      change: "+3%"
    },
    { 
      rank: 5, 
      clanName: "Diamond Tears", 
      mintersOnboarded: 523, 
      totalEarnings: 26.15,
      avatar: "💎",
      badge: "Premium Clan",
      accentColor: "from-cyan-500 to-blue-500",
      rewardPerMint: 0.05,
      change: "+5%"
    },
    { 
      rank: 6, 
      clanName: "Chaos Squad", 
      mintersOnboarded: 445, 
      totalEarnings: 22.25,
      avatar: "⚡",
      badge: "New Power",
      accentColor: "from-green-500 to-teal-500",
      rewardPerMint: 0.05,
      change: "+22%"
    },
    { 
      rank: 7, 
      clanName: "Shadow Miners", 
      mintersOnboarded: 387, 
      totalEarnings: 19.35,
      avatar: "🌑",
      badge: "Stealth Squad",
      accentColor: "from-gray-500 to-slate-500",
      rewardPerMint: 0.05,
      change: "-2%"
    },
    { 
      rank: 8, 
      clanName: "Neon Hustlers", 
      mintersOnboarded: 312, 
      totalEarnings: 15.60,
      avatar: "🎆",
      badge: "Active Clan",
      accentColor: "from-pink-500 to-purple-500",
      rewardPerMint: 0.05,
      change: "+1%"
    },
    { 
      rank: 9, 
      clanName: "Iron Forge", 
      mintersOnboarded: 276, 
      totalEarnings: 13.80,
      avatar: "⚔️",
      badge: "Strong Core",
      accentColor: "from-orange-500 to-amber-500",
      rewardPerMint: 0.05,
      change: "+4%"
    },
    { 
      rank: 10, 
      clanName: "Crypto Crusaders", 
      mintersOnboarded: 234, 
      totalEarnings: 11.70,
      avatar: "🛡️",
      badge: "Dedicated",
      accentColor: "from-blue-500 to-cyan-500",
      rewardPerMint: 0.05,
      change: "+0.5%"
    }
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-8 w-8 text-yellow-400 fill-yellow-400/20 animate-pulse" />;
      case 2:
        return <Medal className="h-8 w-8 text-gray-300 fill-gray-300/20" />;
      case 3:
        return <Medal className="h-8 w-8 text-amber-600 fill-amber-600/20" />;
      default:
        return <span className="font-mono font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-b from-yellow-500/10 to-orange-500/5 border-yellow-500/50 shadow-[0_0_30px_-10px_rgba(234,179,8,0.3)] order-1 md:order-2 scale-105 md:scale-110 z-10";
      case 2:
        return "bg-gradient-to-b from-gray-400/10 to-gray-500/5 border-gray-400/30 order-2 md:order-1";
      case 3:
        return "bg-gradient-to-b from-amber-700/10 to-amber-600/5 border-amber-700/30 order-3";
      default:
        return "bg-gray-900/40 border-white/5";
    }
  };

  const totalStats = {
    totalMinters: clanLeaderboardData.reduce((sum, clan) => sum + clan.mintersOnboarded, 0),
    totalEarnings: clanLeaderboardData.reduce((sum, clan) => sum + clan.totalEarnings, 0),
    averageMinters: Math.round(clanLeaderboardData.reduce((sum, clan) => sum + clan.mintersOnboarded, 0) / clanLeaderboardData.length)
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      <Navigation />
      
      {/* --- EXCITING BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
        {/* Large Animated Nebula Orbs */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />
      </div>
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* --- HEADER --- */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gray-900/50 border border-purple-500/30 mb-8 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(168,85,247,0.5)]">
              <Trophy className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-xs font-bold tracking-[0.3em] bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent uppercase">
                Hall of Fame
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
              <span className="text-white">CLAN </span>
              <span className="bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                LEADERBOARD
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              Dominate the ecosystem. Onboard minters. Earn <span className="text-white font-bold">SOL</span> rewards forever.
            </p>
          </div>

          {/* --- STATS OVERVIEW --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="group relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-hidden hover:border-purple-500/30 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50" />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-1">Total Minters</p>
                  <p className="text-4xl font-black text-white group-hover:text-purple-400 transition-colors">
                    {totalStats.totalMinters.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8" />
                </div>
              </div>
              <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="group relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-hidden hover:border-green-500/30 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-50" />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-1">Total Distributed</p>
                  <p className="text-4xl font-black text-white group-hover:text-green-400 transition-colors">
                    {totalStats.totalEarnings.toFixed(2)} <span className="text-xl text-gray-500">SOL</span>
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 group-hover:scale-110 transition-transform">
                  <DollarSign className="h-8 w-8" />
                </div>
              </div>
              <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="group relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-hidden hover:border-blue-500/30 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-1">Avg. Clan Size</p>
                  <p className="text-4xl font-black text-white group-hover:text-blue-400 transition-colors">
                    {totalStats.averageMinters}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8" />
                </div>
              </div>
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* --- TIMEFRAME SELECTOR --- */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1 bg-gray-900/60 backdrop-blur-lg border border-white/10 rounded-xl">
              {['all', 'month', 'week'].map((period) => (
                <Button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  variant="ghost"
                  className={`px-4 md:px-8 py-2 rounded-lg font-bold uppercase tracking-wider transition-all duration-300 ${
                    timeframe === period 
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {period === 'all' ? 'All Time' : period === 'month' ? 'This Month' : 'This Week'}
                </Button>
              ))}
            </div>
          </div>

          {/* --- TOP 3 PODIUM --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
            {clanLeaderboardData.slice(0, 3).map((clan, index) => (
              <div 
                key={clan.rank} 
                className={`relative rounded-3xl p-8 backdrop-blur-xl border transition-all duration-500 group ${getRankStyle(clan.rank)}`}
              >
                {/* Glow Effect for #1 */}
                {clan.rank === 1 && (
                  <div className="absolute inset-0 bg-yellow-500/10 blur-3xl -z-10 rounded-full" />
                )}

                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {getRankIcon(clan.rank)}
                  </div>
                  
                  <div className="w-20 h-20 text-6xl mb-4 flex items-center justify-center bg-black/30 rounded-2xl border border-white/5 shadow-inner">
                    {clan.avatar}
                  </div>
                  
                  <h3 className={`text-2xl font-black mb-2 bg-gradient-to-r ${clan.accentColor} bg-clip-text text-transparent uppercase tracking-tight`}>
                    {clan.clanName}
                  </h3>
                  
                  <div className="bg-black/40 px-4 py-1 rounded-full border border-white/5 mb-6">
                    <p className={`text-xs font-bold uppercase tracking-widest bg-gradient-to-r ${clan.accentColor} bg-clip-text text-transparent`}>
                      {clan.badge}
                    </p>
                  </div>

                  <div className="w-full space-y-3 pt-6 border-t border-white/5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-bold uppercase">Earnings</span>
                      <span className="text-green-400 font-black">{clan.totalEarnings.toFixed(2)} SOL</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-bold uppercase">Minters</span>
                      <span className="text-white font-bold">{clan.mintersOnboarded.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- FULL LEADERBOARD TABLE --- */}
          <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
            <div className="p-8 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-2xl font-black text-white flex items-center gap-3">
                <Target className="w-6 h-6 text-purple-500" />
                Rankings
              </h3>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/50"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/50"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/50"></span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-white/5">
                    <TableHead className="text-gray-500 font-bold uppercase tracking-wider pl-8 h-14">Rank</TableHead>
                    <TableHead className="text-gray-500 font-bold uppercase tracking-wider h-14">Clan</TableHead>
                    <TableHead className="text-gray-500 font-bold uppercase tracking-wider text-right h-14">Minters</TableHead>
                    <TableHead className="text-gray-500 font-bold uppercase tracking-wider text-right h-14">Total Earnings</TableHead>
                    <TableHead className="text-gray-500 font-bold uppercase tracking-wider text-right h-14">Trend</TableHead>
                    <TableHead className="text-gray-500 font-bold uppercase tracking-wider text-right pr-8 h-14">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clanLeaderboardData.map((clan, idx) => (
                    <TableRow 
                      key={clan.rank} 
                      className={`border-white/5 hover:bg-white/5 transition-colors group ${
                        clan.rank <= 3 ? 'bg-purple-500/5' : ''
                      }`}
                    >
                      <TableCell className="pl-8 font-medium">
                        <div className="flex items-center gap-3">
                          {idx < 3 ? (
                            <div className="p-1.5 bg-white/10 rounded-lg">
                              {getRankIcon(clan.rank)}
                            </div>
                          ) : (
                            <span className="text-gray-500 font-mono">#{clan.rank}</span>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <span className="text-2xl bg-black/30 w-10 h-10 flex items-center justify-center rounded-lg border border-white/5">
                            {clan.avatar}
                          </span>
                          <div>
                            <span className={`font-bold block text-lg ${
                              clan.rank <= 3 ? 'text-white' : 'text-gray-300'
                            } group-hover:text-purple-400 transition-colors`}>
                              {clan.clanName}
                            </span>
                            <span className="text-xs text-gray-600 font-mono uppercase">
                              ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right text-gray-300 font-mono">
                        {clan.mintersOnboarded.toLocaleString()}
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <span className="font-bold text-green-400 font-mono text-lg">
                          {clan.totalEarnings.toFixed(2)} SOL
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className={`inline-flex items-center gap-1 text-xs font-bold ${
                          clan.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {clan.change}
                          {clan.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right pr-8">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                           clan.rank <= 3 
                           ? `bg-gradient-to-r ${clan.accentColor} text-white` 
                           : 'bg-gray-800 text-gray-400 border border-white/10'
                        }`}>
                          {clan.badge}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="p-4 border-t border-white/10 text-center">
              <Button variant="ghost" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 uppercase tracking-widest text-xs font-bold">
                View All 1,420 Clans
              </Button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Leaderboard;