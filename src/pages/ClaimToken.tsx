import EnsureConnected from "@/components/ensureConnected/EnsureConnected";
import LoadingView from "@/components/loadingView/LoadingView";
import Navigation from "@/components/nav/Navigation";
import { useEffect, useState, useRef } from "react";
import { useWalletCore } from "@/hooks/useWalletCore";
import { useWeb3 } from "@/hooks/useWeb3";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import Footer from "@/components/Footer";
import utils from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import Button from "@/components/button/Button";
import MintAlgo, { MintRewardInfo } from "@/core/MintAlgo";
import toast from "@/hooks/toast";
import { Coins, Flame, Sparkles } from "lucide-react";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import ClaimTokenStats from "@/components/claimToken/ClaimTokenStats";
import LatePenaltyCard from "@/components/claimToken/LatePenaltyCard";
import MultipliersCard from "@/components/claimToken/MultipliersCard";
import CountDownTimer from "@/components/claimToken/CountDownTimer";
import { programConfig } from "@/config/program_config";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import StakingModal from "@/components/staking/StakingModal";
import { tokenConfig } from "@/config/token";
import { stakingConfig } from "@/config/staking";
import { BN } from "@coral-xyz/anchor";
import { Helmet } from "react-helmet-async";

interface TimeType {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const { maxTermDays: maxStakeTermDays, minTermDays: minStakeTermDays } = stakingConfig;

export default function TokenClaim() {
  const {
    isConnected,
    publicKey: accountPublicKey,
    address: accountAddress,
    networkId,
  } = useWalletCore();

  const web3 = useWeb3();
  const navigate = useNavigate();

  const [pageLoading, setPageLoading]               = useState(false);
  const [claiming, setClaiming]                     = useState(false);
  const [pageError, setPageError]                   = useState("");
  const [rankInfo, setRankInfo]                     = useState<any>(null);
  const [globalRank, setGlobalRank]                 = useState(0);
  const [rankDifficultyInfo, setRankDifficultyInfo] = useState<any>(null);
  const [tokenInfo, setTokenInfo]                   = useState<any>(null);
  const [rewardInfo, setRewardInfo]                 = useState<MintRewardInfo | null>(null);
  const [timeLeft, setTimeLeft]                     = useState<TimeType | null>(null);
  const [isClaimable, setIsClaimable]               = useState(false);
  const [maturityDate, setMaturityDate]             = useState<Date | null>(null);
  const [progressPercent, setProgressPercent]       = useState(0);
  const [stakingModalOpen, setStakingModalOpen]     = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchAccountData();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isConnected, accountAddress, networkId]);

  useEffect(() => {
    if (claiming) toast.loading("Processing..");
    else toast.dismiss();
  }, [claiming]);

  useEffect(() => {
    if (!maturityDate || !rankInfo) return;

    const updateTimer = () => {
      const now           = new Date().getTime();
      const start         = rankInfo.createdAt.toNumber() * 1000;
      const end           = maturityDate.getTime();
      const totalDuration = end - start;
      const elapsed       = now - start;
      const distance      = end - now;

      let pct = (elapsed / totalDuration) * 100;
      if (pct > 100) pct = 100;
      setProgressPercent(pct);

      if (distance < 0) {
        setIsClaimable(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (timerRef.current) clearInterval(timerRef.current);
        if (rankInfo && globalRank) calculateRewardPreview(rankInfo, globalRank);
      } else {
        setIsClaimable(false);
        setTimeLeft({
          days:    Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours:   Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
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
      setPageError("");

      const programId   = await web3.getProgramId(networkId);
      const programPdas = await web3.getProgramPdas(networkId);

      const [userRankInfoPda] = await web3.findProgramAddress(
        [Buffer.from("rank_info"), accountPublicKey.toBuffer()], programId,
      );
      const [rankDifficultyPda, _] = PublicKey.findProgramAddressSync(
        [Buffer.from("rank_difficulty"), accountPublicKey.toBuffer()], programId,
      );

      const resultStatus = await web3.fetchAccountsInfo({
        network: networkId,
        accounts: {
          protocolState:  { idl: "maxxpainn", programId, pubkey: programPdas.protocolStatePda, accountName: "protocolState" },
          userRankInfo:   { idl: "maxxpainn", programId, pubkey: userRankInfoPda,              accountName: "rankInfo"       },
          tokenInfo:      { idl: "maxxpainn", programId, pubkey: programPdas.mintPda,          accountName: "splTokenInfo"   },
          rankDifficulty: { idl: "maxxpainn", programId, pubkey: rankDifficultyPda,            accountName: "rankDifficulty" },
        },
      });

      if (resultStatus.isError()) { setPageError(resultStatus.getMessage()); return; }

      const data          = resultStatus.getData();
      const protocolState = data.protocolState?.decodedData;
      const _tokenInfo    = data.tokenInfo.decodedData;
      const _globalRank   = Number(protocolState?.globalRank?.toString() || "0");

      if (!data.userRankInfo) { toast.info("No active rank found. Mint first."); navigate("/mint"); return; }

      const _rankInfo = data.userRankInfo.decodedData;
      if (_rankInfo.hasMinted) { setPageError("Tokens already claimed."); return; }

      const createdAt = _rankInfo.createdAt.toNumber() * 1000;
      const waitSecs  = _rankInfo.waitPeriodSecs.toNumber() * 1000;
      const maturity  = new Date(createdAt + waitSecs);

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
    const rankNo   = rInfo.rankNo.toNumber();
    const waitSecs = rInfo.waitPeriodSecs.toNumber();
    const waitDays = Math.floor(waitSecs / 86400);
    const maturity = rInfo.createdAt.toNumber() * 1000 + waitSecs * 1000;
    const now      = Date.now();
    const daysLate = now > maturity ? Math.floor(Math.abs(now - maturity) / (1000 * 60 * 60 * 24)) : 0;
    setRewardInfo(MintAlgo.calculateFinalReward(rankNo, gRank, waitDays, daysLate));
  };

  const prepareClaimIx = async (autoStake = false, stakeTermDays?: number) => {
    const programId   = await web3.getProgramId(networkId);
    const programPdas = await web3.getProgramPdas(networkId);

    const [rankInfoPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("rank_info"), accountPublicKey.toBuffer()], programId,
    );

    const mintPda         = programPdas.mintPda;
    const tokenClaimer    = accountPublicKey;
    const tokenClaimerAta = await getAssociatedTokenAddress(
      mintPda, tokenClaimer, false, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    const instructions: any[] = [
      {
        method: "claimTokens", idl: "maxxpainn", programId: programId.toBase58(), args: [],
        accounts: {
          signer: tokenClaimer, mintAuthority: programPdas.mintAuthorityPda, mint: mintPda,
          rankInfo: rankInfoPda, tokenClaimer, tokenClaimerAta,
          mainConfig: programPdas.mainConfigPda, protocolState: programPdas.protocolStatePda,
          systemProgram: SystemProgram.programId, tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        },
      },
      {
        method: "closeRank", idl: "maxxpainn", programId: programId.toBase58(), args: [],
        accounts: {
          signer: accountPublicKey, mainConfig: programPdas.mainConfigPda,
          rankOwner: accountPublicKey, rankInfo: rankInfoPda,
          treasury: programConfig.treasuryWallet, systemProgram: SystemProgram.programId,
        },
      },
    ];

    if (rankDifficultyInfo?.lamports > 0) {
      const [rankDifficultyPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("rank_difficulty"), accountPublicKey.toBuffer()], programId,
      );
      instructions.push({
        method: "closeRankDifficulty", idl: "maxxpainn", programId: programId.toBase58(), args: [],
        accounts: {
          signer: accountPublicKey, mainConfig: programPdas.mainConfigPda,
          rankDifficultyOwner: accountPublicKey, rankDifficulty: rankDifficultyPda,
          treasury: programConfig.treasuryWallet, systemProgram: SystemProgram.programId,
        },
      });
    }

    if (autoStake && stakeTermDays) {
      const [stakeInfoPda]    = PublicKey.findProgramAddressSync([Buffer.from("stake_info"),   accountPublicKey.toBuffer()], programId);
      const [stakingVaultPda] = PublicKey.findProgramAddressSync([Buffer.from("staking_vault"), mintPda.toBuffer()],          programId);
      instructions.push({
        network: networkId, method: "stake", idl: "maxxpainn", programId: programId.toBase58(),
        args: [utils.toUnits(rewardInfo.finalReward, tokenConfig.decimals), new BN(stakeTermDays)],
        accounts: {
          signer: accountPublicKey, mainConfig: programPdas.mainConfigPda,
          mintAuthority: programPdas.mintAuthorityPda, stakeInfo: stakeInfoPda,
          stakingVault: stakingVaultPda, systemProgram: SystemProgram.programId,
        },
      });
    }

    return instructions;
  };

  const handleClaim = async () => {
    try {
      setClaiming(true);
      const ixArr    = await prepareClaimIx(false);
      const txStatus = await web3.sendBatchTx({ network: networkId, instructions: ixArr });
      if (txStatus.isError()) { toast.error(txStatus.getMessage()); return; }
      toast.success("Tokens Claimed Successfully!");
      navigate("/mint");
    } catch (e: any) {
      utils.logError("", e);
      toast.error(utils.systemError);
    } finally {
      setClaiming(false);
    }
  };

  const handleClaimAndStake = async (stakeTermDays: number) => {
    try {
      if (stakeTermDays < minStakeTermDays || stakeTermDays > maxStakeTermDays) { toast.error("Invalid staking term"); return; }
      setClaiming(true);
      const ixArr    = await prepareClaimIx(true, stakeTermDays);
      const txStatus = await web3.sendBatchTx({ network: networkId, instructions: ixArr });
      if (txStatus.isError()) { toast.error(txStatus.getMessage()); return; }
      toast.success("Tokens Claimed & Staked Successfully!");
      navigate("/staking");
    } catch (e: any) {
      utils.logError("", e);
      toast.error(utils.systemError);
    } finally {
      setClaiming(false);
    }
  };

  const title       = "MaxxPainn - Claim Your Freely Minted MaxxPainn Tokens";
  const description = "Claim your earned MaxxPainn tokens safely and quickly. Participate in time-locked staking and maximize your rewards on Solana.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description"         content={description} />
        <meta property="og:title"        content={title} />
        <meta property="og:description"  content={description} />
        <meta property="og:type"         content="website" />
        <meta property="og:url"          content="https://maxxpainn.com/claim" />
        <meta property="og:image"        content="https://maxxpainn.com/images/pages/claim.jpeg" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image"       content="https://maxxpainn.com/images/pages/claim.jpeg" />
      </Helmet>

      <div className="min-h-screen bg-maxx-bg0 overflow-x-hidden">

        {/* ── Noise layer ── */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-noise-pattern opacity-100" />

        {/* ── Ambient glows ── */}
        <div className="fixed -top-32 -right-32 w-[600px] h-[600px] bg-[radial-gradient(circle,color-mix(in srgb, var(--maxx-pink) 7%, transparent)_0%,transparent_65%)] pointer-events-none z-0" />
        <div className="fixed top-[40%] -left-24 w-[400px] h-[400px] bg-[radial-gradient(circle,color-mix(in srgb, var(--maxx-violet) 6%, transparent)_0%,transparent_70%)] pointer-events-none z-0" />
        
        
        <Navigation />

        {rewardInfo && (
          <StakingModal
            open={stakingModalOpen}
            onChange={(state) => setStakingModalOpen(state)}
            amount={{ valueRaw: rewardInfo.finalAmountRaw, valueFormatted: rewardInfo.finalReward }}
            executeStake={handleClaimAndStake}
          />
        )}

        <main className="relative z-10 pt-[68px] pb-20">
          <div className="max-w-4xl mx-auto px-4 md:px-6 pt-12">

            <EnsureConnected className="min-h-[75vh]">
              <LoadingView
                error={pageError}
                onReload={fetchAccountData}
                loading={pageLoading}
                className="min-h-[50vh]"
              >
                {rankInfo && rewardInfo && (
                  <div className="flex flex-col gap-8 items-center">

                    {/* ── PAGE HEADER ── */}
                    <div className="text-center w-full animate-fade-up">
                      <div className="eyebrow justify-center mb-3">
                        <span className="eyebrow-dot" />
                        PROOF OF PATIENCE · SOLANA
                      </div>
                      <h1 className="font-sans font-bold text-2xl sm:text-3xl md:font-black md:text-4xl lg:text-6xl leading-[0.94] tracking-tight text-maxx-white uppercase">
                        CLAIM{" "}
                        <span className="bg-grad-accent bg-clip-text text-transparent">
                          ${tokenConfig.symbol}
                        </span>
                      </h1>
                      <p className="font-sans text-md md:text-lg text-maxx-bright leading-relaxed mt-3 max-w-xl mx-auto">
                        The cycle is nearly complete.{" "}
                        <span className={`font-bold ${isClaimable ? "text-emerald-400" : "text-maxx-violetLt"}`}>
                          {isClaimable
                            ? "Your rewards are ready to harvest."
                            : "Endure the wait to maximise your yield."}
                        </span>
                      </p>
                    </div>

                    {/* ── COUNTDOWN TIMER ── */}
                    <div className="w-full animate-fade-up delay-1">
                      <CountDownTimer
                        isClaimable={isClaimable}
                        progressPercent={progressPercent}
                        timeLeft={timeLeft}
                      />
                    </div>

                    {/* ── STATS STRIP ── */}
                    <div className="w-full animate-fade-up delay-2">
                      <ClaimTokenStats
                        stats={{
                          globalRank: globalRank.toLocaleString(),
                          clan:       rankInfo.clanId.toString(),
                          rank:       rankInfo.rankNo.toLocaleString(),
                          waitTime:   `${Math.floor(rankInfo.waitPeriodSecs.toNumber() / 86400)} Days`,
                        }}
                      />
                    </div>

                    {/* ── REWARD CARD ── */}
                    <div className="w-full animate-fade-up delay-2">
                      <div className="bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg overflow-hidden relative">

                        {/* top accent */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet/60 via-maxx-pink/30 to-transparent" />

                        {/* corner glow */}
                        <div className="absolute -top-10 -right-10 w-48 h-48 bg-[radial-gradient(circle,color-mix(in srgb, var(--maxx-violet) 10%, transparent)_0%,transparent_70%)] pointer-events-none" />

                        <div className="relative p-8 flex flex-col items-center text-center">

                          {/* label */}
                          <div className="flex items-center gap-2 mb-4">
                            <Sparkles size={13} className="text-yellow-400" />
                            <span className="font-mono text-xs tracking-widest uppercase text-maxx-sub">
                              Estimated Reward
                            </span>
                          </div>

                          {/* amount */}
                          <div className="flex flex-col items-center gap-2">
                            <span className={`font-sans font-black font-mono tracking-tighter text-[clamp(2.2rem,8vw,4.5rem)] leading-none ${rewardInfo.daysLate > 0 ? "text-maxx-pink line-through opacity-35" : "text-maxx-white"}`}>
                              {utils.toLocaleString(rewardInfo.rewardAmount)}
                            </span>
                            {rewardInfo.daysLate > 0 && (
                              <span className="font-sans font-black font-mono tracking-tighter text-[clamp(2.2rem,8vw,4.5rem)] leading-none text-maxx-white animate-pain-pulse">
                                {utils.toLocaleString(rewardInfo.finalReward)}
                              </span>
                            )}
                          </div>

                          {/* token label */}
                          <div className="flex items-center gap-2 mt-4">
                            <div className="w-1.5 h-1.5 rounded-sm bg-maxx-violet" />
                            <span className="font-mono text-sm font-bold text-maxx-violetLt tracking-widest uppercase">
                              ${tokenConfig.symbol} Tokens
                            </span>
                          </div>
                        </div>

                        {/* progress bar */}
                        <div className="h-[3px] bg-maxx-violet/15">
                          <div
                            className="h-full transition-all duration-1000"
                            style={{
                              width: `${progressPercent}%`,
                              background: isClaimable
                                ? "var(--maxx-emerald)"
                                : "linear-gradient(90deg, var(--maxx-violet), var(--maxx-pink))",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* ── ACTION BUTTONS ── */}
                    <div className="w-full flex flex-col sm:flex-row gap-3 animate-fade-up delay-3">
                      <Button
                        disabled={!isClaimable || claiming}
                        loading={claiming}
                        onClick={handleClaim}
                        variant="secondary"
                        size="lg"
                        fullWidth
                        className="py-4 text-base"
                      >
                        <Coins size={16} />
                        Claim to Wallet
                      </Button>
                      <Button
                        disabled={!isClaimable || claiming}
                        onClick={() => setStakingModalOpen(true)}
                        variant="primary"
                        size="lg"
                        fullWidth
                        className="py-4 text-base"
                      >
                        <Flame size={16} />
                        Claim &amp; Stake
                      </Button>
                    </div>

                    {/* ── DETAILS GRID ── */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-maxx-violet/15 animate-fade-up delay-3">
                      <MultipliersCard
                        rewardInfo={rewardInfo}
                        rankNo={rankInfo.rankNo.toNumber()}
                        globalRank={globalRank}
                      />
                      <LatePenaltyCard daysLate={rewardInfo.daysLate} />
                    </div>

                  </div>
                )}
              </LoadingView>
            </EnsureConnected>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
