import React, { useState, useEffect, useMemo, useRef } from 'react';
import Navigation from '@/components/nav/Navigation';
import Footer from '@/components/Footer';
import MintAlgo from '@/core/MintAlgo'; // Import the simulation class
import {
  BookOpen, Shield, Zap, Users, Lock,
  Sparkles, ChevronRight, ArrowRight, Flame, Target,
  Database, Cpu, GitBranch, Award, AlertTriangle, CheckCircle2,
  Calculator, Layers, Network, Coins, Timer, FileCode,
  Binary, Boxes, Gauge, Eye, Key, Server,
  Workflow, BarChart3,
  Milestone, Siren, BadgeCheck, Rocket, Globe, Terminal,
  Crown, Gift, MessageSquare, Vote, Wallet,
  Percent
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import mintConfig from "@/config/mint"

const Whitepaper = () => {

  const [activeSection, setActiveSection] = useState('abstract');
  const [scrollProgress, setScrollProgress] = useState(0);

  const wpMainContentRef = useRef()

  // Generate chart data using MintAlgo simulation
  const chartData = useMemo(() => {
    // Base Reward Decay Chart Data
    const baseRewardData = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000].map(rank => ({
      rank,
      reward: MintAlgo.format(MintAlgo.getBaseReward(rank)),
      label: rank >= 1000000000 ? `${rank/1000000000}B` :
             rank >= 1000000 ? `${rank/1000000}M` :
             rank >= 1000 ? `${rank/1000}K` : String(rank)
    }));

    // EAM Chart Data
    const eamData = [1, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000, 2000000].map(rank => ({
      rank,
      multiplier:  MintAlgo.format(MintAlgo.getEarlyAdopterMultiplier(rank)),
      label: rank >= 1000000 ? `${rank/1000000}M` : rank >= 1000 ? `${rank/1000}K` : String(rank)
    }));

    // LPM Chart Data
    const lpmData = [1, 7, 14, 30, 60, 90, 180, 365, 540, 720, 1095, 1825].map(days => ({
      days,
      multiplier:  MintAlgo.format(MintAlgo.getLockPeriodMultiplier(days)),
      label: days >= 365 ? `${(days/365).toFixed(1)}y` : `${days}d`
    }));

    // NEM Chart Data (assuming user rank 1000, varying global rank)
    const nemData = [1000, 2000, 5000, 10000, 50000, 100000, 500000, 1000000].map(globalRank => ({
      globalRank,
      multiplier:  MintAlgo.format(MintAlgo.getNetworkEffectMultiplier(1000, globalRank)),
      delta: globalRank - 1000,
      label: globalRank >= 1000000 ? `${globalRank/1000000}M` : `${globalRank/1000}K`
    }));

    // Full reward simulation at different ranks (30-day lock, 0 days late)
    const rewardSimulation = [1, 100, 1000, 10000, 100000, 500000, 1000000].map(rank => {
      const globalRank = Math.max(rank * 2, rank + 10000); // Simulate network growth
      const result = MintAlgo.calculateFinalReward(rank, globalRank, 30, 0);
      return {
        rank,
        ...result,
        label: rank >= 1000000 ? `${rank/1000000}M` :
               rank >= 1000 ? `${rank/1000}K` : String(rank)
      };
    });

    // Late penalty data
    const penaltyData = [0, 1, 2, 3, 4, 5, 6, 7].map(days => {
      const baseReward = 1000000;
      const result =  MintAlgo.getRewardWithPenalty(baseReward, days);
      return {
        day: days,
        penalty: days === 0 ? 0 : (typeof result === 'object' ? MintAlgo.format(result.penaltyPercent) : 0),
        retained: days === 0 ? baseReward : (typeof result === 'object' ? MintAlgo.format(result.finalReward) : result)
      };
    });

    return { baseRewardData, eamData, lpmData, nemData, rewardSimulation, penaltyData };
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
    { id: 'on-chain-state', label: 'On-Chain State', icon: Database },
    { id: 'security', label: 'Security Model', icon: Shield },
    { id: 'economics', label: 'Economic Analysis', icon: BarChart3 },
    { id: 'roadmap', label: 'Roadmap', icon: Milestone },
    { id: 'conclusion', label: 'Conclusion', icon: Rocket },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };


  const generatePDF = async (e) => {
    e.preventDefault()
    window.print()
  }

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
        <div className="absolute top-[40%] left-[40%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '14s', animationDelay: '4s' }} />
        <div className="absolute top-[60%] right-[20%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '16s', animationDelay: '6s' }} />
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
                v1.0.0
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
                { label: 'Decimals', value: '4', color: 'pink' },
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
              <QuickStat icon={Coins} label="Mint Cost" value="FREE*" />
              <QuickStat icon={Percent} label="Buy/Sell Tax" value="0%" />
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
                  //onClick={generatePDF}
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
                    <Highlight>Proof-of-Patience (PoP)</Highlight> as its core consensus mechanism.
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
                    The protocol introduces a novel <Highlight>Supply-Based Difficulty Adjustment</Highlight> system
                    that progressively increases the cost of minting as participation grows. This creates
                    natural economic pressure that transitions the ecosystem from mint-dominated to
                    market-dominated token acquisition over time.
                  </Paragraph>

                  <KeyPoints title="Core Innovations">
                    <KeyPoint>100% free minting—participants only pay Solana network fees</KeyPoint>
                    <KeyPoint>Time-weighted rewards that scale with commitment duration</KeyPoint>
                    <KeyPoint>Bot-resistant design through progressive cost increases</KeyPoint>
                    <KeyPoint>Fair launch with no pre-mine, VC allocation, or team tokens</KeyPoint>
                    <KeyPoint>Community-driven clan system with referral rewards</KeyPoint>
                    <KeyPoint>Clan tokenization at 100M milestone with 10% member airdrops</KeyPoint>
                  </KeyPoints>

                  <Divider />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MetricCard
                      label="Minting Cost"
                      value="FREE"
                      footnote="*Gas + Storage fees only"
                      color="green"
                    />
                    <MetricCard
                      label="Maximum Supply"
                      value="∞"
                      footnote="Algorithmically controlled"
                      color="purple"
                    />
                    <MetricCard
                      label="Precision"
                      value="10⁻⁶"
                      footnote="6 decimal fixed-point"
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
                    The cryptocurrency ecosystem has long struggled with fundamental fairness issues
                    in token distribution. Traditional launch mechanisms exhibit several critical flaws:
                  </Paragraph>

                  <ProblemGrid>
                    <ProblemCard
                      title="Capital Concentration"
                      description="Venture capital and wealthy participants receive preferential allocation through private sales, SAFT agreements, and early access rounds."
                    />
                    <ProblemCard
                      title="Information Asymmetry"
                      description="Insiders possess timing information that allows them to enter and exit positions before retail participants."
                    />
                    <ProblemCard
                      title="Bot Exploitation"
                      description="Automated systems front-run legitimate participants, extracting value through speed rather than conviction."
                    />
                    <ProblemCard
                      title="Misaligned Incentives"
                      description="Quick unlock schedules encourage dumping rather than long-term holding and ecosystem building."
                    />
                  </ProblemGrid>

                  <Divider />

                  <SubsectionTitle icon={Zap} color="green">
                    The MAXXPAINN Solution
                  </SubsectionTitle>

                  <Paragraph>
                    MAXXPAINN fundamentally reimagines token distribution by introducing <Highlight>"pain"</Highlight>—measured
                    in time—as the primary cost of participation. This creates a self-selecting mechanism
                    where only truly committed participants are willing to lock their potential rewards
                    for extended periods.
                  </Paragraph>

                  <ConceptBox title="The Core Thesis" color="purple">
                    <p className="text-lg text-gray-300 italic">
                      "The longer you're willing to wait, the more you deserve to receive."
                    </p>
                    <p className="text-gray-500 mt-2 text-sm">
                      This simple principle creates powerful economic incentives that naturally filter
                      out short-term speculators while rewarding patient believers.
                    </p>
                  </ConceptBox>

                  <Paragraph>
                    By measuring commitment in time rather than capital, MAXXPAINN democratizes access
                    to token ownership. A retail participant willing to wait 180 days receives meaningful
                    multipliers that can compete with—or exceed—those available to larger capital holders
                    choosing shorter timeframes.
                  </Paragraph>
                </ContentCard>

                <ContentCard className="mt-8">
                  <SubsectionTitle icon={Globe} color="blue">
                    Design Principles
                  </SubsectionTitle>

                  <PrincipleGrid>
                    <PrincipleCard
                      number="01"
                      title="Temporal Fairness"
                      description="Time is the great equalizer. Everyone has the same 24 hours, making lock duration a fair cost metric."
                    />
                    <PrincipleCard
                      number="02"
                      title="Skin in the Game"
                      description="Locking tokens creates genuine commitment. Participants who lock longer have more to gain."
                    />
                    <PrincipleCard
                      number="03"
                      title="Anti-Fragility"
                      description="The protocol becomes stronger as participation grows through difficulty adjustments."
                    />
                    <PrincipleCard
                      number="04"
                      title="Transparency"
                      description="All logic is on-chain. Anyone can audit the math and verify fair treatment."
                    />
                  </PrincipleGrid>
                </ContentCard>
              </Section>

              {/* ==================== PROTOCOL ARCHITECTURE ==================== */}
              <Section id="architecture">
                <SectionHeader
                  number="03"
                  icon={Boxes}
                  title="Protocol Architecture"
                  color="blue"
                />

                <ContentCard>
                  <LeadText>
                    MAXXPAINN is implemented as a Solana program using the Anchor framework,
                    leveraging Program Derived Addresses (PDAs) for deterministic, secure
                    account management.
                  </LeadText>

                  <ArchitectureDiagram />

                  <SubsectionTitle icon={Layers} color="purple">
                    System Components
                  </SubsectionTitle>

                  <ComponentGrid>
                    <ComponentCard
                      name="Solana Runtime"
                      type="Infrastructure"
                      description="The underlying blockchain providing consensus, execution, and state management."
                      color="purple"
                    />
                    <ComponentCard
                      name="MAXXPAINN Program"
                      type="Smart Contract"
                      description="Core Anchor program containing all protocol logic, deployed as an immutable on-chain program."
                      color="blue"
                    />
                    <ComponentCard
                      name="SPL Token Mint"
                      type="Token Layer"
                      description="Standard Solana token mint with PDA-controlled authority for trustless minting."
                      color="green"
                    />
                    <ComponentCard
                      name="State Accounts"
                      type="Data Layer"
                      description="PDAs storing global configuration, user ranks, and difficulty adjustments."
                      color="pink"
                    />
                  </ComponentGrid>
                </ContentCard>

                <ContentCard className="mt-8">
                  <SubsectionTitle icon={GitBranch} color="cyan">
                    Program Instructions
                  </SubsectionTitle>

                  <Paragraph>
                    The protocol exposes the following instruction endpoints:
                  </Paragraph>

                  <InstructionTable>
                    <InstructionRow
                      name="initialize_config"
                      description="One-time setup of global protocol parameters"
                      access="Authority"
                    />
                    <InstructionRow
                      name="initialize_token"
                      description="Creates the SPL token mint with PDA authority"
                      access="Authority"
                    />
                    <InstructionRow
                      name="claim_rank"
                      description="Registers a new participant with chosen lock duration"
                      access="Public"
                    />
                    <InstructionRow
                      name="claim_tokens"
                      description="Mints tokens to participants after lock expiry"
                      access="Public"
                    />
                    <InstructionRow
                      name="close_rank"
                      description="Closes rank accounts after claiming"
                      access="Owner"
                    />
                    <InstructionRow
                      name="close_rank_difficulty"
                      description="Closes difficulty PDAs and returns lamports to treasury"
                      access="Authority"
                    />
                  </InstructionTable>
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
                    The minting lifecycle consists of two distinct phases: <Highlight>Rank Claiming</Highlight> and
                    <Highlight> Token Claiming</Highlight>. Understanding this separation is crucial for
                    optimal participation strategy.
                  </LeadText>

                  <ProcessTimeline>
                    <TimelineStep
                      phase="Phase 1"
                      title="Claim Rank"
                      description="Participant connects wallet, selects lock duration and clan, then claims their sequential rank number."
                      duration="Instant"
                      cost="~0.005 SOL"
                    />
                    <TimelineStep
                      phase="Phase 2"
                      title="Wait Period"
                      description="The participant waits for their chosen lock duration to expire. No action required during this phase."
                      duration="1 day - 5 years"
                      cost="None"
                    />
                    <TimelineStep
                      phase="Phase 3"
                      title="Claim Tokens"
                      description="After lock expiry, participant claims their calculated token reward. Must claim within 7 days to avoid penalties."
                      duration="Instant"
                      cost="~0.0002 SOL"
                    />
                  </ProcessTimeline>

                  <Divider />

                  <SubsectionTitle icon={Terminal} color="green">
                    Claim Rank: Detailed Flow
                  </SubsectionTitle>

                  <PseudoCode title="claim_rank(wait_period_days, clan_id)">
{`FUNCTION claim_rank(wait_period_days: u16, clan_id: u64):

    // Step 1: Validate protocol state
    REQUIRE main_config.can_mint == TRUE
        ERROR: "Minting is currently disabled"

    // Step 2: Validate minimum lock duration
    REQUIRE wait_period_days >= main_config.min_wait_days
        ERROR: "Lock duration below minimum threshold"

    // Step 3: Atomically increment global rank counter
    global_rank.value = global_rank.value + 1
    rank_no = global_rank.value

    // Step 4: Calculate maximum allowed lock for this rank tier
    max_allowed = get_max_wait_period(rank_no)

    // Step 5: Validate maximum lock duration
    REQUIRE wait_period_days <= max_allowed
        ERROR: "Lock duration exceeds maximum for rank tier"

    // Step 6: Create user's rank account (PDA)
    rank_info = CREATE_PDA(
        seeds: ["rank_info", signer.pubkey],
        data: {
            owner: signer.pubkey,
            rank_no: rank_no,
            clan_id: clan_id,
            wait_period_secs: wait_period_days * 86400,
            created_at: current_timestamp(),
            has_minted: FALSE
        }
    )

    // Step 7: Create difficulty adjustment account
    storage_fee = calculate_storage_fee(rank_no)
    CREATE_DIFFICULTY_PDA(signer, storage_fee)

    // Step 8: Emit event for indexers
    EMIT ClaimRankEvent(signer.pubkey, rank_no, clan_id)

    RETURN SUCCESS`}
                  </PseudoCode>

                  <Callout type="info" title="Why Sequential Ranks?">
                    Sequential rank assignment ensures a globally consistent ordering of participants.
                    This ordering is fundamental to the Early Adopter Multiplier calculation, where
                    lower ranks receive higher bonuses. The atomicity of Solana transactions guarantees
                    no race conditions in rank assignment.
                  </Callout>
                </ContentCard>

                <ContentCard className="mt-8">
                  <SubsectionTitle icon={Terminal} color="blue">
                    Claim Tokens: Detailed Flow
                  </SubsectionTitle>

                  <PseudoCode title="claim_tokens()">
{`FUNCTION claim_tokens():

    // Step 1: Load user's rank information
    rank_info = LOAD_PDA(["rank_info", token_claimer.pubkey])

    // Step 2: Verify ownership
    REQUIRE rank_info.owner == token_claimer.pubkey
        ERROR: "Caller is not the rank owner"

    // Step 3: Verify not already claimed
    REQUIRE rank_info.has_minted == FALSE
        ERROR: "Tokens already claimed for this rank"

    // Step 4: Calculate claim eligibility timestamp
    claim_date = rank_info.created_at + rank_info.wait_period_secs
    current_time = current_timestamp()

    // Step 5: Verify lock period has expired
    REQUIRE current_time >= claim_date
        ERROR: "Lock period has not yet expired"

    // Step 6: Calculate reward amount
    reward = calculate_reward(
        rank_info: rank_info,
        global_rank: global_rank.value,
        current_time: current_time,
        claim_date: claim_date
    )

    // Step 7: Mark as minted BEFORE actual mint (reentrancy guard)
    rank_info.has_minted = TRUE

    // Step 8: Mint tokens to user's associated token account
    MINT_TO(
        mint: token_mint,
        destination: token_claimer.ata,
        amount: reward,
        authority: mint_authority_pda  // PDA signs
    )

    // Step 9: Emit event
    EMIT TokenClaimEvent(token_claimer.pubkey, reward)

    RETURN SUCCESS`}
                  </PseudoCode>

                  <Callout type="warning" title="Reentrancy Protection">
                    Notice that <code>has_minted</code> is set to TRUE before the actual token mint CPI.
                    This is a critical security pattern that prevents potential reentrancy attacks where
                    a malicious contract could attempt to claim multiple times in a single transaction.
                  </Callout>
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
                    The reward calculation is the mathematical heart of MAXXPAINN. It combines four
                    independent multipliers to produce a fair, transparent, and incentive-aligned
                    token distribution.
                  </LeadText>

                  <FormulaDisplay
                    title="Master Reward Formula"
                    color="yellow"
                  >
                    Reward = BaseReward × EAM × NEM × LPM × (1 - LatePenalty)
                  </FormulaDisplay>

                  <Paragraph>
                    Each component serves a specific economic purpose:
                  </Paragraph>

                  <MultiplierOverview>
                    <MultiplierCard
                      name="Base Reward"
                      symbol="BR"
                      purpose="Establishes fundamental token allocation that decreases as more participants join"
                      range="Decreases with √rank"
                    />
                    <MultiplierCard
                      name="Early Adopter"
                      symbol="EAM"
                      purpose="Rewards early believers who take risk when the protocol is unproven"
                      range="1.0× to 3.0×"
                    />
                    <MultiplierCard
                      name="Network Effect"
                      symbol="NEM"
                      purpose="Rewards patience by measuring network growth since joining"
                      range="1.0× to 3.0×"
                    />
                    <MultiplierCard
                      name="Lock Period"
                      symbol="LPM"
                      purpose="Directly rewards longer commitment durations"
                      range="~1.1× to ~5.4×"
                    />
                  </MultiplierOverview>
                </ContentCard>

                <ContentCard className="mt-8">
                  <SubsectionTitle icon={Binary} color="purple">
                    Component 1: Base Reward Calculation
                  </SubsectionTitle>

                  <Paragraph>
                    The Base Reward establishes the fundamental token allocation for each rank.
                    It uses an inverse square root decay to create a smooth, predictable reduction
                    in rewards as more participants join.
                  </Paragraph>

                  <FormulaDisplay title="Base Reward Formula" color="purple">
                    BaseReward = (BASE_FACTOR × MULTIPLIER) / √(rank + 1)
                  </FormulaDisplay>

                  <ConstantsTable title="Base Reward Constants">
                    <ConstantRow name="BASE_FACTOR" value="10,000,000" description="Initial reward factor" />
                    <ConstantRow name="MULTIPLIER" value="100" description="Scaling multiplier" />
                  </ConstantsTable>

                  <PseudoCode title="calculate_base_reward(rank)">
{`FUNCTION calculate_base_reward(rank: u64) -> number:

    BASE_FACTOR = 10_000_000
    MULTIPLIER = 100
    OFFSET = 1  // Prevent division by zero

    adjusted = rank + OFFSET
    sqrt_value = sqrt(adjusted)

    RETURN (BASE_FACTOR * MULTIPLIER) / sqrt_value`}
                  </PseudoCode>

                  {/* Base Reward Chart with Real Data */}
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
                    The Early Adopter Multiplier rewards participants who join when the protocol
                    is young and unproven. It provides a linear decay from 3.0× down to 1.0×
                    over the first one million participants.
                  </Paragraph>

                  <FormulaDisplay title="EAM Formula" color="yellow">
                    EAM = EAM_MIN + (EAM_MAX - EAM_MIN) × (1 - (rank - 1) / (EA_MAX_RANK - 1))
                  </FormulaDisplay>

                  <ConstantsTable title="EAM Constants">
                    <ConstantRow name="EAM_MAX" value="3.0×" description="Maximum multiplier for rank #1" />
                    <ConstantRow name="EAM_MIN" value="1.0×" description="Minimum multiplier (rank ≥ 1M)" />
                    <ConstantRow name="EA_MAX_RANK" value="1,000,000" description="Cutoff rank for bonus" />
                  </ConstantsTable>

                  {/* EAM Chart with Real Data */}
                  <SimulatedChart
                    title="Early Adopter Multiplier Curve (Live Simulation)"
                    color="yellow"
                    data={chartData.eamData}
                    valueKey="multiplier"
                    labelKey="label"
                    formatValue={(v) => `${v.toFixed(2)}×`}
                    yLabel="Multiplier"
                    xLabel="Rank Number →"
                    maxValue={3}
                  />

                  <Callout type="info" title="Strategic Implication">
                    Early participation is significantly rewarded. A rank #1 participant receives
                    3× the tokens of someone at rank #1,000,001 (all other factors equal).
                    This creates strong incentives for early adoption while still maintaining
                    meaningful rewards for later participants.
                  </Callout>
                </ContentCard>

                <ContentCard className="mt-8">
                  <SubsectionTitle icon={Network} color="blue">
                    Component 3: Network Effect Multiplier (NEM)
                  </SubsectionTitle>

                  <Paragraph>
                    The Network Effect Multiplier rewards participants based on how much the
                    network has grown since they joined. This creates a "patience bonus" where
                    early participants who wait longer see more new participants join after them.
                  </Paragraph>

                  <FormulaDisplay title="NEM Formula" color="blue">
                    NEM = min(NEM_MAX, 1.0 + NEM_CURVE × √(globalRank - userRank))
                  </FormulaDisplay>

                  <ConstantsTable title="NEM Constants">
                    <ConstantRow name="NEM_CURVE" value="0.1" description="Growth curve coefficient" />
                    <ConstantRow name="NEM_MAX" value="3.0×" description="Maximum network bonus cap" />
                  </ConstantsTable>

                  {/* NEM Chart with Real Data */}
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

                  <Callout type="info" title="The Patience Premium">
                    NEM creates an interesting incentive model: users who commit to longer lock periods receive higher rewards,
                    as the likelihood of additional minters entering the network during their wait is significantly greater.
                  </Callout>
                </ContentCard>

                <ContentCard className="mt-8">
                  <SubsectionTitle icon={Lock} color="pink">
                    Component 4: Lock Period Multiplier (LPM)
                  </SubsectionTitle>

                  <Paragraph>
                    The Lock Period Multiplier directly rewards longer commitment durations.
                    It uses a square root curve to provide meaningful bonuses for moderate
                    lock periods while preventing excessive rewards for extreme durations.
                  </Paragraph>

                  <FormulaDisplay title="LPM Formula" color="pink">
                    LPM = 1.0 + LPM_SCALE × √(lockDays)
                  </FormulaDisplay>

                  <ConstantsTable title="LPM Constants">
                    <ConstantRow name="LPM_SCALE" value="0.1" description="Duration scaling factor" />
                    <ConstantRow name="MIN_LOCK" value="1 day" description="Minimum lock duration" />
                    <ConstantRow name="MAX_LOCK" value="1,825 days" description="Maximum lock (5 years)" />
                  </ConstantsTable>

                  {/* LPM Chart with Real Data */}
                  <SimulatedChart
                    title="Lock Period Multiplier Curve (Live Simulation)"
                    color="pink"
                    data={chartData.lpmData}
                    valueKey="multiplier"
                    labelKey="label"
                    formatValue={(v) => `${v.toFixed(2)}×`}
                    yLabel="Multiplier"
                    xLabel="Lock Duration →"
                    maxValue={25}
                  />
                </ContentCard>

                <ContentCard className="mt-8">
                  <SubsectionTitle icon={Calculator} color="green">
                    Complete Reward Calculation
                  </SubsectionTitle>

                  <Paragraph>
                    Bringing all components together, here is the complete reward calculation
                    as implemented on-chain:
                  </Paragraph>

                  <PseudoCode title="calculate_final_reward(rank, global_rank, lock_days, days_late)">
{`FUNCTION calculate_final_reward(
    user_rank: u64,
    global_rank: u64,
    lock_days: u64,
    days_late: u64
) -> MintRewardInfo:

    // Calculate all multipliers
    base_reward = calculate_base_reward(user_rank)
    eam = calculate_early_adopter_multiplier(user_rank)
    nem = calculate_network_effect_multiplier(user_rank, global_rank)
    lpm = calculate_lock_period_multiplier(lock_days)

    // Combine multipliers
    reward_amount = base_reward * nem * eam * lpm

    // Apply late penalty if applicable
    IF days_late > 0:
        penalty = get_late_mint_penalty(days_late)
        final_reward = reward_amount * (1 - penalty / 100)
    ELSE:
        final_reward = reward_amount

    RETURN {
        rank: user_rank,
        base_reward: base_reward,
        network_multiplier: nem,
        early_adopter_multiplier: eam,
        lock_period_multiplier: lpm,
        final_reward: final_reward,
        penalty_percent: penalty
    }`}
                  </PseudoCode>

                  {/* Live Simulation Table */}
                  <div className="my-8 bg-gray-900/60 border border-green-500/30 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/10 bg-green-950/30">
                      <h4 className="text-lg font-bold text-green-400 flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        Live Reward Simulation (30-day lock, 0 days late)
                      </h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-black/40">
                            <th className="text-left py-3 px-4 text-gray-400 font-bold">Rank</th>
                            <th className="text-right py-3 px-4 text-gray-400 font-bold">Base Reward</th>
                            <th className="text-right py-3 px-4 text-gray-400 font-bold">EAM</th>
                            <th className="text-right py-3 px-4 text-gray-400 font-bold">NEM</th>
                            <th className="text-right py-3 px-4 text-gray-400 font-bold">LPM</th>
                            <th className="text-right py-3 px-4 text-gray-400 font-bold">Final Reward</th>
                          </tr>
                        </thead>
                        <tbody>
                          {chartData.rewardSimulation.map((item, i) => (
                            <tr key={i} className="border-t border-white/5 hover:bg-white/5">
                              <td className="py-3 px-4 text-white font-mono">#{item.label}</td>
                              <td className="py-3 px-4 text-right text-purple-400 font-mono">
                                {item.baseReward >= 1000000
                                  ? `${(item.baseReward / 1000000).toFixed(2)}M`
                                  : `${(item.baseReward / 1000).toFixed(0)}K`
                                }
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
                  </div>
                </ContentCard>
              </Section>

              {/* ==================== DIFFICULTY SYSTEM ==================== */}
              <Section id="difficulty-system">
                <SectionHeader
                  number="06"
                  icon={Gauge}
                  title="Supply-Based Difficulty System"
                  color="red"
                />

                <ContentCard>
                  <LeadText>
                    The Difficulty System is MAXXPAINN's primary defense against bot attacks
                    and mass-minting exploitation. It creates progressively increasing costs
                    that make bulk participation economically unfeasible.
                  </LeadText>

                  <SubsectionTitle icon={Target} color="red">
                    The Mechanism
                  </SubsectionTitle>

                  <Paragraph>
                    When a participant claims a rank, the protocol creates a "difficulty account"—a
                    Program Derived Address (PDA) whose allocated size (and therefore rent cost)
                    scales with the rank number. This leverages Solana's rent mechanism as a
                    built-in cost function.
                  </Paragraph>

                  <FormulaDisplay title="Storage Fee Formula" color="red">
                    StorageFee = BaseFee × ⁸√rank × ScaleFactor
                  </FormulaDisplay>

                  <Paragraph>
                    The 8th root function (calculated as √√√rank) provides an extremely gradual
                    curve—it takes approximately 256× increase in rank to double the cost.
                  </Paragraph>

                  <PseudoCode title="calculate_storage_fee(rank_no, config)">
{`FUNCTION calculate_storage_fee(rank_no: u64, config: MainConfig) -> u64:

    base_fee = config.rank_difficulty_base_fee_lamports
    scale_numerator = config.rank_difficulty_scale_factor[0]
    scale_denominator = config.rank_difficulty_scale_factor[1]

    // Calculate 8th root using nested square roots
    // 8th root = √(√(√(x)))
    rank = rank_no as u128

    root_2 = isqrt(rank)          // 2nd root
    root_4 = isqrt(root_2)        // 4th root
    eighth_root = isqrt(root_4)   // 8th root

    result = base_fee * eighth_root * scale_numerator / scale_denominator

    RETURN result as u64`}
                  </PseudoCode>

                  <DifficultyChart />

                  <ConceptBox title="Why 8th Root?" color="red">
                    <p className="text-gray-300 mb-3">
                      The choice of 8th root is deliberate and calculated:
                    </p>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span><strong className="text-white">Gradual Growth:</strong> Enables millions of participants before costs become prohibitive</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span><strong className="text-white">Bot Deterrent:</strong> Mass-minting 1000 ranks costs significantly more than a single rank</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span><strong className="text-white">Efficient Computation:</strong> Three nested isqrt() calls are O(1) on modern CPUs</span>
                      </li>
                    </ul>
                  </ConceptBox>
                </ContentCard>
              </Section>

              {/* ==================== LOCK PERIOD TIERS ==================== */}
              <Section id="lock-tiers">
                <SectionHeader
                  number="07"
                  icon={Timer}
                  title="Lock Period Tiers"
                  color="cyan"
                />

                <ContentCard>
                  <LeadText>
                    Maximum lock durations are gated by rank tier to prevent extreme lock period
                    multipliers from dominating early-stage tokenomics. As the protocol matures,
                    later participants gain access to longer lock options.
                  </LeadText>

                  <PseudoCode title="get_max_wait_period(rank)">
{`FUNCTION get_max_wait_period(rank: u64) -> u16:

    MATCH rank:
        0 ..= 100,000:             RETURN 30    // max 1 month
        100,001 ..= 1,000,000:     RETURN 90    // max 3 months
        1,000,001 ..= 5,000,000:   RETURN 180   // max 6 months
        5,000,001 ..= 10,000,000:  RETURN 360   // max 1 year
        10,000,001 ..= 100,000,000: RETURN 480  // max 16 months
        100,000,001 ..= 400,000,000: RETURN 540 // max 18 months
        400,000,001 ..= 1,000,000,000: RETURN 720 // max 2 years
        _ : RETURN 1825  // Cap at 5 years for 1B+ ranks`}
                  </PseudoCode>

                  <LockTierTable lpmData={chartData.lpmData} />
                </ContentCard>
              </Section>

              {/* ==================== LATE PENALTY ==================== */}
              <Section id="late-penalty">
                <SectionHeader
                  number="08"
                  icon={AlertTriangle}
                  title="Late Mint Penalty"
                  color="orange"
                />

                <ContentCard>
                  <LeadText>
                    Participants must claim their tokens within 7 days of lock expiry to receive
                    full rewards. Progressive penalties discourage indefinite delays and ensure
                    active participation.
                  </LeadText>

                  <PseudoCode title="get_late_penalty(delay_days)">
{`// Penalty lookup table (percentage of reward forfeited)
LATE_MINT_PENALTY = [
    0,    // Day 0: No penalty (claim on time)
    1,    // Day 1: 1% penalty
    3,    // Day 2: 3% penalty
    8,    // Day 3: 8% penalty
    17,   // Day 4: 17% penalty
    35,   // Day 5: 35% penalty
    72,   // Day 6: 72% penalty
    99    // Day 7+: 99% penalty (almost total loss)
]

FUNCTION get_late_penalty(delay_days: u64) -> u64:
    index = min(delay_days, 7)
    RETURN LATE_MINT_PENALTY[index]`}
                  </PseudoCode>

                  <PenaltyChart />

                  <Callout type="warning" title="Claim Promptly!">
                    The penalty curve is intentionally aggressive. A 7-day delay results in losing
                    99% of your earned tokens. Set calendar reminders for your claim date!
                  </Callout>
                </ContentCard>
              </Section>

              {/* ==================== CLAN SYSTEM ==================== */}
              <Section id="clan-system">
                <SectionHeader
                  number="09"
                  icon={Users}
                  title="Clan System"
                  color="purple"
                />

                <ContentCard>
                  <LeadText>
                    Clans are community-driven groups that compete for dominance on the MAXXPAINN
                    leaderboard. The system incentivizes organic growth through referral rewards
                    paid in SOL, with a major evolution planned at the 100M rank milestone.
                  </LeadText>

                  <ClanMechanics />

                  <SubsectionTitle icon={Coins} color="green">
                    Reward Structure
                  </SubsectionTitle>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <MetricCard
                      label="Per Referral"
                      value={mintConfig.mintRewardUsd+" USD"}
                      footnote="Minimum paid per mint"
                      color="green"
                    />
                    <MetricCard
                      label="Payment"
                      value="Instant"
                      footnote="On-chain transfer"
                      color="blue"
                    />
                    <MetricCard
                      label="Limit"
                      value="Unlimited"
                      footnote="No cap on earnings"
                      color="purple"
                    />
                  </div>

                  <Paragraph>
                    Clan rewards create a sustainable flywheel: community members are incentivized
                    to spread awareness, new participants join through trusted referrals, and the
                    network effect compounds over time.
                  </Paragraph>
                </ContentCard>

                {/* Clan Tokenization Future */}
                <ContentCard className="mt-8">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-950/40 via-purple-950/40 to-blue-950/40 border border-pink-500/30 p-8">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />

                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-600 to-purple-600">
                        <Crown className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">100M Rank Milestone</span>
                        <h3 className="text-2xl font-black text-white">Clan Tokenization</h3>
                      </div>
                    </div>

                    <Paragraph>
                      At the <Highlight>100 million rank milestone</Highlight>, clans will evolve into fully
                      tokenized autonomous communities. Each clan will receive its own SPL token with
                      built-in governance and social features.
                    </Paragraph>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 rounded-xl bg-black/30 border border-pink-500/20">
                        <Coins className="w-6 h-6 text-pink-400 mb-2" />
                        <h4 className="font-bold text-white mb-1">Clan Tokens</h4>
                        <p className="text-gray-400 text-sm">Each clan gets its own SPL token with customizable tokenomics</p>
                      </div>
                      <div className="p-4 rounded-xl bg-black/30 border border-purple-500/20">
                        <Gift className="w-6 h-6 text-purple-400 mb-2" />
                        <h4 className="font-bold text-white mb-1">10% Airdrop</h4>
                        <p className="text-gray-400 text-sm">All existing clan members receive 10% of the clan token supply</p>
                      </div>
                      <div className="p-4 rounded-xl bg-black/30 border border-blue-500/20">
                        <MessageSquare className="w-6 h-6 text-blue-400 mb-2" />
                        <h4 className="font-bold text-white mb-1">Social Features</h4>
                        <p className="text-gray-400 text-sm">In-app chat, forums, proposals, and community tools</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-black/20 border border-white/10">
                        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                          <Vote className="w-4 h-4 text-purple-400" />
                          Clan Governance
                        </h4>
                        <ul className="space-y-1 text-gray-400 text-sm">
                          <li>• Token-weighted voting on clan decisions</li>
                          <li>• Proposal creation and execution</li>
                          <li>• Treasury management controls</li>
                        </ul>
                      </div>
                      <div className="p-4 rounded-xl bg-black/20 border border-white/10">
                        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-green-400" />
                          Clan Treasury
                        </h4>
                        <ul className="space-y-1 text-gray-400 text-sm">
                          <li>• Collective fund management</li>
                          <li>• Revenue sharing from referrals</li>
                          <li>• Multi-sig security options</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </ContentCard>
              </Section>

              {/* ==================== ON-CHAIN STATE ==================== */}
              <Section id="on-chain-state">
                <SectionHeader
                  number="10"
                  icon={Database}
                  title="On-Chain State"
                  color="indigo"
                />

                <ContentCard>
                  <LeadText>
                    MAXXPAINN uses Program Derived Addresses (PDAs) for deterministic, secure
                    account management. Each account type serves a specific purpose in the protocol.
                  </LeadText>

                  <AccountSchemas />
                </ContentCard>
              </Section>

              {/* ==================== SECURITY ==================== */}
              <Section id="security">
                <SectionHeader
                  number="11"
                  icon={Shield}
                  title="Security Model"
                  color="green"
                />

                <ContentCard>
                  <LeadText>
                    Security is paramount in DeFi. MAXXPAINN implements multiple layers of
                    protection against common attack vectors.
                  </LeadText>

                  <SecurityGrid />

                  <SubsectionTitle icon={Eye} color="yellow">
                    Audit Status
                  </SubsectionTitle>

                  <Paragraph>
                    The MAXXPAINN smart contracts are designed with security-first principles.
                    We recommend users review the open-source code and await formal audits
                    before committing significant capital.
                  </Paragraph>
                </ContentCard>
              </Section>

              {/* ==================== ECONOMICS ==================== */}
              <Section id="economics">
                <SectionHeader
                  number="12"
                  icon={BarChart3}
                  title="Economic Analysis"
                  color="emerald"
                />

                <ContentCard>
                  <LeadText>
                    MAXXPAINN's economic model creates multiple equilibrium points that
                    encourage healthy market dynamics.
                  </LeadText>

                  <EconomicModel />
                </ContentCard>
              </Section>

              {/* ==================== ROADMAP ====================
              <Section id="roadmap">
                <SectionHeader
                  number="13"
                  icon={Milestone}
                  title="Roadmap"
                  color="cyan"
                />

                <ContentCard>
                  <LeadText>
                    MAXXPAINN's development is milestone-driven, with major features unlocked
                    based on network participation rather than arbitrary timelines.
                  </LeadText>

                  <RoadmapTimeline />
                </ContentCard>
              </Section>
              */}

              {/* ==================== CONCLUSION ==================== */}
              <Section id="conclusion">
                <SectionHeader
                  number="13"
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
                      MAXXPAINN represents a paradigm shift in fair token distribution—one where
                      commitment is measured in time, not capital.
                    </p>

                    <p className="text-gray-400 mb-10 leading-relaxed">
                      By transforming patience into profit, we create a self-selecting community
                      of true believers. The math is transparent. The rules are immutable.
                      The opportunity is equal.
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
// SIMULATED CHART COMPONENT (FIXED)
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
        {/* Note: Dynamic template literal classes (bg-${color}-500) may need safelisting in Tailwind config */}
        <span className={`text-xs px-2 py-1 rounded-full bg-${color}-500/20 text-${color}-400`}>
          Live Data
        </span>
      </div>

      {/* Container is h-40 */}
      <div className="h-40 flex items-end justify-between gap-1 px-2">
        {data.map((item, i) => {
          const height = Math.max((item[valueKey] / max) * 100, 2);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              {/*
                 FIX APPLIED HERE:
                 Added 'h-32' (8rem) to the wrapper.
                 Since the main container is h-40 (10rem), this allows 8rem for the bar
                 and leaves 2rem for the label below it.
              */}
              <div className="w-full relative h-32 flex items-end">
                <div
                  className={`w-full bg-gradient-to-t ${colors[color].bar} group-hover:${colors[color].hover} rounded-t transition-all cursor-pointer`}
                  style={{ height: `${height}%`, minHeight: '4px' }}
                />

                {/* Tooltip */}
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

// ============================================================
// EXISTING HELPER COMPONENTS (Keep all existing ones)
// ============================================================

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

const Divider = () => (
  <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
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

const KeyPoints = ({ title, children }) => (
  <div className="mt-8 p-6 rounded-2xl bg-purple-950/20 border border-purple-500/20">
    <h4 className="text-lg font-bold text-purple-400 mb-4">{title}</h4>
    <ul className="space-y-3">
      {children}
    </ul>
  </div>
);

const KeyPoint = ({ children }) => (
  <li className="flex items-start gap-3 text-gray-300">
    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
    <span>{children}</span>
  </li>
);

const ProblemGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
    {children}
  </div>
);

const ProblemCard = ({ title, description }) => (
  <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/20">
    <h4 className="font-bold text-red-400 mb-2">{title}</h4>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

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

const PrincipleGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {children}
  </div>
);

const PrincipleCard = ({ number, title, description }) => (
  <div className="p-6 rounded-2xl bg-gray-900/60 border border-white/10 group hover:border-purple-500/30 transition-colors">
    <span className="text-xs font-mono text-purple-500 mb-2 block">{number}</span>
    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{title}</h4>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

const ComponentGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
    {children}
  </div>
);

const ComponentCard = ({ name, type, description, color }) => {
  const colors = {
    purple: 'border-purple-500/30',
    blue: 'border-blue-500/30',
    green: 'border-green-500/30',
    pink: 'border-pink-500/30',
  };
  const badgeColors = {
    purple: 'bg-purple-500/20 text-purple-400',
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    pink: 'bg-pink-500/20 text-pink-400',
  };

  return (
    <div className={`p-5 rounded-2xl bg-gray-900/60 border ${colors[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-white">{name}</h4>
        <span className={`text-xs px-2 py-1 rounded-full ${badgeColors[color]}`}>{type}</span>
      </div>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
};

const InstructionTable = ({ children }) => (
  <div className="overflow-x-auto mt-6">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-white/10">
          <th className="text-left py-3 px-4 text-gray-400 font-bold uppercase tracking-wider">Instruction</th>
          <th className="text-left py-3 px-4 text-gray-400 font-bold uppercase tracking-wider">Description</th>
          <th className="text-left py-3 px-4 text-gray-400 font-bold uppercase tracking-wider">Access</th>
        </tr>
      </thead>
      <tbody>
        {children}
      </tbody>
    </table>
  </div>
);

const InstructionRow = ({ name, description, access }) => (
  <tr className="border-b border-white/5 hover:bg-white/5">
    <td className="py-3 px-4 font-mono text-cyan-400">{name}</td>
    <td className="py-3 px-4 text-gray-300">{description}</td>
    <td className="py-3 px-4">
      <span className={`text-xs px-2 py-1 rounded-full ${
        access === 'Public' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
      }`}>
        {access}
      </span>
    </td>
  </tr>
);

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

const Callout = ({ type, title, children }) => {
  const styles = {
    info: 'border-blue-500/30 bg-blue-950/20',
    warning: 'border-yellow-500/30 bg-yellow-950/20',
  };
  const iconColors = {
    info: 'text-blue-400',
    warning: 'text-yellow-400',
  };
  const titleColors = {
    info: 'text-blue-400',
    warning: 'text-yellow-400',
  };

  return (
    <div className={`my-6 p-5 rounded-2xl border ${styles[type]}`}>
      <div className="flex items-start gap-3">
        {type === 'info' ? (
          <Eye className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColors[type]}`} />
        ) : (
          <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColors[type]}`} />
        )}
        <div>
          <h4 className={`font-bold mb-1 ${titleColors[type]}`}>{title}</h4>
          <p className="text-gray-400 text-sm">{children}</p>
        </div>
      </div>
    </div>
  );
};

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

const MultiplierOverview = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
    {children}
  </div>
);

const MultiplierCard = ({ name, symbol, purpose, range }) => (
  <div className="p-5 rounded-2xl bg-gray-900/60 border border-white/10">
    <div className="flex items-center justify-between mb-3">
      <h4 className="font-bold text-white">{name}</h4>
      <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 font-mono">{symbol}</span>
    </div>
    <p className="text-gray-400 text-sm mb-2">{purpose}</p>
    <p className="text-xs text-gray-500 font-mono">{range}</p>
  </div>
);

const DifficultyChart = () => (
  <div className="my-8 p-6 rounded-2xl bg-gray-900/60 border border-white/10">
    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Difficulty (Storage Fee) Growth - 8th Root Scale</h4>
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
            <div className="w-full relative">
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
    <p className="text-xs text-gray-500 text-center mt-4">Rank Number (256× increase = 2× cost) →</p>
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
  // Calculate LPM for each tier's max lock using the actual algorithm
  const getLPMForDays = (days) => {
    const item = lpmData?.find(d => d.days === days);
    return item ? item.multiplier.toFixed(2) : (1 + 0.1 * Math.sqrt(days)).toFixed(2);
  };

  return (
    <div className="overflow-x-auto my-8 rounded-2xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-900/60">
            <th className="text-left py-3 px-4 text-gray-400 font-bold uppercase tracking-wider">Rank Range</th>
            <th className="text-left py-3 px-4 text-gray-400 font-bold uppercase tracking-wider">Max Lock</th>
            <th className="text-left py-3 px-4 text-gray-400 font-bold uppercase tracking-wider">Max LPM</th>
            <th className="text-left py-3 px-4 text-gray-400 font-bold uppercase tracking-wider">Phase</th>
          </tr>
        </thead>
        <tbody>
          {[
            { range: '0 - 100,000', lock: 30, phase: 'Early Adopter' },
            { range: '100K - 1M', lock: 90, phase: 'Growth' },
            { range: '1M - 5M', lock: 180, phase: 'Scaling' },
            { range: '5M - 10M', lock: 360, phase: 'Mature' },
            { range: '10M - 100M', lock: 480, phase: 'Extended' },
            { range: '100M - 400M', lock: 540, phase: 'Long-term' },
            { range: '400M - 1B', lock: 720, phase: 'Maximum' },
            { range: '1B+', lock: 1825, phase: 'Ultimate' },
          ].map((row, i) => (
            <tr key={i} className="border-t border-white/5 hover:bg-white/5">
              <td className="py-3 px-4 font-mono text-white">{row.range}</td>
              <td className="py-3 px-4 font-bold text-cyan-400">{row.lock} days</td>
              <td className="py-3 px-4 font-mono text-pink-400">~{getLPMForDays(row.lock)}×</td>
              <td className="py-3 px-4 text-gray-400">{row.phase}</td>
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
      <p className="text-gray-400 text-sm">Referral rewards are paid instantly on-chain. No limits, no vesting.</p>
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
          { name: 'can_mint', type: 'bool', desc: 'Protocol pause flag' },
          { name: 'min_wait_days', type: 'u16', desc: 'Minimum lock duration' },
          { name: 'max_wait_days', type: 'u16', desc: 'Maximum lock duration' },
          { name: 'difficulty_base_fee', type: 'u64', desc: 'Base storage fee' },
          { name: 'difficulty_scale', type: '[u64; 2]', desc: 'Scale numerator/denominator' },
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
          { name: 'clan_id', type: 'u64', desc: 'Associated clan ID' },
          { name: 'wait_period_secs', type: 'u64', desc: 'Lock duration in seconds' },
          { name: 'created_at', type: 'i64', desc: 'Unix timestamp of claim' },
          { name: 'has_minted', type: 'bool', desc: 'Token claim status' },
        ]
      },
      {
        name: 'RankDifficulty',
        seeds: ['rank_difficulty', 'owner'],
        color: 'red',
        fields: [
          { name: '[u8; N]', type: 'bytes', desc: 'Variable-sized buffer (N = f(rank))' },
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
        title: 'PDA Seed Validation',
        description: 'All accounts derived from deterministic seeds verified by Anchor constraints.',
        icon: Key,
      },
      {
        title: 'Owner Verification',
        description: 'Token claims verify signer matches rank_info.owner before minting.',
        icon: BadgeCheck,
      },
      {
        title: 'Reentrancy Guard',
        description: 'has_minted flag set before CPI prevents double-claim attacks.',
        icon: Shield,
      },
      {
        title: 'Overflow Protection',
        description: 'All u128 operations use checked arithmetic with explicit errors.',
        icon: Siren,
      },
      {
        title: 'Treasury Validation',
        description: 'Account closures verify treasury against config to prevent fund theft.',
        icon: Lock,
      },
      {
        title: 'Admin Controls',
        description: 'can_mint flag allows emergency pause. Only authority can modify.',
        icon: Eye,
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
            <span>No maximum supply cap—fully market-driven</span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Decreasing marginal rewards via √rank decay</span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Rising difficulty creates natural mint ceiling</span>
          </li>
        </ul>
      </div>
      <div className="p-6 rounded-2xl bg-blue-950/30 border border-blue-500/20">
        <h4 className="text-lg font-bold text-blue-400 mb-4">Market Forces</h4>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>Mint vs Buy equilibrium naturally emerges</span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>Long locks reduce immediate sell pressure</span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>Early adopter premium rewards risk-taking</span>
          </li>
        </ul>
      </div>
    </div>

    <div className="p-6 rounded-2xl bg-gray-900/60 border border-white/10">
      <h4 className="text-lg font-bold text-white mb-4">Equilibrium Analysis</h4>
      <p className="text-gray-400 mb-4">
        The protocol naturally trends toward three equilibrium states:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-black/30 text-center">
          <p className="text-purple-400 font-bold mb-1">Phase 1: Mint Dominance</p>
          <p className="text-xs text-gray-500">Low difficulty, high rewards. Minting preferred.</p>
        </div>
        <div className="p-4 rounded-xl bg-black/30 text-center">
          <p className="text-yellow-400 font-bold mb-1">Phase 2: Crossover</p>
          <p className="text-xs text-gray-500">Mint cost approaches market price.</p>
        </div>
        <div className="p-4 rounded-xl bg-black/30 text-center">
          <p className="text-green-400 font-bold mb-1">Phase 3: Market Dominance</p>
          <p className="text-xs text-gray-500">Buying cheaper than minting. Price support.</p>
        </div>
      </div>
    </div>
  </div>
);

const RoadmapTimeline = () => (
  <div className="space-y-6 mt-8">
    {[
      {
        phase: 'Phase 1',
        title: 'Genesis',
        target: '0 → 100K Ranks',
        status: 'active',
        color: 'purple',
        items: ['Smart contract deployment', 'Web app launch', 'Clan system V1', 'Community bootstrap']
      },
      {
        phase: 'Phase 2',
        title: 'Growth',
        target: '100K → 1M Ranks',
        status: 'upcoming',
        color: 'blue',
        items: ['DEX liquidity pools', 'Enhanced analytics', 'Ambassador program', 'Lock period extension (90 days)']
      },
      {
        phase: 'Phase 3',
        title: 'Scaling',
        target: '1M → 10M Ranks',
        status: 'upcoming',
        color: 'green',
        items: ['Security audit', 'CEX listings', 'Governance proposals', 'Clan Wars V1']
      },
      {
        phase: 'Phase 4',
        title: 'Clan Evolution',
        target: '10M → 100M Ranks',
        status: 'upcoming',
        color: 'pink',
        highlight: true,
        items: ['🚀 Clan Tokenization', '10% token airdrop to members', 'Social features (chat, forums)', 'Clan treasury & governance']
      },
      {
        phase: 'Phase 5',
        title: 'Ecosystem',
        target: '100M+ Ranks',
        status: 'upcoming',
        color: 'yellow',
        items: ['Full DAO transition', 'Multi-chain expansion', 'DeFi integrations', 'Protocol revenue sharing']
      },
    ].map((phase, i) => (
      <div
        key={i}
        className={`p-6 rounded-2xl border ${
          phase.highlight
            ? 'bg-gradient-to-r from-pink-950/40 to-purple-950/40 border-pink-500/30'
            : 'bg-gray-900/60 border-white/10'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full bg-${phase.color}-500/20 text-${phase.color}-400 uppercase tracking-wider`}>
              {phase.phase}
            </span>
            <h4 className="text-xl font-bold text-white">{phase.title}</h4>
          </div>
          <span className="text-sm text-gray-400 font-mono">{phase.target}</span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {phase.items.map((item, j) => (
            <li key={j} className="flex items-center gap-2 text-gray-300 text-sm">
              <ChevronRight className={`w-4 h-4 text-${phase.color}-500`} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const ArchitectureDiagram = () => (
  <div className="my-8 p-6 rounded-2xl bg-gray-900/60 border border-white/10">
    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">System Architecture</h4>
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-center w-full md:w-auto">
        <Server className="w-8 h-8 text-purple-400 mx-auto mb-2" />
        <p className="text-white font-bold">Solana Runtime</p>
        <p className="text-xs text-gray-500">L1 Blockchain</p>
      </div>
      <ArrowRight className="w-6 h-6 text-gray-600 rotate-90 md:rotate-0" />
      <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 text-center w-full md:w-auto">
        <Cpu className="w-8 h-8 text-blue-400 mx-auto mb-2" />
        <p className="text-white font-bold">MAXXPAINN Program</p>
        <p className="text-xs text-gray-500">Anchor Smart Contract</p>
      </div>
      <ArrowRight className="w-6 h-6 text-gray-600 rotate-90 md:rotate-0" />
      <div className="p-4 rounded-xl bg-green-950/40 border border-green-500/30 text-center w-full md:w-auto">
        <Database className="w-8 h-8 text-green-400 mx-auto mb-2" />
        <p className="text-white font-bold">PDA Accounts</p>
        <p className="text-xs text-gray-500">On-Chain State</p>
      </div>
      <ArrowRight className="w-6 h-6 text-gray-600 rotate-90 md:rotate-0" />
      <div className="p-4 rounded-xl bg-pink-950/40 border border-pink-500/30 text-center w-full md:w-auto">
        <Coins className="w-8 h-8 text-pink-400 mx-auto mb-2" />
        <p className="text-white font-bold">SPL Token</p>
        <p className="text-xs text-gray-500">MAXXPAINN Token</p>
      </div>
    </div>
  </div>

);

export default Whitepaper;
