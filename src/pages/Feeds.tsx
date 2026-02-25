/**
 * MAXXPAINN — Pain Feed
 *
 * Aesthetic: war-room dispatch terminal. Editorial 3-column layout,
 * monospace data density in sidebars, bold serif-ish card titles.
 * Full interaction states: like, repost, bookmark, compose.
 *
 * Design system: maxx-* tokens, eyebrow / pill / btn-p / btn-s classes.
 * No raw Tailwind color names. No hex codes in JSX.
 */

import React, { useState, useRef, useEffect } from "react";
import Navigation from "@/components/nav/Navigation";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import {
  Flame, Heart, Repeat2, MessageSquare, Bookmark,
  TrendingUp, Zap, Skull, Shield, Users, ArrowRight,
  Share2, MoreHorizontal, BadgeCheck, Search, Siren,
  ChevronRight, X, Send, ImagePlus, Hash, AtSign,
  Swords, Trophy, Sparkles, Clock,
} from "lucide-react";
import Button from "@/components/button/Button";

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */

const CATEGORIES = [
  { id: "all",       label: "All",          icon: Flame      },
  { id: "pain",      label: "Pain Stories", icon: Skull      },
  { id: "alpha",     label: "Alpha",        icon: Zap        },
  { id: "gains",     label: "Gains",        icon: TrendingUp },
  { id: "clan",      label: "Clan Wars",    icon: Swords     },
  { id: "community", label: "Community",    icon: Users      },
];

const INITIAL_POSTS = [
  {
    id: 1,
    category: "pain",
    categoryLabel: "PAIN STORY",
    categoryTw: "text-maxx-pink border-maxx-pink/30 bg-maxx-pink/5",
    pinned: true,
    author: { handle: "degen_rex", verified: true, rank: 420, initials: "DR", clout: 98 },
    timestamp: "2h ago",
    timeRaw: 2,
    title: "I locked for 5 years. My wife left. The tokens stayed.",
    body: "Day 1,825 of my MAXXPAINN lock. People called me insane. My financial advisor quit. My wife said choose — her or the chain. I chose both. She chose herself.\n\nThe tokens are still here. Patience is the only relationship that never betrays you. WAGMI.",
    painScore: 99,
    stats: { likes: 2847, reposts: 941, comments: 312, bookmarks: 1204 },
    liked: false, reposted: false, bookmarked: true,
    tags: ["5year", "diamondhands", "pain", "wagmi"],
  },
  {
    id: 2,
    category: "alpha",
    categoryLabel: "ALPHA DROP",
    categoryTw: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5",
    pinned: false,
    author: { handle: "0xwhisper", verified: true, rank: 7, initials: "0W", clout: 100 },
    timestamp: "4h ago",
    timeRaw: 4,
    title: "Rank #7 reporting in. The NEM curve is not what you think.",
    body: "Everyone fixates on early rank for the EAM. But the Network Effect Multiplier is the second engine nobody talks about.\n\nIf you're rank #7 and 50,000 people mint after you, NEM hits 2.9×. That compounds on top of your EAM of 3.0×. Do the math. Early rank × patient waiting = asymmetric reward. This is not financial advice. This is mathematics.",
    painScore: 72,
    stats: { likes: 5102, reposts: 2881, comments: 847, bookmarks: 3210 },
    liked: true, reposted: false, bookmarked: false,
    tags: ["nem", "alpha", "strategy", "math"],
  },
  {
    id: 3,
    category: "gains",
    categoryLabel: "GAINS LOG",
    categoryTw: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
    pinned: false,
    author: { handle: "patience_maxi", verified: false, rank: 1337, initials: "PM", clout: 61 },
    timestamp: "6h ago",
    timeRaw: 6,
    title: "30-day lock expired. The multiplier math hit different.",
    body: "Entered at rank 1337. Locked 30 days. Final calc:\n\nBaseReward 4.2M × EAM 2.1× × NEM 1.4× × LPM 1.43× = 17.6M tokens.\n\nOff a 30-day lock. My degenerate hands thank my patient brain.",
    painScore: 44,
    stats: { likes: 1293, reposts: 445, comments: 188, bookmarks: 672 },
    liked: false, reposted: true, bookmarked: false,
    tags: ["gains", "30days", "math", "lpm"],
  },
  {
    id: 4,
    category: "clan",
    categoryLabel: "CLAN WARS",
    categoryTw: "text-maxx-violet border-maxx-violet/30 bg-maxx-violet/5",
    pinned: false,
    author: { handle: "clan_voidwalker", verified: true, rank: 88, initials: "CV", clout: 87 },
    timestamp: "8h ago",
    timeRaw: 8,
    title: "VOIDWALKERS just hit 500 members. We're coming for the leaderboard.",
    body: "When we started this clan 3 weeks ago it was 4 friends who got rugged together in 2022.\n\nNow we're 500 strong. Every mint through our link is another vote of defiance. The referral rewards funded two hardware wallets. We build in public. We bleed in public.\n\nVOID OR NOTHING. 🖤",
    painScore: 61,
    stats: { likes: 3401, reposts: 1122, comments: 560, bookmarks: 890 },
    liked: true, reposted: true, bookmarked: false,
    tags: ["clan", "voidwalkers", "community"],
  },
  {
    id: 5,
    category: "pain",
    categoryLabel: "PAIN STORY",
    categoryTw: "text-maxx-pink border-maxx-pink/30 bg-maxx-pink/5",
    pinned: false,
    author: { handle: "rug_survivor_9", verified: false, rank: 5501, initials: "RS", clout: 74 },
    timestamp: "12h ago",
    timeRaw: 12,
    title: "Got rugged 4 times before MAXXPAINN. Here's what's different.",
    body: "Luna. FTX. Two mid-caps I won't name. Each time I swore off crypto.\n\nBut MAXXPAINN is the first protocol where the free mint literally cannot rug me — there's nothing to rug. Worst case is zero. But so far the math disagrees with pessimism.",
    painScore: 88,
    stats: { likes: 4820, reposts: 2100, comments: 731, bookmarks: 2450 },
    liked: false, reposted: false, bookmarked: true,
    tags: ["rugpull", "recovery", "nfa"],
  },
  {
    id: 6,
    category: "community",
    categoryLabel: "COMMUNITY",
    categoryTw: "text-cyan-400 border-cyan-400/30 bg-cyan-400/5",
    pinned: false,
    author: { handle: "maxx_anon_42", verified: false, rank: 999, initials: "MA", clout: 45 },
    timestamp: "1d ago",
    timeRaw: 24,
    title: "Built a pain score calculator. Drop your rank and I'll run the numbers.",
    body: "Quick tool to estimate max theoretical rewards given any rank — assuming best-case NEM (global rank 10M), max lock (5 years), rank < 1M.\n\nReply with your rank. I'll post results in the thread.",
    painScore: 30,
    stats: { likes: 987, reposts: 341, comments: 892, bookmarks: 445 },
    liked: false, reposted: false, bookmarked: false,
    tags: ["tools", "calculator", "community"],
  },
];

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════════ */

/* ── Pain score bar ── */
const PainBar = ({ score }) => {
  const gradient = score >= 80
    ? "from-maxx-pink to-maxx-pinkDk"
    : score >= 50
    ? "from-maxx-violet to-maxx-pink"
    : "from-maxx-violet/60 to-maxx-violetLt";
  return (
    <div className="flex items-center gap-2.5 w-full">
      <span className="font-mono text-[0.58rem] tracking-widest uppercase text-maxx-dim shrink-0">PAIN</span>
      <div className="flex-1 h-[3px] bg-maxx-violet/10 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${gradient} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="font-mono text-[0.65rem] font-black text-maxx-mid shrink-0">{score}</span>
    </div>
  );
};

/* ── Avatar ── */
const Avatar = ({ initials, verified, size = "md" }) => {
  const s = size === "sm"
    ? "w-8 h-8 text-xs"
    : size === "lg"
    ? "w-14 h-14 text-base"
    : "w-10 h-10 text-sm";
  return (
    <div className="relative flex-shrink-0">
      <div className={`${s} rounded-lg bg-gradient-to-br from-maxx-violet/30 to-maxx-pink/20 border border-maxx-violet/30 flex items-center justify-center font-mono font-black text-maxx-violetLt clip-edges`}>
        {initials}
      </div>
      {verified && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-background border border-maxx-pink rounded-full flex items-center justify-center">
          <BadgeCheck className="w-2.5 h-2.5 text-maxx-pink" />
        </div>
      )}
    </div>
  );
};

/* ── Interaction button ── */
const ActionBtn = ({ icon: Icon, count, active, activeCls, onClick, label }) => {
  const [pop, setPop] = useState(false);
  const handleClick = () => {
    setPop(true);
    setTimeout(() => setPop(false), 300);
    onClick();
  };
  return (
    <button
      onClick={handleClick}
      aria-label={label}
      className={`flex items-center gap-1.5 font-mono text-[0.7rem] tracking-wide transition-all duration-200 group
        ${active ? activeCls : "text-maxx-sub hover:text-maxx-bright"}
        ${pop ? "scale-125" : "hover:scale-110"}`}
    >
      <Icon className={`w-3.5 h-3.5 transition-transform ${pop ? "scale-125" : "group-hover:scale-110"}`}
        fill={active && label === "Like" ? "currentColor" : "none"}
        strokeWidth={active && label === "Like" ? 0 : 2}
      />
      <span>{count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count}</span>
    </button>
  );
};

/* ── Post card ── */
const PostCard = ({ post, onLike, onRepost, onBookmark }) => {
  const [expanded, setExpanded] = useState(false);
  const lines = post.body.split("\n").filter(Boolean);
  const preview = lines.slice(0, 2).join(" ");
  const hasMore = lines.length > 2;

  return (
    <article
      className={`group relative bg-maxx-bg1/80 border rounded-lg overflow-hidden transition-all duration-300
        ${post.pinned
          ? "border-maxx-pink/35 shadow-lg shadow-maxx-pink/5"
          : "border-maxx-violet/20 hover:border-maxx-violet/35"}`}
    >
      {/* top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${
        post.pinned
          ? "bg-gradient-to-r from-maxx-pink via-maxx-violet to-transparent"
          : "bg-gradient-to-r from-maxx-violet/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      }`} />

      {/* trending badge */}
      {post.pinned && (
        <div className="absolute top-3.5 right-4">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-maxx-pink/10 border border-maxx-pink/25 rounded-full">
            <Siren className="w-2.5 h-2.5 text-maxx-pink" />
            <span className="font-mono text-[0.58rem] tracking-widest uppercase text-maxx-pink">HOT</span>
          </div>
        </div>
      )}

      <div className="p-5 md:p-6">

        {/* ── author row ── */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar initials={post.author.initials} verified={post.author.verified} />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="font-mono font-black text-sm text-maxx-white">@{post.author.handle}</span>
              <span className="pill text-[0.6rem] py-0.5">Rank #{post.author.rank.toLocaleString()}</span>
              <span className={`font-mono text-[0.6rem] tracking-widest uppercase px-2 py-0.5 rounded-full border ${post.categoryTw}`}>
                {post.categoryLabel}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Clock className="w-2.5 h-2.5 text-maxx-dim" />
              <span className="font-mono text-[0.65rem] text-maxx-dim">{post.timestamp}</span>
            </div>
          </div>
          <button className="text-maxx-dim hover:text-maxx-sub transition-colors mt-0.5">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* ── title ── */}
        <h2 className="font-black text-maxx-white text-[1.08rem] leading-[1.3] mb-3 tracking-tight cursor-pointer hover:text-maxx-violetLt transition-colors duration-200">
          {post.title}
        </h2>

        {/* ── body ── */}
        <div className="text-sm text-maxx-mid leading-[1.8] mb-4">
          {expanded
            ? lines.map((l, i) => <p key={i} className={i > 0 ? "mt-2" : ""}>{l}</p>)
            : <p>{preview}{hasMore && !expanded ? "…" : ""}</p>
          }
          {hasMore && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="font-mono text-[0.7rem] text-maxx-violet hover:text-maxx-violetLt mt-1.5 block transition-colors"
            >
              {expanded ? "Show less" : "Read full dispatch →"}
            </button>
          )}
        </div>

        {/* ── pain bar ── */}
        <div className="mb-4">
          <PainBar score={post.painScore} />
        </div>

        {/* ── tags ── */}
        <div className="flex flex-wrap gap-2 mb-5">
          {post.tags.map(tag => (
            <span key={tag} className="font-mono text-[0.65rem] text-maxx-sub hover:text-maxx-violet cursor-pointer transition-colors">
              #{tag}
            </span>
          ))}
        </div>

        {/* ── action bar ── */}
        <div className="flex items-center justify-between pt-4 border-t border-maxx-violet/10">
          <div className="flex items-center gap-5">
            <ActionBtn
              icon={Heart} label="Like"
              count={post.stats.likes + (post.liked ? 1 : 0)}
              active={post.liked} activeCls="text-maxx-pink"
              onClick={() => onLike(post.id)}
            />
            <ActionBtn
              icon={Repeat2} label="Repost"
              count={post.stats.reposts + (post.reposted ? 1 : 0)}
              active={post.reposted} activeCls="text-emerald-400"
              onClick={() => onRepost(post.id)}
            />
            <ActionBtn
              icon={MessageSquare} label="Comment"
              count={post.stats.comments}
              active={false} activeCls=""
              onClick={() => {}}
            />
          </div>
          <div className="flex items-center gap-4">
            <ActionBtn
              icon={Bookmark} label="Bookmark"
              count={post.stats.bookmarks}
              active={post.bookmarked} activeCls="text-maxx-violet"
              onClick={() => onBookmark(post.id)}
            />
            <button className="text-maxx-sub hover:text-maxx-bright transition-colors">
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

/* ── Compose Modal ── */
const ComposeModal = ({ onClose, onSubmit }) => {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("pain");
  const taRef = useRef(null);

  useEffect(() => { taRef.current?.focus(); }, []);

  const handleSubmit = () => {
    if (!title.trim() || !text.trim()) return;
    onSubmit({ title, body: text, category });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-maxx-bg0/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-maxx-bg1 border border-maxx-violet/30 rounded-lg shadow-2xl shadow-maxx-violet/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-maxx-violet via-maxx-pink to-transparent" />

        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-maxx-violet/15">
          <div className="eyebrow"><span className="eyebrow-dot" />New Dispatch</div>
          <button onClick={onClose} className="text-maxx-sub hover:text-maxx-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* category select */}
        <div className="flex gap-2 px-5 pt-4 overflow-x-auto nav-scroll-container pb-0">
          {CATEGORIES.filter(c => c.id !== "all").map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCategory(id)}
              className={`flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full font-mono text-[0.65rem] tracking-wider uppercase transition-all border ${
                category === id
                  ? "bg-maxx-violet/20 border-maxx-violet/50 text-maxx-white"
                  : "border-maxx-violet/15 text-maxx-sub hover:text-maxx-bright"
              }`}
            >
              <Icon className="w-3 h-3" />{label}
            </button>
          ))}
        </div>

        {/* inputs */}
        <div className="p-5 space-y-3">
          <input
            type="text"
            placeholder="Dispatch headline..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-maxx-bg0/80 border border-maxx-violet/20 rounded-lg text-maxx-white font-black text-base placeholder:text-maxx-dim focus:outline-none focus:border-maxx-violet/50 transition-colors"
          />
          <textarea
            ref={taRef}
            rows={5}
            placeholder="Share your pain. The community is listening..."
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full px-4 py-3 bg-maxx-bg0/80 border border-maxx-violet/20 rounded-lg text-sm text-maxx-mid placeholder:text-maxx-dim font-mono focus:outline-none focus:border-maxx-violet/50 transition-colors resize-none leading-relaxed"
          />

          {/* toolbar */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3 text-maxx-sub">
              {[ImagePlus, Hash, AtSign].map((Icon, i) => (
                <button key={i} className="hover:text-maxx-violet transition-colors">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
              <span className={`font-mono text-[0.68rem] ml-2 ${text.length > 260 ? "text-maxx-pink" : "text-maxx-dim"}`}>
                {text.length}/280
              </span>
            </div>
            <Button
              variant="primary"
              skewed
              onClick={handleSubmit}
              className="text-xs"
            >
              <Send size={13} />
              Post Dispatch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Stat row for sidebar ── */
const WarStat = ({ label, value, bar, gradient }) => (
  <div>
    <div className="flex justify-between items-baseline mb-1.5">
      <span className="font-mono text-[0.65rem] uppercase tracking-wider text-maxx-sub">{label}</span>
      <span className="font-mono font-black text-sm text-maxx-bright">{value}</span>
    </div>
    <div className="h-[3px] w-full bg-maxx-violet/10 rounded-full overflow-hidden">
      <div className={`h-full bg-gradient-to-r ${gradient} transition-all duration-700`} style={{ width: `${bar}%` }} />
    </div>
  </div>
);

/* ── Trending tag row ── */
const TrendRow = ({ tag, posts, rank }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-maxx-violet/10 last:border-0 cursor-pointer group hover:translate-x-0.5 transition-transform duration-200">
    <div>
      <p className="font-mono text-[0.6rem] text-maxx-dim tracking-wider">#{rank} trending</p>
      <p className="font-mono font-bold text-xs text-maxx-bright group-hover:text-maxx-violetLt transition-colors">#{tag}</p>
    </div>
    <div className="text-right flex items-center gap-1.5">
      <span className="font-mono text-[0.65rem] text-maxx-sub">{posts}</span>
      <ChevronRight className="w-3 h-3 text-maxx-dim group-hover:text-maxx-violet transition-colors" />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */

const Feed = () => {
  const [posts, setPosts]           = useState(INITIAL_POSTS);
  const [activeCategory, setActive] = useState("all");
  const [search, setSearch]         = useState("");
  const [showCompose, setCompose]   = useState(false);
  const [sortBy, setSort]           = useState("hot"); // hot | new | top

  const toggleLike     = id => setPosts(ps => ps.map(p => p.id === id ? { ...p, liked:     !p.liked     } : p));
  const toggleRepost   = id => setPosts(ps => ps.map(p => p.id === id ? { ...p, reposted:  !p.reposted  } : p));
  const toggleBookmark = id => setPosts(ps => ps.map(p => p.id === id ? { ...p, bookmarked:!p.bookmarked} : p));

  const handleNewPost = ({ title, body, category }) => {
    const newPost = {
      id: Date.now(),
      category,
      categoryLabel: CATEGORIES.find(c => c.id === category)?.label.toUpperCase() || "POST",
      categoryTw: "text-maxx-violet border-maxx-violet/30 bg-maxx-violet/5",
      pinned: false,
      author: { handle: "you", verified: false, rank: 99999, initials: "ME", clout: 1 },
      timestamp: "just now",
      timeRaw: 0,
      title,
      body,
      painScore: Math.floor(Math.random() * 60) + 20,
      stats: { likes: 0, reposts: 0, comments: 0, bookmarks: 0 },
      liked: false, reposted: false, bookmarked: false,
      tags: [],
    };
    setPosts(ps => [newPost, ...ps]);
  };

  const sorted = [...posts]
    .filter(p => (activeCategory === "all" || p.category === activeCategory)
      && (!search || p.title.toLowerCase().includes(search.toLowerCase()) || p.body.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      if (sortBy === "new")  return a.timeRaw - b.timeRaw;
      if (sortBy === "top")  return (b.stats.likes + b.stats.reposts) - (a.stats.likes + a.stats.reposts);
      return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0); // hot = pinned first
    });

  return (
    <>
      <Helmet>
        <title>Pain Feed — MAXXPAINN Community Dispatches</title>
        <meta name="description" content="Read, like, and repost pain stories, alpha drops, and degen dispatches from the MAXXPAINN community." />
      </Helmet>

      {showCompose && (
        <ComposeModal onClose={() => setCompose(false)} onSubmit={handleNewPost} />
      )}

      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="relative overflow-hidden">

          {/* glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-maxx-violet rounded-full blur-[160px] opacity-[0.07]" />
            <div className="absolute top-1/2 -right-48 w-[600px] h-[600px] bg-maxx-pink rounded-full blur-[140px] opacity-[0.05]" />
          </div>

          <main className="relative pt-28 pb-24 md:pb-16">
            <div className="max-w-7xl mx-auto px-4 md:px-6">

              {/* ── PAGE HEADER ── */}
              <div className="mb-8 flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
                <div>
                  <div className="eyebrow mb-2">
                    <span className="eyebrow-dot" />
                    Community · Dispatches from the Battlefield
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                    <span className="text-maxx-white">THE </span>
                    <span className="bg-grad-accent bg-clip-text text-transparent">PAIN FEED</span>
                  </h1>
                </div>
                <Button
                  variant="primary" skewed
                  onClick={() => setCompose(true)}
                  className="shrink-0 shadow-[0_0_24px_rgba(255,45,120,0.2)]"
                >
                  <Flame size={14} />
                  Post Dispatch
                </Button>
              </div>

              {/* ── TOOLBAR: search + categories + sort ── */}
              <div className="flex flex-col gap-3 mb-8">
                {/* row 1: search + sort */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-maxx-sub pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search dispatches..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg text-sm text-maxx-bright placeholder:text-maxx-dim font-mono focus:outline-none focus:border-maxx-violet/50 transition-colors"
                    />
                  </div>
                  {/* sort buttons */}
                  <div className="flex items-center gap-1 bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-1">
                    {[
                      { id: "hot",  label: "Hot",  icon: Flame      },
                      { id: "new",  label: "New",  icon: Sparkles   },
                      { id: "top",  label: "Top",  icon: Trophy     },
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setSort(id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[0.7rem] tracking-wider uppercase transition-all duration-200 ${
                          sortBy === id
                            ? "bg-maxx-violet/20 text-maxx-white"
                            : "text-maxx-sub hover:text-maxx-bright"
                        }`}
                      >
                        <Icon className="w-3 h-3" />{label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* row 2: categories */}
                <div className="flex items-center gap-2 overflow-x-auto nav-scroll-container pb-0.5">
                  {CATEGORIES.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActive(id)}
                      className={`flex items-center gap-1.5 shrink-0 px-3.5 py-2 rounded-full font-mono text-[0.7rem] tracking-wider uppercase transition-all duration-200 border ${
                        activeCategory === id
                          ? "bg-maxx-violet/20 border-maxx-violet/50 text-maxx-white"
                          : "bg-transparent border-maxx-violet/20 text-maxx-sub hover:border-maxx-violet/40 hover:text-maxx-bright"
                      }`}
                    >
                      <Icon className="w-3 h-3" />{label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── LAYOUT ── */}
              <div className="flex flex-col xl:flex-row gap-6">

                {/* ── FEED ── */}
                <div className="flex-1 min-w-0 space-y-3">
                  {sorted.length === 0 ? (
                    <div className="text-center py-24 bg-maxx-bg1/40 border border-maxx-violet/15 rounded-lg">
                      <Skull className="w-10 h-10 text-maxx-dim mx-auto mb-4" />
                      <p className="font-mono text-maxx-sub text-sm">No dispatches match your search.</p>
                      <p className="font-mono text-maxx-dim text-xs mt-1">The pain is elsewhere today.</p>
                    </div>
                  ) : (
                    sorted.map(post => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onLike={toggleLike}
                        onRepost={toggleRepost}
                        onBookmark={toggleBookmark}
                      />
                    ))
                  )}

                  {sorted.length > 0 && (
                    <div className="pt-2 flex justify-center">
                      <Button variant="secondary" className="w-full sm:w-auto">
                        Load More Dispatches
                        <ArrowRight size={14} />
                      </Button>
                    </div>
                  )}
                </div>

                {/* ── SIDEBAR ── */}
                <aside className="xl:w-72 flex-shrink-0 space-y-4">

                  {/* war room stats */}
                  <div className="bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-maxx-violet/60 to-transparent" />
                    <div className="eyebrow mb-4"><span className="eyebrow-dot" />War Room</div>
                    <div className="space-y-4">
                      <WarStat label="Total Dispatches"  value="12,841"  bar={82} gradient="from-maxx-violet to-maxx-violetLt" />
                      <WarStat label="Active Degens"     value="3,204"   bar={54} gradient="from-maxx-pink to-maxx-pinkLt"     />
                      <WarStat label="Stories Liked"     value="847K"    bar={91} gradient="from-maxx-pink to-maxx-pinkDk"     />
                      <WarStat label="Alpha Drops Today" value="47"      bar={30} gradient="from-yellow-500 to-yellow-400"     />
                    </div>
                  </div>

                  {/* trending */}
                  <div className="bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-maxx-pink/60 to-transparent" />
                    <div className="eyebrow mb-3"><span className="eyebrow-dot" />Trending Pain</div>
                    {[
                      { tag: "5year",        posts: "2.1K" },
                      { tag: "diamondhands", posts: "1.8K" },
                      { tag: "nem",          posts: "1.4K" },
                      { tag: "clanwars",     posts: "987"  },
                      { tag: "freemint",     posts: "854"  },
                      { tag: "rugsurvivors", posts: "712"  },
                    ].map((t, i) => <TrendRow key={t.tag} {...t} rank={i + 1} />)}
                  </div>

                  {/* top degens */}
                  <div className="bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-maxx-violet/40 via-maxx-pink/30 to-transparent" />
                    <div className="eyebrow mb-4"><span className="eyebrow-dot" />Top Degens</div>
                    <div className="space-y-3">
                      {[
                        { handle: "0xwhisper",      rank: 7,    clout: 100, tw: "text-yellow-400"  },
                        { handle: "clan_voidwalker", rank: 88,   clout: 87,  tw: "text-maxx-pink"   },
                        { handle: "degen_rex",       rank: 420,  clout: 98,  tw: "text-maxx-violet" },
                        { handle: "patience_maxi",   rank: 1337, clout: 61,  tw: "text-emerald-400" },
                      ].map(({ handle, rank, clout, tw }) => (
                        <div key={handle} className="flex items-center gap-3 group cursor-pointer hover:translate-x-0.5 transition-transform duration-200">
                          <div className="w-8 h-8 rounded-lg bg-maxx-violet/15 border border-maxx-violet/25 flex items-center justify-center font-mono font-black text-xs text-maxx-violetLt clip-edges flex-shrink-0">
                            {handle.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-mono text-xs font-bold text-maxx-bright truncate group-hover:text-maxx-violetLt transition-colors">
                              @{handle}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className={`font-mono text-[0.6rem] ${tw}`}>Rank #{rank}</span>
                              <div className="flex-1 h-[2px] bg-maxx-violet/10 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-maxx-violet to-maxx-pink" style={{ width: `${clout}%` }} />
                              </div>
                            </div>
                          </div>
                          <BadgeCheck className="w-3.5 h-3.5 text-maxx-pink flex-shrink-0 opacity-80" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* post CTA */}
                  <div className="bg-maxx-bg1/80 border border-maxx-pink/25 rounded-lg p-5 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-maxx-pink/60 via-maxx-violet/30 to-transparent" />
                    <Flame className="w-8 h-8 text-maxx-pink mx-auto mb-3" />
                    <p className="font-black text-maxx-white text-sm uppercase tracking-tight mb-1">
                      Share Your Pain
                    </p>
                    <p className="text-xs text-maxx-sub mb-4 leading-relaxed">
                      Your story might be the one that brings the next degen home.
                    </p>
                    <Button variant="primary" fullWidth skewed onClick={() => setCompose(true)} className="text-xs">
                      Post Dispatch
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
