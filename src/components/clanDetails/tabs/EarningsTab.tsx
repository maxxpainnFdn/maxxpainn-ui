import { useState, useEffect, useRef } from "react";
import { 
  ArrowUpRight, 
  Settings, 
  ChevronDown, 
  Copy, 
  Check, 
  TrendingUp, 
  Wallet, 
  Coins, 
  Layers,
  History,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink
} from "lucide-react";
import utils, { cn } from "@/lib/utils";
import { ClanData } from "@/types/ClanData";
import StatsCard from "@/components/StatsCard";
import { useWalletCore } from "@/hooks/useWalletCore";
import MintReferralFilter from "../MintReferralFilter";
import ApiQuery from "@/components/apiQuery/ApiQuery";
import MintReferralTxRow from "../MintReferralTxRow";
import { rewardsConfig } from "@/config/rewards_config";
import EarningsWithdrawalModal from "../EarningsWithdrawalModal";
import { useNavigate } from "react-router-dom";
import PayoutHistoryItem from "../PayoutHistoryItem";


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

export default function EarningsTab({ clan, onPageUpdate }: { clan: ClanData, onPageUpdate: ((clan: ClanData | null) => void) }) {
  
  const clanId = clan.id;
  const { address: accountAddr, isConnected } = useWalletCore();
  const navigate = useNavigate();

  
  // Tab State
  const [activeTab, setActiveTab] = useState<'mints' | 'payouts'>('mints');
  
  const [period, setPeriod] = useState<string>("all");
  const [refDataArr, setRefDataArr] = useState([]);
  const [payoutsData, setPayoutsData] = useState([]);
 
  const unClaimedAmount = clan.totalEarnedUsd - clan.totalEarnedClaimedUsd;
  
  
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

      {/* ── Background blurs ── */}
      <div className="relative">
        <div className="absolute pointer-events-none -top-32 -left-32 w-96 h-96 rounded-full blur-[128px] bg-teal-400/10" />
        <div className="absolute pointer-events-none -bottom-32 -right-32 w-96 h-96 rounded-full blur-[128px] bg-pink-500/10" />
      </div>

      {/* ══ MAIN GRID — total + ring ═════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Total earnings */}
        <div className="lg:col-span-2 rounded-[20px] p-[1px] pb-[10px] bg-gradient-to-br from-teal-400/20 to-pink-500/20">
          <div className="h-[100%] rounded-[19px] p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between align-middle gap-6 bg-zinc-900">
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
          <PayoutRing current={unClaimedAmount} goal={rewardsConfig.minCashoutThresholdUsd} />
          <div className="text-sm mt-4 text-center text-zinc-400">
            <div className="text-white font-semibold">{rewardsConfig.minCashoutThresholdUsd} USDC</div>
            <div>Minimum Payout Amount</div>
          </div>
        </div>
      </div>

      {/* ══ STATS ROW ════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {statsData.map(({ icon, label, value, color }, i) => (
          <StatsCard
            key={i}
            icon={icon}
            title={label}
            value={value}
            color={color}
          />
        ))}
      </div>

      {/* ══ WITHDRAWAL ROW ═══════════════════════════════════════════════════ */}
      {isConnected && clan.isOwner === true && (
        <div className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 border border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br from-purple-600 to-indigo-700">
              👛
            </div>
            <div>
              <p className="text-xs mb-1 text-zinc-500">Connected Wallet</p>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm transition-all bg-zinc-950 text-zinc-300 hover:bg-zinc-800"
                disabled={unClaimedAmount == 0}
              >
                {utils.maskAddress(accountAddr, 8, 8)}
              </button>
            </div>
          </div>
          
          <EarningsWithdrawalModal
            clanId={clanId}
            amount={unClaimedAmount}
            onSuccess={(newClanData) => onPageUpdate(newClanData) }
          />
        </div>
      )}
      
      {/* ══ TABBED CONTENT SECTION ═══════════════════════════════════════════ */}
      <div className="rounded-2xl bg-zinc-900/50 border border-white/5 overflow-hidden">
        
        {/* Tabs Header */}
        <div className="flex items-center border-b border-white/5 bg-zinc-900/80">
          <button
            onClick={() => setActiveTab('mints')}
            className={cn(
              "px-6 py-4 text-sm font-semibold tracking-wide transition-all border-b-2",
              activeTab === 'mints' 
                ? "border-teal-400 text-white bg-white/5" 
                : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
            )}
          >
            Recent Mints
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={cn(
              "px-6 py-4 text-sm font-semibold tracking-wide transition-all border-b-2",
              activeTab === 'payouts' 
                ? "border-purple-500 text-white bg-white/5" 
                : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
            )}
          >
            Payout History
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5">
          
          {/* ── TAB: MINTS ── */}
          {activeTab === 'mints' && (
            <div className="animate-fade-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                 Referral Activity
                </h3>
                <MintReferralFilter onChange={setPeriod} />
              </div>

              <div className="space-y-3 overflow-x-hidden max-h-[600px] overflow-y-auto scrollbar-hide">
                <ApiQuery
                  uri={`/clans/${clanId}/referrals`}
                  query={{ period }}
                  key={period}
                  onSuccess={ data => setRefDataArr(data)}
                  pagingType="full"
                >
                  <>
                    {refDataArr.length === 0 && (
                      <div className="p-8 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                        No recent mints found for this period.
                      </div>
                    )}
                    {refDataArr.map((data: any, i) => (
                      <MintReferralTxRow key={i} data={data} />
                    ))}
                  </>
                </ApiQuery>
              </div>
            </div>
          )}

          {/* ── TAB: PAYOUTS ── */}
          {activeTab === 'payouts' && (
            <div className="animate-fade-up">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Payouts History
                </h3>
              </div>

              <div className="space-y-3">
                <ApiQuery
                  uri={`/clans/${clanId}/payouts`}
                  onSuccess={(dataArr) => setPayoutsData(dataArr)}
                  pagingType="full"
                >
                  <>
                    {refDataArr.length === 0 && (
                      <div className="p-8 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                        No data found
                      </div>
                    )}
                    {payoutsData.map((data: any, i) => (
                      <PayoutHistoryItem
                        key={i}
                        data={data}
                      />
                    ))}
                  </>
                </ApiQuery>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
