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
import { DecodedAccountInfo, useWeb3 } from "@/hooks/useWeb3";
import LoadingView from "@/components/loadingView/LoadingView";
import EnsureConnected from "@/components/ensureConnected/EnsureConnected";
import { TokenBalanceInfo } from "@/types/TokenBalanceInfo";
import { StakingMath } from "@/core/StakingMath";
import { FetchOnchainDataReturn, useStaking } from "@/hooks/useStaking";

const TabButton = ({ active, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`
      flex-1 py-5 flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 relative overflow-hidden
      ${
        active
          ? "text-white"
          : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
      }
    `}
  >
    {active && (
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
    )}
    <Icon
      className={`w-5 h-5 relative z-10 ${active ? "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" : ""}`}
    />
    <span className="relative z-10">{children}</span>
    {active && (
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 shadow-[0_0_10px_rgba(219,39,119,0.8)]" />
    )}
  </button>
);

// --- MAIN PAGE COMPONENT ---
const Staking = () => {
  const {
    isConnected,
    networkId,
    publicKey: accountPublickey,
  } = useWalletCore();

  const stakingCore = useStaking();

  const [activeTab, setActiveTab] = useState<"stake" | "unstake">("stake"); // 'stake' | 'unstake'
  const [userStakeInfo, setUserStakeInfo] = useState<UserStakeInfo | null>(null);
  const [totalStakedTokens, setTotalStakedTokens] = useState<{ valueRaw: bigint, valueFormatted: string}>({ valueRaw: 0n, valueFormatted: '0' })

  const [pageError, setPageError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [userTokenBalanceInfo, setUserTokenBalanceInfo] = useState<TokenBalanceInfo>({ valueRaw: BigInt(0), value: "" });
  const [rewards, setRewards] = useState(0)

  const hasActiveStake = useMemo(() => userStakeInfo != null, [userStakeInfo]);
  
  useEffect(() => {
    let intval;
    
    if (!userStakeInfo) {
       setRewards(0)
      return;
    }
    
    setRewards(userStakeInfo?.rewards || 0)
    
    intval = setInterval(() => {
      setRewards(stakingCore.getRewards(userStakeInfo))
    }, 1_000)
    
    return () => {
      if (intval) clearInterval(intval)
    }
  },[userStakeInfo])

  useEffect(() => {
     setLoading(true);
    fetchData()
  }, [isConnected, accountPublickey]);

  const fetchData = async () => {
        
    if (!isConnected) return;
    
    setPageError("")
    setLoading(true);
    
    const resultStatus = await stakingCore.fetchOnchainData(
      networkId,
      accountPublickey,
    );
    
    setLoading(false);

    if (resultStatus.isError()) {
      setPageError(resultStatus.getMessage());
      return;
    }

    const resultData = resultStatus.getData() as FetchOnchainDataReturn;
    
    //console.log("resultData===>", resultData)
    
    setUserTokenBalanceInfo(resultData.userBalanceInfo);
    setUserStakeInfo(resultData.userStakeInfo);
    setTotalStakedTokens(resultData.totalStaked);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden pb-24 font-sans selection:bg-purple-500/30">
      <Navigation />

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[20%] w-[30vw] h-[30vw] bg-pink-900/10 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-12 md:pt-20">
        {/* --- HEADER --- */}
        <div className="text-center w-full mb-16 gap-6 pt-20 flex justify-center">
          <div>
            <h1 className="text-3xl  md:text-5xl lg:text-7xl font-black tracking-tighter text-white mb-2">
              STAKING{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">
                CONSOLE
              </span>
            </h1>
            <div className="text-center  w-full text-gray-400 text-lg max-w-xl leading-relaxed">
              {hasActiveStake
                ? "Your position is locked and earning. Add more PAINN to compound your dominance."
                : "Initialize your position. Longer lock periods yield significantly higher multipliers."}
            </div>
          </div>
        </div>

        <EnsureConnected>
          <LoadingView loading={loading} error={pageError} onReload={fetchData}>
            <StakingStats
              data={{
                tvl: utils.toLocaleString(totalStakedTokens.valueFormatted),
                maxYield: stakingConfig.maxYield + "%",
                userStake: utils.toLocaleString(userStakeInfo?.amountFormatted || 0),
                userRewards: rewards || 0,
              }}
            />

            {/* --- MAIN INTERFACE --- */}
            <div className="bg-gray-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
              {/* Tabs */}
              <div className="flex border-b border-white/5 bg-black/20">
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

              <div className="p-6 md:p-12 min-h-[500px]">
                {activeTab === "stake" && (
                  <Stake
                    userStakeInfo={userStakeInfo}
                    tokenBalanceInfo={userTokenBalanceInfo}
                    onStakingSuccess={ fetchData }
                  />
                )}

                {activeTab === "unstake" && (
                  <Unstake
                    hasActiveStake={hasActiveStake}
                    userStakeInfo={userStakeInfo}
                    rewards={rewards}
                    onUnstakingSuccess={ fetchData }
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
