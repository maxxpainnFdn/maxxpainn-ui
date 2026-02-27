/**
 * MAXXPAINN — Social Feed
 *
 * Clan-based social feed: post composer with clan picker,
 * themed reactions (Burn · Boost · Pain), pain-level bars,
 * trending sidebar, Global Pain Index, cursor-reactive cards.
 * Design system: maxx-* tokens, eyebrow / pill classes.
 */

import React, { useState, useRef, useEffect } from "react";
import {
  Flame,
  Zap,
  Skull,
  Shield,
  Moon,
  Globe,
  MessageCircle,
  Share2,
  Send,
  Image,
  Hash,
  ChevronDown,
  MoreHorizontal,
  ArrowUp,
  TrendingUp,
  Sparkles,
} from "lucide-react";

/* ═══ CLANS ══════════════════════════════════════════════ */

const CLANS = [
  { id: "inferno", name: "Inferno Squad", icon: Flame, rgb: "239,68,68", members: 2847 },
  { id: "volt", name: "Volt Runners", icon: Zap, rgb: "139,92,246", members: 3201 },
  { id: "skull", name: "Skull Syndicate", icon: Skull, rgb: "236,72,153", members: 1956 },
  { id: "dragon", name: "Dragon Horde", icon: Shield, rgb: "245,158,11", members: 1432 },
  { id: "shadow", name: "Night Reapers", icon: Moon, rgb: "99,102,241", members: 2103 },
];

const getClan = (id: string) => CLANS.find((c) => c.id === id)!;

/* ═══ MOCK DATA ══════════════════════════════════════════ */

interface FeedPost {
  id: string;
  user: { name: string; initials: string; grad: string };
  clanId: string;
  content: string;
  time: string;
  reactions: { burn: number; boost: number; pain: number };
  comments: number;
  painLevel: number;
}

const SEED_POSTS: FeedPost[] = [
  {
    id: "p1",
    user: { name: "CryptoReaper", initials: "CR", grad: "from-pink-500 to-purple-600" },
    clanId: "skull",
    content:
      "Just staked my entire bag into the PAINN pool. Either we moon or I eat ramen for a year. No in between. 💀",
    time: "12m ago",
    reactions: { burn: 24, boost: 18, pain: 42 },
    comments: 7,
    painLevel: 87,
  },
  {
    id: "p2",
    user: { name: "VoltageMaxx", initials: "VM", grad: "from-violet-500 to-blue-500" },
    clanId: "volt",
    content:
      "New clan record: 847 consecutive days of hodling through a 94% drawdown. We don't sell. We don't sleep. We BOOST. ⚡",
    time: "28m ago",
    reactions: { burn: 56, boost: 89, pain: 31 },
    comments: 14,
    painLevel: 94,
  },
  {
    id: "p3",
    user: { name: "InfernoKing", initials: "IK", grad: "from-red-500 to-orange-500" },
    clanId: "inferno",
    content:
      "Inferno Squad just crossed 100 SOL in the clan treasury. Every burn makes us stronger. Who else is adding to the fire today? 🔥",
    time: "1h ago",
    reactions: { burn: 112, boost: 45, pain: 8 },
    comments: 23,
    painLevel: 45,
  },
  {
    id: "p4",
    user: { name: "NightPhantom", initials: "NP", grad: "from-indigo-500 to-purple-600" },
    clanId: "shadow",
    content:
      "Survived three rug pulls this week and still in profit. The shadows protect their own. Night Reapers don't die, we multiply. 🌙",
    time: "2h ago",
    reactions: { burn: 38, boost: 27, pain: 156 },
    comments: 19,
    painLevel: 98,
  },
  {
    id: "p5",
    user: { name: "DragonSlayer", initials: "DS", grad: "from-amber-500 to-yellow-500" },
    clanId: "dragon",
    content:
      "Dragon Horde governance proposal #47 passed: 10% of all clan rewards now go to the community burn pool. We play the long game. 🐉",
    time: "3h ago",
    reactions: { burn: 67, boost: 93, pain: 12 },
    comments: 31,
    painLevel: 32,
  },
  {
    id: "p6",
    user: { name: "PainEnjoyer", initials: "PE", grad: "from-purple-500 to-pink-500" },
    clanId: "volt",
    content:
      'Chart check: if you squint hard enough at the 1m candle, PAINN looks like it\'s forming an inverse head-and-shoulders-and-knees-and-toes pattern. Bullish.',
    time: "4h ago",
    reactions: { burn: 89, boost: 34, pain: 67 },
    comments: 42,
    painLevel: 71,
  },
];

const TRENDING = [
  { tag: "MaxxSeason", posts: 3420 },
  { tag: "BurnItAll", posts: 2180 },
  { tag: "ClanWars", posts: 1847 },
  { tag: "DiamondPain", posts: 1203 },
  { tag: "SolanaVibes", posts: 956 },
];

const PAIN_BARS = [35, 42, 58, 47, 63, 72, 68, 78, 71, 84, 76, 78];

/* ═══ INJECT STYLES ══════════════════════════════════════ */

let _feedInjected = false;
function injectFeedStyles() {
  if (_feedInjected || typeof document === "undefined") return;
  _feedInjected = true;
  const s = document.createElement("style");
  s.textContent = `
    /* ── card cursor spotlight ── */
    ._fd-card {
      position: relative;
      transition: border-color 0.3s ease;
    }
    ._fd-card::before {
      content: '';
      position: absolute; inset: 0;
      border-radius: inherit;
      background: radial-gradient(
        400px circle at var(--_cx, 50%) var(--_cy, 50%),
        rgba(139,92,246,0.045), transparent 55%
      );
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    ._fd-card:hover::before { opacity: 1; }
    ._fd-card:hover { border-color: rgba(139,92,246,0.16) !important; }

    /* ── new post entrance ── */
    @keyframes _fd-in {
      from { opacity: 0; transform: translateY(-14px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    ._fd-new { animation: _fd-in 0.5s cubic-bezier(.22,.61,.36,1); }

    /* ── pain bar shimmer ── */
    @keyframes _fd-shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }

    /* ── clan pill hover lift ── */
    ._fd-pill { transition: all 0.25s cubic-bezier(.22,.61,.36,1); }
    ._fd-pill:hover { transform: translateY(-1px); }

    /* ── compose textarea ── */
    ._fd-compose:focus {
      outline: none;
      border-color: rgba(139,92,246,0.3) !important;
      box-shadow: 0 0 0 3px rgba(139,92,246,0.06);
    }

    /* ── reaction press ── */
    @keyframes _fd-pop {
      0%   { transform: scale(1); }
      40%  { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    ._fd-pop { animation: _fd-pop 0.28s ease; }

    /* ── sidebar index pulse ring ── */
    @keyframes _fd-ring {
      0%   { transform: scale(1); opacity: 0.35; }
      100% { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(s);
}

/* ═══ COMPONENT ══════════════════════════════════════════ */

const MAX_CHARS = 500;

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>(SEED_POSTS);
  const [filter, setFilter] = useState("all");
  const [text, setText] = useState("");
  const [selectedClan, setSelectedClan] = useState(CLANS[0].id);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [reacted, setReacted] = useState<Record<string, Set<string>>>({});
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [visible, setVisible] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    injectFeedStyles();
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  /* close picker on outside click */
  useEffect(() => {
    if (!pickerOpen) return;
    const h = () => setPickerOpen(false);
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, [pickerOpen]);

  /* auto-resize textarea */
  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const t = e.target;
    t.style.height = "auto";
    t.style.height = t.scrollHeight + "px";
  };

  /* submit post */
  const submitPost = () => {
    if (!text.trim()) return;
    const p: FeedPost = {
      id: `u-${Date.now()}`,
      user: { name: "You", initials: "YO", grad: "from-violet-400 to-fuchsia-500" },
      clanId: selectedClan,
      content: text.trim(),
      time: "Just now",
      reactions: { burn: 0, boost: 0, pain: 0 },
      comments: 0,
      painLevel: Math.floor(Math.random() * 55) + 25,
    };
    setPosts((prev) => [p, ...prev]);
    setNewIds((prev) => new Set(prev).add(p.id));
    setText("");
    if (taRef.current) taRef.current.style.height = "auto";
  };

  /* toggle reaction */
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
        p.id !== pid
          ? p
          : { ...p, reactions: { ...p.reactions, [type]: p.reactions[type] + (was ? -1 : 1) } }
      )
    );
  };

  /* card spotlight handler */
  const onCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--_cx", `${e.clientX - r.left}px`);
    el.style.setProperty("--_cy", `${e.clientY - r.top}px`);
  };

  /* stagger helper */
  const reveal = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(18px)",
    transition: `all 0.6s cubic-bezier(.22,.61,.36,1) ${delay}s`,
  });

  const displayed = filter === "all" ? posts : posts.filter((p) => p.clanId === filter);
  const clanObj = getClan(selectedClan);

  /* ── REACTIONS CONFIG ── */
  const REACTION_CFG = [
    { type: "burn" as const, icon: Flame, rgb: "239,68,68", label: "Burn" },
    { type: "boost" as const, icon: Zap, rgb: "139,92,246", label: "Boost" },
    { type: "pain" as const, icon: Skull, rgb: "236,72,153", label: "Pain" },
  ];

  return (
    <div className="min-h-screen bg-maxx-bg0">
      {/* ═══ HERO / HEADER ═══════════════════════════════ */}
      <div className="relative overflow-hidden border-b border-white/[0.04]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(139,92,246,0.06), transparent)",
          }}
          aria-hidden
        />
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-10 relative">
          <div style={reveal(0)}>
            <div className="eyebrow mb-4">
              <span className="eyebrow-dot" />
              Clan Feed
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-maxx-white tracking-tight mb-3">
              The{" "}
              <span className="bg-grad-accent bg-clip-text text-transparent">
                Feed
              </span>
            </h1>
            <p className="text-maxx-sub text-base max-w-lg leading-relaxed">
              Share your pain, celebrate your gains, and rally your clan. Every
              post fuels the fire.
            </p>
          </div>

          {/* ── clan filter pills ── */}
          <div className="flex flex-wrap gap-2 mt-8" style={reveal(0.1)}>
            {/* "all" pill */}
            <button
              onClick={() => setFilter("all")}
              className={`_fd-pill flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border cursor-pointer transition-all duration-200 ${
                filter === "all"
                  ? "bg-purple-500/15 border-purple-500/30 text-white shadow-lg shadow-purple-500/10"
                  : "bg-white/[0.02] border-white/[0.06] text-gray-500 hover:text-white hover:border-white/[0.12]"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              All Clans
            </button>

            {CLANS.map((clan) => {
              const CIcon = clan.icon;
              const active = filter === clan.id;
              return (
                <button
                  key={clan.id}
                  onClick={() => setFilter(clan.id)}
                  className="_fd-pill flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border cursor-pointer transition-all duration-200"
                  style={{
                    background: active ? `rgba(${clan.rgb},0.12)` : "rgba(255,255,255,0.02)",
                    borderColor: active ? `rgba(${clan.rgb},0.3)` : "rgba(255,255,255,0.06)",
                    color: active ? "white" : "",
                    boxShadow: active ? `0 0 20px -6px rgba(${clan.rgb},0.3)` : "",
                  }}
                >
                  <CIcon
                    className="w-3.5 h-3.5"
                    style={{ color: active ? `rgb(${clan.rgb})` : "" }}
                  />
                  {clan.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ TWO-COLUMN LAYOUT ═══════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ═══ MAIN COLUMN ═════════════════════════════ */}
          <div className="lg:col-span-2 space-y-5">
            {/* ── POST COMPOSER ── */}
            <div
              className="_fd-card rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
              style={reveal(0.15)}
              onMouseMove={onCardMove}
            >
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold">
                  YO
                </div>
                <div className="flex-1 min-w-0">
                  <textarea
                    ref={taRef}
                    value={text}
                    onChange={onTextChange}
                    placeholder="Share your pain with the clan…"
                    maxLength={MAX_CHARS}
                    rows={3}
                    className="_fd-compose w-full bg-transparent border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 resize-none transition-all duration-200"
                  />

                  {/* composer toolbar */}
                  <div className="flex items-center justify-between mt-3 gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      {/* clan picker */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPickerOpen(!pickerOpen);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-sm cursor-pointer transition-all duration-200 hover:border-white/[0.12]"
                        >
                          {React.createElement(clanObj.icon, {
                            className: "w-3.5 h-3.5",
                            style: { color: `rgb(${clanObj.rgb})` },
                          })}
                          <span className="text-gray-400 hidden sm:inline">
                            {clanObj.name}
                          </span>
                          <ChevronDown className="w-3 h-3 text-gray-600" />
                        </button>

                        {pickerOpen && (
                          <div
                            className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-white/[0.08] bg-maxx-bg0/[0.98] backdrop-blur-xl shadow-2xl shadow-black/50 z-50 py-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {CLANS.map((c) => {
                              const CI = c.icon;
                              return (
                                <button
                                  key={c.id}
                                  onClick={() => {
                                    setSelectedClan(c.id);
                                    setPickerOpen(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 cursor-pointer transition-colors duration-150 hover:bg-white/[0.04] hover:text-white"
                                >
                                  <CI
                                    className="w-4 h-4"
                                    style={{ color: `rgb(${c.rgb})` }}
                                  />
                                  {c.name}
                                  {selectedClan === c.id && (
                                    <span className="ml-auto text-sm text-purple-400">✓</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <button className="w-8 h-8 rounded-lg border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-gray-600 cursor-pointer transition-colors hover:text-gray-400 hover:border-white/[0.12]">
                        <Image className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-mono transition-colors ${
                          text.length > MAX_CHARS * 0.9
                            ? "text-red-400"
                            : "text-gray-600"
                        }`}
                      >
                        {text.length}/{MAX_CHARS}
                      </span>
                      <button
                        onClick={submitPost}
                        disabled={!text.trim()}
                        className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20 hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── POSTS ── */}
            {displayed.length === 0 && (
              <div
                className="flex flex-col items-center justify-center py-20 gap-3"
                style={reveal(0.25)}
              >
                <Sparkles className="w-8 h-8 text-gray-700" />
                <p className="text-sm text-gray-600">
                  No posts in this clan yet. Be the first to share your pain.
                </p>
              </div>
            )}

            {displayed.map((post, i) => {
              const clan = getClan(post.clanId);
              const ClanIcon = clan.icon;
              const mySet = reacted[post.id] || new Set<string>();
              const isNew = newIds.has(post.id);

              return (
                <div
                  key={post.id}
                  className={`_fd-card rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 ${
                    isNew ? "_fd-new" : ""
                  }`}
                  style={isNew ? undefined : reveal(0.2 + Math.min(i, 5) * 0.05)}
                  onMouseMove={onCardMove}
                >
                  {/* post header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${post.user.grad} flex items-center justify-center text-white text-sm font-bold shrink-0`}
                      >
                        {post.user.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-white">
                            {post.user.name}
                          </span>
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium leading-none"
                            style={{
                              background: `rgba(${clan.rgb},0.1)`,
                              color: `rgb(${clan.rgb})`,
                              border: `1px solid rgba(${clan.rgb},0.2)`,
                            }}
                          >
                            <ClanIcon className="w-2.5 h-2.5" />
                            {clan.name}
                          </span>
                        </div>
                        <span className="text-[12px] text-gray-600 block mt-0.5">
                          {post.time}
                        </span>
                      </div>
                    </div>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 cursor-pointer transition-colors hover:text-gray-400 hover:bg-white/[0.04]">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* content */}
                  <p className="text-sm text-gray-300 leading-relaxed mb-4 pl-[52px]">
                    {post.content}
                  </p>

                  {/* pain level bar */}
                  <div className="pl-[52px] mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-mono text-gray-600 uppercase tracking-wider">
                        Pain Lvl
                      </span>
                      <div className="flex-1 h-1 rounded-full bg-white/[0.04] overflow-hidden max-w-[140px]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${post.painLevel}%`,
                            background:
                              post.painLevel > 80
                                ? "linear-gradient(90deg, rgba(236,72,153,0.7), rgba(239,68,68,0.7))"
                                : post.painLevel > 50
                                ? "linear-gradient(90deg, rgba(139,92,246,0.6), rgba(236,72,153,0.6))"
                                : "linear-gradient(90deg, rgba(99,102,241,0.5), rgba(139,92,246,0.5))",
                            backgroundSize: "200% auto",
                            animation: "_fd-shimmer 3s linear infinite",
                          }}
                        />
                      </div>
                      <span
                        className="text-[11px] font-mono font-bold"
                        style={{
                          color:
                            post.painLevel > 80
                              ? "rgb(236,72,153)"
                              : post.painLevel > 50
                              ? "rgb(139,92,246)"
                              : "rgb(99,102,241)",
                        }}
                      >
                        {post.painLevel}
                      </span>
                    </div>
                  </div>

                  {/* reactions row */}
                  <div className="flex items-center gap-1.5 pl-[52px] flex-wrap">
                    {REACTION_CFG.map(({ type, icon: RIcon, rgb }) => {
                      const active = mySet.has(type);
                      return (
                        <button
                          key={type}
                          onClick={() => toggle(post.id, type)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-all duration-200 hover:bg-white/[0.03]"
                          style={{
                            background: active ? `rgba(${rgb},0.1)` : "transparent",
                            borderColor: active
                              ? `rgba(${rgb},0.25)`
                              : "rgba(255,255,255,0.04)",
                            color: active ? `rgb(${rgb})` : "",
                          }}
                        >
                          <RIcon
                            className={`w-3.5 h-3.5 ${!active ? "text-gray-600" : ""}`}
                          />
                          <span
                            className={`tabular-nums ${
                              !active ? "text-gray-600" : ""
                            }`}
                          >
                            {post.reactions[type]}
                          </span>
                        </button>
                      );
                    })}

                    <div className="w-px h-5 bg-white/[0.06] mx-1" />

                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-600 text-sm cursor-pointer transition-colors hover:text-gray-400 hover:bg-white/[0.03]">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {post.comments}
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-600 text-sm cursor-pointer transition-colors hover:text-gray-400 hover:bg-white/[0.03]">
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ═══ SIDEBAR ═════════════════════════════════ */}
          <div className="space-y-5">
            {/* ── YOUR CLANS ── */}
            <div
              className="_fd-card rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
              style={reveal(0.2)}
              onMouseMove={onCardMove}
            >
              <div className="eyebrow mb-4">
                <span className="eyebrow-dot" />
                Your Clans
              </div>
              <div className="space-y-2">
                {CLANS.map((clan) => {
                  const CI = clan.icon;
                  return (
                    <button
                      key={clan.id}
                      onClick={() => setFilter(clan.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent cursor-pointer transition-all duration-200 hover:bg-white/[0.03] hover:border-white/[0.06] group"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: `rgba(${clan.rgb},0.08)`,
                          border: `1px solid rgba(${clan.rgb},0.15)`,
                        }}
                      >
                        <CI
                          className="w-4 h-4"
                          style={{ color: `rgb(${clan.rgb})` }}
                        />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors truncate">
                          {clan.name}
                        </div>
                        <div className="text-[12px] text-gray-600">
                          {clan.members.toLocaleString()} members
                        </div>
                      </div>
                      <div
                        className="w-2 h-2 rounded-full shrink-0 opacity-50"
                        style={{ background: `rgb(${clan.rgb})` }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── TRENDING ── */}
            <div
              className="_fd-card rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
              style={reveal(0.3)}
              onMouseMove={onCardMove}
            >
              <div className="eyebrow mb-4">
                <span className="eyebrow-dot" />
                Trending
              </div>
              <div className="space-y-1">
                {TRENDING.map((t) => (
                  <div
                    key={t.tag}
                    className="flex items-center justify-between group cursor-pointer px-2 py-2 rounded-lg transition-colors hover:bg-white/[0.03]"
                  >
                    <div className="flex items-center gap-2.5">
                      <Hash className="w-3.5 h-3.5 text-purple-500/50" />
                      <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                        {t.tag}
                      </span>
                    </div>
                    <span className="text-[12px] text-gray-600 font-mono">
                      {t.posts >= 1000
                        ? `${(t.posts / 1000).toFixed(1)}k`
                        : t.posts}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── GLOBAL PAIN INDEX ── */}
            <div
              className="_fd-card rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 overflow-hidden relative"
              style={reveal(0.4)}
              onMouseMove={onCardMove}
            >
              <div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.04] via-transparent to-pink-500/[0.03] pointer-events-none"
                aria-hidden
              />
              <div className="relative">
                <div className="eyebrow mb-4">
                  <span className="eyebrow-dot" />
                  Global Pain Index
                </div>
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-4xl font-black bg-grad-accent bg-clip-text text-transparent tabular-nums">
                    78.4
                  </span>
                  <div className="flex items-center gap-1 pb-1.5">
                    <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-sm text-emerald-400 font-medium">
                      +3.2
                    </span>
                  </div>
                </div>
                <p className="text-[12px] text-gray-600 leading-relaxed mb-4">
                  Community pain sentiment across all clans in the last 24h.
                  Higher = more degen energy.
                </p>

                {/* mini bar chart */}
                <div className="flex items-end gap-1 h-10">
                  {PAIN_BARS.map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm min-w-0"
                      style={{
                        height: `${v}%`,
                        background: `linear-gradient(to top, rgba(139,92,246,0.3), rgba(236,72,153,${(v / 140).toFixed(2)}))`,
                        opacity: 0.45 + (i / PAIN_BARS.length) * 0.55,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ── LIVE ACTIVITY ── */}
            <div
              className="_fd-card rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4"
              style={reveal(0.45)}
              onMouseMove={onCardMove}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center w-3 h-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full relative z-[1]" />
                    <div
                      className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                      style={{ animation: "_fd-ring 2.5s ease-out infinite" }}
                      aria-hidden
                    />
                  </div>
                  <span className="text-sm text-gray-400">
                    <span className="font-semibold text-white">1,247</span>{" "}
                    degens online
                  </span>
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-400/50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
