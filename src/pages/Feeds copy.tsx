/**
 * MAXXPAINN — Pain Feed
 *
 * Design system: maxx-* tokens, eyebrow / pill / btn-p / btn-s / card-hover classes.
 * No raw Tailwind color names. No hex codes in JSX.
 *
 * Aesthetic: homepage energy — vibrant violet/pink accents, card-based layout,
 * gradient top-accent bars, glowing CTAs. Body text stays readable (maxx-bright/mid).
 */

import React, { useState, useRef, useEffect } from "react";
import Navigation from "@/components/nav/Navigation";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import {
  Flame, Heart, Repeat2, MessageSquare, Bookmark,
  TrendingUp, Zap, Skull, Shield, Users, ArrowRight,
  Share2, MoreHorizontal, BadgeCheck, Search,
  ChevronRight, X, Send, Coins, Timer, ChevronDown,
  Trophy, Sparkles, Swords,
} from "lucide-react";
import Button from "@/components/button/Button";
import PostCard from "@/components/feeds/PostCard";
import FeedsSideStats from "@/components/feeds/FeedSideStats";
import FeedFilter from "@/components/feeds/FeedFilter";
import TrendingHashTags from "@/components/feeds/TrendingHashTags";
import TopDegens from "@/components/feeds/TopDegens";
import FeedTopMenu from "@/components/feeds/FeedTopMenu";

/* ═══════════════════════════════════════════════════════════════
   CLANS
═══════════════════════════════════════════════════════════════ */
const CLANS = [
  {
    id: "voidwalkers",
    name: "VOIDWALKERS",
    members: 512,
    accent: "violet",
    tw: { text: "text-maxx-violet", border: "border-maxx-violet/30", bg: "bg-maxx-violet/10" },
  },
  {
    id: "painisgain",
    name: "PAIN IS GAIN",
    members: 841,
    accent: "pink",
    tw: { text: "text-maxx-pink", border: "border-maxx-pink/30", bg: "bg-maxx-pink/8" },
  },
  {
    id: "degencore",
    name: "DEGENCORE",
    members: 329,
    accent: "yellow",
    tw: { text: "text-yellow-400", border: "border-yellow-400/25", bg: "bg-yellow-400/8" },
  },
  {
    id: "ironhands",
    name: "IRON HANDS",
    members: 204,
    accent: "emerald",
    tw: { text: "text-emerald-400", border: "border-emerald-400/25", bg: "bg-emerald-400/8" },
  },
];

/* ═══════════════════════════════════════════════════════════════
   SEED DATA
═══════════════════════════════════════════════════════════════ */
const SEED_POSTS = [
  {
    id: 1,
    type: "pain",
    clan: CLANS[1],
    author: { handle: "degen_rex", verified: true, rank: 420, initials: "DR" },
    ts: "2h", timeRaw: 2,
    text: "Day 1,825 of my MAXXPAINN lock. People called me insane. My financial advisor quit. My wife said choose — her or the chain.\n\nI chose both. She chose herself.\n\nThe tokens are still here. Patience is the only relationship that never betrays you.",
    mint: { amount: "247.3M", waitDays: 1825 },
    stats: { likes: 2847, reposts: 941, comments: 312, bookmarks: 1204 },
    liked: false, reposted: false, bookmarked: true,
  },
  {
    id: 2,
    type: "post",
    clan: CLANS[0],
    author: { handle: "0xwhisper", verified: true, rank: 7, initials: "0W" },
    ts: "4h", timeRaw: 4,
    text: "The NEM curve is not what you think. Everyone fixates on early rank for EAM. But the Network Effect Multiplier rewards you for every person who joins AFTER you.\n\nRank #7 + 50,000 mints after you = NEM 2.9×. Compounds on top of EAM 3.0×. Early rank × patient waiting = asymmetric reward.",
    mint: null,
    stats: { likes: 5102, reposts: 2881, comments: 847, bookmarks: 3210 },
    liked: true, reposted: false, bookmarked: false,
  },
  {
    id: 3,
    type: "pain",
    clan: CLANS[2],
    author: { handle: "patience_maxi", verified: false, rank: 1337, initials: "PM" },
    ts: "6h", timeRaw: 6,
    text: "30-day lock just expired. Final calc: 4.2M × EAM 2.1× × NEM 1.4× × LPM 1.43× = 17.6M tokens off a single month of waiting.\n\nMy degenerate hands thank my patient brain.",
    mint: { amount: "17.6M", waitDays: 30 },
    stats: { likes: 1293, reposts: 445, comments: 188, bookmarks: 672 },
    liked: false, reposted: true, bookmarked: false,
  },
  {
    id: 4,
    type: "post",
    clan: CLANS[0],
    author: { handle: "clan_voidwalker", verified: true, rank: 88, initials: "CV" },
    ts: "8h", timeRaw: 8,
    text: "VOIDWALKERS just hit 500 members. When we started it was 4 friends who got rugged together in 2022.\n\nNow we're 500 strong. Every mint through our link is another vote of defiance. The referral rewards funded two hardware wallets.\n\nVOID OR NOTHING. 🖤",
    mint: null,
    stats: { likes: 3401, reposts: 1122, comments: 560, bookmarks: 890 },
    liked: true, reposted: true, bookmarked: false,
  },
  {
    id: 5,
    type: "pain",
    clan: CLANS[1],
    author: { handle: "rug_survivor_9", verified: false, rank: 5501, initials: "RS" },
    ts: "12h", timeRaw: 12,
    text: "Got rugged 4 times before finding this protocol. Luna. FTX. Two others I won't name. Each time I swore off crypto.\n\nMAXXPAINN is the first protocol where the free mint literally cannot rug me. Worst case is zero. But the math disagrees with pessimism.",
    mint: { amount: "31.2M", waitDays: 90 },
    stats: { likes: 4820, reposts: 2100, comments: 731, bookmarks: 2450 },
    liked: false, reposted: false, bookmarked: true,
  },
  {
    id: 6,
    type: "post",
    clan: CLANS[3],
    author: { handle: "maxx_anon_42", verified: false, rank: 999, initials: "MA" },
    ts: "1d", timeRaw: 24,
    text: "Built a pain score calculator. Drop your rank in the replies and I'll run the numbers on your theoretical max reward — assuming best-case NEM and max lock.\n\nIron hands only.",
    mint: null,
    stats: { likes: 987, reposts: 341, comments: 892, bookmarks: 445 },
    liked: false, reposted: false, bookmarked: false,
  },
];

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
const fmtN   = n => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
const fmtDay = d => d >= 365 ? `${(d / 365).toFixed(1)}y` : d >= 30 ? `${Math.round(d / 30)}mo` : `${d}d`;

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════════ */

/* ── Avatar ── */
const Avatar = ({ initials, verified, clan }) => (
  <div className="relative flex-shrink-0">
    <div className={`w-10 h-10  bg-grad-btn flex items-center justify-center font-mono font-black text-sm text-maxx-white rounded-full`}>
      {initials}
    </div>
    {verified && (
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-maxx-bg1 border border-maxx-pink rounded-full flex items-center justify-center">
        <BadgeCheck className="w-2.5 h-2.5 text-maxx-pink" />
      </div>
    )}
  </div>
);


/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
const Feed = () => {
  const [posts, setPosts]     = useState(SEED_POSTS);
  const [activeClan, setClan] = useState("all");
  const [activeType, setType] = useState("all");
  const [search, setSearch]   = useState("");
  const [sortBy, setSort]     = useState("hot");
  const [compose, setCompose] = useState(false);

  const toggle = key => id => setPosts(ps => ps.map(p => p.id === id ? { ...p, [key]: !p[key] } : p));

  const filtered = [...posts]


  return (
    <>
      <Helmet>
        <title>Pain Feed — MAXXPAINN</title>
        <meta name="description" content="Community posts, pain stories, and degen dispatches from the MAXXPAINN protocol." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="relative overflow-hidden">
          {/* glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-maxx-violet rounded-full blur-[160px] opacity-[0.07]" />
            <div className="absolute top-1/2 -right-48 w-[600px] h-[600px] bg-maxx-pink rounded-full blur-[140px] opacity-[0.05]" />
          </div>

          <main className="relative pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              
              {/* header */}
              <div className="mb-6">
                <div className="eyebrow mb-3"><span className="eyebrow-dot" />Community Stories</div>
                <div className="flex items-middle justify-between gap-4">
                  <h1 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tighter leading-none">
                    <span className="text-maxx-white">THE </span>
                    <span className="bg-grad-accent bg-clip-text text-transparent">PAIN FEED</span>
                  </h1>
                  
                  <div>
                    <Button variant="primary" skewed className="shadow-[0_0_24px_rgba(255,45,120,0.2)] w-auto">
                      <Flame size={14} /> Post
                    </Button>
                  </div>
                </div>
              </div>
                            
              <div className="flex gap-8">

                {/* ── FEED COLUMN ── */}
                <div className="flex-1 min-w-0">
                  
                  {/* posts */}
                  <div className="space-y-3">
                    {filtered.length === 0 ? (
                      <div className="text-center py-20 bg-maxx-bg1/40 border border-maxx-violet/15 rounded-lg">
                        <Skull className="w-10 h-10 text-maxx-sub mx-auto mb-3" />
                        <p className="font-mono text-sm text-maxx-sub">No posts match your filter.</p>
                        <p className="font-mono text-xs text-maxx-dim mt-1">The pain is elsewhere today.</p>
                      </div>
                    ) : (
                      filtered.map(post => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onLike={toggle("liked")}
                          onRepost={toggle("reposted")}
                          onBookmark={toggle("bookmarked")}
                        />
                      ))
                    )}
                  </div>

                  {filtered.length > 0 && (
                    <div className="pt-6 flex justify-center">
                      <Button variant="secondary" className="text-sm">
                        Load more <ArrowRight size={14} />
                      </Button>
                    </div>
                  )}
                </div>

                {/* ── SIDEBAR ── */}
                <aside className="hidden md:flex md:w-64 flex-shrink-0 flex-col gap-4 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pb-4">
                  
                  <TopDegens />
                  <TrendingHashTags />                 

                  {/* CTA */}
                  <div className="bg-maxx-bg1/80 border border-maxx-pink/25 rounded-lg p-5 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-maxx-pink/60 via-maxx-violet/30 to-transparent" />
                    <Flame className="w-8 h-8 text-maxx-pink mx-auto mb-3" />
                    <p className="font-black text-maxx-white text-sm uppercase tracking-tight mb-1">Share Your Pain</p>
                    <p className="text-sm text-maxx-sub mb-4 leading-relaxed">
                      Your story might bring the next degen home.
                    </p>
                    <Button variant="primary" fullWidth skewed onClick={() => setCompose(true)} className="text-sm">
                      Post Now
                    </Button>
                  </div>

                </aside>
              </div>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Feed;
