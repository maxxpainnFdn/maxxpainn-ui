import EnsureConnected from "@/components/ensureConnected/EnsureConnected";
import LoadingView from "@/components/loadingView/LoadingView";
import Navigation from "@/components/nav/Navigation";
import { useEffect, useState } from "react";
import { useWalletCore } from "@/hooks/useWalletCore";
import { DecodedAccountInfo, ProgramPdas, SendTxResult, useWeb3 } from "@/hooks/useWeb3";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import Footer from "@/components/Footer";
import MintStats from "@/components/mint/MintStats";
import utils from "@/lib/utils";
import { useForm } from 'react-hook-form';
import { useApi } from "@/hooks/useApi";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import mintConfig from "@/config/mint";
import { Calendar, AlertTriangle, Flame } from "lucide-react";
import MintCore from "@/core/MintCore";
import { Textarea } from "@/components/ui/textarea";
import Button from "@/components/button/Button";
import MintAlgo, { MintRewardInfo } from "@/core/MintAlgo";
import PainMeter from "@/components/mint/PainMeter";
import PainBadges from "@/components/mint/PainBadges";
import toast from "@/hooks/toast";
import { BN } from "@coral-xyz/anchor";
import ClansModal from "@/components/clansModal/ClansModal";
import MintPreview from "@/components/mint/MintPreview";
import { ClanData } from "@/types/ClanData";
import { tokenConfig } from "@/config/token";
import { Helmet } from "react-helmet-async";

interface ClaimRankForm {
  term: number;
  painStory: string;
}

export default function Mint() {
  const { networkId, address: accountAddress, publicKey: accountPublickey, isConnected } = useWalletCore();
  const web3 = useWeb3();
  const { watch, register, handleSubmit, formState: { errors } } = useForm<ClaimRankForm>();

  const selectedWaitTermDays = watch("term", mintConfig.defaultLockPeriod);
  const painStory = watch("painStory", "");

  const [loading, setLoading] = useState(false);
  const api = useApi();
  const navigate = useNavigate();

  const [pageInited, setPageInited] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [mainConfig, setMainConfig] = useState(null);
  const [globalRank, setGlobalRank] = useState(0);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [maxLockTermDays, setMaxLockTermDays] = useState(0);
  const [mintRewardInfo, setMintRewardInfo] = useState<MintRewardInfo>();
  const [selectedClanId, setSelectedClanId] = useState(0);
  const [referralClanInfo, setReferralClanInfo] = useState<ClanData | null>(null);
  const [referralUserAccountId, setReferralUserAccountId] = useState<number>(0);
  const [isFetchingRefClan, setIsFetchingRefClan] = useState<boolean>(false);

  useEffect(() => { processReferralInfo(); }, []);
  useEffect(() => { fetchOnChainAccounts(); }, [isConnected, accountAddress, networkId]);
  useEffect(() => {
    const mintReward = MintAlgo.calculateFinalReward(globalRank + 1, globalRank + 1, selectedWaitTermDays, 0);
    setMintRewardInfo(mintReward);
  }, [selectedWaitTermDays, globalRank]);

  const processReferralInfo = async () => {
    try {
      setIsFetchingRefClan(true);
      const refInfoStr = localStorage.getItem("referral_info") || null;
      if (refInfoStr == null) return;
      let refInfoJson: Record<string, number>;
      try { refInfoJson = JSON.parse(refInfoStr); } catch (e) { return; }
      let clanId = refInfoJson.clanId || null;
      let refAccountId = Number(refInfoJson.accountId || 0);
      if (!Number.isNaN(refAccountId)) setReferralUserAccountId(refAccountId);
      if (clanId == null) return;
      clanId = Number(clanId);
      const clanInfoStatus = await api.get(`/clans/${clanId}`);
      if (clanInfoStatus.isError()) return;
      const clanInfo = clanInfoStatus.getData() as ClanData | null;
      if (clanInfo == null) return;
      setReferralClanInfo(clanInfo);
      setSelectedClanId(clanInfo.id);
    } catch (e: any) {
      utils.logError("Mint#processReferralInfo", e);
    } finally {
      setIsFetchingRefClan(false);
    }
  };

  const fetchOnChainAccounts = async () => {
    try {
      setPageLoading(true);
      setPageError("");
      if (!isConnected) return;
      const programPdas = await web3.getProgramPdas(networkId);
      const programId = await web3.getProgramId(networkId);
      const [userRankInfoPda] = await web3.findProgramAddress(
        [Buffer.from("rank_info"), accountPublickey.toBuffer()],
        programId
      );
      const idl = "maxxpainn";
      const resultStatus = await web3.fetchAccountsInfo({
        network: networkId,
        accounts: {
          mainConfig:    { idl, programId, pubkey: programPdas.mainConfigPda,    accountName: "mainConfig"    },
          protocolState: { idl, programId, pubkey: programPdas.protocolStatePda, accountName: "protocolState" },
          userRankInfo:  { idl, programId, pubkey: userRankInfoPda,              accountName: "rankInfo"      },
          tokenInfo:     { idl, programId, pubkey: programPdas.mintPda,          accountName: "splTokenInfo"  },
        },
      });
      if (resultStatus.isError()) { setPageError(resultStatus.getMessage()); return; }
      const acctsInfoObj: Record<string, DecodedAccountInfo> = resultStatus.getData();
      const userRankInfo = acctsInfoObj.userRankInfo || null;
      if (userRankInfo != null) { navigate("/mint/claim"); return true; }
      const mainConfig = acctsInfoObj.mainConfig.decodedData;
      const protocolState = acctsInfoObj?.protocolState?.decodedData;
      const rdScale = mainConfig.rankDifficultyScaleFactor;
      mainConfig.rankDifficultyScaleFactorNo = rdScale[0] / rdScale[1];
      const _tokenInfo = acctsInfoObj.tokenInfo.decodedData;
      _tokenInfo.supplyFormatted = utils.formatUnit(_tokenInfo.supply, _tokenInfo.decimals);
      if (!mainConfig.isInitialized) { setPageError("Smart contract hasn't been initialized yet. Please reach out to the dev team."); return; }
      if (!mainConfig.canMint) { setPageError("Minting is temporarily unavailable. Please try again soon."); return; }
      let _globalRank = Number(protocolState?.globalRank?.toString() || "0");
      let maxLockPeriodSecs = MintCore.maxLockPeriodSecondsForRank(_globalRank + 1);
      setMaxLockTermDays(Math.floor(maxLockPeriodSecs / 86400));
      setMainConfig(mainConfig);
      setGlobalRank(_globalRank);
      setTokenInfo(_tokenInfo);
      setPageInited(true);
    } catch (e) {
      utils.logError("Mint#fetchOnChainAccounts:", e);
      setPageError(utils.systemError);
    } finally {
      setPageLoading(false);
    }
  };

  const getTokenClaimDate = () => {
    const today = new Date();
    const unlockDate = new Date(today.getTime() + selectedWaitTermDays * 24 * 60 * 60 * 1000);
    return unlockDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const processFormSubmit = async (data: ClaimRankForm) => {
    try {
      if (!isConnected) { toast.error("Connect wallet to continue"); return; }
      if (!selectedClanId || selectedClanId == 0) { toast.error("Select clan to continue"); return; }
      let waitPeriod = Number(data.term);
      if (waitPeriod < mintConfig.minLockDays) { toast.error(`Wait period cannot be lower than ${mintConfig.minLockDays}`); return; }
      if (waitPeriod > maxLockTermDays) { toast.error(`Wait period cannot exceed ${maxLockTermDays}`); return; }
      if (painStory.trim() == "") { toast.error("Pain story input is required"); return; }
      setLoading(true);
      const programId = await web3.getProgramId(networkId);
      const [rankInfoPda] = PublicKey.findProgramAddressSync([Buffer.from("rank_info"), accountPublickey.toBuffer()], programId);
      const [rankDifficultyPda, rankDifficultyBump] = PublicKey.findProgramAddressSync([Buffer.from("rank_difficulty"), accountPublickey.toBuffer()], programId);
      const programPdas = await web3.getProgramPdas(networkId);
      const clanId = new BN(selectedClanId);
      const referrerIdBN = new BN(referralUserAccountId);
      const txStatus = await web3.sendTx({
        network: networkId,
        method: "claimRank",
        idl: "maxxpainn",
        programId: programId.toBase58(),
        args: [new BN(waitPeriod), clanId, referrerIdBN, rankDifficultyBump],
        accounts: {
          signer:         accountPublickey,
          mainConfig:     programPdas.mainConfigPda,
          protocolState:  programPdas.protocolStatePda,
          rankInfo:       rankInfoPda,
          rankDifficulty: rankDifficultyPda,
          treasury:       mainConfig.treasuryWallet,
          systemProgram:  SystemProgram.programId,
        },
      });
      if (txStatus.isError()) { toast.error(txStatus.getMessage()); return; }
      const txData: SendTxResult = txStatus.getData() as SendTxResult;
      const txSig = txData.txSig;
      const evts = txData.getEvent("claimRankLog");
      const rankNo = evts.rankNo.toNumber();
      if (painStory != "") {
        await api.post("/posts/new", { clanId: selectedClanId, content: painStory, txSig, rankNo, type: "pain_story" });
      }
      toast.success("Mint initiated successfully");
      navigate("/mint/claim");
    } catch (e) {
      utils.logError("ClaimRank#processFormSubmit:", e);
      toast.error(utils.systemError);
    } finally {
      setLoading(false);
    }
  };

  const getEarlyAdopterMultiplier = () => {
    const eam = MintAlgo.format(MintAlgo.getEarlyAdopterMultiplier(globalRank + 1));
    return utils.truncDecimals(eam, 2) + "x";
  };

  const sliderPct = maxLockTermDays > 0 ? Math.min(100, (Number(selectedWaitTermDays) / maxLockTermDays) * 100) : 0;

  const title       = "Mint MaxxPainn - Free-to-Mint SPL Token on Solana";
  const description = "Join MaxxPainn and mint your free Solana token. Stake, endure the time-locked staking, and earn rewards.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description"        content={description} />
        <meta property="og:title"       content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content="https://maxxpainn.com/mint" />
        <meta property="og:image"       content="https://maxxpainn.com/images/pages/mint.jpg" />
        <meta name="twitter:card"       content="summary_large_image" />
        <meta name="twitter:title"      content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image"      content="https://maxxpainn.com/images/pages/mint.jpg" />
      </Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "MaxxPainn Mint",
          description: "Mint MaxxPainn token with Proof of Patience. Free-to-mint protocol on Solana.",
        })}
      </script>

      <div className="min-h-screen bg-maxx-bg0 overflow-x-hidden">
        <div className="fixed inset-0 pointer-events-none z-0 bg-noise-pattern opacity-100" />
        <div className="fixed -top-32 -right-32 w-[600px] h-[600px] bg-[radial-gradient(circle,color-mix(in_srgb,var(--maxx-pink)_7%,transparent)_0%,transparent_65%)] pointer-events-none z-0" />
        <div className="fixed top-[30%] -left-24 w-[400px] h-[400px] bg-[radial-gradient(circle,color-mix(in_srgb,var(--maxx-violet)_6%,transparent)_0%,transparent_70%)] pointer-events-none z-0" />

        <Navigation />

        <main className="relative z-10 pt-[68px] pb-16 sm:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-8">

            <EnsureConnected className="min-h-[75vh]">
              <LoadingView
                error={pageError}
                onReload={fetchOnChainAccounts}
                loading={pageLoading || isFetchingRefClan}
                className="min-h-[50vh]"
              >
                <>
                  {pageInited && (
                    <div>

                      {/* PAGE HEADER */}
                      <div className="flex justify-center flex-col items-center text-center mb-7 sm:mb-10 animate-fade-up">
                      
                        <h1 className="font-sans font-bold text-xl sm:text-3xl md:font-black md:text-4xl lg:text-6xl leading-[0.94] tracking-tight text-maxx-white uppercase">
                          <span className="bg-grad-accent bg-clip-text text-transparent">
                            ${tokenConfig.symbol}{" "}
                          </span>
                          Allocation
                        </h1>
                        <div className="font-sans text-sm sm:text-base md:text-lg text-maxx-bright leading-relaxed mt-2 sm:mt-3 max-w-xl px-2">
                          Share your story, claim your rank, commit to a duration, and unlock your tokens — longer commitments earn more.
                        </div>
                      </div>

                      {/* STATS STRIP */}
                      <div className="w-full mb-7 sm:mb-10 animate-fade-up delay-1">
                        <MintStats
                          stats={{
                            globalRank:     utils.toShortNumber(globalRank),
                            eam:            getEarlyAdopterMultiplier(),
                            mintDifficulty: mainConfig.rankDifficultyScaleFactorNo,
                            tokenSupply:    utils.toShortNumber(tokenInfo.supplyFormatted),
                          }}
                        />
                      </div>

                      {/* MAIN GRID */}
                      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 animate-fade-up delay-2">

                        {/* LEFT: FORM */}
                        <div className="lg:col-span-2 space-y-3 sm:space-y-4">

                          {/* Form card */}
                          <div className="bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet/60 via-maxx-pink/30 to-transparent" />

                            <div className="mb-5 sm:mb-8">
                              <div className="eyebrow mb-1.5 sm:mb-2"><span className="eyebrow-dot" />Initialization</div>
                              <h2 className="font-sans font-black text-[clamp(1.3rem,3vw,2.2rem)] uppercase tracking-tight text-maxx-white leading-none">
                                Claim Your{" "}
                                <span className="bg-grad-accent bg-clip-text text-transparent">Rank</span>
                              </h2>
                            </div>

                            <form className="space-y-5 sm:space-y-8" onSubmit={handleSubmit(processFormSubmit)}>

                              {/* CLAN SELECTOR */}
                              <div>
                                <label className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-maxx-mid block mb-2">
                                  Select Your Clan
                                </label>
                                <ClansModal
                                  defaultClan={referralClanInfo}
                                  disabled={(referralClanInfo != null) || loading}
                                  onChange={(clan: ClanData) => setSelectedClanId(clan.id)}
                                />
                              </div>

                              {/* WAIT PERIOD SLIDER */}
                              <div>
                                <div className="flex justify-between items-center mb-2.5 sm:mb-3">
                                  <label className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-maxx-mid">
                                    Wait Period
                                  </label>
                                  <span className="font-sans font-black text-xl sm:text-2xl leading-none bg-grad-accent bg-clip-text text-transparent">
                                    {selectedWaitTermDays}{" "}
                                    <span className="text-sm sm:text-base text-maxx-sub font-normal">days</span>
                                  </span>
                                </div>

                                <div className="bg-maxx-bg0/60 rounded-md p-3.5 sm:p-5 border border-maxx-violet/15">
                                  <Input
                                    type="range"
                                    min={mintConfig.minLockDays}
                                    max={maxLockTermDays}
                                    defaultValue={mintConfig.defaultLockPeriod}
                                    {...register("term", {
                                      required: true,
                                      min: { value: mintConfig.minLockDays, message: `Term cannot be lower than ${mintConfig.minLockDays} days` },
                                      max: { value: maxLockTermDays,        message: `Term cannot exceed ${maxLockTermDays} days` },
                                    })}
                                    className="mint-slider w-full px-0 appearance-none cursor-pointer border-0 bg-transparent"
                                    style={{
                                      background: `linear-gradient(to right, var(--maxx-violet) 0%, var(--maxx-pink) ${sliderPct - 1}%, color-mix(in srgb, var(--maxx-dim) 50%, transparent) ${sliderPct}%, color-mix(in srgb, var(--maxx-dim) 50%, transparent) 100%)`,
                                    }}
                                    error={errors.term?.message}
                                  />
                                  <div className="flex justify-between text-xs sm:text-sm text-maxx-sub mt-2.5 sm:mt-3">
                                    <span>1 day</span>
                                    <span>{maxLockTermDays} days</span>
                                  </div>

                                  {/* Claim date */}
                                  <div className="flex items-center gap-2.5 sm:gap-3 mt-3.5 sm:mt-5 p-3 sm:p-4 bg-maxx-violet/5 border border-maxx-violet/20 rounded-md">
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-sm bg-maxx-violet/15 border border-maxx-violet/25 flex items-center justify-center shrink-0">
                                      <Calendar size={14} className="text-maxx-violet" />
                                    </div>
                                    <div>
                                      <div className="text-[0.65rem] sm:text-xs font-mono tracking-widest uppercase text-maxx-sub">
                                        Claim Date
                                      </div>
                                      <div className="text-sm sm:text-base font-bold text-maxx-white mt-0.5">
                                        {getTokenClaimDate()}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* PAIN STORY */}
                              <div>
                                <label className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-maxx-mid block mb-2">
                                  Your Pain Story
                                </label>
                                <Textarea
                                  className="w-full bg-maxx-bg0/60 border border-maxx-violet/20 rounded-md px-3.5 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base text-maxx-bright leading-relaxed placeholder:text-maxx-dim focus:border-maxx-violet/50 focus:outline-none resize-none transition-colors duration-200"
                                  rows={4}
                                  maxLength={2000}
                                  placeholder="Share your crypto pain story... How did you get here? What drove you to this moment?"
                                  disabled={loading}
                                  {...register("painStory", {
                                    maxLength: { value: 2000, message: "Story cannot exceed 2000 characters" },
                                  })}
                                  hint={`Share your journey and inspire others (${painStory.trim().length}/2000)`}
                                  error={errors.painStory?.message}
                                />
                              </div>

                              {/* SUBMIT */}
                              <Button loading={loading} size="md" variant="primary" fullWidth className="sm:text-base sm:py-4">
                                <Flame size={15} />
                                <span>unlock your allocation</span>
                              </Button>

                            </form>
                          </div>

                          {/* WARNING CARD */}
                          <div className="bg-maxx-pink/5 border border-maxx-pink/30 rounded-md p-4 sm:p-5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-pink/60 to-transparent" />
                            <div className="flex gap-3 sm:gap-4 items-start">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-sm bg-maxx-pink/15 border border-maxx-pink/30 flex items-center justify-center shrink-0 mt-0.5">
                                <AlertTriangle size={14} className="text-maxx-pink" />
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-bold uppercase tracking-wide text-maxx-white mb-1.5 sm:mb-2">
                                  Token Claim Delay Warning
                                </p>
                                <p className="text-xs sm:text-sm text-maxx-mid leading-relaxed">
                                  To avoid losing a portion of your rewards, claim your tokens exactly on{" "}
                                  <strong className="text-maxx-pinkLt">{getTokenClaimDate()}</strong>.
                                  Each additional day you wait triggers a penalty that increases daily.
                                </p>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* RIGHT: SIDEBAR */}
                        <div className="space-y-3 sm:space-y-4">
                          <MintPreview
                            baseReward={mintRewardInfo.baseReward}
                            earlyAdopterMultiplier={mintRewardInfo.earlyAdopterMultiplier}
                            lockPeriodMultiplier={mintRewardInfo.lockPeriodMultiplier}
                            networkMultiplier={mintRewardInfo.networkMultiplier}
                            minRewardAmount={mintRewardInfo.rewardAmount}
                          />
                          <PainMeter lockPeriod={selectedWaitTermDays} maxLockPeriod={maxLockTermDays} />
                          <PainBadges lockPeriod={selectedWaitTermDays} />
                        </div>

                      </div>
                    </div>
                  )}
                </>
              </LoadingView>
            </EnsureConnected>

          </div>
        </main>

        <Footer />

        <style>{`
          .mint-slider {
            height: 8px;
            border-radius: 2px;
          }
          .mint-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 30px;
            border-radius: 4px;
            background: linear-gradient(180deg, var(--maxx-violet-lt) 0%, var(--maxx-violet) 45%, var(--maxx-pink) 100%);
            cursor: pointer;
            border: 2px solid color-mix(in srgb, white 12%, transparent);
            box-shadow: 0 0 0 1px color-mix(in srgb, var(--maxx-violet) 45%, transparent), 0 4px 14px color-mix(in srgb, var(--maxx-violet) 55%, transparent);
            transition: transform 0.15s ease, box-shadow 0.15s ease;
          }
          .mint-slider::-webkit-slider-thumb:hover {
            transform: scaleY(1.1);
            box-shadow: 0 0 0 1px color-mix(in srgb, var(--maxx-pink) 55%, transparent), 0 4px 20px color-mix(in srgb, var(--maxx-pink) 55%, transparent);
          }
          .mint-slider::-webkit-slider-thumb:active { transform: scaleY(0.93); }
          .mint-slider::-moz-range-thumb {
            width: 18px;
            height: 30px;
            border-radius: 4px;
            background: linear-gradient(180deg, var(--maxx-violet-lt) 0%, var(--maxx-violet) 45%, var(--maxx-pink) 100%);
            cursor: pointer;
            border: 2px solid color-mix(in srgb, white 12%, transparent);
            box-shadow: 0 0 0 1px color-mix(in srgb, var(--maxx-violet) 45%, transparent), 0 4px 14px color-mix(in srgb, var(--maxx-violet) 55%, transparent);
            transition: transform 0.15s ease, box-shadow 0.15s ease;
          }
          .mint-slider::-moz-range-thumb:hover {
            transform: scaleY(1.1);
            box-shadow: 0 0 0 1px color-mix(in srgb, var(--maxx-pink) 55%, transparent), 0 4px 20px color-mix(in srgb, var(--maxx-pink) 55%, transparent);
          }
        `}</style>
      </div>
    </>
  );
}
