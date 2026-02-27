/**
 * MAXXPAINN — Social Feed (Infinite Glass Style)
 * 
 * A high-end, spatial layout that prioritizes content and typography.
 * Uses "Progressive Disclosure" (hiding complexity until needed)
 * and deep glassmorphism to match your existing navigation.
 */

import React, { useState } from 'react';
import { 
  Flame, 
  Zap, 
  Skull, 
  MessageSquare, 
  Share2, 
  ShieldCheck, 
  ChevronRight, 
  Plus,
  Compass,
  History,
  TrendingUp
} from 'lucide-react';

/* ── Types & Data ── */

const POSTS = [
  {
    id: 1,
    user: "0xNova",
    tag: "WHALE",
    content: "The protocol just reached $200M TVL. The burn rate is doubling tonight. Are you positioned or just watching from the sidelines? ⚡️",
    time: "4m",
    clans: ["Volt", "Inferno"],
    metrics: { burn: "1.2k", pain: "24", comments: "12" },
    verified: true
  },
  {
    id: 2,
    user: "PainMaster",
    tag: "REAPER",
    content: "Just liquidated a 50x position. The market doesn't care about your feelings, only your collateral. Sacrifice made. 💀",
    time: "18m",
    clans: ["Skull"],
    metrics: { burn: "850", pain: "98", comments: "42" },
    verified: false
  }
];

export default function GlassFeed() {
  const [activeTab, setActiveTab] = useState('Global');

  return (
    <div className="min-h-screen bg-maxx-bg0 text-maxx-white font-sans selection:bg-maxx-violet/30 pt-[80px]">
      
      {/* ── Main Layout Container ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex gap-8">
        
        {/* LEFT NAV: Minimal Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 sticky top-[100px] h-fit gap-2">
          {['Global', 'Following', 'Clans', 'Saved'].map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm tracking-wide uppercase
                ${activeTab === item 
                  ? 'bg-maxx-violet/10 text-maxx-bright border border-maxx-violet/20' 
                  : 'text-maxx-bright/50 hover:text-maxx-bright hover:bg-maxx-white/5 border border-transparent'}
              `}
            >
              {item === 'Global' && <Compass size={18} />}
              {item === 'Following' && <TrendingUp size={18} />}
              {item === 'Clans' && <ShieldCheck size={18} />}
              {item === 'Saved' && <History size={18} />}
              {item}
            </button>
          ))}
          
          <div className="mt-8 px-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-maxx-bright/30 mb-4">Trending Clans</h4>
            <div className="flex flex-col gap-3">
              {['Inferno', 'Volt', 'Skull'].map(clan => (
                <div key={clan} className="flex items-center justify-between group cursor-pointer">
                  <span className="text-xs font-bold text-maxx-bright/70 group-hover:text-maxx-pink transition-colors">#{clan}</span>
                  <span className="text-[10px] text-maxx-bright/30">2.4k post</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* CENTER FEED: The Glass Stream */}
        <main className="flex-1 max-w-2xl mx-auto">
          
          {/* Quick Post Input */}
          <div className="mb-8 p-[1px] rounded-2xl bg-gradient-to-r from-maxx-violet/20 via-maxx-pink/20 to-transparent">
            <div className="bg-maxx-bg0 rounded-[15px] p-4 flex gap-4 items-center">
              <div className="w-10 h-10 rounded-full bg-maxx-violet/20 border border-maxx-violet/30 flex items-center justify-center">
                <Plus className="text-maxx-bright" size={20} />
              </div>
              <input 
                type="text" 
                placeholder="What's the pain level today?" 
                className="bg-transparent border-none flex-1 text-maxx-bright placeholder:text-maxx-bright/30 focus:outline-none font-medium"
              />
              <button className="bg-maxx-bright text-maxx-bg0 px-4 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-tighter hover:scale-105 transition-transform">
                POST
              </button>
            </div>
          </div>

          {/* Feed List */}
          <div className="flex flex-col gap-px bg-maxx-white/5 border-x border-maxx-white/5">
            {POSTS.map((post) => (
              <article 
                key={post.id} 
                className="bg-maxx-bg0 p-6 hover:bg-maxx-white/[0.02] transition-all cursor-pointer group"
              >
                <div className="flex gap-4">
                  {/* Avatar with Status Ring */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-maxx-violet to-maxx-pink p-[2px]">
                      <div className="w-full h-full rounded-full bg-maxx-bg0 flex items-center justify-center font-black text-sm">
                        {post.user[0]}
                      </div>
                    </div>
                    {post.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-maxx-bright text-maxx-bg0 rounded-full p-0.5 border-2 border-maxx-bg0">
                        <ShieldCheck size={10} fill="currentColor" />
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm tracking-tight">{post.user}</span>
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-maxx-white/10 text-maxx-bright/60 uppercase tracking-widest">
                          {post.tag}
                        </span>
                        <span className="text-xs text-maxx-bright/30">· {post.time}</span>
                      </div>
                      <ChevronRight size={14} className="text-maxx-bright/20 group-hover:translate-x-1 transition-transform" />
                    </div>

                    <p className="text-[15px] leading-relaxed text-maxx-bright/90 mb-4">
                      {post.content}
                    </p>

                    {/* Clan Tags */}
                    <div className="flex gap-2 mb-4">
                      {post.clans.map(clan => (
                        <span key={clan} className="text-[10px] font-bold text-maxx-violet">#{clan.toUpperCase()}</span>
                      ))}
                    </div>

                    {/* Action Bar: Minimalist */}
                    <div className="flex items-center gap-6 pt-2 border-t border-maxx-white/5">
                      <button className="flex items-center gap-2 text-maxx-bright/40 hover:text-maxx-pink transition-colors">
                        <Flame size={16} />
                        <span className="text-[11px] font-bold">{post.metrics.burn}</span>
                      </button>
                      <button className="flex items-center gap-2 text-maxx-bright/40 hover:text-maxx-violet transition-colors">
                        <Skull size={16} />
                        <span className="text-[11px] font-bold">{post.metrics.pain}%</span>
                      </button>
                      <button className="flex items-center gap-2 text-maxx-bright/40 hover:text-maxx-bright transition-colors">
                        <MessageSquare size={16} />
                        <span className="text-[11px] font-bold">{post.metrics.comments}</span>
                      </button>
                      <button className="ml-auto text-maxx-bright/20 hover:text-maxx-bright transition-colors">
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>

        {/* RIGHT PANEL: Live Stats */}
        <aside className="hidden xl:flex flex-col w-72 sticky top-[100px] h-fit gap-6">
          <div className="bg-maxx-white/[0.03] border border-maxx-white/5 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={14} className="text-maxx-pink" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-maxx-bright/50">Live Analytics</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[11px] mb-1.5 font-bold">
                  <span className="text-maxx-bright/40">TOTAL BURN</span>
                  <span className="text-maxx-pink">4,209.1 MAXX</span>
                </div>
                <div className="h-1 bg-maxx-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-maxx-pink w-[65%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1.5 font-bold">
                  <span className="text-maxx-bright/40">SYSTEM PAIN</span>
                  <span className="text-maxx-violet">88%</span>
                </div>
                <div className="h-1 bg-maxx-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-maxx-violet w-[88%]" />
                </div>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
