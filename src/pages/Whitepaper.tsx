/**
 * MAXXPAINN — Technical Whitepaper
 *
 * Design system: maxx-* tokens, bg-background/bg-card, grad-accent/grad-btn,
 * eyebrow, pill, card-hover classes. No raw gray/purple/pink color names.
 */

import React, { useState, useEffect, useMemo } from 'react';
import Navigation from '@/components/nav/Navigation';
import Footer from '@/components/Footer';
import {
  BookOpen, Shield, Zap, Users, Lock, Sparkles,
  ChevronRight, ArrowRight, Flame, Target,
  Database, Cpu, GitBranch, Award, AlertTriangle,
  Calculator, Layers, Network, Coins, Timer, FileCode,
  Binary, Boxes, Gauge, Key, Server,
  Workflow, BarChart3, Siren, Rocket, Terminal,
  Gem, Percent,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import mintConfig from "@/config/mint";
import Button from '@/components/button/Button';

// ─── constants ────────────────────────────────────────────────
const CONSTANTS = {
  BASE_REWARD: 5005000,
  DAMPENER_K: 5000,
  EAM_MAX: 3.0,
  EAM_MIN: 1.0,
  EA_MAX_RANK: 1000000,
  NEM_COEFF: 0.004,
  NEM_MAX: 3.0,
  LPM_COEFF: 0.08,
  LPM_MAX: 5.0,
  DIFF_BASE_FEE: 0.003,
  DIFF_SCALE: 3,
};

// ─── table of contents ────────────────────────────────────────
const TABLE_OF_CONTENTS = [
  { id: 'abstract',          label: 'Abstract',              icon: BookOpen,      color: 'text-maxx-violet'  },
  { id: 'introduction',      label: 'Introduction',          icon: Sparkles,      color: 'text-maxx-pink'    },
  { id: 'architecture',      label: 'Protocol Architecture', icon: Boxes,         color: 'text-blue-400'     },
  { id: 'minting-process',   label: 'Minting Process',       icon: Workflow,      color: 'text-green-400'    },
  { id: 'reward-algorithm',  label: 'Reward Algorithm',      icon: Calculator,    color: 'text-yellow-400'   },
  { id: 'difficulty-system', label: 'Difficulty System',     icon: Gauge,         color: 'text-red-400'      },
  { id: 'lock-tiers',        label: 'Lock Period Tiers',     icon: Timer,         color: 'text-cyan-400'     },
  { id: 'late-penalty',      label: 'Late Mint Penalty',     icon: AlertTriangle, color: 'text-orange-400'   },
  { id: 'clan-system',       label: 'Clan System',           icon: Users,         color: 'text-maxx-violet'  },
  { id: 'staking',           label: 'Staking Protocol',      icon: Gem,           color: 'text-emerald-400'  },
  { id: 'on-chain-state',    label: 'On-Chain State',        icon: Database,      color: 'text-indigo-400'   },
  { id: 'security',          label: 'Security Model',        icon: Shield,        color: 'text-green-400'    },
  { id: 'economics',         label: 'Economic Analysis',     icon: BarChart3,     color: 'text-emerald-400'  },
  { id: 'conclusion',        label: 'Conclusion',            icon: Rocket,        color: 'text-maxx-pink'    },
];

// ─── helpers ──────────────────────────────────────────────────
const getLPMForDays = (days) =>
  Math.min(CONSTANTS.LPM_MAX, 1.0 + CONSTANTS.LPM_COEFF * Math.sqrt(days)).toFixed(2);

// ─── sub-components ───────────────────────────────────────────

const BlockQuote = ({ color = 'border-l-maxx-violet bg-maxx-violet/5', children }) => (
  <p className={`text-base leading-[1.85] border-l-4 pl-6 py-3 rounded-r-md text-maxx-bright ${color}`}>
    {children}
  </p>
);

const Para = ({ children, className = '' }) => (
  <p className={`text-base leading-[1.9] text-maxx-mid mb-4 ${className}`}>{children}</p>
);

const Lead = ({ children }) => (
  <p className="text-xl text-maxx-bright leading-relaxed mb-6 font-medium">{children}</p>
);

const Section = ({ id, children }) => (
  <section id={id} className="scroll-mt-24">{children}</section>
);

const SectionHeader = ({ number, Icon, title, badge }) => (
  <div className="flex items-center gap-4 mb-8">
    <span className="text-4xl font-black text-maxx-white/10 font-mono select-none">{number}</span>
    <div className={`p-2 sm:p-3 rounded-lg border ${badge}`}>
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
    </div>
    <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-maxx-white uppercase tracking-tight">{title}</h2>
  </div>
);

const Card = ({ children, className = '', border = 'border-maxx-violet/20' }) => (
  <div className={`bg-maxx-bg1/80 border rounded-lg p-8 md:p-10 shadow-2xl ${border} ${className}`}>
    {children}
  </div>
);

const SubTitle = ({ Icon, iconClass, children }) => (
  <h3 className="flex items-center gap-3 text-lg sm:text-xl font-bold text-maxx-white mb-5">
    <Icon className={`w-5 h-5 flex-shrink-0 ${iconClass}`} />
    {children}
  </h3>
);

const Formula = ({ title, children, border, bg, text }) => (
  <div className={`my-6 p-5 rounded-lg border text-center ${border} ${bg}`}>
    <p className={`text-sm uppercase tracking-widest mb-2 opacity-60 font-mono ${text}`}>{title}</p>
    <p className={`text-lg md:text-xl font-mono font-bold ${text}`}>{children}</p>
  </div>
);

const MetricCard = ({ label, value, footnote, border, bg, text }) => (
  <div className={`p-6 rounded-lg border text-center ${border} ${bg}`}>
    <p className="text-purple-300 text-sm font-semibold uppercase  mb-2">{label}</p>
    <p className={`text-3xl font-black ${text}`}>{value}</p>
    <p className="text-violet-400  font-semibold  text-sm mt-1">{footnote}</p>
  </div>
);

const BarChart = ({ title, badge, data, valueKey, labelKey, formatValue, xLabel, barClass, maxOverride }) => {
  const max = maxOverride ?? Math.max(...data.map(d => d[valueKey]));
  return (
    <div className="my-6 p-6 rounded-lg bg-maxx-bg0/60 border border-maxx-violet/15">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-maxx-sub uppercase tracking-wider font-mono">{title}</h4>
        <span className={`text-sm px-2 py-1 rounded-full ${badge}`}>Live Sim</span>
      </div>
      <div className="h-36 flex items-end justify-between gap-1 px-1">
        {data.map((item, i) => {
          const h = Math.max((item[valueKey] / max) * 100, 2);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full relative h-28 flex items-end">
                <div
                  className={`w-full rounded-t transition-all ${barClass}`}
                  style={{ height: `${h}%`, minHeight: 4 }}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-maxx-bg0 border border-maxx-violet/20 rounded text-sm text-maxx-white opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none">
                  {formatValue(item[valueKey])}
                </div>
              </div>
              <span className="text-[0.6rem] text-maxx-sub truncate max-w-full font-mono">{item[labelKey]}</span>
            </div>
          );
        })}
      </div>
      {xLabel && <p className="text-sm text-maxx-sub text-center mt-2 font-mono">{xLabel}</p>}
    </div>
  );
};

const ConstantsTable = ({ title, rows }) => (
  <div className="my-5">
    {title && <h4 className="text-sm font-bold text-maxx-sub uppercase tracking-wider mb-2 font-mono">{title}</h4>}
    <div className="overflow-x-auto rounded-lg border border-maxx-violet/15">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-maxx-bg0/60">
            <th className="text-left py-2 px-4 text-maxx-sub font-medium font-mono">Constant</th>
            <th className="text-left py-2 px-4 text-maxx-sub font-medium font-mono">Value</th>
            <th className="text-left py-2 px-4 text-maxx-sub font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-maxx-violet/10 hover:bg-maxx-violet/5">
              <td className="py-2 px-4 font-mono text-maxx-violet">{r.name}</td>
              <td className="py-2 px-4 font-mono text-maxx-white">{r.value}</td>
              <td className="py-2 px-4 text-maxx-mid">{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const CodeBlock = ({ title, children }) => (
  <div className="my-6 rounded-lg overflow-hidden border border-maxx-violet/20">
    <div className="bg-maxx-bg0 px-4 py-3 border-b border-maxx-violet/15 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/50" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <span className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <span className="text-sm font-mono text-maxx-sub">{title}</span>
      </div>
      <Terminal className="w-4 h-4 text-maxx-dim" />
    </div>
    <pre className="bg-maxx-bg0/80 p-6 overflow-x-auto">
      <code className="text-sm font-mono text-maxx-mid leading-relaxed whitespace-pre">{children}</code>
    </pre>
  </div>
);

// ─── page ─────────────────────────────────────────────────────
const Whitepaper = () => {
  const [activeSection, setActiveSection] = useState('abstract');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((window.scrollY / total) * 100);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const chartData = useMemo(() => {
    const baseRewardData = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000].map(rank => ({
      rank, label: rank >= 1e6 ? `${rank/1e6}M` : rank >= 1000 ? `${rank/1000}K` : String(rank),
      reward: (CONSTANTS.BASE_REWARD * CONSTANTS.DAMPENER_K) / (Math.sqrt(rank) + CONSTANTS.DAMPENER_K),
    }));

    const eamData = [1, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000, 2000000].map(rank => ({
      rank, label: rank >= 1e6 ? `${rank/1e6}M` : rank >= 1000 ? `${rank/1000}K` : String(rank),
      multiplier: rank > CONSTANTS.EA_MAX_RANK ? 1.0
        : CONSTANTS.EAM_MIN + ((CONSTANTS.EAM_MAX - CONSTANTS.EAM_MIN) * (CONSTANTS.EA_MAX_RANK - rank) / (CONSTANTS.EA_MAX_RANK - 1)),
    }));

    const lpmData = [1, 7, 14, 30, 90, 180, 365, 730, 1095, 1825].map(days => ({
      days, label: days >= 365 ? `${(days/365).toFixed(1)}y` : `${days}d`,
      multiplier: Math.min(CONSTANTS.LPM_MAX, 1.0 + CONSTANTS.LPM_COEFF * Math.sqrt(days)),
    }));

    const nemData = [1000, 5000, 10000, 50000, 100000, 250000, 500000, 1000000].map(globalRank => ({
      globalRank, label: globalRank >= 1e6 ? `${globalRank/1e6}M` : `${globalRank/1000}K`,
      multiplier: Math.min(CONSTANTS.NEM_MAX, 1.0 + CONSTANTS.NEM_COEFF * Math.sqrt(globalRank - 1000)),
    }));

    const rewardSimulation = [1, 100, 1000, 10000, 100000, 1000000, 10000000].map(rank => {
      const base = (CONSTANTS.BASE_REWARD * CONSTANTS.DAMPENER_K) / (Math.sqrt(rank) + CONSTANTS.DAMPENER_K);
      const eam  = rank > CONSTANTS.EA_MAX_RANK ? 1.0 : 1.0 + 2.0 * (CONSTANTS.EA_MAX_RANK - rank) / (CONSTANTS.EA_MAX_RANK - 1);
      const nem  = Math.min(CONSTANTS.NEM_MAX, 1.0 + CONSTANTS.NEM_COEFF * Math.sqrt(Math.max(rank * 2, rank + 50000) - rank));
      const lpm  = Math.min(CONSTANTS.LPM_MAX, 1.0 + CONSTANTS.LPM_COEFF * Math.sqrt(30));
      return { rank, label: rank >= 1e6 ? `${rank/1e6}M` : rank >= 1000 ? `${rank/1000}K` : String(rank), base, eam, nem, lpm, final: base * eam * nem * lpm };
    });

    return { baseRewardData, eamData, lpmData, nemData, rewardSimulation };
  }, []);

  const title       = "MAXXPAINN Technical Whitepaper — Proof-of-Patience Protocol";
  const description = "Full technical documentation for MAXXPAINN, a decentralized Proof-of-Patience token distribution protocol built on Solana.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description"        content={description} />
        <meta property="og:title"       content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content="https://maxxpainn.com/whitepaper" />
        <meta name="twitter:card"       content="summary_large_image" />
      </Helmet>

      {/* ── scroll progress bar ── */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-maxx-bg1 z-[60]">
        <div
          className="h-full bg-grad-accent transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="relative overflow-hidden">
          {/* ambient glows */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-20 left-10 w-96 h-96 bg-maxx-violet/20 rounded-full blur-3xl" />
            <div className="absolute top-60 right-10 w-96 h-96 bg-maxx-pink/10 rounded-full blur-3xl" />
          </div>

          {/* ── HERO ── */}
          <header className="relative pt-32 pb-16 border-b border-maxx-violet/15">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="text-center max-w-4xl mx-auto">

                {/* eyebrow badge */}
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-lg bg-maxx-bg1/80 border border-maxx-violet/25 mb-8">
                  <FileCode className="w-4 h-4 text-maxx-violet" />
                  <span className="eyebrow mb-0">Technical Whitepaper</span>
                  <span className="pill py-0.5">v1.1.0</span>
                </div>

                {/* title */}
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-6 leading-none">
                  <span className="text-maxx-white">MAXX</span>
                  <span className="bg-grad-accent bg-clip-text text-transparent">PAINN</span>
                </h1>

                <p className="text-xl md:text-2xl text-maxx-bright mb-3 leading-relaxed">
                  A Proof-of-Patience SocialFi Protocol
                </p>
                <p className="text-base text-maxx-sub mb-10">
                  Built on Solana · Powered by Time · Secured by Mathematics
                </p>

                {/* meta pills */}
                <div className="flex flex-wrap justify-center gap-3 text-sm mb-10">
                  {[
                    { label: 'Network',   value: 'Solana', tw: 'text-maxx-violet border-maxx-violet/30 bg-maxx-violet/10' },
                    { label: 'Framework', value: 'Anchor',  tw: 'text-blue-400   border-blue-400/30   bg-blue-400/10'     },
                    { label: 'Token',     value: 'SPL',     tw: 'text-green-400  border-green-400/30  bg-green-400/10'    },
                    { label: 'Decimals',  value: '1',       tw: 'text-maxx-pink  border-maxx-pink/30  bg-maxx-pink/10'    },
                    { label: 'Launch',    value: 'Fair',    tw: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'   },
                  ].map(({ label, value, tw }) => (
                    <div key={label} className={`px-4 py-2 rounded-lg border font-mono text-sm ${tw}`}>
                      <span className="text-maxx-white/40 mr-1">{label}:</span>
                      <span className="font-bold">{value}</span>
                    </div>
                  ))}
                </div>

                {/* quick stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
                  {[
                    { Icon: Coins,   label: 'Mint Cost',     value: 'Free + Storage' },
                    { Icon: Percent, label: 'Staking Yield', value: 'Up to 100%'     },
                    { Icon: Lock,    label: 'Min Lock',      value: '1 Day'          },
                    { Icon: Timer,   label: 'Max Lock',      value: '5 Years'        },
                  ].map(({ Icon, label, value }) => (
                    <div key={label} className="p-4 rounded-lg bg-maxx-bg1/80 border border-maxx-violet/20 text-center">
                      <Icon className="w-5 h-5 text-maxx-violet mx-auto mb-2" />
                      <p className="text-lg font-bold text-maxx-white">{value}</p>
                      <p className="text-sm text-maxx-sub uppercase tracking-wider mt-1 font-mono">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </header>

          {/* ── MAIN CONTENT ── */}
          <main className="relative py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="flex flex-col xl:flex-row gap-10">

                {/* ── SIDEBAR ── */}
                <aside className="xl:w-72 flex-shrink-0">
                  <div className="xl:sticky xl:top-24">
                    <div className="bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-5 mb-4 shadow-2xl">
                      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-maxx-violet/15">
                        <BookOpen className="w-4 h-4 text-maxx-violet" />
                        <h3 className="text-sm font-bold text-maxx-white uppercase tracking-widest font-mono">Contents</h3>
                      </div>
                      <nav className="space-y-0.5 max-h-[60vh] overflow-y-auto pr-1">
                        {TABLE_OF_CONTENTS.map((item, i) => (
                          <button
                            key={item.id}
                            onClick={() => scrollTo(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                              activeSection === item.id
                                ? 'bg-maxx-violet/15 border border-maxx-violet/30'
                                : 'hover:bg-maxx-violet/5 border border-transparent'
                            }`}
                          >
                            <span className="text-[0.6rem] font-mono text-maxx-dim group-hover:text-maxx-sub w-4">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <item.icon className={`w-3.5 h-3.5 flex-shrink-0 ${activeSection === item.id ? item.color : 'text-maxx-sub'}`} />
                            <span className={`text-sm font-medium font-mono ${activeSection === item.id ? 'text-maxx-violetLt' : 'text-maxx-sub group-hover:text-maxx-white'}`}>
                              {item.label}
                            </span>
                          </button>
                        ))}
                      </nav>
                    </div>

                    <a href="/MaxxPainn.pdf" target="_blank" rel="noopener noreferrer">
                      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-maxx-bg1/80 border border-maxx-violet/20 text-maxx-bright text-sm font-semibold hover:bg-maxx-violet/10 hover:border-maxx-violet/40 transition-all font-mono">
                        <FileCode className="w-4 h-4 text-maxx-violet" />
                        Download PDF
                      </button>
                    </a>
                  </div>
                </aside>

                {/* ── CONTENT ── */}
                <div className="flex-1 min-w-0 space-y-16">

                  {/* ── 01 ABSTRACT ── */}
                  <Section id="abstract">
                    <SectionHeader number="01" Icon={BookOpen} title="Abstract" badge="bg-maxx-violet/10 border-maxx-violet/30 text-maxx-violet" />
                    <Card>
                      <Lead>
                        MAXXPAINN is a decentralized SocialFi protocol on Solana introducing
                        <span className="text-maxx-violet font-semibold"> Proof-of-Patience (PoP)</span> —
                        a fair distribution model that rewards time over capital. Crypto trench
                        survivors share their stories, demonstrate patience, and mint liquid $MAXX
                        tokens 100% free.
                      </Lead>
                      <Para>
                        Built natively on Solana using the Anchor framework, MAXXPAINN implements a sophisticated
                        reward algorithm that dynamically calculates token distribution based on four independent
                        variables: participant rank, early adopter status, network growth contribution, and lock
                        duration commitment.
                      </Para>
                      <Para>
                        The protocol introduces a novel{' '}
                        <span className="text-maxx-violet font-semibold">Rank-Based Difficulty Adjustment</span>{' '}
                        system that progressively increases the cost of minting via account storage rent as
                        participation grows. This creates natural economic pressure that transitions the ecosystem
                        from mint-dominated to market-dominated token acquisition over time.
                      </Para>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <MetricCard label="Mint Cost"      value="FREE"  footnote="*Gas + Dynamic Storage Rent" border="border-green-500/30"      bg="bg-green-950/20"       text="text-green-400"      />
                        <MetricCard label="Standard" value="SPL"  footnote="SPL token Standard"    border="border-maxx-violet/30"     bg="bg-maxx-violet/10"     text="text-maxx-violetLt"  />
                        <MetricCard label="Decimals"       value="1"     footnote="Minimal fragmentation"       border="border-blue-500/30"        bg="bg-blue-950/20"        text="text-blue-400"       />
                      </div>
                    </Card>
                  </Section>

                  {/* ── 02 INTRODUCTION ── */}
                  <Section id="introduction">
                    <SectionHeader number="02" Icon={Sparkles} title="Introduction" badge="bg-maxx-pink/10 border-maxx-pink/30 text-maxx-pink" />
                    <Card>
                      <SubTitle Icon={AlertTriangle} iconClass="text-red-400">The Problem with Traditional Token Launches</SubTitle>
                      <Para>
                        The cryptocurrency ecosystem has long struggled with fundamental fairness issues.
                        VC allocation, insider trading, and bot sniping often leave retail users as exit liquidity.
                        Most launches reward speed and capital, not conviction.
                      </Para>
                      <div className="my-6 p-6 rounded-lg border border-maxx-violet/25 bg-maxx-violet/5">
                        <div className="eyebrow mb-3">
                          <span className="eyebrow-dot" />
                          The Core Thesis
                        </div>
                        <BlockQuote color="border-l-maxx-violet bg-maxx-violet/5">
                          "The longer you're willing to wait, the more you deserve to receive."
                        </BlockQuote>
                      </div>
                    </Card>
                  </Section>

                  {/* ── 03 ARCHITECTURE ── */}
                  <Section id="architecture">
                    <SectionHeader number="03" Icon={Boxes} title="Protocol Architecture" badge="bg-blue-500/10 border-blue-500/30 text-blue-400" />
                    <Card>
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-lg bg-maxx-bg0/60 border border-maxx-violet/15 mb-6">
                        {[
                          { Icon: Server,   label: 'Solana',  tw: 'bg-maxx-violet/10 border-maxx-violet/30 text-maxx-violet' },
                          { Icon: Cpu,      label: 'Program', tw: 'bg-blue-500/10    border-blue-500/30    text-blue-400'    },
                          { Icon: Database, label: 'PDAs',    tw: 'bg-green-500/10   border-green-500/30   text-green-400'   },
                        ].map(({ Icon, label, tw }, i, arr) => (
                          <React.Fragment key={label}>
                            <div className={`p-5 rounded-lg border text-center w-full md:w-auto flex-1 ${tw}`}>
                              <Icon className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-maxx-white font-bold font-mono">{label}</p>
                            </div>
                            {i < arr.length - 1 && (
                              <ArrowRight className="w-5 h-5 text-maxx-dim rotate-90 md:rotate-0 flex-shrink-0" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <Para>
                        The system is comprised of the core Program, PDA states for user Ranks and Difficulty
                        adjustments, and a centralized Treasury (managed via on-chain governance/authority) for
                        collecting storage fees.
                      </Para>
                    </Card>
                  </Section>

                  {/* ── 04 MINTING PROCESS ── */}
                  <Section id="minting-process">
                    <SectionHeader number="04" Icon={Workflow} title="The Minting Process" badge="bg-green-500/10 border-green-500/30 text-green-400" />
                    <Card>
                      <Lead>
                        Minting is a three-step process involving an initial commitment (Rank Claim) and a
                        delayed realization (Token Claim).
                      </Lead>
                      <div className="relative mt-6">
                        <div className="absolute left-6 top-0 bottom-0 w-px bg-grad-accent" />
                        <div className="space-y-6">
                          {[
                            { phase: '1', title: 'Claim Rank',   duration: 'Instant',         cost: 'Dynamic SOL', desc: 'The user begins the mint process by claiming their rank, choosing a lock duration, and committing to the protocol.' },
                            { phase: '2', title: 'Wait Period',  duration: '1 day – 5 years',  cost: 'None',        desc: 'The Proof-of-Patience phase. Users cannot access tokens until lock expires.' },
                            { phase: '3', title: 'Claim Tokens', duration: 'Instant',          cost: 'Gas Only',    desc: 'User mints tokens to their wallet. Must be done within 7 days of expiry to avoid penalty.' },
                          ].map(({ phase, title, duration, cost, desc }) => (
                            <div key={phase} className="relative pl-16">
                              <div className="absolute left-0 w-12 h-12 rounded-lg bg-maxx-bg1 border border-maxx-violet/30 flex items-center justify-center">
                                <span className="text-sm font-black text-maxx-white font-mono">{phase}</span>
                              </div>
                              <div className="p-5 rounded-lg bg-maxx-bg0/60 border border-maxx-violet/20">
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                  <h4 className="text-base font-bold text-maxx-white">{title}</h4>
                                  <div className="flex gap-2">
                                    <span className="pill">{duration}</span>
                                    <span className="pill text-green-400 border-green-500/25">{cost}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-maxx-mid">{desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </Section>

                  {/* ── 05 REWARD ALGORITHM ── */}
                  <Section id="reward-algorithm">
                    <SectionHeader number="05" Icon={Calculator} title="Reward Algorithm" badge="bg-yellow-500/10 border-yellow-500/30 text-yellow-400" />

                    <Card>
                      <Lead>
                        The reward calculation combines four independent multipliers to produce fair,
                        transparent, and incentive-aligned token distribution.
                      </Lead>
                      <Formula title="Master Reward Formula" border="border-yellow-500/30" bg="bg-yellow-950/20" text="text-yellow-400">
                        Reward = BaseReward × EAM × NEM × LPM × (1 − LatePenalty)
                      </Formula>
                    </Card>

                    <Card className="mt-6">
                      <SubTitle Icon={Binary} iconClass="text-maxx-violet">Component 1: Dampened Base Reward</SubTitle>
                      <Para>
                        Unlike simple exponential decay, MAXXPAINN uses a dampened inverse square root decay.
                        Early participants receive high rewards, but the drop-off is smoothed by the dampener
                        constant K, keeping rewards meaningful even at high ranks.
                      </Para>
                      <Formula title="Dampened Base Reward Formula" border="border-maxx-violet/30" bg="bg-maxx-violet/5" text="text-maxx-violetLt">
                        BaseReward = BASE × K / (√(rank) + K)
                      </Formula>
                      <ConstantsTable rows={[
                        { name: 'BASE_REWARD', value: '5,005,000', desc: 'Maximum base tokens' },
                        { name: 'DAMPENER_K',  value: '5,000',     desc: 'Smoothing constant'  },
                      ]} />
                      <BarChart
                        title="Base Reward Decay Curve"
                        badge="bg-maxx-violet/20 text-maxx-violetLt"
                        data={chartData.baseRewardData}
                        valueKey="reward"
                        labelKey="label"
                        formatValue={v => v >= 1e6 ? `${(v/1e6).toFixed(1)}M` : `${(v/1000).toFixed(0)}K`}
                        xLabel="Rank Number →"
                        barClass="bg-gradient-to-t from-maxx-violetDk to-maxx-violet group-hover:from-maxx-violet group-hover:to-maxx-violetLt"
                      />
                    </Card>

                    <Card className="mt-6">
                      <SubTitle Icon={Award} iconClass="text-yellow-400">Component 2: Early Adopter Multiplier (EAM)</SubTitle>
                      <Para>
                        Rewards participants who join when the protocol is young. Linearly decays from
                        3.0× for Rank #1 down to 1.0× for Rank #1,000,000.
                      </Para>
                      <Formula title="EAM Formula" border="border-yellow-500/30" bg="bg-yellow-950/20" text="text-yellow-400">
                        EAM = 1.0 + 2.0 × (1 − (rank − 1) / 999,999)
                      </Formula>
                      <BarChart
                        title="Early Adopter Multiplier Curve"
                        badge="bg-yellow-500/20 text-yellow-400"
                        data={chartData.eamData}
                        valueKey="multiplier"
                        labelKey="label"
                        formatValue={v => `${v.toFixed(2)}×`}
                        xLabel="Rank Number →"
                        barClass="bg-gradient-to-t from-yellow-600 to-yellow-400 group-hover:from-yellow-500 group-hover:to-yellow-300"
                        maxOverride={3}
                      />
                    </Card>

                    <Card className="mt-6">
                      <SubTitle Icon={Network} iconClass="text-blue-400">Component 3: Network Effect Multiplier (NEM)</SubTitle>
                      <Para>
                        NEM rewards patience by measuring how many users joined <em>after</em> you.
                        Uses a square root curve to heavily reward the first wave of followers.
                      </Para>
                      <Formula title="NEM Formula" border="border-blue-500/30" bg="bg-blue-950/20" text="text-blue-400">
                        NEM = min(3.0, 1.0 + 0.004 × √(GlobalRank − UserRank))
                      </Formula>
                      <ConstantsTable rows={[
                        { name: 'NEM_COEFF', value: '0.004', desc: 'Growth curve coefficient'  },
                        { name: 'NEM_MAX',   value: '3.0×',  desc: 'Maximum network bonus cap' },
                      ]} />
                      <BarChart
                        title="Network Effect Multiplier (User Rank: 1,000)"
                        badge="bg-blue-500/20 text-blue-400"
                        data={chartData.nemData}
                        valueKey="multiplier"
                        labelKey="label"
                        formatValue={v => `${v.toFixed(2)}×`}
                        xLabel="Global Rank →"
                        barClass="bg-gradient-to-t from-blue-600 to-blue-400 group-hover:from-blue-500 group-hover:to-blue-300"
                        maxOverride={3}
                      />
                    </Card>

                    <Card className="mt-6">
                      <SubTitle Icon={Lock} iconClass="text-maxx-pink">Component 4: Lock Period Multiplier (LPM)</SubTitle>
                      <Para>
                        The LPM incentivizes long-term commitment. By locking tokens for extended periods,
                        users can multiply their rewards significantly.
                      </Para>
                      <Formula title="LPM Formula" border="border-maxx-pink/30" bg="bg-maxx-pink/5" text="text-maxx-pinkLt">
                        LPM = min(5.0, 1.0 + 0.08 × √(lockDays))
                      </Formula>
                      <ConstantsTable rows={[
                        { name: 'LPM_COEFF', value: '0.08',    desc: 'Duration scaling factor' },
                        { name: 'LPM_MAX',   value: '5.0×',    desc: 'Maximum lock multiplier'  },
                        { name: 'MAX_LOCK',  value: '5 years', desc: '~1825 days'               },
                      ]} />
                      <BarChart
                        title="Lock Period Multiplier Curve"
                        badge="bg-maxx-pink/20 text-maxx-pinkLt"
                        data={chartData.lpmData}
                        valueKey="multiplier"
                        labelKey="label"
                        formatValue={v => `${v.toFixed(2)}×`}
                        xLabel="Lock Duration →"
                        barClass="bg-gradient-to-t from-maxx-pinkDk to-maxx-pink group-hover:from-maxx-pink group-hover:to-maxx-pinkLt"
                        maxOverride={5}
                      />
                    </Card>

                    {/* simulation table */}
                    <Card className="mt-6">
                      <SubTitle Icon={Calculator} iconClass="text-green-400">Live Simulation Table</SubTitle>
                      <Para>Reward calculation assuming 30-day lock and moderate network growth.</Para>
                      <div className="overflow-x-auto rounded-lg border border-maxx-violet/15">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-maxx-bg0/60">
                              {['Rank','Base','EAM','NEM','LPM','Total'].map(h => (
                                <th key={h} className={`py-3 px-4 text-maxx-sub font-bold font-mono ${h === 'Rank' ? 'text-left' : 'text-right'}`}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {chartData.rewardSimulation.map((item, i) => (
                              <tr key={i} className="border-t border-maxx-violet/10 hover:bg-maxx-violet/5">
                                <td className="py-3 px-4 text-maxx-white font-mono">#{item.label}</td>
                                <td className="py-3 px-4 text-right text-maxx-violetLt font-mono">{(item.base/1000).toFixed(0)}K</td>
                                <td className="py-3 px-4 text-right text-yellow-400 font-mono">{item.eam.toFixed(2)}×</td>
                                <td className="py-3 px-4 text-right text-blue-400 font-mono">{item.nem.toFixed(2)}×</td>
                                <td className="py-3 px-4 text-right text-maxx-pinkLt font-mono">{item.lpm.toFixed(2)}×</td>
                                <td className="py-3 px-4 text-right text-green-400 font-bold font-mono">
                                  {item.final >= 1e9 ? `${(item.final/1e9).toFixed(2)}B` : item.final >= 1e6 ? `${(item.final/1e6).toFixed(2)}M` : `${(item.final/1000).toFixed(0)}K`}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </Section>

                  {/* ── 06 DIFFICULTY SYSTEM ── */}
                  <Section id="difficulty-system">
                    <SectionHeader number="06" Icon={Gauge} title="Rank-Based Difficulty System" badge="bg-red-500/10 border-red-500/30 text-red-400" />
                    <Card>
                      <Lead>
                        The Difficulty System leverages Solana's native rent mechanism to introduce a storage
                        cost barrier that scales with the eighth root of the rank, preventing protocol abuse
                        and acting as an anti-bot mechanism.
                      </Lead>
                      <Formula title="Storage Fee Formula" border="border-red-500/30" bg="bg-red-950/20" text="text-red-400">
                        Fee = 0.003 SOL × 3 × ⁸√rank
                      </Formula>
                      <Para>
                        The base fee is 0.003 SOL. The scaler is 3. The 8th root ensures that cost doubles only
                        after extremely large jumps in rank — keeping the protocol accessible while deterring
                        massive bot swarms.
                      </Para>
                      <CodeBlock title="get_storage_fee(rank)">{`// Native Rust Implementation (No Floats)
fn get_storage_fee(rank_no: u64) -> u64 {
    let base = 3_000_000; // 0.003 SOL in lamports
    let scale = 3;

    // 8th root = sqrt(sqrt(sqrt(rank)))
    let root = rank_no.isqrt().isqrt().isqrt();
    
    return base * root * scale;
}`}</CodeBlock>
                      <div className="my-4 p-5 rounded-lg bg-maxx-bg0/60 border border-maxx-violet/15">
                        <h4 className="text-sm font-bold text-maxx-sub uppercase tracking-wider mb-4 font-mono">Difficulty (Storage Fee) Growth</h4>
                        <div className="h-32 flex items-end justify-between gap-2">
                          {[{rank:1,label:'1'},{rank:256,label:'256'},{rank:65536,label:'65K'},{rank:16777216,label:'16M'},{rank:4294967296,label:'4B'}].map((item, i) => {
                            const root = Math.pow(item.rank, 1/8);
                            const max  = Math.pow(4294967296, 1/8);
                            const h    = (root / max) * 100;
                            return (
                              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full relative h-24 flex items-end">
                                  <div className="w-full bg-gradient-to-t from-red-700 to-red-400 rounded-t group-hover:from-red-600 group-hover:to-red-300 transition-all"
                                       style={{ height: `${h}%`, minHeight: 4 }} />
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-maxx-bg0 border border-maxx-violet/20 rounded text-sm text-maxx-white opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                                    {root.toFixed(2)}× base
                                  </div>
                                </div>
                                <span className="text-sm text-maxx-sub font-mono">{item.label}</span>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-sm text-maxx-sub text-center mt-3 font-mono">Rank Number (Log Scale)</p>
                      </div>
                    </Card>
                  </Section>

                  {/* ── 07 LOCK TIERS ── */}
                  <Section id="lock-tiers">
                    <SectionHeader number="07" Icon={Timer} title="Lock Period Tiers" badge="bg-cyan-500/10 border-cyan-500/30 text-cyan-400" />
                    <Card>
                      <Lead>Max lock durations are gated by rank to prevent extreme multipliers early on.</Lead>
                      <div className="overflow-x-auto rounded-lg border border-maxx-violet/15">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-maxx-bg0/60">
                              <th className="text-left py-3 px-4 text-maxx-sub font-bold uppercase tracking-wider font-mono">Rank Range</th>
                              <th className="text-left py-3 px-4 text-maxx-sub font-bold uppercase tracking-wider font-mono">Max Lock</th>
                              <th className="text-left py-3 px-4 text-maxx-sub font-bold uppercase tracking-wider font-mono">Max LPM</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { range: '0 – 100,000',  lock: 30   },
                              { range: '100K – 1M',    lock: 90   },
                              { range: '1M – 5M',      lock: 180  },
                              { range: '5M – 10M',     lock: 360  },
                              { range: '10M – 100M',   lock: 480  },
                              { range: '100M – 400M',  lock: 540  },
                              { range: '400M – 1B',    lock: 720  },
                              { range: '1B+',          lock: 1825 },
                            ].map((row, i) => (
                              <tr key={i} className="border-t border-maxx-violet/10 hover:bg-maxx-violet/5">
                                <td className="py-3 px-4 font-mono text-maxx-white">{row.range}</td>
                                <td className="py-3 px-4 font-bold text-cyan-400 font-mono">{row.lock} days</td>
                                <td className="py-3 px-4 font-mono text-maxx-pinkLt">~{getLPMForDays(row.lock)}×</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </Section>

                  {/* ── 08 LATE PENALTY ── */}
                  <Section id="late-penalty">
                    <SectionHeader number="08" Icon={AlertTriangle} title="Late Mint Penalty" badge="bg-orange-500/10 border-orange-500/30 text-orange-400" />
                    <Card>
                      <Para>
                        Claiming must occur within 7 days of lock expiry. The penalty curve is aggressive
                        (exponential). Miss the window entirely and you lose nearly all rewards.
                      </Para>
                      <div className="my-4 p-5 rounded-lg bg-maxx-bg0/60 border border-maxx-violet/15">
                        <h4 className="text-sm font-bold text-maxx-sub uppercase tracking-wider mb-4 font-mono">Late Claim Penalty Schedule</h4>
                        <div className="grid grid-cols-8 gap-2">
                          {[{day:0,p:0},{day:1,p:1},{day:2,p:3},{day:3,p:8},{day:4,p:17},{day:5,p:35},{day:6,p:72},{day:'7+',p:99}].map((item, i) => (
                            <div key={i} className="text-center group">
                              <div className="h-24 flex items-end justify-center mb-2">
                                <div
                                  className="w-full bg-gradient-to-t from-red-700 to-red-400 rounded-t group-hover:from-red-600 group-hover:to-red-300 transition-all"
                                  style={{ height: `${item.p}%`, minHeight: item.p > 0 ? 4 : 0 }}
                                />
                              </div>
                              <p className="text-sm text-maxx-sub font-mono">Day {item.day}</p>
                              <p className="text-sm font-bold text-red-400 font-mono">{item.p}%</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </Section>

                  {/* ── 09 CLAN SYSTEM ── */}
                  <Section id="clan-system">
                    <SectionHeader number="09" Icon={Users} title="Clan System" badge="bg-maxx-violet/10 border-maxx-violet/30 text-maxx-violet" />
                    <Card>
                      <Lead>Clans drive organic growth via instant on-chain referral rewards.</Lead>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                        {[
                          { Icon: Users,   tw: 'bg-maxx-violet/10 border-maxx-violet/30 text-maxx-violet', title: 'Create or Join', desc: 'Join an existing clan or create your own to start earning referral rewards.' },
                          { Icon: Network, tw: 'bg-blue-500/10    border-blue-500/30    text-blue-400',    title: 'Share & Grow',   desc: 'Share your clan link. Every new mint through your referral earns SOL.' },
                          { Icon: Coins,   tw: 'bg-green-500/10   border-green-500/30   text-green-400',   title: 'Earn Forever',   desc: `Referral rewards are paid instantly on-chain: ${mintConfig.mintRewardUsd} USD equivalent.` },
                        ].map(({ Icon, tw, title, desc }) => (
                          <div key={title} className="p-5 rounded-lg bg-maxx-bg0/60 border border-maxx-violet/20 text-center card-hover">
                            <div className={`w-14 h-14 rounded-lg border flex items-center justify-center mx-auto mb-4 ${tw}`}>
                              <Icon className="w-7 h-7" />
                            </div>
                            <h4 className="font-bold text-maxx-white mb-2">{title}</h4>
                            <p className="text-sm text-maxx-mid">{desc}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </Section>

                  {/* ── 10 STAKING ── */}
                  <Section id="staking">
                    <SectionHeader number="10" Icon={Gem} title="Staking Protocol" badge="bg-emerald-500/10 border-emerald-500/30 text-emerald-400" />
                    <Card>
                      <Lead>
                        Beyond the initial distribution, MAXXPAINN offers a robust staking mechanism allowing
                        holders to earn yield by re-locking their claimed tokens.
                      </Lead>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                        <div className="p-5 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                          <h4 className="font-bold text-emerald-400 mb-4 font-mono uppercase tracking-wider text-sm">Staking Parameters</h4>
                          <ul className="space-y-3">
                            {[
                              { k: 'Min Lock',      v: '1 Day',                tw: 'text-maxx-white'  },
                              { k: 'Max Lock',      v: '3 Years (1095 Days)',   tw: 'text-maxx-white'  },
                              { k: 'Max APY',       v: '100%',                  tw: 'text-maxx-white'  },
                              { k: 'Early Unstake', v: '25% Penalty',           tw: 'text-red-400'     },
                            ].map(({ k, v, tw }) => (
                              <li key={k} className="flex justify-between items-center border-b border-maxx-violet/10 pb-3 last:border-0 last:pb-0">
                                <span className="text-maxx-sub text-sm">{k}</span>
                                <span className={`font-mono font-semibold text-sm ${tw}`}>{v}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-col gap-4">
                          <Para className="mb-0">
                            The staking protocol is designed to reduce circulating supply after the mint phase.
                            Yield is derived from protocol revenue and allocated treasury funds.
                          </Para>
                          <div className="p-4 rounded-lg bg-red-950/20 border border-red-500/20">
                            <h5 className="flex items-center gap-2 text-red-400 font-bold text-sm mb-2">
                              <AlertTriangle className="w-4 h-4" />
                              Penalty Warning
                            </h5>
                            <p className="text-sm text-maxx-mid">
                              Unstaking before your term ends results in a flat 25% penalty on the principal.
                              Patience is enforced strictly.
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Section>

                  {/* ── 11 ON-CHAIN STATE ── */}
                  <Section id="on-chain-state">
                    <SectionHeader number="11" Icon={Database} title="On-Chain State" badge="bg-indigo-500/10 border-indigo-500/30 text-indigo-400" />
                    <Card>
                      <div className="space-y-5 mt-4">
                        {[
                          { name: 'MainConfig',     seeds: ['main_config'],           color: 'text-maxx-violet', fields: [{ n:'authority', t:'Pubkey', d:'Admin address' },{ n:'treasury', t:'Pubkey', d:'Fee recipient' },{ n:'difficulty_base_fee', t:'u64', d:'0.003 SOL' },{ n:'difficulty_scale', t:'[u64; 2]', d:'[3, 1]' }] },
                          { name: 'GlobalRank',     seeds: ['global_rank'],           color: 'text-blue-400',    fields: [{ n:'value', t:'u64', d:'Current global rank counter' }] },
                          { name: 'RankInfo',       seeds: ['rank_info','owner'],     color: 'text-green-400',   fields: [{ n:'owner', t:'Pubkey', d:'Participant address' },{ n:'rank_no', t:'u64', d:'Assigned rank number' },{ n:'wait_period_secs', t:'u64', d:'Lock duration' },{ n:'has_minted', t:'bool', d:'Claim status' }] },
                          { name: 'RankDifficulty', seeds: ['rank_difficulty','owner'],color: 'text-red-400',    fields: [{ n:'raw_data', t:'bytes', d:'Variable size buffer' }] },
                        ].map((acc) => (
                          <div key={acc.name} className="p-5 rounded-lg bg-maxx-bg0/60 border border-maxx-violet/15">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                              <h4 className={`font-bold font-mono text-base ${acc.color}`}>{acc.name}</h4>
                              <div className="flex gap-2 flex-wrap">
                                {acc.seeds.map(s => (
                                  <span key={s} className="pill">{s}</span>
                                ))}
                              </div>
                            </div>
                            <table className="w-full text-sm">
                              <tbody>
                                {acc.fields.map(f => (
                                  <tr key={f.n} className="border-t border-maxx-violet/10">
                                    <td className="py-2 font-mono text-cyan-400 w-40 pr-4">{f.n}</td>
                                    <td className="py-2 font-mono text-maxx-sub w-24 pr-4">{f.t}</td>
                                    <td className="py-2 text-maxx-mid">{f.d}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </Section>

                  {/* ── 12 SECURITY ── */}
                  <Section id="security">
                    <SectionHeader number="12" Icon={Shield} title="Security Model" badge="bg-green-500/10 border-green-500/30 text-green-400" />
                    <Card>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {[
                          { Icon: Key,    title: 'PDA Validation',     desc: 'Deterministic account derivation ensures secure state management.'    },
                          { Icon: Shield, title: 'Reentrancy Guard',   desc: 'Checks-Effects-Interactions pattern strictly enforced.'                },
                          { Icon: Siren,  title: 'Checked Arithmetic', desc: 'Overflow/Underflow protection on all math operations.'                 },
                          { Icon: Lock,   title: 'Treasury Safety',    desc: 'Fee destination hardcoded to config authority.'                        },
                        ].map(({ Icon, title, desc }) => (
                          <div key={title} className="flex gap-4 p-5 rounded-lg bg-maxx-bg0/60 border border-green-500/20">
                            <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 h-fit">
                              <Icon className="w-4 h-4 text-green-400" />
                            </div>
                            <div>
                              <h4 className="font-bold text-maxx-white mb-1">{title}</h4>
                              <p className="text-sm text-maxx-mid">{desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </Section>

                  {/* ── 13 ECONOMICS ── */}
                  <Section id="economics">
                    <SectionHeader number="13" Icon={BarChart3} title="Economic Analysis" badge="bg-emerald-500/10 border-emerald-500/30 text-emerald-400" />
                    <Card>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                        <div className="p-5 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                          <h4 className="font-bold text-emerald-400 mb-4 font-mono uppercase tracking-wider text-sm">Supply Dynamics</h4>
                          <ul className="space-y-3">
                            {['Smooth dampened decay curve', 'High precision (1 decimal) reduces dust'].map(t => (
                              <li key={t} className="flex items-start gap-2 text-sm text-maxx-mid">
                                <ChevronRight className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />{t}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-5 rounded-lg bg-blue-950/20 border border-blue-500/20">
                          <h4 className="font-bold text-blue-400 mb-4 font-mono uppercase tracking-wider text-sm">Equilibrium</h4>
                          <ul className="space-y-3">
                            {['Difficulty rises with rank^0.125', 'Staking removes supply from circulation'].map(t => (
                              <li key={t} className="flex items-start gap-2 text-sm text-maxx-mid">
                                <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />{t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </Section>

                  {/* ── 14 CONCLUSION ── */}
                  <Section id="conclusion">
                    <SectionHeader number="14" Icon={Rocket} title="Conclusion" badge="bg-maxx-pink/10 border-maxx-pink/30 text-maxx-pink" />
                    <div className="bg-maxx-bg1/80 border-2 border-maxx-violet/30 rounded-lg p-10 md:p-14 shadow-2xl shadow-maxx-violet/10 text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-maxx-violet/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-maxx-pink/30 to-transparent" />

                      <Flame className="w-14 h-14 text-maxx-violet mx-auto mb-8" />

                      <h2 className="text-4xl md:text-5xl font-black text-maxx-white mb-5 tracking-tight">
                        The Future is{' '}
                        <span className="bg-grad-accent bg-clip-text text-transparent">
                          Awesome
                        </span>
                      </h2>

                      <p className="text-xl text-maxx-bright mb-8 leading-relaxed max-w-2xl mx-auto">
                        MAXXPAINN represents a paradigm shift in fair token distribution.
                        The math is updated. The difficulty is set. The timer starts now.
                      </p>

                      <Link to="/mint">
                        <Button variant="primary" skewed className="shadow-[0_0_30px_rgba(255,45,120,0.25)]">
                          <Flame size={16} />
                          START YOUR JOURNEY
                          <ArrowRight size={16} />
                        </Button>
                      </Link>
                    </div>
                  </Section>

                </div>{/* end content */}
              </div>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Whitepaper;
