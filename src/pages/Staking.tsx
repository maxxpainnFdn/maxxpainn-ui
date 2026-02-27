import { useState, useMemo, useEffect } from "react";
import { MinusCircle, ShieldCheck } from "lucide-react";
import Navigation from "@/components/nav/Navigation";
import { stakingConfig } from "@/config/staking";
import StakingStats from "@/components/staking/StakingStats";
import Unstake from "@/components/staking/tabs/Unstake";
import Stake from "@/components/staking/tabs/Stake";
import { UserStakeInfo } from "@/types/UserStakeInfo";
import { useWalletCore } from "@/hooks/useWalletCore";
import utils from "@/lib/utils";
import { useWeb3 } from "@/hooks/useWeb3";
import LoadingView from "@/components/loadingView/LoadingView";
import EnsureConnected from "@/components/ensureConnected/EnsureConnected";
import { TokenBalanceInfo } from "@/types/TokenBalanceInfo";
import { StakingMath } from "@/core/StakingMath";
import { FetchOnchainDataReturn, useStaking } from "@/hooks/useStaking";

/* ── Tab button ────────────────────────────────────────────── */
const TabButton = ({ active, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`
      flex-1 py-4 flex items-center justify-center gap-2.5
      font-mono text-xs tracking-widest uppercase
      transition-all duration-200 relative overflow-hidden
      ${active
        ? "text-maxx-white"
        : "text-maxx-sub hover:text-maxx-mid hover:bg-maxx-violet/5"
      }
    `}
  >
    {/* active background tint */}
    {active && (
      <div className="absolute inset-0 bg-gradient-to-t from-maxx-violet/10 to-transparent pointer-events-none" />
    )}

    <Icon
      size={16}
      className={`relative z-10 transition-colors ${
        active ? "text-maxx-violet" : "text-maxx-dim"
      }`}
    />
    <span className="relative z-10">{children}</span>

    {/* active bottom accent */}
    {active && (
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet via-maxx-pink to-maxx-violet" />
    )}
  </button>
);

/* ── Main page ─────────────────────────────────────────────── */
const Staking = () => {
  const {
    isConnected,
    networkId,
    publicKey: accountPublickey,
  } = useWalletCore();

  const stakingCore = useStaking();

  const [activeTab, setActiveTab]                   = useState<"stake" | "unstake">("stake");
  const [userStakeInfo, setUserStakeInfo]           = useState<UserStakeInfo | null>(null);
  const [totalStakedTokens, setTotalStakedTokens]   = useState<{ valueRaw: bigint; valueFormatted: string }>({ valueRaw: 0n, valueFormatted: "0" });
  const [pageError, setPageError]                   = useState<string>("");
  const [loading, setLoading]                       = useState(false);
  const [userTokenBalanceInfo, setUserTokenBalanceInfo] = useState<TokenBalanceInfo>({ valueRaw: BigInt(0), value: "" });
  const [rewards, setRewards]                       = useState(0);

  const hasActiveStake = useMemo(() => userStakeInfo != null, [userStakeInfo]);

  useEffect(() => {
    let intval: NodeJS.Timeout;
    if (!userStakeInfo) { setRewards(0); return; }
    setRewards(userStakeInfo?.rewards || 0);
    intval = setInterval(() => { setRewards(stakingCore.getRewards(userStakeInfo)); }, 1_000);
    return () => { if (intval) clearInterval(intval); };
  }, [userStakeInfo]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [isConnected, accountPublickey]);

  const fetchData = async () => {
    if (!isConnected) return;
    setPageError("");
    setLoading(true);
    const resultStatus = await stakingCore.fetchOnchainData(networkId, accountPublickey);
    setLoading(false);
    if (resultStatus.isError()) { setPageError(resultStatus.getMessage()); return; }
    const resultData = resultStatus.getData() as FetchOnchainDataReturn;
    setUserTokenBalanceInfo(resultData.userBalanceInfo);
    setUserStakeInfo(resultData.userStakeInfo);
    setTotalStakedTokens(resultData.totalStaked);
  };

  return (
    <div className="min-h-screen bg-maxx-bg0 overflow-x-hidden">

      {/* ── Noise layer ── */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-noise-pattern opacity-100" />

      {/* ── Ambient glows ── */}
      <div className="fixed top-[-10%] left-[20%] w-[40vw] h-[40vw] bg-[radial-gradient(circle,color-mix(in srgb, var(--maxx-violet) 7%, transparent)_0%,transparent_65%)] pointer-events-none z-0 rounded-full" />
      <div className="fixed bottom-[10%] right-[15%] w-[30vw] h-[30vw] bg-[radial-gradient(circle,color-mix(in srgb, var(--maxx-pink) 5%, transparent)_0%,transparent_65%)] pointer-events-none z-0 rounded-full" />

      <Navigation />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-[68px]">

        {/* ── PAGE HEADER ── */}
        <div className="text-center w-full mb-12 pt-12 animate-fade-up">
          <div className="eyebrow justify-center mb-3">
            <span className="eyebrow-dot" />
            PROOF OF PATIENCE · SOLANA
          </div>
          <h1 className="font-sans font-black text-[clamp(2.8rem,9vw,7rem)] leading-[0.94] tracking-tight text-maxx-white uppercase">
            STAKING{" "}
            <span className="bg-grad-accent bg-clip-text text-transparent">
              CONSOLE
            </span>
          </h1>
          <p className="font-sans text-base md:text-lg text-maxx-mid mt-3 max-w-lg mx-auto leading-relaxed">
            {hasActiveStake
              ? "Your position is locked and earning. Compound your dominance by adding more $PAINN."
              : "Initialise your position. Longer lock periods yield significantly higher multipliers."}
          </p>
        </div>

        <EnsureConnected>
          <LoadingView loading={loading} error={pageError} onReload={fetchData}>

            {/* ── Stats strip ── */}
            <div className="mb-8 animate-fade-up delay-1">
              <StakingStats
                data={{
                  tvl:         utils.toLocaleString(totalStakedTokens.valueFormatted),
                  maxYield:    stakingConfig.maxYield + "%",
                  userStake:   utils.toLocaleString(userStakeInfo?.amountFormatted || 0),
                  userRewards: rewards || 0,
                }}
              />
            </div>

            {/* ── Main interface card ── */}
            <div className="bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg overflow-hidden shadow-2xl relative animate-fade-up delay-2">

              {/* top accent */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet/60 via-maxx-pink/30 to-transparent pointer-events-none" />

              {/* ── Tabs ── */}
              <div className="flex border-b border-maxx-violet/15 bg-maxx-bg0/40">
                <TabButton
                  active={activeTab === "stake"}
                  onClick={() => setActiveTab("stake")}
                  icon={ShieldCheck}
                >
                  Stake
                </TabButton>
                <TabButton
                  active={activeTab === "unstake"}
                  onClick={() => setActiveTab("unstake")}
                  icon={MinusCircle}
                >
                  Unstake
                </TabButton>
              </div>

              {/* ── Tab content ── */}
              <div className="p-6 md:p-10 min-h-[500px]">
                {activeTab === "stake" && (
                  <Stake
                    userStakeInfo={userStakeInfo}
                    tokenBalanceInfo={userTokenBalanceInfo}
                    onStakingSuccess={fetchData}
                  />
                )}
                {activeTab === "unstake" && (
                  <Unstake
                    hasActiveStake={hasActiveStake}
                    userStakeInfo={userStakeInfo}
                    rewards={rewards}
                    onUnstakingSuccess={fetchData}
                  />
                )}
              </div>
            </div>

          </LoadingView>
        </EnsureConnected>
      </div>
    </div>
  );
};

export default Staking;
