import EnsureConnected from "@/components/ensureConnected/EnsureConnected";
import LoadingView from "@/components/loadingView/LoadingView";
import Navigation from "@/components/nav/Navigation";
import { useEffect, useState, useRef } from "react";
import { useWalletCore } from "@/hooks/useWalletCore";
import { useWeb3 } from "@/hooks/useWeb3";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import Footer from "@/components/Footer";
import utils from "@/lib/utils";
import { useApi } from "@/hooks/useApi";
import { useNavigate } from "react-router-dom";
import Button from "@/components/button/Button";
import MintAlgo, { MintRewardInfo } from "@/core/MintAlgo";
import toast from "@/hooks/toast";
import {
  Clock,
  AlertTriangle,
  Coins,
  Lock,
  Zap,
  Skull,
  ChevronRight,
  Activity,
  Flame,
  Globe,
  TrendingUp,
  Sparkle,
  Trophy,
  Calendar,
  Users,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import {
  ASSOCIATED_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@coral-xyz/anchor/dist/cjs/utils/token";
import ClaimTokenStats from "@/components/claimToken/ClaimTokenStats";
import LatePenaltyCard from "@/components/claimToken/LatePenaltyCard";
import MultipliersCard from "@/components/claimToken/MultipliersCard";
import CountDownTimer from "@/components/claimToken/CountDownTimer";
import programConfig from "@/config/program_config"
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";

interface TimeType {
  days:     number;
  hours:    number;
  minutes:  number;
  seconds:  number;
}

export default function TokenClaim() {

  const { isConnected, publicKey: accountPublicKey, address: accountAddress, networkId } = useWalletCore();
  const web3 = useWeb3();
  const navigate = useNavigate();

  // State
  const [pageLoading, setPageLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [pageError, setPageError] = useState("");
  const [rankInfo, setRankInfo] = useState<any>(null);
  const [globalRank, setGlobalRank] = useState(0);
  const [rankDifficultyInfo, setRankDifficultyInfo] = useState<any>(null)
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [rewardInfo, setRewardInfo] = useState<MintRewardInfo | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeType | null>(null);
  const [isClaimable, setIsClaimable] = useState(false);
  const [maturityDate, setMaturityDate] = useState<Date | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchAccountData();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isConnected, accountAddress, networkId]);

  // Timer Logic
  useEffect(() => {
    if (!maturityDate || !rankInfo) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const start = rankInfo.createdAt.toNumber() * 1000;
      const end = maturityDate.getTime();
      const totalDuration = end - start;
      const elapsed = now - start;
      const distance = end - now;

      // Update Progress Circle
      let pct = (elapsed / totalDuration) * 100;
      if (pct > 100) pct = 100;
      setProgressPercent(pct);

      if (distance < 0) {
        setIsClaimable(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (timerRef.current) clearInterval(timerRef.current);
        if (rankInfo && globalRank)
          calculateRewardPreview(rankInfo, globalRank);
      } else {
        setIsClaimable(false);
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);
  }, [maturityDate, rankInfo, globalRank]);

  const fetchAccountData = async () => {
    try {
      setPageLoading(true);
      if (!isConnected) return;

      const programId = await web3.getProgramId(networkId);
      const programPdas = await web3.getProgramPdas(networkId);

      const [userRankInfoPda] = await web3.findProgramAddress(
        [Buffer.from("rank_info"), accountPublicKey.toBuffer()],
        programId,
      );

      const [rankDifficultyPda, _] = PublicKey.findProgramAddressSync(
        [Buffer.from("rank_difficulty"), accountPublicKey.toBuffer()],
        programId
      );

      const resultStatus = await web3.fetchAccountsInfo({
        network: networkId,
        accounts: {
          globalRank: {
            idl: "maxxpainn",
            programId,
            pubkey: programPdas.globalRankPda,
            accountName: "globalRank",
          },
          userRankInfo: {
            idl: "maxxpainn",
            programId,
            pubkey: userRankInfoPda,
            accountName: "rankInfo",
          },
          tokenInfo: {
            idl: "maxxpainn",
            programId,
            pubkey: programPdas.mintPda,
            accountName: "splTokenInfo",
          },
          rankDifficulty: {
            idl: "maxxpainn",
            programId,
            pubkey: rankDifficultyPda,
            accountName: "rankDifficulty"
          }
        },
      });

      if (resultStatus.isError()) {
        setPageError(resultStatus.getMessage());
        return;
      }

      const data = resultStatus.getData();

      //console.log("data===>", data)

      const _globalRank = data.globalRank.decodedData.value.toNumber();
      const _tokenInfo = data.tokenInfo.decodedData;

      if (!data.userRankInfo) {
        toast.info("No active rank found. Mint first.");
        navigate("/mint")
        return;
      }

      const _rankInfo = data.userRankInfo.decodedData;

      if (_rankInfo.hasMinted) {
        setPageError("Tokens already claimed.");
        return;
      }

      const createdAt = _rankInfo.createdAt.toNumber() * 1000;
      const waitSecs = _rankInfo.waitPeriodSecs.toNumber() * 1000;
      const maturity = new Date(createdAt + waitSecs);

      setRankDifficultyInfo(data.rankDifficulty || null);
      setRankInfo(_rankInfo);
      setGlobalRank(_globalRank);
      setTokenInfo(_tokenInfo);
      setMaturityDate(maturity);
      calculateRewardPreview(_rankInfo, _globalRank);

    } catch (e) {
      utils.logError("TokenClaim#fetch:", e);
      setPageError("Failed to load data.");
    } finally {
      setPageLoading(false);
    }
  };


  const calculateRewardPreview = (rInfo: any, gRank: number) => {

    if (!rInfo) return;

    const rankNo = rInfo.rankNo.toNumber();
    const waitSecs = rInfo.waitPeriodSecs.toNumber();
    const waitDays = Math.floor(waitSecs / 86400);

    const createdAt = rInfo.createdAt.toNumber() * 1000;
    const maturity = createdAt + waitSecs * 1000;
    const now = Date.now();

    let daysLate = 0;
    if (now > maturity) {
      daysLate = Math.floor(Math.abs(now - maturity) / (1000 * 60 * 60 * 24));
    }

    const reward = MintAlgo.calculateFinalReward(
      rankNo,
      gRank,
      waitDays,
      daysLate,
    );

    //console.log("reward===>", reward);

    setRewardInfo(reward);
  };

  const handleClaim = async () => {
    try {

      setClaiming(true);

      const programId = await web3.getProgramId(networkId);
      const programPdas = await web3.getProgramPdas(networkId);

      const [rankInfoPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("rank_info"), accountPublicKey.toBuffer()],
        programId,
      );

      const mintPda = programPdas.mintPda
      const tokenClaimer = accountPublicKey;

      const tokenClaimerAta = await getAssociatedTokenAddress(
        mintPda,
        tokenClaimer,
        false, // allowOwnerOffCurve
        TOKEN_PROGRAM_ID, // <-- Pass the correct program ID here!
        ASSOCIATED_TOKEN_PROGRAM_ID
      );


      const claimTokensIx = {
        method:         "claimTokens",
        idl:            "maxxpainn",
        programId:      programId.toBase58(),
        args: [],
        accounts: {
          signer:                 tokenClaimer,
          mintAuthority:          programPdas.mintAuthorityPda,
          mint:                   mintPda,
          rankInfo:               rankInfoPda,
          tokenClaimer:           tokenClaimer,
          tokenClaimerAta,
          mainConfig:             programPdas.mainConfigPda,
          globalRank:             programPdas.globalRankPda,
          systemProgram:          SystemProgram.programId,
          tokenProgram:           TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        }
      }

      const closeRankIx = {
        method:     "closeRank",
        idl:        "maxxpainn",
        programId:  programId.toBase58(),
        args: [],
        accounts: {
          signer:         accountPublicKey,
          mainConfig:     programPdas.mainConfigPda,
          rankOwner:      accountPublicKey,
          rankInfo:       rankInfoPda,
          treasury:       programConfig.treasuryWallet,
          systemProgram:  SystemProgram.programId,
        }
      }

      const instructions = [
        claimTokensIx,
        closeRankIx
      ];

      if(rankDifficultyInfo != null && rankDifficultyInfo.lamports > 0) {

        const [rankDifficultyPda, _] = PublicKey.findProgramAddressSync(
          [Buffer.from("rank_difficulty"), accountPublicKey.toBuffer()],
          programId
        );

        const closeRankDifficultyIx = {
          method:     "closeRankDifficulty",
          idl:        "maxxpainn",
          programId:  programId.toBase58(),
          args: [],
          accounts: {
            signer:               accountPublicKey,
            mainConfig:           programPdas.mainConfigPda,
            rankDifficultyOwner:  accountPublicKey,
            rankDifficulty:       rankDifficultyPda,
            treasury:             programConfig.treasuryWallet,
            systemProgram:        SystemProgram.programId,
          }
        }

        // @ts-ignore
        instructions.push(closeRankDifficultyIx)
      }

      const txStatus = await web3.sendBatchTx({
        network: networkId,
        instructions
      });

      if (txStatus.isError()) {
        toast.error(txStatus.getMessage());
        return;
      }

      toast.success("Tokens Claimed Successfully!");

      navigate("/mint");

    } catch (e) {
      console.error(e);
      toast.error("Claim failed.");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans overflow-x-hidden">
      <Navigation />

      {/* --- IMMERSIVE BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-purple-600/10 rounded-full blur-[120px] opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <main className="relative z-10 pt-28 pb-20 min-h-screen flex flex-col items-center">
        <div className="w-full h-full max-w-8xl mx-auto px-4 md:px-6">
          <EnsureConnected>
            <LoadingView
              error={pageError}
              onReload={fetchAccountData}
              loading={pageLoading}
              className="h-[50vh] overflow-hidden"
            >
              {rankInfo && rewardInfo && (
                <div className="flex flex-col gap-10 items-center">
                  {/* --- 1. HEADER (Top) --- */}
                  <div className="text-center animate-in fade-in slide-in-from-top-8 duration-700">
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tight mb-4">
                      CLAIM{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                        TOKENS
                      </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                      The cycle is nearly complete.
                      <span
                        className={
                          isClaimable
                            ? "text-green-400 font-bold ml-2"
                            : "text-purple-400 font-bold ml-2"
                        }
                      >
                        {isClaimable
                          ? "Rewards are ready for harvest."
                          : "Endure the wait to maximize yield."}
                      </span>
                    </p>
                  </div>

                  {/* --- 2. RADIAL REACTOR (Middle) --- */}
                  <CountDownTimer
                    isClaimable={isClaimable}
                    progressPercent={progressPercent}
                    timeLeft={timeLeft}
                  />

                  {/* --- 3. HUD & ACTIONS (Bottom) --- */}
                  <div className="w-full space-y-8 max-w-3xl">
                    <ClaimTokenStats
                      stats={{
                        globalRank: globalRank.toLocaleString(),
                        clan: rankInfo.clanId.toString(),
                        rank: rankInfo.rankNo.toLocaleString(),
                        waitTime: `${Math.floor(rankInfo.waitPeriodSecs.toNumber() / 86400)} Days`,
                      }}
                    />

                    {/* Reward Card */}
                    <div className="relative group overflow-hidden rounded-3xl bg-gray-900/60 border border-white/10 backdrop-blur-xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-50" />
                      <div className="relative p-8 flex flex-col items-center text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                          <Sparkle className="w-3 h-3 text-yellow-400" />{" "}
                          Estimated Reward
                        </p>
                        <div className="flex flex-col  gap-2">
                          <span
                            className={`text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tighter ${rewardInfo.daysLate > 0 ? "text-red-400 line-through opacity-40 " : "text-white"}`}
                          >
                            {utils.toLocaleString(rewardInfo.rewardAmount)}
                          </span>
                          {rewardInfo.daysLate > 0 && (
                            <span className="text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tighter text-white animate-pulse">
                              {utils.toLocaleString(rewardInfo.finalReward)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-purple-500 mt-2 tracking-wide">
                          $PAINN Tokens
                        </p>
                      </div>
                      <div className="w-full h-1 bg-gray-800">
                        <div
                          className={`h-full transition-all duration-1000 ${isClaimable ? "bg-green-500" : "bg-gradient-to-r from-purple-600 to-pink-600"}`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                      <Button
                        disabled={!isClaimable || claiming}
                        loading={claiming}
                        onClick={() => handleClaim(false)}
                        variant="secondary"
                        size="xl"
                        className="flex-1 py-8 rounded-2xl text-lg font-bold bg-gray-800 hover:bg-gray-700 border border-white/5"
                      >
                        <span className="flex items-center gap-3">
                          <Coins className="w-5 h-5 text-gray-400" /> Claim to
                          Wallet
                        </span>
                      </Button>
                      <Button
                        disabled={!isClaimable || claiming}
                        onClick={() => handleClaim(true)}
                        variant="primary"
                        size="xl"
                        className="flex-1 py-8 rounded-2xl text-lg font-bold shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)]"
                      >
                        <span className="flex items-center gap-3">
                          <Flame className="w-5 h-5 text-pink-200 fill-current" />{" "}
                          Claim & Stake
                        </span>
                      </Button>
                    </div>

                    {/* --- 4. DETAILS GRID (New Section) --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/5">
                      {/* Card 1: Multipliers */}
                      <MultipliersCard
                        rewardInfo={rewardInfo}
                        rankNo={rankInfo.rankNo.toNumber()}
                        globalRank={globalRank}
                      />

                      {/* Card 2: Penalty Schedule */}
                      <LatePenaltyCard daysLate={rewardInfo.daysLate} />

                      {/* Card 3: Quick Info */}
                    </div>
                  </div>
                </div>
              )}
            </LoadingView>
          </EnsureConnected>
        </div>
      </main>
      <Footer />
    </div>
  );
}
