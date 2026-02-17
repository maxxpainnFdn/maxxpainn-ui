import React, { useState, useEffect, useMemo, useRef } from 'react';
import Navigation from '@/components/nav/Navigation';
import Footer from '@/components/Footer';
import {
  BookOpen, Shield, Zap, Users, Lock,
  Sparkles, ChevronRight, ArrowRight, Flame, Target,
  Database, Cpu, GitBranch, Award, AlertTriangle, CheckCircle2,
  Calculator, Layers, Network, Coins, Timer, FileCode,
  Binary, Boxes, Gauge, Eye, Key, Server,
  Workflow, BarChart3,
  Milestone, Siren, BadgeCheck, Rocket, Globe, Terminal,
  Crown, Gift, MessageSquare, Vote, Wallet,
  Percent, Gem
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import mintConfig from "@/config/mint"

// Constants based on provided Code
const CONSTANTS = {
  BASE_REWARD: 5005000,
  DAMPENER_K: 5000,
  EAM_MAX: 3.0,
  EAM_MIN: 1.0,
  EA_MAX_RANK: 1000000,
  NEM_COEFF: 0.004, // 4_000n / 1_000_000
  NEM_MAX: 3.0,     // 3n
  LPM_COEFF: 0.08,  // 80_000n / 1_000_000
  LPM_MAX: 5.0,     // 5n
  DIFF_BASE_FEE: 0.003, // 0.003 SOL
  DIFF_SCALE: 3,        // 3/1 scale factor
};

const Whitepaper = () => {

  const [activeSection, setActiveSection] = useState('abstract');
  const [scrollProgress, setScrollProgress] = useState(0);

  const wpMainContentRef = useRef()

  // Generate chart data matching updated MintAlgo simulation
  const chartData = useMemo(() => {
    // 1. Base Reward Dampened Decay: Base * K / (sqrt(rank) + K)
    const baseRewardData = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000].map(rank => {
        const sqrtRank = Math.sqrt(rank);
        const reward = (CONSTANTS.BASE_REWARD * CONSTANTS.DAMPENER_K) / (sqrtRank + CONSTANTS.DAMPENER_K);
        return {
            rank,
            reward: reward,
            label: rank >= 1000000000 ? `${rank/1000000000}B` :
                   rank >= 1000000 ? `${rank/1000000}M` :
                   rank >= 1000 ? `${rank/1000}K` : String(rank)
        };
    });

    // 2. EAM Chart Data (Linear Decay)
    const eamData = [1, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000, 2000000].map(rank => {
      let multiplier;
      if (rank > CONSTANTS.EA_MAX_RANK) {
          multiplier = CONSTANTS.EAM_MIN;
      } else {
          const range = CONSTANTS.EAM_MAX - CONSTANTS.EAM_MIN;
          const remaining = CONSTANTS.EA_MAX_RANK - rank;
          multiplier = CONSTANTS.EAM_MIN + (range * remaining / (CONSTANTS.EA_MAX_RANK - 1));
      }
      return {
        rank,
        multiplier,
        label: rank >= 1000000 ? `${rank/1000000}M` : rank >= 1000 ? `${rank/1000}K` : String(rank)
      };
    });

    // 3. LPM Chart Data: 1 + 0.08 * sqrt(days), Max 5.0
    const lpmData = [1, 7, 14, 30, 90, 180, 365, 730, 1095, 1825].map(days => {
      const raw = 1.0 + (CONSTANTS.LPM_COEFF * Math.sqrt(days));
      return {
        days,
        multiplier: Math.min(raw, CONSTANTS.LPM_MAX),
        label: days >= 365 ? `${(days/365).toFixed(1)}y` : `${days}d`
      };
    });

    // 4. NEM Chart Data: 1 + 0.004 * sqrt(delta), Max 3.0
    const nemData = [1000, 5000, 10000, 50000, 100000, 250000, 500000, 1000000].map(globalRank => {
      const delta = globalRank - 1000;
      const raw = 1.0 + (CONSTANTS.NEM_COEFF * Math.sqrt(delta));
      return {
        globalRank,
        multiplier: Math.min(raw, CONSTANTS.NEM_MAX),
        delta,
        label: globalRank >= 1000000 ? `${globalRank/1000000}M` : `${globalRank/1000}K`
      };
    });

    // 5. Full Simulation
    const rewardSimulation = [1, 100, 1000, 10000, 100000, 1000000, 10000000].map(rank => {
      // Inputs
      const globalRank = Math.max(rank * 2, rank + 50000); 
      const days = 30;
      
      // Calcs
      const sqrtRank = Math.sqrt(rank);
      const base = (CONSTANTS.BASE_REWARD * CONSTANTS.DAMPENER_K) / (sqrtRank + CONSTANTS.DAMPENER_K);
      
      let eam;
      if (rank > CONSTANTS.EA_MAX_RANK) eam = 1.0;
      else eam = 1.0 + (2.0 * (CONSTANTS.EA_MAX_RANK - rank) / (CONSTANTS.EA_MAX_RANK - 1));
      
      const nemRaw = 1.0 + (CONSTANTS.NEM_COEFF * Math.sqrt(globalRank - rank));
      const nem = Math.min(nemRaw, CONSTANTS.NEM_MAX);
      
      const lpmRaw = 1.0 + (CONSTANTS.LPM_COEFF * Math.sqrt(days));
      const lpm = Math.min(lpmRaw, CONSTANTS.LPM_MAX);
      
      const final = base * eam * nem * lpm;
      
      return {
        rank,
        baseReward: base,
        earlyAdopterMultiplier: eam,
        networkMultiplier: nem,
        lockPeriodMultiplier: lpm,
        finalReward: final,
        label: rank >= 1000000 ? `${rank/1000000}M` : rank >= 1000 ? `${rank/1000}K` : String(rank)
      };
    });

    return { baseRewardData, eamData, lpmData, nemData, rewardSimulation };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tableOfContents = [
    { id: 'abstract', label: 'Abstract', icon: BookOpen },
    { id: 'introduction', label: 'Introduction', icon: Sparkles },
    { id: 'architecture', label: 'Protocol Architecture', icon: Boxes },
    { id: 'minting-process', label: 'Minting Process', icon: Workflow },
    { id: 'reward-algorithm', label: 'Reward Algorithm', icon: Calculator },
    { id: 'difficulty-system', label: 'Difficulty System', icon: Gauge },
    { id: 'lock-tiers', label: 'Lock Period Tiers', icon: Timer },
    { id: 'late-penalty', label: 'Late Mint Penalty', icon: AlertTriangle },
    { id: 'clan-system', label: 'Clan System', icon: Users },
    { id: 'staking', label: 'Staking Protocol', icon: Gem }, // Added
    { id: 'on-chain-state', label: 'On-Chain State', icon: Database },
    { id: 'security', label: 'Security Model', icon: Shield },
    { id: 'economics', label: 'Economic Analysis', icon: BarChart3 },
    { id: 'conclusion', label: 'Conclusion', icon: Rocket },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="overflow-x-hidden min-h-screen bg-black text-white selection:bg-purple-500/30">

      <Navigation />

      {/* Progress Bar */}
      <div className="scroll-progress fixed top-0 left-0 right-0 h-1 bg-gray-900 z-50">
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Hero Section */}
      <header className="relative z-10 pt-32 pb-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">

            {/* Version Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gray-900/60 border border-purple-500/30 mb-8 backdrop-blur-md">
              <FileCode className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-bold tracking-wider text-purple-400 uppercase">
                Technical Whitepaper
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono">
                v1.1.0
              </span>
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-6 leading-none">
              <span className="text-white">MAXX</span>
              <span className="bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">PAINN</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 font-light mb-4">
              A Proof-of-Patience Token Distribution Protocol
            </p>
            <p className="text-lg text-gray-500 mb-10">
              Built on Solana • Powered by Time • Secured by Mathematics
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap justify-center gap-3 text-sm mb-10">
              {[
                { label: 'Network', value: 'Solana', color: 'purple' },
                { label: 'Framework', value: 'Anchor', color: 'blue' },
                { label: 'Token', value: 'SPL', color: 'green' },
                { label: 'Decimals', value: '1', color: 'pink' },
                { label: 'Launch', value: 'Fair', color: 'yellow' },
              ].map((item, i) => (
                <div key={i} className="px-4 py-2 rounded-xl bg-gray-900/60 border border-white/10 backdrop-blur-sm">
                  <span className="text-gray-500">{item.label}:</span>
                  <span className={`ml-2 font-bold text-${item.color}-400`}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <QuickStat icon={Coins} label="Mint Cost" value="Free + Storage" />
              <QuickStat icon={Percent} label="Staking Yield" value="Up to 100%" />
              <QuickStat icon={Lock} label="Min Lock" value="1 Day" />
              <QuickStat icon={Timer} label="Max Lock" value="5 Years" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col xl:flex-row gap-12">

            {/* Sidebar Navigation */}
            <aside className="xl:w-80 flex-shrink-0 wp-table-of-contents">
              <div className="xl:sticky xl:top-24">
                <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                      Table of Contents
                    </h3>
                  </div>
                  <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-2">
                    {tableOfContents.map((item, index) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                          activeSection === item.id
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="text-xs font-mono text-gray-600 group-hover:text-gray-500">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Download Button */}
                <a
                  href="/MaxxPainn.pdf"
                  target="_blank"
                >
                    <Button
                      className="w-full py-4 rounded-2xl bg-gray-900/60 border border-white/10 text-white hover:bg-white/10 transition-all"
                    >
                        <FileCode className="w-4 h-4 mr-2" />
                        Download PDF
                    </Button>
                </a>
              </div>
            </aside>

            {/* Content Area */}
            <div id="wp-content" ref={wpMainContentRef} className="flex-1 min-w-0 space-y-20">

              {/* ==================== ABSTRACT ==================== */}
              <Section id="abstract">
                <SectionHeader
                  number="01"
                  icon={BookOpen}
                  title="Abstract"
                  color="purple"
                />
                <ContentCard>
                  <LeadText>
                    MAXXPAINN is a decentralized token distribution protocol that introduces
                    {" "}<Highlight>Proof-of-Patience (PoP)</Highlight> as its core consensus mechanism.
                    Unlike traditional token launches that favor capital, MAXXPAINN rewards participants
                    who demonstrate commitment through time-locked waiting periods.
                  </LeadText>

                  <Paragraph>
                    Built natively on Solana using the Anchor framework, MAXXPAINN implements a
                    sophisticated reward algorithm that dynamically calculates token distribution
                    based on four independent variables: participant rank, early adopter status,
                    network growth contribution, and lock duration commitment.
                  </Paragraph>

                  <Paragraph>
                    The protocol introduces a novel <Highlight>Rank-Based Difficulty Adjustment</Highlight> system
                    that progressively increases the cost of minting (via account storage rent) as participation grows. This creates
                    natural economic pressure that transitions the ecosystem from mint-dominated to
                    market-dominated token acquisition over time.
                  </Paragraph>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <MetricCard
                      label="Mint Cost"
                      value="FREE"
                      footnote="*Gas + Dynamic Storage Rent"
                      color="green"
                    />
                    <MetricCard
                      label="Maximum Supply"
                      value="100P"
                      footnote="100 Quadrillion (Approx)"
                      color="purple"
                    />
                    <MetricCard
                      label="Decimals"
                      value="1"
                      footnote="Minimal fragmentation"
                      color="blue"
                    />
                  </div>
                </ContentCard>
              </Section>

              {/* ==================== INTRODUCTION ==================== */}
              <Section id="introduction">
                <SectionHeader
                  number="02"
                  icon={Sparkles}
                  title="Introduction"
                  color="pink"
                />

                <ContentCard>
                  <SubsectionTitle icon={AlertTriangle} color="red">
                    The Problem with Traditional Token Launches
                  </SubsectionTitle>
                  <Paragraph>
                    The cryptocurrency ecosystem has long struggled with fundamental fairness issues. 
                    VC allocation, insider trading, and bot sniping often leave retail users as exit liquidity.
                  </Paragraph>

                  <ConceptBox title="The Core Thesis" color="purple">
                    <p className="text-lg text-gray-300 italic">
                      "The longer you're willing to wait, the more you deserve to receive."
                    </p>
                  </ConceptBox>
                </ContentCard>
              </Section>

              {/* ==================== ARCHITECTURE ==================== */}
              <Section id="architecture">
                <SectionHeader
                  number="03"
                  icon={Boxes}
                  title="Protocol Architecture"
                  color="blue"
                />
                <ContentCard>
                   <ArchitectureDiagram />
                   <Paragraph>
                      The system is comprised of the core Program, PDA states for user Ranks and Difficulty adjustments, 
                      and a centralized Treasury (managed via on-chain governance/authority) for collecting storage fees.
                   </Paragraph>
                </ContentCard>
              </Section>

              {/* ==================== MINTING PROCESS ==================== */}
              <Section id="minting-process">
                <SectionHeader
                  number="04"
                  icon={Workflow}
                  title="The Minting Process"
                  color="green"
                />
                <ContentCard>
                  <LeadText>
                     Minting is a three-step process involving an initial commitment (Rank Claim) and a delayed realization (Token Claim).
                  </LeadText>
                  <ProcessTimeline>
                    <TimelineStep
                      phase="Phase 1"
                      title="Claim Rank"
                      description="The user begins the mint process by claiming their rank, choosing a lock duration, and committing to the protocol."
                      duration="Instant"
                      cost="Dynamic SOL"
                    />
                     <TimelineStep
                      phase="Phase 2"
                      title="Wait Period"
                      description="The Proof-of-Patience phase. Users cannot access tokens until lock expires."
                      duration="1 day - 5 years"
                      cost="None"
                    />
                     <TimelineStep
                      phase="Phase 3"
                      title="Claim Tokens"
                      description="User mints tokens to their wallet. Must be done within 7 days of expiry to avoid penalty."
                      duration="Instant"
                      cost="Gas Only"
                    />
                  </ProcessTimeline>
                </ContentCard>
              </Section>

              {/* ==================== REWARD ALGORITHM ==================== */}
              <Section id="reward-algorithm">
                <SectionHeader
                  number="05"
                  icon={Calculator}
                  title="Reward Algorithm"
                  color="yellow"
                />

                <ContentCard>
                  <LeadText>
                    The reward calculation combines four independent multipliers to produce 
                    fair, transparent, and incentive-aligned token distribution.
                  </LeadText>

                  <FormulaDisplay title="Master Reward Formula" color="yellow">
                    Reward = BaseReward × EAM × NEM × LPM × (1 - LatePenalty)
                  </FormulaDisplay>
                </ContentCard>

                <ContentCard className="mt-8">
                  <SubsectionTitle icon={Binary} color="purple">
                    Component 1: Dampened Base Reward
                  </SubsectionTitle>

                  <Paragraph>
                    Unlike simple exponential decay, MAXXPAINN uses a "dampened" inverse square root decay.
                    This ensures early participants get high rewards, but the drop-off is smoothed
                    by the dampener constant $K$, keeping rewards meaningful even at high ranks.
                  </Paragraph>

                  <FormulaDisplay title="Dampened Base Reward Formula" color="purple">
                    BaseReward = BASE × K / (√(rank) + K)
                  </FormulaDisplay>

                  <ConstantsTable title="Base Reward Constants">
                    <ConstantRow name="BASE_REWARD" value="5,005,000" description="Maximum base tokens" />
                    <ConstantRow name="DAMPENER_K" value="5,000" description="Smoothing constant" />
                  </ConstantsTable>

                  <SimulatedChart
                    title="Base Reward Decay Curve (Live Simulation)"
                    color="purple"
                    data={chartData.baseRewardData}
                    valueKey="reward"
                    labelKey="label"
                    formatValue={(v) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${(v/1000).toFixed(0)}K`}
                    yLabel="Base Reward"
                    xLabel="Rank Number →"
                  />
                </ContentCard>

                <ContentCard className="mt-8">
                  <SubsectionTitle icon={Award} color="yellow">
                    Component 2: Early Adopter Multiplier (EAM)
                  </SubsectionTitle>

                  <Paragraph>
                    Rewards participants who join when the protocol is young. It linearly decays from 
                    2.0× for Rank #1 down to 1.0× for Rank #1,000,000.
                  </Paragraph>

                  <FormulaDisplay title="EAM Formula" color="yellow">
                    EAM = 1.0 + 2.0 × (1 - (rank - 1) / 999,999)
                  </FormulaDisplay>

                  <SimulatedChart
                    title="Early Adopter Multiplier Curve"
                    color="yellow"
                    data={chartData.eamData}
                    valueKey="multiplier"
                    labelKey="label"
                    formatValue={(v) => `${v.toFixed(2)}×`}
                    yLabel="Multiplier"
                    xLabel="Rank Number →"
                    maxValue={3}
                  />
                </ContentCard>

                <ContentCard className="mt-8">
                  <SubsectionTitle icon={Network} color="blue">
                    Component 3: Network Effect Multiplier (NEM)
                  </SubsectionTitle>

                  <Paragraph>
                    NEM rewards patience by measuring how many users joined <i>after</i> you.
                    The formula uses a square root curve to heavily reward the first wave of followers.
                  </Paragraph>

                  <FormulaDisplay title="NEM Formula" color="blue">
                    NEM = min(3.0, 1.0 + 0.004 × √(GlobalRank - UserRank))
                  </FormulaDisplay>

                  <ConstantsTable title="NEM Constants">
                    <ConstantRow name="NEM_COEFF" value="0.004" description="Growth curve coefficient" />
                    <ConstantRow name="NEM_MAX" value="3.0×" description="Maximum network bonus cap" />
                  </ConstantsTable>

                  <SimulatedChart
                    title="Network Effect Multiplier (User Rank: 1,000)"
                    color="blue"
                    data={chartData.nemData}
                    valueKey="multiplier"
                    labelKey="label"
                    formatValue={(v) => `${v.toFixed(2)}×`}
                    yLabel="Multiplier"
                    xLabel="Global Rank →"
                    maxValue={3}
                  />
                </ContentCard>

                <ContentCard className="mt-8">
                  <SubsectionTitle icon={Lock} color="pink">
                    Component 4: Lock Period Multiplier (LPM)
                  </SubsectionTitle>

                  <Paragraph>
                    The LPM incentivizes long-term commitment. By locking tokens for extended periods,
                    users can multiply their rewards significantly.
                  </Paragraph>

                  <FormulaDisplay title="LPM Formula" color="pink">
                    LPM = min(5.0, 1.0 + 0.08 × √(lockDays))
                  </FormulaDisplay>

                  <ConstantsTable title="LPM Constants">
                    <ConstantRow name="LPM_COEFF" value="0.08" description="Duration scaling factor" />
                    <ConstantRow name="LPM_MAX" value="5.0×" description="Maximum lock multiplier" />
                    <ConstantRow name="MAX_LOCK" value="5 years" description="~1825 days" />
                  </ConstantsTable>

                  <SimulatedChart
                    title="Lock Period Multiplier Curve"
                    color="pink"
                    data={chartData.lpmData}
                    valueKey="multiplier"
                    labelKey="label"
                    formatValue={(v) => `${v.toFixed(2)}×`}
                    yLabel="Multiplier"
                    xLabel="Lock Duration →"
                    maxValue={5}
                  />
                </ContentCard>

                <ContentCard className="mt-8">
                    <SubsectionTitle icon={Calculator} color="green">
                        Live Simulation Table
                    </SubsectionTitle>
                    <Paragraph>
                        Reward calculation assuming 30-day lock and moderate network growth.
                    </Paragraph>
                     <div className="overflow-x-auto rounded-xl border border-white/10">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-black/40">
                            <th className="text-left py-3 px-4 text-gray-400 font-bold">Rank</th>
                            <th className="text-right py-3 px-4 text-gray-400 font-bold">Base</th>
                            <th className="text-right py-3 px-4 text-gray-400 font-bold">EAM</th>
                            <th className="text-right py-3 px-4 text-gray-400 font-bold">NEM</th>
                            <th className="text-right py-3 px-4 text-gray-400 font-bold">LPM</th>
                            <th className="text-right py-3 px-4 text-gray-400 font-bold">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {chartData.rewardSimulation.map((item, i) => (
                            <tr key={i} className="border-t border-white/5 hover:bg-white/5">
                              <td className="py-3 px-4 text-white font-mono">#{item.label}</td>
                              <td className="py-3 px-4 text-right text-purple-400 font-mono">
                                {(item.baseReward / 1000).toFixed(0)}K
                              </td>
                              <td className="py-3 px-4 text-right text-yellow-400 font-mono">
                                {item.earlyAdopterMultiplier.toFixed(2)}×
                              </td>
                              <td className="py-3 px-4 text-right text-blue-400 font-mono">
                                {item.networkMultiplier.toFixed(2)}×
                              </td>
                              <td className="py-3 px-4 text-right text-pink-400 font-mono">
                                {item.lockPeriodMultiplier.toFixed(2)}×
                              </td>
                              <td className="py-3 px-4 text-right text-green-400 font-bold font-mono">
                                {item.finalReward >= 1000000000
                                  ? `${(item.finalReward / 1000000000).toFixed(2)}B`
                                  : item.finalReward >= 1000000
                                    ? `${(item.finalReward / 1000000).toFixed(2)}M`
                                    : `${(item.finalReward / 1000).toFixed(0)}K`
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                </ContentCard>
              </Section>

              {/* ==================== DIFFICULTY SYSTEM ==================== */}
              <Section id="difficulty-system">
                <SectionHeader
                  number="06"
                  icon={Gauge}
                  title="Rank-Based Difficulty System"
                  color="red"
                />

                <ContentCard>
                  <LeadText>
                    The Difficulty System leverages Solana’s native rent mechanism to introduce a storage cost barrier that scales with the eighth root of the rank.
                    This helps prevent protocol abuse and serves as an effective anti-bot mechanism.
                  </LeadText>

                  <FormulaDisplay title="Storage Fee Formula" color="red">
                    Fee = 0.003 SOL × 3 × ⁸√rank
                  </FormulaDisplay>

                  <Paragraph>
                    The base fee is 0.003 SOL. The scaler is 3. The 8th root ensures that cost doubles 
                    only after extremely large jumps in rank (256x rank increase = 2x cost), allowing 
                    the protocol to remain accessible while deterring massive bot swarms.
                  </Paragraph>
                  
                  <PseudoCode title="get_storage_fee(rank)">
{`// Native Rust Implementation (No Floats)
fn get_storage_fee(rank_no: u64) -> u64 {
    let base = 3_000_000; // 0.003 SOL in lamports
    let scale = 3;

    // 8th root = sqrt(sqrt(sqrt(rank)))
    let root = rank_no.isqrt().isqrt().isqrt();
    
    return base * root * scale;
}`}
                  </PseudoCode>

                  <DifficultyChart />
                </ContentCard>
              </Section>

              {/* ==================== LOCK TIERS ==================== */}
              <Section id="lock-tiers">
                <SectionHeader
                  number="07"
                  icon={Timer}
                  title="Lock Period Tiers"
                  color="cyan"
                />
                <ContentCard>
                    <LeadText>
                        Max lock durations are gated by rank to prevent extreme multipliers early on.
                    </LeadText>
                    <LockTierTable lpmData={chartData.lpmData} />
                </ContentCard>
              </Section>

              {/* ==================== LATE PENALTY ==================== */}
              <Section id="late-penalty">
                 <SectionHeader number="08" icon={AlertTriangle} title="Late Mint Penalty" color="orange" />
                 <ContentCard>
                    <Paragraph>
                        Claiming must occur within 7 days of lock expiry. The penalty curve is aggressive (Exponential).
                    </Paragraph>
                    <PenaltyChart />
                 </ContentCard>
              </Section>

              {/* ==================== CLAN SYSTEM ==================== */}
              <Section id="clan-system">
                <SectionHeader number="09" icon={Users} title="Clan System" color="purple" />
                <ContentCard>
                    <LeadText>Clans drive organic growth via instant on-chain referral rewards.</LeadText>
                    <ClanMechanics />
                </ContentCard>
              </Section>

              {/* ==================== STAKING PROTOCOL ==================== */}
              <Section id="staking">
                <SectionHeader
                  number="10"
                  icon={Gem}
                  title="Staking Protocol"
                  color="emerald"
                />

                <ContentCard>
                  <LeadText>
                    Beyond the initial distribution, MAXXPAINN offers a robust staking mechanism
                    allowing holders to earn yield by re-locking their claimed tokens.
                  </LeadText>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                     <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
                        <h4 className="text-lg font-bold text-emerald-400 mb-4">Staking Parameters</h4>
                        <ul className="space-y-4">
                            <li className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-gray-400">Min Lock</span>
                                <span className="text-white font-mono">1 Day</span>
                            </li>
                            <li className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-gray-400">Max Lock</span>
                                <span className="text-white font-mono">3 Years (1095 Days)</span>
                            </li>
                            <li className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-gray-400">Max APY</span>
                                <span className="text-white font-mono">100%</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="text-gray-400">Early Unstake</span>
                                <span className="text-red-400 font-mono">25% Penalty</span>
                            </li>
                        </ul>
                     </div>
                     <div className="p-6 rounded-2xl bg-gray-900/60 border border-white/10 flex flex-col justify-center">
                        <p className="text-gray-300 mb-4">
                            The staking protocol is designed to reduce circulating supply after the mint phase.
                            Yield is derived from protocol revenue and allocated treasury funds.
                        </p>
                        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20">
                            <h5 className="flex items-center gap-2 text-red-400 font-bold mb-2">
                                <AlertTriangle className="w-4 h-4"/> Penalty Warning
                            </h5>
                            <p className="text-xs text-gray-400">
                                Unstaking before your term ends results in a flat 25% penalty on the principal. 
                                Patience is enforced strictly.
                            </p>
                        </div>
                     </div>
                  </div>
                </ContentCard>
              </Section>


              {/* ==================== ON-CHAIN STATE ==================== */}
              <Section id="on-chain-state">
                <SectionHeader number="11" icon={Database} title="On-Chain State" color="indigo" />
                <ContentCard>
                    <AccountSchemas />
                </ContentCard>
              </Section>

              {/* ==================== SECURITY ==================== */}
              <Section id="security">
                <SectionHeader number="12" icon={Shield} title="Security Model" color="green" />
                <ContentCard>
                    <SecurityGrid />
                </ContentCard>
              </Section>

               {/* ==================== ECONOMICS ==================== */}
               <Section id="economics">
                <SectionHeader number="13" icon={BarChart3} title="Economic Analysis" color="emerald" />
                <ContentCard>
                   <EconomicModel />
                </ContentCard>
              </Section>

              {/* ==================== CONCLUSION ==================== */}
              <Section id="conclusion">
                <SectionHeader
                  number="14"
                  icon={Rocket}
                  title="Conclusion"
                  color="pink"
                />

                <div className="relative bg-gradient-to-b from-purple-950/30 via-pink-950/20 to-black/50 rounded-3xl p-10 md:p-14 border border-purple-500/20 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />

                  <div className="text-center max-w-3xl mx-auto relative z-10">
                    <Flame className="w-16 h-16 text-purple-400 mx-auto mb-8" />

                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                      The Future is <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">Awesome</span>
                    </h2>

                    <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                      MAXXPAINN represents a paradigm shift in fair token distribution.
                      The math is updated. The difficulty is set. The timer starts now.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                      <a href="/mint">
                        <Button className="inline-flex items-center gap-2 px-10 py-5 h-auto rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-lg uppercase tracking-wider shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:scale-105">
                          Start Your Journey <ArrowRight className="w-5 h-5" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </Section>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

const SimulatedChart = ({ title, color, data, valueKey, labelKey, formatValue, yLabel, xLabel, maxValue }) => {
  const colors = {
    purple: { bar: 'from-purple-600 to-purple-400', hover: 'from-purple-500 to-purple-300' },
    yellow: { bar: 'from-yellow-600 to-yellow-400', hover: 'from-yellow-500 to-yellow-300' },
    blue: { bar: 'from-blue-600 to-blue-400', hover: 'from-blue-500 to-blue-300' },
    pink: { bar: 'from-pink-600 to-pink-400', hover: 'from-pink-500 to-pink-300' },
    green: { bar: 'from-green-600 to-green-400', hover: 'from-green-500 to-green-300' },
    red: { bar: 'from-red-600 to-orange-400', hover: 'from-red-500 to-orange-300' },
  };

  const max = maxValue || Math.max(...data.map(d => d[valueKey]));

  return (
    <div className="my-8 p-6 rounded-2xl bg-gray-900/60 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</h4>
        <span className={`text-xs px-2 py-1 rounded-full bg-${color}-500/20 text-${color}-400`}>
          Live Data
        </span>
      </div>

      <div className="h-40 flex items-end justify-between gap-1 px-2">
        {data.map((item, i) => {
          const height = Math.max((item[valueKey] / max) * 100, 2);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full relative h-32 flex items-end">
                <div
                  className={`w-full bg-gradient-to-t ${colors[color].bar} group-hover:${colors[color].hover} rounded-t transition-all cursor-pointer`}
                  style={{ height: `${height}%`, minHeight: '4px' }}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                  {formatValue(item[valueKey])}
                </div>
              </div>
              <span className="text-xs text-gray-500 truncate max-w-full">{item[labelKey]}</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 text-center mt-4">{xLabel}</p>
    </div>
  );
};

const Section = ({ id, children }) => (
  <section id={id} className="scroll-mt-24">
    {children}
  </section>
);

const SectionHeader = ({ number, icon: Icon, title, color }) => {
  const colors = {
    purple: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    pink: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
    blue: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    green: 'text-green-400 border-green-500/30 bg-green-500/10',
    red: 'text-red-400 border-red-500/30 bg-red-500/10',
    cyan: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    orange: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
    yellow: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
    indigo: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  };

  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="text-4xl font-black text-gray-800 font-mono">{number}</span>
      <div className={`p-2 sm:p-3 rounded-xl border ${colors[color]}`}>
        <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
      </div>
      <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">{title}</h2>
    </div>
  );
};

const ContentCard = ({ children, className = '' }) => (
  <div className={`bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 ${className}`}>
    {children}
  </div>
);

const LeadText = ({ children }) => (
  <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 font-light">
    {children}
  </p>
);

const Paragraph = ({ children }) => (
  <p className="text-gray-400 leading-relaxed mb-6">
    {children}
  </p>
);

const Highlight = ({ children }) => (
  <span className="text-purple-400 font-semibold">{children}</span>
);

const SubsectionTitle = ({ icon: Icon, color, children }) => {
  const colors = {
    purple: 'text-purple-400',
    pink: 'text-pink-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    red: 'text-red-400',
    cyan: 'text-cyan-400',
    orange: 'text-orange-400',
    yellow: 'text-yellow-400',
  };

  return (
    <h3 className="flex items-center gap-3 text-lg sm:text-xl md:text-2xl font-bold text-white mb-6">
      <Icon className={`w-4 w-h sm:w-6 sm:h-6 ${colors[color]}`} />
      {children}
    </h3>
  );
};

const QuickStat = ({ icon: Icon, label, value }) => (
  <div className="p-4 rounded-2xl bg-gray-900/60 border border-white/10 text-center">
    <Icon className="w-5 h-5 text-purple-400 mx-auto mb-2" />
    <p className="text-xl font-bold text-white">{value}</p>
    <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
  </div>
);

const MetricCard = ({ label, value, footnote, color }) => {
  const colors = {
    green: 'border-green-500/30 bg-green-950/30',
    purple: 'border-purple-500/30 bg-purple-950/30',
    blue: 'border-blue-500/30 bg-blue-950/30',
    pink: 'border-pink-500/30 bg-pink-950/30',
  };
  const textColors = {
    green: 'text-green-400',
    purple: 'text-purple-400',
    blue: 'text-blue-400',
    pink: 'text-pink-400',
  };

  return (
    <div className={`p-6 rounded-2xl border text-center ${colors[color]}`}>
      <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-black ${textColors[color]}`}>{value}</p>
      <p className="text-gray-600 text-xs mt-1">{footnote}</p>
    </div>
  );
};

const ConceptBox = ({ title, color, children }) => {
  const colors = {
    purple: 'border-purple-500/30 bg-purple-950/20',
    red: 'border-red-500/30 bg-red-950/20',
    cyan: 'border-cyan-500/30 bg-cyan-950/20',
  };
  const titleColors = {
    purple: 'text-purple-400',
    red: 'text-red-400',
    cyan: 'text-cyan-400',
  };

  return (
    <div className={`my-8 p-6 rounded-2xl border ${colors[color]}`}>
      <h4 className={`text-lg font-bold mb-3 ${titleColors[color]}`}>{title}</h4>
      {children}
    </div>
  );
};

const ProcessTimeline = ({ children }) => (
  <div className="relative my-8">
    <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-green-500 via-blue-500 to-purple-500" />
    <div className="space-y-8">
      {children}
    </div>
  </div>
);

const TimelineStep = ({ phase, title, description, duration, cost }) => (
  <div className="relative pl-16">
    <div className="absolute left-0 w-12 h-12 rounded-xl bg-gray-900 border border-white/20 flex items-center justify-center">
      <span className="text-xs font-bold text-white">{phase.split(' ')[1]}</span>
    </div>
    <div className="p-5 rounded-2xl bg-gray-900/60 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-bold text-white">{title}</h4>
        <div className="flex gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">{duration}</span>
          <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">{cost}</span>
        </div>
      </div>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  </div>
);

const PseudoCode = ({ title, children }) => (
  <div className="my-8 rounded-2xl overflow-hidden border border-white/10">
    <div className="bg-gray-900 px-4 py-3 border-b border-white/10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/50" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <span className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <span className="text-sm font-mono text-gray-400">{title}</span>
      </div>
      <Terminal className="w-4 h-4 text-gray-600" />
    </div>
    <pre className="bg-black/60 p-6 overflow-x-auto">
      <code className="text-sm font-mono text-gray-300 leading-relaxed whitespace-pre">
        {children}
      </code>
    </pre>
  </div>
);

const FormulaDisplay = ({ title, color, children }) => {
  const colors = {
    yellow: 'border-yellow-500/30 bg-yellow-950/30 text-yellow-400',
    purple: 'border-purple-500/30 bg-purple-950/30 text-purple-400',
    blue: 'border-blue-500/30 bg-blue-950/30 text-blue-400',
    pink: 'border-pink-500/30 bg-pink-950/30 text-pink-400',
    red: 'border-red-500/30 bg-red-950/30 text-red-400',
  };

  return (
    <div className={`my-8 p-6 rounded-2xl border text-center ${colors[color]}`}>
      <p className="text-xs uppercase tracking-widest mb-3 opacity-60">{title}</p>
      <p className="text-xl md:text-2xl font-mono font-bold">{children}</p>
    </div>
  );
};

const ConstantsTable = ({ title, children }) => (
  <div className="my-6">
    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{title}</h4>
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-900/60">
            <th className="text-left py-2 px-4 text-gray-400 font-medium">Constant</th>
            <th className="text-left py-2 px-4 text-gray-400 font-medium">Value</th>
            <th className="text-left py-2 px-4 text-gray-400 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  </div>
);

const ConstantRow = ({ name, value, description }) => (
  <tr className="border-t border-white/5">
    <td className="py-2 px-4 font-mono text-purple-400">{name}</td>
    <td className="py-2 px-4 font-mono text-white">{value}</td>
    <td className="py-2 px-4 text-gray-400">{description}</td>
  </tr>
);

const DifficultyChart = () => (
  <div className="my-8 p-6 rounded-2xl bg-gray-900/60 border border-white/10">
    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Difficulty (Storage Fee) Growth</h4>
    <div className="h-32 flex items-end justify-between gap-1">
      {[
        { rank: 1, label: '1' },
        { rank: 256, label: '256' },
        { rank: 65536, label: '65K' },
        { rank: 16777216, label: '16M' },
        { rank: 4294967296, label: '4B' },
      ].map((item, i) => {
        const eighthRoot = Math.pow(item.rank, 1/8);
        const maxRoot = Math.pow(4294967296, 1/8);
        const height = (eighthRoot / maxRoot) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="w-full relative h-28 flex items-end">
              <div
                className="w-full bg-gradient-to-t from-red-600 to-orange-400 rounded-t transition-all group-hover:from-red-500 group-hover:to-orange-300"
                style={{ height: `${height}%`, minHeight: '4px' }}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {eighthRoot.toFixed(2)}× base
              </div>
            </div>
            <span className="text-xs text-gray-500">{item.label}</span>
          </div>
        );
      })}
    </div>
    <p className="text-xs text-gray-500 text-center mt-4">Rank Number (Log Scale)</p>
  </div>
);

const PenaltyChart = () => (
  <div className="my-8 p-6 rounded-2xl bg-gray-900/60 border border-white/10">
    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Late Claim Penalty Schedule</h4>
    <div className="grid grid-cols-8 gap-2">
      {[
        { day: 0, penalty: 0 },
        { day: 1, penalty: 1 },
        { day: 2, penalty: 3 },
        { day: 3, penalty: 8 },
        { day: 4, penalty: 17 },
        { day: 5, penalty: 35 },
        { day: 6, penalty: 72 },
        { day: '7+', penalty: 99 },
      ].map((item, i) => (
        <div key={i} className="text-center group">
          <div className="h-24 flex items-end justify-center mb-2">
            <div
              className="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t transition-all group-hover:from-red-500 group-hover:to-red-300"
              style={{ height: `${item.penalty}%`, minHeight: item.penalty > 0 ? '4px' : '0' }}
            />
          </div>
          <p className="text-xs text-gray-500">Day {item.day}</p>
          <p className="text-sm font-bold text-red-400">{item.penalty}%</p>
        </div>
      ))}
    </div>
  </div>
);

const LockTierTable = ({ lpmData }) => {
  const getLPMForDays = (days) => {
    // 1 + 0.08 * sqrt(days), max 5
    const lpm = Math.min(5.0, 1.0 + (0.08 * Math.sqrt(days)));
    return lpm.toFixed(2);
  };

  return (
    <div className="overflow-x-auto my-8 rounded-2xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-900/60">
            <th className="text-left py-3 px-4 text-gray-400 font-bold uppercase tracking-wider">Rank Range</th>
            <th className="text-left py-3 px-4 text-gray-400 font-bold uppercase tracking-wider">Max Lock</th>
            <th className="text-left py-3 px-4 text-gray-400 font-bold uppercase tracking-wider">Max LPM</th>
          </tr>
        </thead>
        <tbody>
          {[
            { range: '0 - 100,000', lock: 30 },
            { range: '100K - 1M', lock: 90 },
            { range: '1M - 5M', lock: 180 },
            { range: '5M - 10M', lock: 360 },
            { range: '10M - 100M', lock: 480 },
            { range: '100M - 400M', lock: 540 },
            { range: '400M - 1B', lock: 720 },
            { range: '1B+', lock: 1825 },
          ].map((row, i) => (
            <tr key={i} className="border-t border-white/5 hover:bg-white/5">
              <td className="py-3 px-4 font-mono text-white">{row.range}</td>
              <td className="py-3 px-4 font-bold text-cyan-400">{row.lock} days</td>
              <td className="py-3 px-4 font-mono text-pink-400">~{getLPMForDays(row.lock)}×</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ClanMechanics = () => (
  <div className="my-8 grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="p-6 rounded-2xl bg-gray-900/60 border border-white/10 text-center">
      <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
        <Users className="w-8 h-8 text-purple-400" />
      </div>
      <h4 className="font-bold text-white mb-2">Create or Join</h4>
      <p className="text-gray-400 text-sm">Join an existing clan or create your own to start earning referral rewards.</p>
    </div>
    <div className="p-6 rounded-2xl bg-gray-900/60 border border-white/10 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
        <Network className="w-8 h-8 text-blue-400" />
      </div>
      <h4 className="font-bold text-white mb-2">Share & Grow</h4>
      <p className="text-gray-400 text-sm">Share your clan link. Every new mint through your referral earns SOL.</p>
    </div>
    <div className="p-6 rounded-2xl bg-gray-900/60 border border-white/10 text-center">
      <div className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
        <Coins className="w-8 h-8 text-green-400" />
      </div>
      <h4 className="font-bold text-white mb-2">Earn Forever</h4>
      <p className="text-gray-400 text-sm">Referral rewards are paid instantly on-chain: {mintConfig.mintRewardUsd} USD equivalent.</p>
    </div>
  </div>
);

const AccountSchemas = () => (
  <div className="space-y-6 mt-8">
    {[
      {
        name: 'MainConfig',
        seeds: ['main_config'],
        color: 'purple',
        fields: [
          { name: 'authority', type: 'Pubkey', desc: 'Admin address' },
          { name: 'treasury', type: 'Pubkey', desc: 'Fee recipient' },
          { name: 'difficulty_base_fee', type: 'u64', desc: '0.003 SOL' },
          { name: 'difficulty_scale', type: '[u64; 2]', desc: '[3, 1]' },
        ]
      },
      {
        name: 'GlobalRank',
        seeds: ['global_rank'],
        color: 'blue',
        fields: [
          { name: 'value', type: 'u64', desc: 'Current global rank counter' },
        ]
      },
      {
        name: 'RankInfo',
        seeds: ['rank_info', 'owner'],
        color: 'green',
        fields: [
          { name: 'owner', type: 'Pubkey', desc: 'Participant address' },
          { name: 'rank_no', type: 'u64', desc: 'Assigned rank number' },
          { name: 'wait_period_secs', type: 'u64', desc: 'Lock duration' },
          { name: 'has_minted', type: 'bool', desc: 'Claim status' },
        ]
      },
      {
        name: 'RankDifficulty',
        seeds: ['rank_difficulty', 'owner'],
        color: 'red',
        fields: [
          { name: 'raw_data', type: 'bytes', desc: 'Variable size buffer' },
        ]
      },
    ].map((account, i) => (
      <div key={i} className="p-6 rounded-2xl bg-gray-900/60 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-white font-mono">{account.name}</h4>
          <div className="flex gap-2">
            {account.seeds.map((seed, j) => (
              <span key={j} className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400 font-mono">
                {seed}
              </span>
            ))}
          </div>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {account.fields.map((field, k) => (
              <tr key={k} className="border-t border-white/5">
                <td className="py-2 font-mono text-cyan-400 w-40">{field.name}</td>
                <td className="py-2 font-mono text-gray-500 w-24">{field.type}</td>
                <td className="py-2 text-gray-400">{field.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}
  </div>
);

const SecurityGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
    {[
      {
        title: 'PDA Validation',
        description: 'Deterministic account derivation ensures secure state management.',
        icon: Key,
      },
      {
        title: 'Reentrancy Guard',
        description: 'Checks-Effects-Interactions pattern strictly enforced.',
        icon: Shield,
      },
      {
        title: 'Checked Arithmetic',
        description: 'Overflow/Underflow protection on all math operations.',
        icon: Siren,
      },
      {
        title: 'Treasury Safety',
        description: 'Fee destination hardcoded to config authority.',
        icon: Lock,
      },
    ].map((item, i) => (
      <div key={i} className="p-5 rounded-2xl bg-gray-900/60 border border-green-500/20 flex gap-4">
        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 h-fit">
          <item.icon className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h4 className="font-bold text-white mb-1">{item.title}</h4>
          <p className="text-gray-400 text-sm">{item.description}</p>
        </div>
      </div>
    ))}
  </div>
);

const EconomicModel = () => (
  <div className="space-y-8 mt-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
        <h4 className="text-lg font-bold text-emerald-400 mb-4">Supply Dynamics</h4>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Smooth dampened decay curve</span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>High precision (1 decimal) reduces dust</span>
          </li>
        </ul>
      </div>
      <div className="p-6 rounded-2xl bg-blue-950/30 border border-blue-500/20">
        <h4 className="text-lg font-bold text-blue-400 mb-4">Equilibrium</h4>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>Difficulty rises with rank^0.125</span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>Staking removes supply from circulation</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

const ArchitectureDiagram = () => (
  <div className="my-8 p-6 rounded-2xl bg-gray-900/60 border border-white/10">
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-center w-full md:w-auto">
        <Server className="w-8 h-8 text-purple-400 mx-auto mb-2" />
        <p className="text-white font-bold">Solana</p>
      </div>
      <ArrowRight className="w-6 h-6 text-gray-600 rotate-90 md:rotate-0" />
      <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 text-center w-full md:w-auto">
        <Cpu className="w-8 h-8 text-blue-400 mx-auto mb-2" />
        <p className="text-white font-bold">Program</p>
      </div>
      <ArrowRight className="w-6 h-6 text-gray-600 rotate-90 md:rotate-0" />
      <div className="p-4 rounded-xl bg-green-950/40 border border-green-500/30 text-center w-full md:w-auto">
        <Database className="w-8 h-8 text-green-400 mx-auto mb-2" />
        <p className="text-white font-bold">PDAs</p>
      </div>
    </div>
  </div>
);

export default Whitepaper;
