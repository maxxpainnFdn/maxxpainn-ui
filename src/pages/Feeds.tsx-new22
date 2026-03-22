// pages/FeedPage.tsx

import React, { useState, useRef } from 'react';
import {
  Flame, TrendingUp, Clock, MessageSquare, Heart,
  Share2, Bookmark, MoreHorizontal, Plus, Image,
  Zap, Users, Award, ArrowUp, Eye, Play, X,
  ChevronLeft, ChevronRight, Send, Sparkles,
  Globe, Shield, Swords, BarChart3, Volume2
} from 'lucide-react';

/* ─── types ─── */
interface StoryBubble {
  id: string;
  name: string;
  avatar: string;
  ring: 'violet' | 'pink' | 'green' | 'yellow';
  seen?: boolean;
}

interface FeedPost {
  id: string;
  author: { name: string; tag: string; avatar: string; verified: boolean };
  content: string;
  category: 'discussion' | 'media' | 'alpha' | 'clan' | 'governance';
  media?: 'image' | 'video';
  timestamp: string;
  stats: { likes: number; comments: number; views: number };
  liked?: boolean;
  pinned?: boolean;
  size?: 'tall' | 'wide' | 'normal';
}

interface ActivityTick {
  id: string;
  text: string;
  icon: React.ElementType;
  color: string;
}

/* ─── palette map for categories ─── */
const CATEGORY_STYLES: Record<string, { border: string; badge: string; bg: string; text: string; icon: React.ElementType }> = {
  discussion:  { border: 'border-maxx-violet/30', badge: 'bg-maxx-violet/15 text-maxx-violet', bg: 'from-maxx-violet/10', text: 'text-maxx-violet', icon: MessageSquare },
  media:       { border: 'border-maxx-pink/30',   badge: 'bg-maxx-pink/15 text-maxx-pink',     bg: 'from-maxx-pink/10',   text: 'text-maxx-pink',   icon: Play           },
  alpha:       { border: 'border-maxx-green/30',   badge: 'bg-maxx-green/15 text-maxx-green',   bg: 'from-maxx-green/10',  text: 'text-maxx-green',  icon: TrendingUp     },
  clan:        { border: 'border-maxx-yellow/30',  badge: 'bg-maxx-yellow/15 text-maxx-yellow', bg: 'from-maxx-yellow/10', text: 'text-maxx-yellow', icon: Swords         },
  governance:  { border: 'border-maxx-bright/30',  badge: 'bg-maxx-bright/15 text-maxx-bright', bg: 'from-maxx-bright/10', text: 'text-maxx-bright', icon: Shield          },
};

/* ─── mock data ─── */
const STORIES: StoryBubble[] = [
  { id: 's1', name: 'VoltRunner',   avatar: '⚡', ring: 'violet' },
  { id: 's2', name: 'NeonWraith',   avatar: '👻', ring: 'pink'   },
  { id: 's3', name: 'GlitchQueen',  avatar: '👑', ring: 'yellow' },
  { id: 's4', name: 'CipherNode',   avatar: '🔐', ring: 'green'  },
  { id: 's5', name: 'PixelSage',    avatar: '🧠', ring: 'violet' },
  { id: 's6', name: 'HexPhantom',   avatar: '🎭', ring: 'pink'   },
  { id: 's7', name: 'ByteWitch',    avatar: '🔮', ring: 'green',  seen: true },
  { id: 's8', name: 'RustLord',     avatar: '⚔️', ring: 'yellow', seen: true },
  { id: 's9', name: 'VoidWalker',   avatar: '🌀', ring: 'violet', seen: true },
];

const ACTIVITY_TICKER: ActivityTick[] = [
  { id: 'a1', text: 'VoltRunner staked 50K $MAXX',            icon: TrendingUp,     color: 'text-maxx-green'  },
  { id: 'a2', text: 'Neon Wraiths captured Node #42',         icon: Swords,         color: 'text-maxx-pink'   },
  { id: 'a3', text: 'GlitchQueen minted MAXX #8841',          icon: Sparkles,       color: 'text-maxx-yellow' },
  { id: 'a4', text: 'Governance Proposal #17 passed',         icon: Shield,         color: 'text-maxx-violet' },
  { id: 'a5', text: 'CipherNode tipped 200 $MAXX',            icon: Zap,            color: 'text-maxx-green'  },
  { id: 'a6', text: 'Void Collective ranked #1 in warfare',   icon: Award,          color: 'text-maxx-yellow' },
];

const FEATURED_POST: FeedPost = {
  id: 'f1',
  author: { name: 'MAXXPAINN', tag: '@maxxpainn', avatar: '🔥', verified: true },
  content: 'Season 3 is LIVE. New clan warfare mechanics, cross-chain staking vaults, and the limited Obsidian NFT collection. The grind starts now — who\'s ready to dominate?',
  category: 'alpha',
  media: 'image',
  timestamp: '2h ago',
  stats: { likes: 4218, comments: 891, views: 28400 },
  pinned: true,
};

const FEED_POSTS: FeedPost[] = [
  {
    id: 'p1',
    author: { name: 'VoltRunner', tag: '@voltrunner', avatar: '⚡', verified: true },
    content: 'Broke down the new staking APY tiers. If you\'re not in the Diamond vault you\'re leaving money on the table. Thread incoming 🧵',
    category: 'alpha',
    timestamp: '18m ago',
    stats: { likes: 347, comments: 89, views: 2100 },
    size: 'normal',
  },
  {
    id: 'p2',
    author: { name: 'NeonWraith', tag: '@neonwraith', avatar: '👻', verified: true },
    content: 'Captured footage of the new clan warfare arena. The particle effects are INSANE this season.',
    category: 'media',
    media: 'video',
    timestamp: '42m ago',
    stats: { likes: 892, comments: 156, views: 5600 },
    size: 'tall',
  },
  {
    id: 'p3',
    author: { name: 'PixelSage', tag: '@pixelsage', avatar: '🧠', verified: false },
    content: 'Proposal #18 is up for vote — treasury allocation for developer grants. Read the full breakdown before you cast.',
    category: 'governance',
    timestamp: '1h ago',
    stats: { likes: 201, comments: 134, views: 1800 },
    size: 'normal',
  },
  {
    id: 'p4',
    author: { name: 'GlitchQueen', tag: '@glitchqueen', avatar: '👑', verified: true },
    content: 'Void Collective just hit 500 members. We\'re recruiting — DM for tryouts. Only the dedicated survive.',
    category: 'clan',
    timestamp: '1h ago',
    stats: { likes: 534, comments: 201, views: 3200 },
    size: 'normal',
  },
  {
    id: 'p5',
    author: { name: 'CipherNode', tag: '@ciphernode', avatar: '🔐', verified: true },
    content: 'The tokenomics flywheel is working exactly as designed. Burn rate up 34% this week, supply tightening. Chart is about to get very interesting.',
    category: 'alpha',
    timestamp: '2h ago',
    stats: { likes: 761, comments: 203, views: 4100 },
    size: 'normal',
  },
  {
    id: 'p6',
    author: { name: 'HexPhantom', tag: '@hexphantom', avatar: '🎭', verified: false },
    content: 'New meme format just dropped. The MAXX community never misses. 😂',
    category: 'media',
    media: 'image',
    timestamp: '3h ago',
    stats: { likes: 1243, comments: 312, views: 8900 },
    size: 'tall',
  },
  {
    id: 'p7',
    author: { name: 'ByteWitch', tag: '@bytewitch', avatar: '🔮', verified: true },
    content: 'Anyone else think the next epoch rewards should be weighted toward smaller stakers? Decentralization matters. Let\'s discuss.',
    category: 'discussion',
    timestamp: '3h ago',
    stats: { likes: 189, comments: 267, views: 1400 },
    size: 'normal',
  },
  {
    id: 'p8',
    author: { name: 'RustLord', tag: '@rustlord', avatar: '⚔️', verified: true },
    content: 'Phantom Circuit vs Iron Vanguard — warfare match in 30 mins. Pulling up the stream. Who you got?',
    category: 'clan',
    media: 'video',
    timestamp: '4h ago',
    stats: { likes: 678, comments: 445, views: 6200 },
    size: 'tall',
  },
];

/* ─── helpers ─── */
function shortNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

const RING_MAP: Record<string, string> = {
  violet: 'from-maxx-violet to-maxx-pink',
  pink:   'from-maxx-pink to-maxx-violet',
  green:  'from-maxx-green to-maxx-violet',
  yellow: 'from-maxx-yellow to-maxx-pink',
};

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
export default function FeedPage() {
  const [composerOpen, setComposerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-maxx-bg0 text-maxx-white relative">

      {/* ── Live activity ticker ── */}
      <ActivityMarquee items={ACTIVITY_TICKER} />

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-28 pb-32">

        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.25em] uppercase text-maxx-violet mb-1">
              Community
            </p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
              Feed
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-maxx-bg1/60 border border-maxx-border/50 rounded-full px-4 py-2">
              <Globe className="w-3.5 h-3.5 text-maxx-green" />
              <span className="text-xs font-bold text-maxx-bright">1,247 online</span>
            </div>
            <button className="w-10 h-10 rounded-full bg-maxx-bg1 border border-maxx-border flex items-center justify-center text-maxx-muted hover:text-maxx-bright hover:border-maxx-bright/30 transition-all cursor-pointer">
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Stories row ── */}
        <StoriesRow stories={STORIES} />

        {/* ── Featured hero card ── */}
        <FeaturedCard post={FEATURED_POST} />

        {/* ── Masonry grid ── */}
        <MasonryGrid posts={FEED_POSTS} />
      </div>

      {/* ── Floating compose FAB ── */}
      <FloatingComposer open={composerOpen} onToggle={() => setComposerOpen((p) => !p)} />
    </div>
  );
}

/* ══════════════════════════════════════════════
   ACTIVITY MARQUEE
   ══════════════════════════════════════════════ */
function ActivityMarquee({ items }: { items: ActivityTick[] }) {
  const doubled = [...items, ...items];

  return (
    <div className="fixed top-16 left-0 right-0 z-30 bg-maxx-bg1/80 backdrop-blur-md border-b border-maxx-border/30 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-2">
        {doubled.map((item, i) => {
          const Icon = item.icon;
          return (
            <span key={`${item.id}-${i}`} className="inline-flex items-center gap-1.5 mx-6 text-xs">
              <Icon className={`w-3 h-3 ${item.color}`} />
              <span className="text-maxx-muted font-medium">{item.text}</span>
            </span>
          );
        })}
      </div>

      {/* Inject the keyframes */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════
   STORIES ROW
   ══════════════════════════════════════════════ */
function StoriesRow({ stories }: { stories: StoryBubble[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  return (
    <div className="relative mb-8 group/stories">
      {/* Arrows */}
      <button
        onClick={() => scroll('left')}
        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-maxx-bg1 border border-maxx-border flex items-center justify-center text-maxx-muted hover:text-maxx-bright opacity-0 group-hover/stories:opacity-100 transition-all cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-maxx-bg1 border border-maxx-border flex items-center justify-center text-maxx-muted hover:text-maxx-bright opacity-0 group-hover/stories:opacity-100 transition-all cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide py-1 px-1">
        {/* Add story */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-maxx-border flex items-center justify-center hover:border-maxx-violet hover:bg-maxx-violet/5 transition-all cursor-pointer">
            <Plus className="w-5 h-5 text-maxx-muted" />
          </div>
          <span className="text-[0.6rem] font-semibold text-maxx-muted">Your Story</span>
        </div>

        {stories.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group/bubble">
            <div className={`w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-br ${RING_MAP[s.ring]} ${s.seen ? 'opacity-40' : ''}`}>
              <div className="w-full h-full rounded-full bg-maxx-bg0 flex items-center justify-center text-xl group-hover/bubble:scale-105 transition-transform">
                {s.avatar}
              </div>
            </div>
            <span className={`text-[0.6rem] font-semibold truncate max-w-[64px] text-center ${s.seen ? 'text-maxx-muted/50' : 'text-maxx-bright'}`}>
              {s.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   FEATURED CARD
   ══════════════════════════════════════════════ */
function FeaturedCard({ post }: { post: FeedPost }) {
  const cat = CATEGORY_STYLES[post.category];

  return (
    <div className="relative rounded-3xl overflow-hidden mb-8 group cursor-pointer">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-maxx-violet/20 via-maxx-pink/10 to-maxx-bg1" />
      <div className="absolute inset-0 bg-gradient-to-t from-maxx-bg0 via-maxx-bg0/60 to-transparent" />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />

      <div className="relative z-10 p-6 sm:p-8 min-h-[280px] flex flex-col justify-end">
        {/* Pinned badge */}
        <div className="absolute top-5 left-5 flex items-center gap-2">
          <span className="flex items-center gap-1.5 bg-maxx-violet/20 border border-maxx-violet/30 backdrop-blur-sm rounded-full px-3 py-1.5 text-[0.65rem] font-bold tracking-widest uppercase text-maxx-violet">
            <Flame className="w-3 h-3" />
            Pinned
          </span>
          <span className={`flex items-center gap-1.5 ${cat.badge} backdrop-blur-sm rounded-full px-3 py-1.5 text-[0.65rem] font-bold tracking-widest uppercase`}>
            <cat.icon className="w-3 h-3" />
            {post.category}
          </span>
        </div>

        {/* Views counter top-right */}
        <div className="absolute top-5 right-5 flex items-center gap-1.5 text-maxx-muted/60 text-xs">
          <Eye className="w-3.5 h-3.5" />
          {shortNum(post.stats.views)} views
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-maxx-violet to-maxx-pink flex items-center justify-center text-lg font-bold ring-2 ring-maxx-bg0">
            {post.author.avatar}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-maxx-white">{post.author.name}</span>
              {post.author.verified && (
                <span className="w-4 h-4 rounded-full bg-maxx-violet flex items-center justify-center">
                  <Zap className="w-2.5 h-2.5 text-white" fill="currentColor" />
                </span>
              )}
            </div>
            <span className="text-xs text-maxx-muted">{post.author.tag} · {post.timestamp}</span>
          </div>
        </div>

        {/* Content */}
        <p className="text-base sm:text-lg font-semibold text-maxx-white leading-relaxed max-w-2xl mb-5">
          {post.content}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-maxx-pink hover:text-maxx-pink/80 transition-colors bg-transparent border-none cursor-pointer">
            <Heart className="w-5 h-5" />
            <span className="text-sm font-bold">{shortNum(post.stats.likes)}</span>
          </button>
          <button className="flex items-center gap-1.5 text-maxx-violet hover:text-maxx-violet/80 transition-colors bg-transparent border-none cursor-pointer">
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm font-bold">{shortNum(post.stats.comments)}</span>
          </button>
          <button className="flex items-center gap-1.5 text-maxx-muted hover:text-maxx-bright transition-colors bg-transparent border-none cursor-pointer">
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-bold">Share</span>
          </button>
          <div className="ml-auto">
            <button className="text-maxx-muted/40 hover:text-maxx-bright transition-colors bg-transparent border-none cursor-pointer">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MASONRY GRID
   ══════════════════════════════════════════════ */
function MasonryGrid({ posts }: { posts: FeedPost[] }) {
  // Split into two columns for masonry effect
  const left  = posts.filter((_, i) => i % 2 === 0);
  const right = posts.filter((_, i) => i % 2 !== 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-4">
        {left.map((post) => <GridCard key={post.id} post={post} />)}
      </div>
      <div className="space-y-4">
        {right.map((post) => <GridCard key={post.id} post={post} />)}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   GRID CARD
   ══════════════════════════════════════════════ */
function GridCard({ post }: { post: FeedPost }) {
  const [liked, setLiked] = useState(post.liked ?? false);
  const [likes, setLikes] = useState(post.stats.likes);
  const cat = CATEGORY_STYLES[post.category];
  const CatIcon = cat.icon;

  const toggleLike = () => {
    setLiked((p) => !p);
    setLikes((n) => (liked ? n - 1 : n + 1));
  };

  return (
    <article
      className={`
        relative rounded-2xl border overflow-hidden
        bg-maxx-bg1/30 backdrop-blur-sm
        hover:bg-maxx-bg1/50 transition-all duration-300 group/card
        ${cat.border}
      `}
    >
      {/* Top accent gradient line */}
      <div className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${cat.bg} to-transparent`} />

      {/* Media area */}
      {post.media && (
        <div className="relative h-44 bg-gradient-to-br from-maxx-bg2 via-maxx-bg1 to-maxx-bg2 flex items-center justify-center overflow-hidden">
          {/* Decorative gradient blobs */}
          <div className={`absolute inset-0 bg-gradient-to-br ${cat.bg} to-transparent opacity-40`} />

          {post.media === 'video' ? (
            <div className="relative z-10 w-12 h-12 rounded-full bg-maxx-white/10 backdrop-blur-md border border-maxx-white/20 flex items-center justify-center group-hover/card:scale-110 transition-transform">
              <Play className="w-5 h-5 text-maxx-white ml-0.5" fill="currentColor" />
            </div>
          ) : (
            <span className="relative z-10 text-maxx-muted/30 text-[0.6rem] font-bold tracking-[0.3em] uppercase">
              Media
            </span>
          )}

          {/* View count overlay */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-maxx-bg0/70 backdrop-blur-sm rounded-full px-2 py-1">
            <Eye className="w-3 h-3 text-maxx-muted" />
            <span className="text-[0.6rem] font-bold text-maxx-muted">{shortNum(post.stats.views)}</span>
          </div>
        </div>
      )}

      {/* Card body */}
      <div className="p-4">
        {/* Category chip + timestamp */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center gap-1 ${cat.badge} rounded-md px-2 py-0.5 text-[0.6rem] font-bold tracking-widest uppercase`}>
            <CatIcon className="w-2.5 h-2.5" />
            {post.category}
          </span>
          <span className="text-[0.6rem] text-maxx-muted/60 font-medium">{post.timestamp}</span>
        </div>

        {/* Author */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-maxx-bg2 border border-maxx-border/60 flex items-center justify-center text-sm shrink-0">
            {post.author.avatar}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-maxx-white truncate">{post.author.name}</span>
              {post.author.verified && (
                <Zap className="w-3 h-3 text-maxx-violet shrink-0" fill="currentColor" />
              )}
            </div>
            <span className="text-[0.6rem] text-maxx-muted">{post.author.tag}</span>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm text-maxx-bright/80 leading-relaxed mb-4">
          {post.content}
        </p>

        {/* Engagement row */}
        <div className="flex items-center gap-0.5 pt-3 border-t border-maxx-border/20">
          <button
            onClick={toggleLike}
            className={`
              flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[0.7rem] font-bold
              transition-all cursor-pointer bg-transparent border-none
              ${liked ? 'text-maxx-pink bg-maxx-pink/10' : 'text-maxx-muted hover:text-maxx-pink hover:bg-maxx-pink/5'}
            `}
          >
            <Heart className="w-3.5 h-3.5" fill={liked ? 'currentColor' : 'none'} />
            {shortNum(likes)}
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[0.7rem] font-bold text-maxx-muted hover:text-maxx-violet hover:bg-maxx-violet/5 transition-all cursor-pointer bg-transparent border-none">
            <MessageSquare className="w-3.5 h-3.5" />
            {shortNum(post.stats.comments)}
          </button>

          {!post.media && (
            <div className="flex items-center gap-1 px-2.5 py-1.5 text-[0.7rem] text-maxx-muted/40">
              <Eye className="w-3.5 h-3.5" />
              {shortNum(post.stats.views)}
            </div>
          )}

          <button className="ml-auto p-1.5 rounded-lg text-maxx-muted/30 hover:text-maxx-bright transition-colors cursor-pointer bg-transparent border-none">
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-lg text-maxx-muted/30 hover:text-maxx-violet transition-colors cursor-pointer bg-transparent border-none">
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ══════════════════════════════════════════════
   FLOATING COMPOSER
   ══════════════════════════════════════════════ */
function FloatingComposer({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const [text, setText] = useState('');

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-40 bg-maxx-bg0/60 backdrop-blur-sm" onClick={onToggle} />
      )}

      {/* Expanded composer */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100%-3rem)] max-w-md rounded-2xl bg-maxx-bg1 border border-maxx-violet/30 shadow-[0_0_40px_rgba(var(--violet-rgb),0.15)] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-maxx-border/30">
            <span className="text-xs font-bold tracking-widest uppercase text-maxx-bright">
              New Post
            </span>
            <button onClick={onToggle} className="text-maxx-muted hover:text-maxx-bright transition-colors cursor-pointer bg-transparent border-none">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's happening in the network?"
              rows={4}
              autoFocus
              className="w-full bg-transparent text-sm text-maxx-white placeholder-maxx-muted/50 resize-none outline-none leading-relaxed"
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-maxx-border/30">
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg text-maxx-muted hover:text-maxx-violet hover:bg-maxx-violet/10 transition-colors cursor-pointer bg-transparent border-none">
                  <Image className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg text-maxx-muted hover:text-maxx-violet hover:bg-maxx-violet/10 transition-colors cursor-pointer bg-transparent border-none">
                  <Zap className="w-4 h-4" />
                </button>
              </div>
              <button
                disabled={!text.trim()}
                className={`
                  flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase
                  transition-all cursor-pointer border-none
                  ${text.trim()
                    ? 'bg-gradient-to-r from-maxx-violet to-maxx-pink text-maxx-white shadow-[0_0_20px_rgba(var(--violet-rgb),0.3)]'
                    : 'bg-maxx-bg2 text-maxx-muted/40 cursor-not-allowed'
                  }
                `}
              >
                <Send className="w-3.5 h-3.5" />
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={onToggle}
        className={`
          fixed bottom-8 right-6 z-50 w-14 h-14 rounded-full
          flex items-center justify-center
          shadow-[0_0_30px_rgba(var(--violet-rgb),0.4)]
          transition-all duration-300 cursor-pointer border-none
          ${open
            ? 'bg-maxx-bg2 rotate-45 scale-90'
            : 'bg-gradient-to-br from-maxx-violet to-maxx-pink hover:scale-110 hover:shadow-[0_0_40px_rgba(var(--violet-rgb),0.6)]'
          }
        `}
      >
        <Plus className="w-6 h-6 text-maxx-white" />
      </button>
    </>
  );
}
