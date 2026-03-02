import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, Settings, ChevronDown, Copy, Check, TrendingUp, Wallet, Coins, Layers } from "lucide-react";
import utils, { cn } from "@/lib/utils";
import { ClanData } from "@/types/ClanData";
import StatsCard from "@/components/StatsCard";
import { useWalletCore } from "@/hooks/useWalletCore";
import MintReferralFilter from "../MintReferralFilter";
import ApiQuery from "@/components/apiQuery/ApiQuery";
import MintReferralTxRow from "../MintReferralTxRow";
import { clanConfig } from "@/config/clan";

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_TRANSACTIONS = [
  { id: 1, name: "CryptoKing",  address: "8xPq...4mNk", amount: 2500, time: "1 min ago",   isNew: true  },
  { id: 2, name: "DegenLord",   address: "3bYz...9kLm", amount: 1200, time: "5 mins ago",  isNew: true  },
  { id: 3, name: "WhaleAlert",  address: "7nXw...2pQr", amount: 8900, time: "23 mins ago", isNew: false },
  { id: 4, name: "SolanaOG",    address: "5vBc...8mNk", amount: 450,  time: "1 hour ago",  isNew: false },
  { id: 5, name: "NFTMaxi",     address: "2tYu...6wEr", amount: 3200, time: "2 hours ago", isNew: false },
  { id: 6, name: "DiamondApe",  address: "9mQw...4sAz", amount: 1800, time: "5 hours ago", isNew: false },
  { id: 7, name: "PainLord",    address: "4kZx...7rBn", amount: 5100, time: "6 hours ago", isNew: false },
  { id: 8, name: "GrindQueen",  address: "1pWe...3cLo", amount: 990,  time: "8 hours ago", isNew: false },
];


// ── Animated counter ──────────────────────────────────────────────────────────
function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0 }: {
  value: number; prefix?: string; suffix?: string; decimals?: number;
}) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();
    const tick = () => {
      const elapsed  = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current!);
  }, [value]);

  return (
    <span>
      {prefix}
      {display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}


// ── Payout ring ───────────────────────────────────────────────────────────────
function PayoutRing({ current, goal }: { current: number; goal: number }) {
  const r      = 42;
  const circ   = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(current / goal, 1));

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" className="stroke-zinc-800" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className="[stop-color:theme(colors.pink.500)]" />
            <stop offset="100%" className="[stop-color:theme(colors.purple.600)]" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-black text-2xl text-white leading-none">
          <AnimatedNumber value={current} prefix="$" />
        </span>
        <span className="text-[10px] tracking-wider uppercase mt-0.5 text-zinc-500">
          Pending
        </span>
      </div>
    </div>
  );
}


export default function  EarningsTab({ clan }: { clan: ClanData  } ) {
  
  const clanId = clan.id;
  const { address: accountAddr } = useWalletCore()
  
  console.log("clan===>", clan)
  
  const [period, setPeriod] = useState<string>("all");
  const [refDataArr, setRefDataArr] = useState([])

  const unClaimedAmount = clan.totalEarnedUsd - clan.totalEarnedClaimedUsd;
  
  const onQuerySuccess = (data) => {
    console.log("data===>", data)
    setRefDataArr(data)
  }
  
  const mintPerMemberRatio = (clan.totalMints == 0)
    ? 0
    : ((clan.totalMints / clan.totalMembers) * 100).toFixed(1);
  
  const statsData = [
    { 
      icon: Coins, 
      label: "Reward Per Mint", 
      value: clan.rewardPerMintUsd + " USDC",    
      color: "mint"    
    },
    { 
      icon: Layers, 
      label: "Total Mints",     
      value: clan.totalMints, 
      color: "purple"  
    },
    { 
      icon: Wallet, 
      label: "Total Claimed (USDC)", 
      value: clan.totalEarnedClaimedUsd,   
      color: "ice" 
    },
    { 
      icon: TrendingUp, 
      label: "Avg Mints per Member",    
      value: mintPerMemberRatio + "%", 
      color: "neon"     
    },
  ];
  
  return (
    <div className="space-y-5 animate-fade-up font-sans">

      {/* ── Background blurs (scoped to this tab) ── */}
      <div className="relative">
        <div className="absolute pointer-events-none -top-32 -left-32 w-96 h-96 rounded-full blur-[128px] bg-teal-400/10" />
        <div className="absolute pointer-events-none -bottom-32 -right-32 w-96 h-96 rounded-full blur-[128px] bg-pink-500/10" />
      </div>

      {/* ══ MAIN GRID — total + ring ═════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Total earnings */}
        <div className="lg:col-span-2 rounded-[20px] p-[1px] pb-[10px] bg-gradient-to-br from-teal-400/20 to-pink-500/20">
          <div className=" h-[100%] rounded-[19px] p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between align-middle gap-6 bg-zinc-900">
            <div className="">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">💰</span>
                <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500">
                  Total Earnings
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-[0_0_30px_rgba(45,212,191,0.5)]">
                  <AnimatedNumber value={clan.totalEarnedUsd} prefix="$" decimals={2} />
                </span>
                <span className="text-lg font-semibold text-zinc-400">USDC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending ring */}
        <div className="rounded-[20px] p-6 flex flex-col items-center justify-center relative overflow-hidden bg-zinc-900 border border-white/5">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-pink-500/5 to-transparent" />
          <PayoutRing current={unClaimedAmount} goal={clanConfig.minRewardWithdrawalThresholdUsd} />
          <p className="text-sm mt-4 text-center text-zinc-400">
            min. withdrawal amount: <span className="text-white font-semibold">{clanConfig.minRewardWithdrawalThresholdUsd} USDC</span>
          </p>
        </div>
      </div>

      {/* ══ STATS ROW ════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {statsData.map(({ icon, label, value, color }) => (
          <StatsCard
            icon={icon}
            title={label}
            value={value}
            color={color}
          />
        ))}
      </div>

      {/* ══ WALLET ═══════════════════════════════════════════════════════════ */}
      <div className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 border border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br from-purple-600 to-indigo-700">
            👛
          </div>
          <div>
            <p className="text-xs mb-1 text-zinc-500">Connected Wallet</p>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm transition-all bg-zinc-950 text-zinc-300 hover:bg-zinc-800"
            >
              { utils.maskAddress(accountAddr, 8, 8) }
            </button>
          </div>
        </div>

        <button className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-teal-400 to-emerald-500 text-zinc-950 hover:shadow-lg hover:shadow-teal-400/25">
          <span>Withdraw Funds</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* ══ TRANSACTIONS ══════════════════════════════════════════════════════ */}
      <div className="rounded-2xl p-5 bg-zinc-900/50 border border-white/5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
           Recent Mints
          </h3>
          <MintReferralFilter onChange={setPeriod} />
        </div>

        {/* Rows */}
        <div className="space-y-3 overflow-x-hidden max-h-[600px] overflow-y-auto scrollbar-hide">
          <ApiQuery
            uri={`/clans/${clanId}/referrals`}
            query={{ period }}
            key={period}
            onSuccess={onQuerySuccess}
          >
            <>
              { refDataArr.map((data, i) => (
                <MintReferralTxRow key={i} data={data}  />
              ))}
            </>
          </ApiQuery>
        </div>

        <button
          className="w-full mt-4 py-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all border border-dashed border-white/10 text-zinc-500 hover:border-teal-400/30 hover:text-teal-400"
        >
          <span>Load More</span><ChevronDown className="w-4 h-4" />
        </button>
        
      </div>
    </div>
  );
}
