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
    <div className={`w-10 h-10 rounded-lg bg-grad-btn flex items-center justify-center font-mono font-black text-sm text-maxx-white clip-edges`}>
      {initials}
    </div>
    {verified && (
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-maxx-bg1 border border-maxx-pink rounded-full flex items-center justify-center">
        <BadgeCheck className="w-2.5 h-2.5 text-maxx-pink" />
      </div>
    )}
  </div>
);

/* ── Clan badge ── */
const ClanBadge = ({ clan }) => (
  <span className={`inline-flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase px-2.5 py-1 rounded-full border font-bold ${clan.tw.text} ${clan.tw.border} ${clan.tw.bg}`}>
    <Shield className="w-3 h-3" />
    {clan.name}
  </span>
);

/* ── Mint chips — pain stories only ── */
const MintChips = ({ amount, waitDays }) => (
  <div className="flex gap-2 flex-wrap">
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-maxx-pink/30 bg-maxx-pink/8 font-mono text-xs text-maxx-pinkLt font-bold">
      <Coins className="w-3.5 h-3.5 text-maxx-pink" />
      {amount} minted
    </div>
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-maxx-violet/30 bg-maxx-violet/10 font-mono text-xs text-maxx-violetLt font-bold">
      <Timer className="w-3.5 h-3.5 text-maxx-violet" />
      {fmtDay(waitDays)} wait
    </div>
  </div>
);

/* ── Action button ── */
const ActBtn = ({ icon: Icon, count, active, activeCls, onClick, filled }) => {
  const [pop, setPop] = useState(false);
  const go = () => { setPop(true); setTimeout(() => setPop(false), 220); onClick(); };
  return (
    <button
      onClick={go}
      className={`flex items-center gap-1.5 font-mono text-xs transition-all duration-150
        ${active ? activeCls : "text-maxx-sub hover:text-maxx-bright"}
        ${pop ? "scale-125" : "hover:scale-110"}`}
    >
      <Icon
        className="w-3.5 h-3.5"
        fill={filled && active ? "currentColor" : "none"}
        strokeWidth={filled && active ? 0 : 1.8}
      />
      {count !== undefined && <span>{fmtN(count)}</span>}
    </button>
  );
};

/* ── Post card ── */
const PostCard = ({ post, onLike, onRepost, onBookmark }) => {
  const [expanded, setExpanded] = useState(false);
  const paras = post.text.split("\n").filter(Boolean);
  const isLong = paras.length > 3 || post.text.length > 280;

  return (
    <article className="group relative bg-maxx-bg1/80 border border-maxx-violet/15 rounded-lg overflow-hidden hover:border-maxx-violet/35 transition-all duration-300">
      {/* top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet/60 via-maxx-pink/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5 flex gap-3">

        {/* avatar col */}
        <div className="flex flex-col items-center flex-shrink-0">
          <Avatar initials={post.author.initials} verified={post.author.verified} />
          <div className="flex-1 w-px bg-maxx-violet/15 mt-3 min-h-[16px]" />
        </div>

        {/* content */}
        <div className="flex-1 min-w-0">

          {/* author row */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mb-2.5">
            <span className="font-sans font-bold text-base text-maxx-white">
              @{post.author.handle}
            </span>
            <span className="pill">Rank #{post.author.rank.toLocaleString()}</span>
            <span className="text-maxx-sub text-sm">·</span>
            <span className="font-mono text-xs text-maxx-sub">{post.ts}</span>
            <div className="ml-auto">
              <button className="text-maxx-sub/50 hover:text-maxx-mid transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* clan */}
          <div className="mb-3">
            <ClanBadge clan={post.clan} />
          </div>

          {/* body text */}
          <div className="text-sm text-maxx-bright leading-relaxed font-sans mb-3">
            {(expanded ? paras : paras.slice(0, 3)).map((p, i) => (
              <p key={i} className={i > 0 ? "mt-2" : ""}>{p}</p>
            ))}
            {isLong && (
              <button
                onClick={() => setExpanded(e => !e)}
                className="font-mono text-xs text-maxx-violet hover:text-maxx-violetLt mt-2 block transition-colors"
              >
                {expanded ? "Show less" : "Show more →"}
              </button>
            )}
          </div>

          {/* mint chips */}
          {post.mint && (
            <div className="mb-4">
              <MintChips amount={post.mint.amount} waitDays={post.mint.waitDays} />
            </div>
          )}

          {/* actions */}
          <div className="flex items-center justify-between pt-3 border-t border-maxx-violet/10">
            <div className="flex items-center gap-5">
              <ActBtn icon={MessageSquare} count={post.stats.comments}
                active={false} activeCls="" onClick={() => {}} />
              <ActBtn icon={Repeat2}
                count={post.stats.reposts + (post.reposted ? 1 : 0)}
                active={post.reposted} activeCls="text-emerald-400"
                onClick={() => onRepost(post.id)} />
              <ActBtn icon={Heart}
                count={post.stats.likes + (post.liked ? 1 : 0)}
                active={post.liked} activeCls="text-maxx-pink"
                filled onClick={() => onLike(post.id)} />
            </div>
            <div className="flex items-center gap-4">
              <ActBtn icon={Bookmark}
                count={post.stats.bookmarks}
                active={post.bookmarked} activeCls="text-maxx-violet"
                filled onClick={() => onBookmark(post.id)} />
              <button className="text-maxx-sub/60 hover:text-maxx-bright transition-colors">
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

/* ── Compose modal ── */
const ComposeModal = ({ onClose, onSubmit }) => {
  const [text, setText]     = useState("");
  const [clan, setClan]     = useState(CLANS[0]);
  const [type, setType]     = useState("post");
  const [amount, setAmount] = useState("");
  const [waitDays, setWait] = useState("");
  const [clanOpen, setOpen] = useState(false);
  const taRef = useRef(null);
  useEffect(() => taRef.current?.focus(), []);

  const chars  = text.length;
  const submit = () => {
    if (!text.trim() || chars > 280) return;
    onSubmit({ text, clan, type, mint: type === "pain" && amount ? { amount, waitDays: parseInt(waitDays) || 0 } : null });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-maxx-bg0/85 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-maxx-bg1 border border-maxx-violet/25 rounded-lg shadow-2xl shadow-maxx-violet/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-maxx-violet via-maxx-pink to-transparent" />

        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-maxx-violet/15">
          <span className="eyebrow"><span className="eyebrow-dot" />New Post</span>
          <button onClick={onClose} className="text-maxx-sub hover:text-maxx-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 flex gap-3">
          <Avatar initials="ME" verified={false} />

          <div className="flex-1 min-w-0 flex flex-col gap-3">

            {/* clan picker */}
            <div className="relative">
              <button
                onClick={() => setOpen(o => !o)}
                className={`inline-flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase px-3 py-1.5 rounded-full border font-bold transition-colors cursor-pointer ${clan.tw.text} ${clan.tw.border} ${clan.tw.bg}`}
              >
                <Shield className="w-3 h-3" />
                {clan.name}
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
              {clanOpen && (
                <div className="absolute top-full mt-1.5 left-0 z-10 bg-maxx-bg1 border border-maxx-violet/25 rounded-lg min-w-[220px] overflow-hidden shadow-xl shadow-maxx-violet/10">
                  {CLANS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { setClan(c); setOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-maxx-violet/8 transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full ${c.tw.bg} border ${c.tw.border}`} />
                      <span className={`font-mono text-xs font-bold ${c.tw.text}`}>{c.name}</span>
                      <span className="font-mono text-xs text-maxx-sub ml-auto">{c.members}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* type toggle */}
            <div className="flex gap-2">
              {[["post", "Post", Zap], ["pain", "Pain Story", Skull]].map(([id, label, Icon]) => (
                <button
                  key={id}
                  onClick={() => setType(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs tracking-wider uppercase border transition-all ${
                    type === id
                      ? "bg-maxx-violet/15 border-maxx-violet/40 text-maxx-violetLt"
                      : "border-maxx-violet/15 text-maxx-sub hover:text-maxx-bright hover:border-maxx-violet/30"
                  }`}
                >
                  <Icon className="w-3 h-3" />{label}
                </button>
              ))}
            </div>

            {/* textarea */}
            <textarea
              ref={taRef}
              rows={5}
              placeholder={type === "pain" ? "Tell your pain story…" : "What's happening in the degen world?"}
              value={text}
              onChange={e => setText(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-maxx-bright text-sm leading-relaxed placeholder:text-maxx-sub/40 resize-none font-sans"
            />

            {/* pain story fields */}
            {type === "pain" && (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-maxx-pink pointer-events-none" />
                  <input
                    className="w-full pl-8 pr-3 py-2 bg-maxx-bg0/60 border border-maxx-violet/15 rounded-md font-mono text-xs text-maxx-bright placeholder:text-maxx-sub/40 outline-none focus:border-maxx-violet/40 transition-colors"
                    placeholder="Minted (e.g. 17.6M)"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />
                </div>
                <div className="relative flex-1">
                  <Timer className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-maxx-violet pointer-events-none" />
                  <input
                    type="number" min={1}
                    className="w-full pl-8 pr-3 py-2 bg-maxx-bg0/60 border border-maxx-violet/15 rounded-md font-mono text-xs text-maxx-bright placeholder:text-maxx-sub/40 outline-none focus:border-maxx-violet/40 transition-colors"
                    placeholder="Wait days"
                    value={waitDays}
                    onChange={e => setWait(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* footer */}
            <div className="flex items-center justify-between pt-3 border-t border-maxx-violet/10">
              <span className={`font-mono text-xs ${chars > 260 ? "text-maxx-pink" : "text-maxx-sub"}`}>
                {chars}/280
              </span>
              <Button variant="primary" skewed onClick={submit} className="text-xs"
                disabled={!text.trim() || chars > 280}>
                <Send size={12} /> Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Sidebar stat ── */
const SideStat = ({ label, value, pct, gradientCls }) => (
  <div>
    <div className="flex justify-between items-baseline mb-1.5">
      <span className="font-mono text-xs text-maxx-sub">{label}</span>
      <span className="font-mono font-bold text-sm text-maxx-bright">{value}</span>
    </div>
    <div className="h-[3px] w-full bg-maxx-violet/10 rounded-full overflow-hidden">
      <div className={`h-full bg-gradient-to-r ${gradientCls} transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
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

  const toggle = key => id =>
    setPosts(ps => ps.map(p => p.id === id ? { ...p, [key]: !p[key] } : p));

  const addPost = ({ text, clan, type, mint }) =>
    setPosts(ps => [{
      id: Date.now(), type, clan,
      author: { handle: "you", verified: false, rank: 99999, initials: "ME" },
      ts: "now", timeRaw: 0, text, mint,
      stats: { likes: 0, reposts: 0, comments: 0, bookmarks: 0 },
      liked: false, reposted: false, bookmarked: false,
    }, ...ps]);

  const filtered = [...posts]
    .filter(p =>
      (activeClan === "all" || p.clan.id === activeClan) &&
      (activeType === "all" || p.type === activeType) &&
      (!search || p.text.toLowerCase().includes(search.toLowerCase()) ||
        p.author.handle.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "new") return a.timeRaw - b.timeRaw;
      if (sortBy === "top") return (b.stats.likes + b.stats.reposts) - (a.stats.likes + a.stats.reposts);
      return 0;
    });

  return (
    <>
      <Helmet>
        <title>Pain Feed — MAXXPAINN</title>
        <meta name="description" content="Community posts, pain stories, and degen dispatches from the MAXXPAINN protocol." />
      </Helmet>

      {compose && <ComposeModal onClose={() => setCompose(false)} onSubmit={addPost} />}

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
              <div className="flex gap-8">

                {/* ── FEED COLUMN ── */}
                <div className="flex-1 min-w-0">

                  {/* header */}
                  <div className="mb-6">
                    <div className="eyebrow mb-3"><span className="eyebrow-dot" />Community · Dispatches from the Battlefield</div>
                    <div className="flex items-end justify-between gap-4">
                      <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                        <span className="text-maxx-white">THE </span>
                        <span className="bg-grad-accent bg-clip-text text-transparent">PAIN FEED</span>
                      </h1>
                      <Button variant="primary" skewed onClick={() => setCompose(true)}
                        className="shrink-0 shadow-[0_0_24px_rgba(255,45,120,0.2)]">
                        <Flame size={14} /> Post
                      </Button>
                    </div>
                  </div>

                  {/* search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-maxx-sub pointer-events-none" />
                    <input
                      placeholder="Search posts…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg text-sm text-maxx-bright placeholder:text-maxx-sub font-mono focus:outline-none focus:border-maxx-violet/45 transition-colors"
                    />
                  </div>

                  {/* clan filter */}
                  <div className="flex items-center gap-2 overflow-x-auto nav-scroll-container pb-0.5 mb-4">
                    <button
                      onClick={() => setClan("all")}
                      className={`flex items-center gap-1.5 shrink-0 px-3.5 py-2 rounded-full font-mono text-xs tracking-wider uppercase border transition-all ${
                        activeClan === "all"
                          ? "bg-maxx-violet/20 border-maxx-violet/50 text-maxx-white"
                          : "border-maxx-violet/20 text-maxx-sub hover:border-maxx-violet/40 hover:text-maxx-bright"
                      }`}
                    >
                      <Users className="w-3 h-3" /> All Clans
                    </button>
                    {CLANS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setClan(c.id)}
                        className={`flex items-center gap-1.5 shrink-0 px-3.5 py-2 rounded-full font-mono text-xs tracking-wider uppercase border font-bold transition-all ${
                          activeClan === c.id
                            ? `${c.tw.bg} ${c.tw.border} ${c.tw.text}`
                            : "border-maxx-violet/20 text-maxx-sub hover:border-maxx-violet/40 hover:text-maxx-bright"
                        }`}
                      >
                        <Shield className="w-3 h-3" />{c.name}
                      </button>
                    ))}
                  </div>

                  {/* type + sort row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {[["all","All",Flame],["post","Posts",Zap],["pain","Pain Stories",Skull]].map(([id,label,Icon]) => (
                        <button
                          key={id}
                          onClick={() => setType(id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs tracking-wider uppercase border transition-all ${
                            activeType === id
                              ? "bg-maxx-violet/15 border-maxx-violet/40 text-maxx-violetLt"
                              : "border-maxx-violet/15 text-maxx-sub hover:text-maxx-bright hover:border-maxx-violet/30"
                          }`}
                        >
                          <Icon className="w-3 h-3" />{label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-0.5 bg-maxx-bg1/80 border border-maxx-violet/15 rounded-lg p-1">
                      {[["hot","Hot",Flame],["new","New",Sparkles],["top","Top",Trophy]].map(([id,label,Icon]) => (
                        <button
                          key={id}
                          onClick={() => setSort(id)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-mono text-xs uppercase tracking-wider transition-all ${
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
                <aside className="hidden xl:flex xl:w-64 flex-shrink-0 flex-col gap-4 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pb-4">

                  {/* clan leaderboard */}
                  <div className="bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-maxx-violet/60 to-transparent" />
                    <div className="eyebrow mb-4"><span className="eyebrow-dot" />Clan Leaderboard</div>
                    <div className="space-y-3">
                      {[...CLANS].sort((a, b) => b.members - a.members).map((c, i) => (
                        <div key={c.id} className="flex items-center gap-2.5">
                          <span className="font-mono text-xs text-maxx-sub w-5 text-right">#{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1.5">
                              <span className={`font-mono text-xs font-bold ${c.tw.text}`}>{c.name}</span>
                              <span className="font-mono text-xs text-maxx-sub">{c.members}</span>
                            </div>
                            <div className="h-[3px] bg-maxx-violet/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${c.tw.bg} border-0`}
                                style={{ width: `${(c.members / 841) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* stats */}
                  <div className="bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-maxx-pink/50 to-transparent" />
                    <div className="eyebrow mb-4"><span className="eyebrow-dot" />War Room</div>
                    <div className="space-y-4">
                      <SideStat label="Total Posts"   value="12,841" pct={82} gradientCls="from-maxx-violet to-maxx-violetLt" />
                      <SideStat label="Pain Stories"  value="4,201"  pct={55} gradientCls="from-maxx-pink to-maxx-pinkLt"    />
                      <SideStat label="Active Degens" value="3,204"  pct={47} gradientCls="from-maxx-violet to-maxx-pink"    />
                      <SideStat label="Tokens Shared" value="847B"   pct={91} gradientCls="from-maxx-pink to-maxx-pinkDk"   />
                    </div>
                  </div>

                  {/* trending */}
                  <div className="bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-maxx-violet/40 via-maxx-pink/25 to-transparent" />
                    <div className="eyebrow mb-3"><span className="eyebrow-dot" />Trending</div>
                    {[
                      ["5year","2.1K"],["diamondhands","1.8K"],["nem","1.4K"],
                      ["clanwars","987"],["freemint","854"],["rugsurvivors","712"],
                    ].map(([tag, count], i) => (
                      <div
                        key={tag}
                        className="flex items-center justify-between py-2.5 border-b border-maxx-violet/10 last:border-0 cursor-pointer group hover:translate-x-0.5 transition-transform"
                      >
                        <div>
                          <p className="font-mono text-xs text-maxx-dim">#{i + 1} trending</p>
                          <p className="font-mono text-sm font-bold text-maxx-bright group-hover:text-maxx-violetLt transition-colors">#{tag}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs text-maxx-sub">{count}</span>
                          <ChevronRight className="w-3 h-3 text-maxx-sub group-hover:text-maxx-violet transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* top degens */}
                  <div className="bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-maxx-violet/50 via-maxx-pink/20 to-transparent" />
                    <div className="eyebrow mb-4"><span className="eyebrow-dot" />Top Degens</div>
                    <div className="space-y-3">
                      {[
                        { h: "0xwhisper",       rank: 7,    tw: "text-maxx-pink"    },
                        { h: "clan_voidwalker",  rank: 88,   tw: "text-maxx-violet"  },
                        { h: "degen_rex",        rank: 420,  tw: "text-maxx-violetLt"},
                        { h: "patience_maxi",    rank: 1337, tw: "text-maxx-mid"     },
                      ].map(({ h, rank, tw }) => (
                        <div key={h} className="flex items-center gap-2.5 group cursor-pointer hover:translate-x-0.5 transition-transform">
                          <div className="w-8 h-8 rounded-lg bg-grad-btn flex items-center justify-center font-mono font-black text-xs text-maxx-white clip-edges flex-shrink-0">
                            {h.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-mono text-sm font-bold text-maxx-bright truncate group-hover:text-maxx-violetLt transition-colors">
                              @{h}
                            </p>
                            <p className={`font-mono text-xs ${tw}`}>Rank #{rank}</p>
                          </div>
                          <BadgeCheck className="w-3.5 h-3.5 text-maxx-pink flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>

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
