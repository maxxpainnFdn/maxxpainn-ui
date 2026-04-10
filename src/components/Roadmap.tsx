/**
 * MAXXPAINN — Roadmap Page
 *
 * Design system: maxx-* tokens, btn-p / eyebrow / pill / card-hover classes.
 * No raw Tailwind color names, no hex codes in JSX.
 */

import React from 'react';
import Navigation from '@/components/nav/Navigation';
import Footer from '@/components/Footer';
import {
  CheckCircle,
  Clock,
  Flame,
  Rocket,
  TrendingUp,
  Skull,
  Crown,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Button from '@/components/button/Button';

const title       = "MaxxPainn Roadmap – Pain to Power";
const description = "From collective pain to unstoppable power. Track MAXXPAINN's journey from genesis to the largest airdrop in degen history.";

/* ─── phases data ────────────────────────────────────────────── */
const phases = [
  {
    phase: "Phase 1",
    title: "The Pain Awakening",
    status: "completed",
    timeline: "Q1 2025",
    emoji: "💀",
    Icon: CheckCircle,
    tw: {
      badge:    "bg-maxx-emerald/10 border-maxx-emerald/30 text-maxx-emerald",
      label:    "text-maxx-emerald",
      accent:   "via-maxx-emerald/40",
      dot:      "bg-maxx-emerald shadow-[0_0_8px_rgba(16,185,129,0.7)]",
      ring:     "border-maxx-emerald/25",
      circle:   "from-maxx-emerald/20 to-maxx-emerald/5 border-maxx-emerald/40 text-maxx-emerald",
      statusTw: "text-maxx-emerald",
    },
    items: [
      "Domain secured",
      "Core website launched",
      "MAXXPAINN whitepaper + manifesto unveiled",
      "Social channels established",
    ],
  },
  {
    phase: "Phase 2",
    title: "Free Mint Liberation",
    status: "current",
    timeline: "Q2 2025",
    emoji: "🔥",
    Icon: Flame,
    tw: {
      badge:    "bg-maxx-pink/10 border-maxx-pink/30 text-maxx-pink",
      label:    "text-maxx-pink",
      accent:   "via-maxx-pink/50",
      dot:      "bg-maxx-pink shadow-[0_0_8px_rgba(255,45,120,0.7)]",
      ring:     "border-maxx-pink/35",
      circle:   "from-maxx-pink/20 to-maxx-pinkDk/5 border-maxx-pink/40 text-maxx-pink",
      statusTw: "text-maxx-pink",
    },
    items: [
      "Early degen outreach & validation",
      "Community formation and maxx-story onboarding",
      "Smart contract deployment",
      "Free mint launch for all degens",
    ],
  },
  {
    phase: "Phase 3",
    title: "Ecosystem Expansion",
    status: "upcoming",
    timeline: "Q3 2025",
    emoji: "🚀",
    Icon: Rocket,
    tw: {
      badge:    "bg-blue-500/10 border-blue-500/30 text-blue-400",
      label:    "text-blue-400",
      accent:   "via-blue-500/40",
      dot:      "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.7)]",
      ring:     "border-blue-500/25",
      circle:   "from-blue-500/20 to-blue-600/5 border-blue-500/40 text-blue-400",
      statusTw: "text-blue-400",
    },
    items: [
      "User onboarding & amplified marketing",
      "Exchange listings",
      "Partnership integrations with major protocols",
      "Enhanced on-chain liquidity",
    ],
  },
  {
    phase: "Phase 4",
    phaseText: "Activated at 10,000,000 Global Rank",
    title: "Protocol Upgrade",
    status: "future",
    emoji: "👑",
    Icon: Crown,
    tw: {
      badge:    "bg-maxx-violet/10 border-maxx-violet/30 text-maxx-violet",
      label:    "text-maxx-violet",
      accent:   "via-maxx-violet/40",
      dot:      "bg-maxx-violet shadow-[0_0_8px_rgba(139,92,246,0.7)]",
      ring:     "border-maxx-violet/25",
      circle:   "from-maxx-violet/20 to-maxx-violetDk/5 border-maxx-violet/40 text-maxx-violet",
      statusTw: "text-maxx-violet",
    },
    items: [
      "Clan-focused social features",
      "Live streaming for clans",
      "Advanced clan moderation tools",
      "Cross-chain deployment across multiple networks",
    ],
  },
  {
    phase: "Phase 5",
    phaseText: "Activated at 100,000,000 Global Rank",
    title: "Creator Expansion",
    status: "future",
    emoji: "👑",
    Icon: TrendingUp,
    tw: {
      badge:    "bg-maxx-violet/10 border-maxx-violet/30 text-maxx-violet",
      label:    "text-maxx-violet",
      accent:   "via-maxx-violet/40",
      dot:      "bg-maxx-violet shadow-[0_0_8px_rgba(139,92,246,0.7)]",
      ring:     "border-maxx-violet/25",
      circle:   "from-maxx-violet/20 to-maxx-violetDk/5 border-maxx-violet/40 text-maxx-violet",
      statusTw: "text-maxx-violet",
    },
    items: [
      "Clan-based token launches",
      "Creator economy toolset",
      "Creator rewards, incentives, and boosts",
    ],
  },
  {
    phase: "Phase 6",
    phaseText: "Activated at 100,000,000+ Global Rank",
    title: "THE LARGEST AIRDROP",
    status: "future",
    emoji: "👑",
    Icon: Zap,
    tw: {
      badge:    "bg-grad-accent border-maxx-pink/30 text-maxx-white",
      label:    "text-maxx-pink",
      accent:   "via-maxx-pink/60",
      dot:      "bg-maxx-pink shadow-[0_0_8px_rgba(255,45,120,0.7)]",
      ring:     "border-maxx-pink/40",
      circle:   "from-maxx-pink/20 to-maxx-violet/10 border-maxx-pink/40 text-maxx-white",
      statusTw: "text-maxx-pink",
    },
    items: [
      "Clan token airdrop distributed based on member point scores",
    ],
  },
];

const statusLabel = {
  completed: "Completed",
  current:   "In Progress",
  upcoming:  "Upcoming",
  future:    "Future",
};

/* ─── phase card ─────────────────────────────────────────────── */
const PhaseCard = ({ phase, index }) => {
  const isLast = index === phases.length - 1;

  return (
    <div className="relative flex items-start gap-6">

      {/* ── vertical connector ── */}
      {!isLast && (
        <div className="hidden sm:block absolute left-8 top-20 w-px h-[calc(100%+3rem)] bg-gradient-to-b from-maxx-violet/30 to-transparent z-0" />
      )}

      {/* ── phase circle ── */}
      <div className={`
        hidden sm:flex relative z-10 flex-shrink-0
        w-16 h-16 rounded-full items-center justify-center text-2xl
        border-2 bg-gradient-to-br transition-all duration-300 hover:scale-110
        ${phase.tw.circle}
        ${phase.status === 'current' ? 'shadow-[0_0_24px_rgba(255,45,120,0.4)] animate-pulse' : ''}
      `}>
        {phase.emoji}
      </div>

      {/* ── card ── */}
      <div className={`
        flex-1 relative bg-maxx-bg1/80 border rounded-lg overflow-hidden
        transition-all duration-300 hover:scale-[1.01]
        ${phase.tw.ring}
        ${phase.status === 'current' ? 'shadow-[0_0_40px_rgba(255,45,120,0.12)]' : ''}
      `}>
        {/* top accent */}
        <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${phase.tw.accent} to-transparent opacity-70`} />

        <div className="p-7 md:p-9">

          {/* ── header row ── */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="eyebrow mb-1">
                <span className="eyebrow-dot" />
                {phase.phase}
              </div>
              {phase.phaseText && (
                <p className="font-mono text-[0.7rem] text-maxx-sub tracking-wide mt-1">
                  {phase.phaseText}
                </p>
              )}
            </div>

            {/* status badge */}
            <span className={`
              inline-flex items-center gap-2
              font-mono text-[0.62rem] tracking-widest uppercase
              px-3 py-1.5 rounded-lg border flex-shrink-0
              ${phase.tw.badge}
            `}>
              <phase.Icon className="w-3.5 h-3.5" />
              {statusLabel[phase.status]}
            </span>
          </div>

          {/* title */}
          <h3 className={`text-2xl md:text-3xl font-black text-maxx-white uppercase tracking-tight mb-6 ${
            phase.status === 'current' ? 'bg-grad-accent bg-clip-text text-transparent' : ''
          }`}>
            {phase.title}
          </h3>

          {/* items grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {phase.items.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-lg bg-maxx-bg0/60 border border-maxx-violet/10 hover:border-maxx-violet/25 transition-all duration-300"
              >
                <div className={`w-1.5 h-1.5 rounded-sm mt-2 flex-shrink-0 ${phase.tw.dot}`} />
                <span className="text-maxx-bright text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

/* ─── page ───────────────────────────────────────────────────── */
const Roadmap = () => (
  <>
    <Helmet>
      <title>{title}</title>
      <meta name="description"        content={description} />
      <meta property="og:title"       content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type"        content="website" />
      <meta property="og:url"         content="https://maxxpainn.com/roadmap" />
      <meta property="og:image"       content="https://maxxpainn.com/images/pages/roadmap.jpg" />
      <meta name="twitter:card"       content="summary_large_image" />
      <meta name="twitter:title"      content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"      content="https://maxxpainn.com/images/pages/roadmap.jpg" />
    </Helmet>

    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="relative overflow-hidden">

        {/* ambient glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-maxx-violet rounded-full blur-[160px] opacity-[0.07]" />
          <div className="absolute top-1/3 -right-48 w-[600px] h-[600px] bg-maxx-pink rounded-full blur-[140px] opacity-[0.05]" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-maxx-pink rounded-full blur-[160px] opacity-[0.04]" />
        </div>

        <main className="relative pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-4">

            {/* ── HEADER ── */}
            <div className="text-center mb-20">
              <div className="eyebrow justify-center mb-4">
                <span className="eyebrow-dot" />
                The Journey · Pain to Power
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tighter">
                <span className="text-maxx-white">ROAD</span>
                <span className="bg-grad-accent bg-clip-text text-transparent">MAP</span>
              </h1>

              <p className="text-xl md:text-2xl text-maxx-mid max-w-3xl mx-auto leading-relaxed mb-8">
                From collective pain to unstoppable power. This is how we're going to make it, anon.
              </p>

              {/* WAGMI pill */}
              <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-widest uppercase px-5 py-2.5 rounded-lg bg-maxx-pink/10 border border-maxx-pink/30 text-maxx-pink">
                <Flame className="w-3.5 h-3.5" />
                WAGMI MODE ACTIVATED
                <Flame className="w-3.5 h-3.5" />
              </span>

              <div className="flex items-center justify-center gap-4 mt-12">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-maxx-violet/50" />
                <Skull className="w-5 h-5 text-maxx-pink" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-maxx-violet/50" />
              </div>
            </div>

            {/* ── PHASES ── */}
            <div className="space-y-12">
              {phases.map((phase, index) => (
                <PhaseCard key={index} phase={phase} index={index} />
              ))}
            </div>

            {/* ── BOTTOM NOTE ── */}
            <div className="mt-20 text-center">
              <div className="relative bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-8 md:p-12 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-maxx-violet/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-maxx-violet/3 to-maxx-pink/3 pointer-events-none" />

                <div className="relative z-10">
                  <p className="text-maxx-mid text-base leading-relaxed mb-2">
                    This roadmap evolves with our degen community.{' '}
                    <span className="text-maxx-bright font-semibold">Diamond hands only! 💎🙌</span>
                  </p>
                  <p className="font-mono text-[0.62rem] text-maxx-dim uppercase tracking-widest mb-8">
                    *Not financial advice. DYOR, anon.
                  </p>

                  <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {[
                      { label: "🚀 Community Driven", tw: "bg-maxx-violet/10 border-maxx-violet/30 text-maxx-violetLt" },
                      { label: "👀 Transparent AF",    tw: "bg-maxx-emerald/10 border-maxx-emerald/30 text-maxx-emerald" },
                      { label: "📈 Regular Updates",   tw: "bg-blue-500/10 border-blue-500/30 text-blue-400" },
                      { label: "💀 Degen Approved",    tw: "bg-maxx-pink/10 border-maxx-pink/30 text-maxx-pink" },
                    ].map(({ label, tw }) => (
                      <span key={label} className={`font-mono text-[0.65rem] tracking-widest uppercase px-4 py-2 rounded-lg border ${tw}`}>
                        {label}
                      </span>
                    ))}
                  </div>

                  <Link to="/mint">
                    <Button variant="primary" skewed className="shadow-[0_0_30px_rgba(255,45,120,0.2)]">
                      <Flame className="w-4 h-4" />
                      CLAIM YOUR ALLOCATION
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  </>
);

export default Roadmap;
