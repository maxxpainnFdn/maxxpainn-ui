/**
 * MAXXPAINN — Social Feed (Neon Bento Dashboard Style)
 *
 * Designed to sit perfectly under the existing top Navigation.
 * Uses a max-w-7xl grid layout, rounded "bento" cards, frosted 
 * glass backgrounds, and glowing neon accents.
 */

import React, { useState, useRef } from "react";
import {
  Flame,
  Zap,
  Skull,
  Shield,
  Moon,
  Globe,
  MessageSquare,
  Repeat,
  TrendingUp,
  Activity,
  Send,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";

/* ═══ CLANS & DATA ═══════════════════════════════════════ */

const CLANS = [
  { id: "inferno", name: "Inferno", icon: Flame, color: "text-red-500", bg: "bg-red-500" },
  { id: "volt", name: "Volt", icon: Zap, color: "text-purple-500", bg: "bg-purple-500" },
  { id: "skull", name: "Skull", icon: Skull, color: "text-pink-500", bg: "bg-pink-500" },
  { id: "dragon", name: "Dragon", icon: Shield, color: "text-amber-500", bg: "bg-amber-500" },
  { id: "shadow", name: "Shadow", icon: Moon, color: "text-indigo-500", bg: "bg-indigo-500" },
];

const getClan = (id: string) => CLANS.find((c) => c.id === id)!;

interface FeedPost {
  id: string;
  user: { handle: string; avatar: string };
  clanId: string;
  content: string;
  time: string;
  metrics: { burn: number; boost: number; pain: number };
  comments: number;
  painLevel: number; // 0-100
}

const SEED_POSTS: FeedPost[] = [
  {
    id: "p1",
    user: { handle: "0xReaper", avatar: "bg-gradient-to-br from-pink-500 to-rose-500" },
    clanId: "skull",
    content: "LIQUIDATED. 40x long right into the wick. The syndicate demands a sacrifice and I guess I'm it today. Pain is temporary, glory is forever. 💀",
    time: "12m ago",
    metrics: { burn: 24, boost: 18, pain: 89 },
    comments: 7,
    painLevel: 95,
  },
  {
    id: "p2",
    user: { handle: "Voltage_X", avatar: "bg-gradient-to-br from-violet-500 to-purple-500" },
    clanId: "volt",
    content: "Node operators: network upgrade at 0400 UTC. If you drop offline, your stake goes to the burn wallet. Stay sharp.",
    time: "28m ago",
    metrics: { burn: 12, boost: 104, pain: 2 },
    comments: 14,
    painLevel: 20,
  },
  {
    id: "p3",
    user: { handle: "InfernoMaxx", avatar: "bg-gradient-to-br from-red-500 to-orange-500" },
    clanId: "inferno",
    content: "Just swept the floor of the new drop. Burning 50% immediately to pump the floor. We are the fire.",
    time: "1h ago",
    metrics: { burn: 210, boost: 45, pain: 12 },
    comments: 23,
    painLevel: 65,
  },
];

/* ═══ HELPERS ════════════════════════════════════════════ */

// A sleek circular SVG gauge for the Pain Level
const PainGauge = ({ level, colorClass }: { level: number; colorClass: string }) => {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (level / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-10 h-10" title={`Pain: ${level}%`}>
      <svg className="transform -rotate-90 w-10 h-10">
        <circle
          cx="20" cy="20" r={radius}
          className="stroke-white/10" strokeWidth="3" fill="transparent"
        />
        <circle
          cx="20" cy="20" r={radius}
          className={colorClass.replace("text-", "stroke-")}
          strokeWidth="3" fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Activity className={`w-3.5 h-3.5 ${colorClass}`} />
      </div>
    </div>
  );
};

/* ═══ MAIN COMPONENT ═════════════════════════════════════ */

export default function BentoFeed() {
  const [posts, setPosts] = useState<FeedPost[]>(SEED_POSTS);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [text, setText] = useState("");
  const [reacted, setReacted] = useState<Record<string, Set<string>>>({});
  const taRef = useRef<HTMLTextAreaElement>(null);

  const submitPost = () => {
    if (!text.trim()) return;
    const postClan = activeFilter === "all" ? CLANS[1].id : activeFilter;
    const p: FeedPost = {
      id: `u-${Date.now()}`,
      user: { handle: "You", avatar: "bg-gradient-to-br from-purple-400 to-pink-500" },
      clanId: postClan,
      content: text.trim(),
      time: "Just now",
      metrics: { burn: 0, boost: 0, pain: 0 },
      comments: 0,
      painLevel: Math.floor(Math.random() * 60) + 20,
    };
    setPosts([p, ...posts]);
    setText("");
    if (taRef.current) taRef.current.style.height = "auto";
  };

  const toggle = (pid: string, type: "burn" | "boost" | "pain") => {
    const was = reacted[pid]?.has(type) ?? false;
    setReacted((prev) => {
      const copy = { ...prev };
      const s = new Set(copy[pid] || []);
      was ? s.delete(type) : s.add(type);
      copy[pid] = s;
      return copy;
    });
    setPosts((prev) =>
      prev.map((p) =>
        p.id !== pid ? p : { ...p, metrics: { ...p.metrics, [type]: p.metrics[type] + (was ? -1 : 1) } }
      )
    );
  };

  const displayed = activeFilter === "all" ? posts : posts.filter((p) => p.clanId === activeFilter);

  return (
    // Outer wrapper assumes your Nav is fixed at top. pt-[100px] clears the 68px nav.
    // Replace `bg-[#09090b]` with your actual `bg-maxx-bg0` class.
    <div className="min-h-screen bg-[#09090b] pt-[100px] pb-24 text-white font-sans selection:bg-purple-500/30">
      
      {/* Container perfectly matches your Navigation max-w-7xl */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ═══ LEFT COLUMN: NAVIGATION BENTO ════════════════ */}
        <div className="hidden lg:flex flex-col gap-4 lg:col-span-3 sticky top-[100px]">
          
          {/* Main Filters */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-3 backdrop-blur-md">
            <button
              onClick={() => setActiveFilter("all")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeFilter === "all"
                  ? "bg-white/[0.08] text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Globe className="w-5 h-5" />
              Global Stream
            </button>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all mt-1"
            >
              <TrendingUp className="w-5 h-5" />
              Top Trending
            </button>
          </div>

          {/* Clans Bento */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-5 backdrop-blur-md">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 px-1">
              Factions
            </h3>
            <div className="space-y-1">
              {CLANS.map((clan) => {
                const Icon = clan.icon;
                const active = activeFilter === clan.id;
                return (
                  <button
                    key={clan.id}
                    onClick={() => setActiveFilter(clan.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all group ${
                      active ? "bg-white/[0.06] text-white" : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg transition-colors ${active ? clan.bg : "bg-white/[0.05] group-hover:bg-white/[0.1]"}`}>
                        <Icon className={`w-4 h-4 ${active ? "text-white" : clan.color}`} />
                      </div>
                      <span className="font-semibold">{clan.name}</span>
                    </div>
                    {/* Glowing dot for active state */}
                    {active && <div className={`w-2 h-2 rounded-full ${clan.bg} shadow-[0_0_8px_currentColor]`} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>


        {/* ═══ MIDDLE COLUMN: FEED ═════════════════════════ */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          {/* Bento Composer */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-4 backdrop-blur-md relative overflow-hidden group focus-within:border-purple-500/30 focus-within:shadow-[0_0_30px_rgba(168,85,247,0.05)] transition-all duration-300">
            {/* Subtle glow orb inside composer */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px] pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity" />
            
            <div className="flex gap-4 items-start relative z-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                Y
              </div>
              <div className="flex-1 pt-1">
                <textarea
                  ref={taRef}
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  placeholder="Share your pain with the syndicate..."
                  className="w-full bg-transparent border-none text-base resize-none text-white placeholder-gray-500 focus:outline-none focus:ring-0"
                  rows={1}
                />
                
                {/* Actions Row */}
                <div className={`flex items-center justify-between mt-3 transition-opacity duration-300 ${text ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:text-purple-400 hover:bg-purple-400/10 rounded-full transition-colors">
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={submitPost}
                    disabled={!text.trim()}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all disabled:opacity-50 disabled:hover:shadow-none flex items-center gap-2"
                  >
                    <span>Post</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Stream */}
          <div className="flex flex-col gap-4">
            {displayed.length === 0 && (
              <div className="py-20 text-center text-gray-500">
                No transmissions found.
              </div>
            )}
            
            {displayed.map((post) => {
              const clan = getClan(post.clanId);
              const CIcon = clan.icon;
              const mySet = reacted[post.id] || new Set();

              return (
                <div key={post.id} className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-5 hover:bg-white/[0.03] transition-colors group relative">
                  
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${post.user.avatar} flex items-center justify-center font-bold text-sm shadow-lg`}>
                        {post.user.handle.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{post.user.handle}</span>
                          <span className={`flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-white/[0.05] ${clan.color}`}>
                            <CIcon className="w-3 h-3" />
                            {clan.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{post.time}</span>
                      </div>
                    </div>

                    <button className="text-gray-500 hover:text-white p-2 rounded-full hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <p className="text-gray-300 text-[15px] leading-relaxed mb-5 pl-[52px]">
                    {post.content}
                  </p>

                  {/* Post Footer Actions & Metrics */}
                  <div className="flex items-center justify-between pl-[52px]">
                    
                    {/* Interaction Pills */}
                    <div className="flex items-center gap-2">
                      {[
                        { key: "burn", icon: Flame, hover: "hover:text-red-400 hover:bg-red-400/10", activeText: "text-red-400", activeBg: "bg-red-400/10" },
                        { key: "boost", icon: Zap, hover: "hover:text-purple-400 hover:bg-purple-400/10", activeText: "text-purple-400", activeBg: "bg-purple-400/10" },
                        { key: "pain", icon: Skull, hover: "hover:text-pink-400 hover:bg-pink-400/10", activeText: "text-pink-400", activeBg: "bg-pink-400/10" }
                      ].map(({ key, icon: Icon, hover, activeText, activeBg }) => {
                        const active = mySet.has(key);
                        const count = post.metrics[key as keyof typeof post.metrics];
                        return (
                          <button
                            key={key}
                            onClick={() => toggle(post.id, key as any)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                              active ? `${activeText} ${activeBg}` : `text-gray-400 bg-white/[0.03] ${hover}`
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {count}
                          </button>
                        );
                      })}
                      
                      {/* Comments */}
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-400 bg-white/[0.03] hover:text-white hover:bg-white/[0.08] transition-all ml-2">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {post.comments}
                      </button>
                    </div>

                    {/* Minimal Pain Gauge */}
                    <PainGauge level={post.painLevel} colorClass={clan.color} />

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ RIGHT COLUMN: STATS BENTO ═══════════════════ */}
        <div className="hidden lg:flex flex-col gap-4 lg:col-span-3 sticky top-[100px]">
          
          {/* Global Pain Index */}
          <div className="bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/[0.05] rounded-3xl p-5 backdrop-blur-md relative overflow-hidden">
            {/* Soft decorative glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-[40px] pointer-events-none" />
            
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-pink-500" />
              Pain Index
            </h3>
            
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                84.2
              </span>
              <span className="text-sm font-semibold text-gray-500 mb-1">/ 100</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-[84%] rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Global pain threshold is critically high. Burn rates accelerated.
            </p>
          </div>

          {/* Mini Top Degens */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-5 backdrop-blur-md">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              Top Degens
            </h3>
            <div className="space-y-4">
              {[
                { name: "0xReaper", score: "14.2K", color: "text-pink-400" },
                { name: "InfernoMaxx", score: "9.8K", color: "text-red-400" },
                { name: "Voltage_X", score: "7.1K", color: "text-purple-400" },
              ].map((user, i) => (
                <div key={user.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-600">{i + 1}</span>
                    <span className="text-sm font-semibold text-gray-200">{user.name}</span>
                  </div>
                  <span className={`text-xs font-bold ${user.color}`}>{user.score}</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
