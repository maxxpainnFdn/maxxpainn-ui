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
  Gem, Percent, Skull
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import mintConfig from "@/config/mint";
import Button from '@/components/button/Button';

// ─── constants ────────────────────────────────────────────────
const CONSTANTS = {
  BASE_REWARD: 10_010,
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
  { id: 'introduction',      label: 'Introduction',          icon: Flame,         color: 'text-maxx-pink'    },
  { id: 'architecture',      label: 'Weaponized State',      icon: Boxes,         color: 'text-blue-400'     },
  { id: 'minting-process',   label: 'The Gauntlet',          icon: Workflow,      color: 'text-green-400'    },
  { id: 'reward-algorithm',  label: 'Laws of Pain',          icon: Calculator,    color: 'text-yellow-400'   },
  { id: 'clan-system',       label: 'Clan System',           icon: Skull,         color: 'text-maxx-violet'  },
];

// ─── helpers ──────────────────────────────────────────────────
const getLPMForDays = (days) =>
  Math.min(CONSTANTS.LPM_MAX, 1.0 + CONSTANTS.LPM_COEFF * Math.sqrt(days)).toFixed(2);

// ─── sub-components ───────────────────────────────────────────

const BlockQuote = ({ color = 'border-l-maxx-violet bg-maxx-violet/5', children }) => (
  <p className={`text-base leading-[1.85] border-l-4 pl-6 py-3 rounded-r-md text-maxx-bright font-mono ${color}`}>
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
  <h3 className="flex items-center gap-3 text-lg sm:text-xl font-bold text-maxx-white mb-5 uppercase tracking-wider">
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
    <p className="text-purple-300 text-sm font-semibold uppercase tracking-widest mb-2 font-mono">{label}</p>
    <p className={`text-4xl font-black ${text}`}>{value}</p>
    <p className="text-violet-400 font-semibold text-xs uppercase mt-2 opacity-70">{footnote}</p>
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
            <th className="text-left py-2 px-4 text-maxx-sub font-medium font-mono">Variable</th>
            <th className="text-left py-2 px-4 text-maxx-sub font-medium font-mono">Value</th>
            <th className="text-left py-2 px-4 text-maxx-sub font-medium">Impact</th>
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

    return { baseRewardData, eamData };
  }, []);

  const title       = "MAXXPAINN Technical Whitepaper — Proof-of-Patience Protocol";
  const description = "Forged in gas. Paid in dust. The definitive guide to MAXXPAINN's state-backed tokenomics and social warfare mechanics.";

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
          className="h-full bg-red-600 transition-all duration-150 shadow-[0_0_10px_rgba(220,38,38,0.8)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="min-h-screen bg-background font-sans text-maxx-mid selection:bg-maxx-pink/30 selection:text-white">
        <Navigation />

        <div className="relative overflow-hidden">
          {/* ambient glows */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-20 left-10 w-96 h-96 bg-red-900/20 rounded-full blur-[100px]" />
            <div className="absolute top-60 right-10 w-96 h-96 bg-maxx-violet/10 rounded-full blur-[100px]" />
          </div>

          {/* ── HERO ── */}
          <header className="relative pt-32 pb-16 border-b border-maxx-violet/15">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="text-center max-w-4xl mx-auto">

                {/* eyebrow badge */}
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-sm bg-black border border-red-900/50 mb-8 shadow-[0_0_15px_rgba(220,38,38,0.15)]">
                  <Skull className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest font-mono">Classified Doctrine</span>
                  <span className="px-2 py-0.5 bg-red-950 text-red-400 text-xs font-mono rounded">v1.1.0</span>
                </div>

                {/* title */}
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-6 leading-none">
                  <span className="text-maxx-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">MAXX</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-maxx-violet drop-shadow-lg">PAINN</span>
                </h1>

                <p className="text-xl md:text-2xl text-maxx-bright mb-3 leading-relaxed font-bold uppercase tracking-wider">
                  Forged in gas. Paid in dust.
                </p>
                <p className="text-base text-maxx-sub mb-10 font-mono">
                  For those the market has painned. Time over capital.
                </p>

                {/* meta pills */}
                <div className="flex flex-wrap justify-center gap-3 text-sm mb-10">
                  {[
                    { label: 'Network',   value: 'Solana', tw: 'text-maxx-violet border-maxx-violet/30 bg-maxx-violet/10' },
                    { label: 'Consensus', value: 'Proof-of-Patience',  tw: 'text-red-400 border-red-500/30 bg-red-500/10' },
                    { label: 'Token',     value: 'SPL-2022', tw: 'text-maxx-pink border-maxx-pink/30 bg-maxx-pink/10' },
                    { label: 'Launch',    value: 'Zero VC', tw: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' },
                  ].map(({ label, value, tw }) => (
                    <div key={label} className={`px-4 py-2 rounded-sm border font-mono text-sm uppercase ${tw}`}>
                      <span className="opacity-60 mr-2">{label}:</span>
                      <span className="font-bold">{value}</span>
                    </div>
                  ))}
                </div>

                {/* quick stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
                  {[
                    { Icon: Coins,   label: 'Mint Cost',     value: 'Free' },
                    { Icon: Percent, label: 'VC Allocation', value: '0%' },
                    { Icon: Lock,    label: 'Min Lock',      value: '1 Day' },
                    { Icon: Timer,   label: 'Max Lock',      value: '5 Years' },
                  ].map(({ Icon, label, value }) => (
                    <div key={label} className="p-4 rounded-sm bg-black/50 border border-maxx-violet/20 text-center backdrop-blur-sm">
                      <Icon className="w-5 h-5 text-maxx-violet mx-auto mb-2 opacity-80" />
                      <p className="text-lg font-black text-maxx-white font-mono">{value}</p>
                      <p className="text-xs text-maxx-sub uppercase tracking-wider mt-1 font-mono">{label}</p>
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
                    <div className="bg-black/60 border border-maxx-violet/20 rounded-sm p-5 mb-4 shadow-2xl backdrop-blur-md">
                      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-maxx-violet/15">
                        <Terminal className="w-4 h-4 text-maxx-violet" />
                        <h3 className="text-sm font-bold text-maxx-white uppercase tracking-widest font-mono">Index</h3>
                      </div>
                      <nav className="space-y-0.5 max-h-[60vh] overflow-y-auto pr-1">
                        {TABLE_OF_CONTENTS.map((item, i) => (
                          <button
                            key={item.id}
                            onClick={() => scrollTo(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-all duration-200 group ${
                              activeSection === item.id
                                ? 'bg-maxx-violet/15 border-l-2 border-l-maxx-violet border-y border-r border-transparent'
                                : 'hover:bg-maxx-violet/5 border-l-2 border-transparent'
                            }`}
                          >
                            <span className="text-[0.6rem] font-mono text-maxx-dim group-hover:text-maxx-sub w-4">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <item.icon className={`w-3.5 h-3.5 flex-shrink-0 ${activeSection === item.id ? item.color : 'text-maxx-sub'}`} />
                            <span className={`text-sm font-bold uppercase tracking-wide font-mono ${activeSection === item.id ? 'text-maxx-violetLt' : 'text-maxx-sub group-hover:text-maxx-white'}`}>
                              {item.label}
                            </span>
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                </aside>

                {/* ── CONTENT ── */}
                <div className="flex-1 min-w-0 space-y-20">

                  {/* ── 01 ABSTRACT ── */}
                  <Section id="abstract">
                    <SectionHeader number="01" Icon={BookOpen} title="Abstract" badge="bg-maxx-violet/10 border-maxx-violet/30 text-maxx-violet" />
                    <Card border="border-maxx-violet/30 bg-black/40">
                      <Lead>
                        MAXXPAINN is a completely decentralized SocialFi protocol on Solana introducing
                        <span className="text-maxx-violet font-bold"> Proof-of-Patience (PoP)</span> —
                        a brutalist distribution model that rewards conviction over capital. Crypto trench survivors share their stories, prove their patience, and mint liquid $MAXX tokens 100% free.
                      </Lead>
                      <Para>
                        The protocol utilizes Solana's native rent requirements as a dynamic difficulty adjustment mechanism. Instead of relying on empty promises or VC presales, the cost to mint scales dynamically with network usage via physical state storage. 
                      </Para>
                      <Para>
                        This creates immense economic pressure that transforms the ecosystem from a mint-dominated distribution to a market-dominated asset, all secured by deterministic on-chain mathematics.
                      </Para>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <MetricCard label="Mint Cost"      value="FREE"  footnote="*Gas + Dynamic Storage Rent" border="border-green-500/30"      bg="bg-green-950/20"       text="text-green-400"      />
                        <MetricCard label="Standard" value="SPL-22"  footnote="Token-2022 Extensions"    border="border-maxx-violet/30"     bg="bg-maxx-violet/10"     text="text-maxx-violetLt"  />
                        <MetricCard label="Decimals"       value="1"     footnote="Maximal density"        border="border-red-500/30"        bg="bg-red-950/20"        text="text-red-400"        />
                      </div>
                    </Card>
                  </Section>

                  {/* ── 02 INTRODUCTION ── */}
                  <Section id="introduction">
                    <SectionHeader number="02" Icon={Flame} title="The Market is a Warzone" badge="bg-red-500/10 border-red-500/30 text-red-500" />
                    <Card border="border-red-900/30 bg-black/40">
                      <SubTitle Icon={AlertTriangle} iconClass="text-red-500">The Slaughterhouse of Traditional Launches</SubTitle>
                      <Para>
                        The crypto industry is fundamentally broken. VC allocations, insider trading, and bot sniping ensure that retail participants are almost always treated as exit liquidity. Most token launches reward speed, capital, and proximity to the developers. They do not reward loyalty. They do not reward resilience.
                      </Para>
                      <div className="my-6 p-6 rounded-sm border border-red-900/50 bg-red-950/10">
                        <div className="eyebrow mb-3 text-red-400 border-red-900/50">
                          <span className="eyebrow-dot bg-red-500" />
                          The Core Thesis
                        </div>
                        <BlockQuote color="border-l-red-600 bg-red-950/20 text-red-100">
                          "The longer you bleed, the more you deserve to breathe. Capital is temporary; patience is absolute."
                        </BlockQuote>
                      </div>
                    </Card>
                  </Section>

                  {/* ── 03 ARCHITECTURE ── */}
                  <Section id="architecture">
                    <SectionHeader number="03" Icon={Boxes} title="Weaponized State" badge="bg-blue-500/10 border-blue-500/30 text-blue-400" />
                    <Card border="border-blue-900/30 bg-black/40">
                      <Lead>
                        We do not use artificial barriers. We weaponize the physical constraints of the Solana ledger.
                      </Lead>
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-sm bg-black/60 border border-blue-900/30 mb-6">
                        {[
                          { Icon: Server,   label: 'Solana L1',  tw: 'bg-black border-maxx-violet/30 text-maxx-violet' },
                          { Icon: Cpu,      label: 'Anchor Logic', tw: 'bg-black border-blue-500/30 text-blue-400'    },
                          { Icon: Database, label: 'PDA Vaults',    tw: 'bg-black border-red-500/30 text-red-500'   },
                        ].map(({ Icon, label, tw }, i, arr) => (
                          <React.Fragment key={label}>
                            <div className={`p-5 rounded-sm border text-center w-full md:w-auto flex-1 ${tw}`}>
                              <Icon className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-white font-bold font-mono uppercase text-sm tracking-widest">{label}</p>
                            </div>
                            {i < arr.length - 1 && (
                              <ArrowRight className="w-5 h-5 text-maxx-dim rotate-90 md:rotate-0 flex-shrink-0" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <Para>
                        Instead of an arbitrary hashing difficulty, the cost to mint is pegged to the physical growth of the protocol’s state via Rent-Exempt requirements. Furthermore, <span className="text-red-400 font-bold">only the protocol can close accounts</span>. This solves the "rent-drain" problem, allowing the protocol to harvest the rent to fund its own decentralized treasury. 
                      </Para>
                    </Card>
                  </Section>

                  {/* ── 04 MINTING PROCESS ── */}
                  <Section id="minting-process">
                    <SectionHeader number="04" Icon={Workflow} title="The Gauntlet" badge="bg-green-500/10 border-green-500/30 text-green-400" />
                    <Card border="border-green-900/30 bg-black/40">
                      <Lead>
                        Minting is not a click. It is a commitment. It requires a high tolerance for delayed gratification.
                      </Lead>
                      <div className="relative mt-8">
                        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-green-500/50 to-transparent" />
                        <div className="space-y-8">
                          {[
                            { phase: '1', title: 'The Blood Oath (Claim Rank)',  duration: 'Instant Execution',         cost: 'Dynamic SOL', desc: 'The user begins by permanently committing their story of market trauma to the ledger, locking in their rank and selecting a wait duration.' },
                            { phase: '2', title: 'The Trench (Wait Period)',  duration: '1 day – 5 years',  cost: 'Patience',        desc: 'The defining characteristic of MAXXPAINN. Tokens are utterly inaccessible. You wait, or you get nothing.' },
                            { phase: '3', title: 'The Extraction (Claim)', duration: '7-Day Window',          cost: 'Gas Only',    desc: 'The lock expires. You have exactly 7 days to mint your tokens. Miss the window, and severe late penalties destroy your allocation.' },
                          ].map(({ phase, title, duration, cost, desc }) => (
                            <div key={phase} className="relative pl-16">
                              <div className="absolute left-0 w-12 h-12 rounded-sm bg-black border-2 border-green-900 flex items-center justify-center z-10 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                                <span className="text-lg font-black text-green-500 font-mono">{phase}</span>
                              </div>
                              <div className="p-6 rounded-sm bg-black/60 border border-green-900/30 hover:border-green-500/50 transition-colors">
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                  <h4 className="text-lg font-bold text-white uppercase tracking-wide font-mono">{title}</h4>
                                  <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-black border border-maxx-dim rounded text-xs font-mono text-maxx-sub">{duration}</span>
                                    <span className="px-2 py-1 bg-green-950/30 border border-green-500/30 rounded text-xs font-mono text-green-400">{cost}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-maxx-mid leading-relaxed">{desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </Section>

                  {/* ── 05 REWARD ALGORITHM ── */}
                  <Section id="reward-algorithm">
                    <SectionHeader number="05" Icon={Calculator} title="The Laws of Pain" badge="bg-yellow-500/10 border-yellow-500/30 text-yellow-400" />
                    
                    <Card border="border-yellow-900/30 bg-black/40">
                      <Lead>
                        No VC backdoor deals. The MAXXPAINN token distribution is brutally mathematical, governed entirely by deterministic variables.
                      </Lead>
                      <Formula title="Master Issuance Equation" border="border-yellow-500/30" bg="bg-black" text="text-yellow-400">
                        Final MAXX = BaseReward × EAM × NEM × LPM × (1 − LatePenalty)
                      </Formula>
                    </Card>

                    <Card className="mt-6 bg-black/40 border-maxx-violet/20">
                      <SubTitle Icon={Binary} iconClass="text-maxx-violet">Variable 1: Dampened Base Emission</SubTitle>
                      <Para>
                        Unlike reckless XEN clones that hyperinflate instantly, MAXXPAINN utilizes an inverse square root decay stabilized by a dampening constant (K). The early bird gets the worm, but the supply curve remains stable.
                      </Para>
                      <Formula title="Decay Formula" border="border-maxx-violet/30" bg="bg-black" text="text-maxx-violetLt">
                        BaseReward = BASE × K / (√(rank) + K)
                      </Formula>
                      <BarChart
                        title="Emission Decay Curve"
                        badge="bg-maxx-violet/20 text-maxx-violetLt border border-maxx-violet/30"
                        data={chartData.baseRewardData}
                        valueKey="reward"
                        labelKey="label"
                        formatValue={v => v >= 1e6 ? `${(v/1e6).toFixed(1)}M` : `${(v/1000).toFixed(0)}K`}
                        xLabel="Participant Rank Number →"
                        barClass="bg-gradient-to-t from-black to-maxx-violet border-t border-maxx-violetLt"
                      />
                    </Card>
                  </Section>

                  {/* ── 06 CLAN SYSTEM (NEW) ── */}
                  <Section id="clan-system">
                    <SectionHeader number="06" Icon={Users} title="SocialFi Warfare: Clans" badge="bg-red-500/10 border-red-500/30 text-red-500" />
                    <Card border="border-red-900/30 bg-black/40">
                      <Lead>
                        You do not survive the trenches alone. Clans are the digital barracks where like-minded survivors gather to share their stories of market trauma.
                      </Lead>
                      <Para>
                        Most projects fail because they rely on unsustainable VC marketing budgets. MAXXPAINN replaces marketing teams with a <strong className="text-red-400">cult-driven affiliate structure</strong> built directly into the core protocol state.
                      </Para>
                      
                      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MetricCard 
                          label="Rent Share" 
                          value="25% - 50%" 
                          footnote="Of Reclaimed Rent goes to the Clan Owner" 
                          border="border-red-500/40" 
                          bg="bg-red-950/20" 
                          text="text-red-500" 
                        />
                        <div className="p-6 rounded-sm border border-maxx-violet/30 bg-black flex flex-col justify-center">
                          <h4 className="text-sm font-bold text-maxx-white uppercase tracking-widest font-mono mb-2">The Economic Loop</h4>
                          <p className="text-sm text-maxx-mid leading-relaxed">
                            When a member mints using a Clan's referral, the Clan is forever linked to that transaction. When the protocol eventually closes the user's account and reclaims the SOL rent, a massive <span className="text-white font-bold">25% to 50%</span> slice is instantly routed to the Clan Leader's treasury.
                          </p>
                        </div>
                      </div>

                      <SubTitle Icon={Target} iconClass="text-maxx-violet">Organic Virality</SubTitle>
                      <Para>
                        This mechanic creates a highly lucrative incentive for community owners, DAO leaders, and influencers to onboard their entire communities. They are not paid in dilutive protocol tokens; they earn real yield from the state-rent economy. The larger the Clan, the greater the harvest.
                      </Para>

                      <div className="mt-6 p-5 rounded-sm border-l-4 border-l-red-600 bg-red-950/10">
                        <p className="text-sm font-mono text-red-200">
                          <span className="font-bold text-red-500">SYSTEM NOTE:</span> Only the overarching protocol authority has the right to close an account. This prevents malicious actors from sniping rent and ensures the Clan Leader payout is mathematically guaranteed by the smart contract upon account termination.
                        </p>
                      </div>

                    </Card>
                  </Section>

                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Whitepaper;
