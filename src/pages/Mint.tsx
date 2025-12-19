import EnsureConnected from "@/components/ensureConnected/EnsureConnected";
import LoadingView from "@/components/loadingView/LoadingView";
import Navigation from "@/components/nav/Navigation";
import { useEffect, useState } from "react";
import { useWalletCore } from "@/hooks/useWalletCore";
import { DecodedAccountInfo, ProgramPdas, SendTxResult, useWeb3 } from "@/hooks/useWeb3";
import maxxpainnIdl from "@/data/idl/maxxpainn.json"
import { PublicKey, SystemProgram } from "@solana/web3.js";
import Footer from "@/components/Footer";
import MintStats from "@/components/mint/MintStats";
import utils from "@/lib/utils";
import { useForm } from 'react-hook-form';
import { useApi } from "@/hooks/useApi";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import mintConfig from "@/config/mint"
import { Calendar, Info } from "lucide-react";
import MintCore from "@/core/MintCore";
import { Textarea } from "@/components/ui/textarea";
import  Button  from "@/components/button/Button";
import MintAlgo, { MintRewardInfo } from "@/core/MintAlgo";
import PainMeter from "@/components/mint/PainMeter";
import PainBadges from "@/components/mint/PainBadges";
import toast from "@/hooks/toast";
import { BN } from "@coral-xyz/anchor";
import ClansModal from "@/components/clansModal/ClansModal";
import MintPreview from "@/components/mint/MintPreview";
import { ClanData } from "@/types/ClanData";

interface ClaimRankForm {
    term:  number;
    painStory: string;
}

export default function Mint(){

    const wallet = useWalletCore()
    const web3 = useWeb3()
    const { watch, register, handleSubmit, formState: { errors } } = useForm<ClaimRankForm>()

    const selectedWaitTermDays = watch("term", mintConfig.defaultLockPeriod);
    const painStory = watch("painStory", "")

    const [loading, setLoading] = useState(false)

    const api = useApi()
    const navigate = useNavigate();


    const [pageInited, setPageInited] = useState(false)
    const [pageLoading, setPageLoading] = useState(false)
    const [pageError, setPageError] = useState("")
    const [programConfig, setProgramConfig] = useState(null)
    const [globalRank, setGlobalRank] = useState(0)
    const [tokenInfo, setTokenInfo] = useState(null)
    const [maxLockTermDays, setMaxLockTermDays] = useState(0)
    const [mintRewardInfo, setMintRewardInfo] = useState<MintRewardInfo>()
    const [selectedClanId, setSelectedClanId] = useState(0)

    //let rankDifficulty;
    let programPdas: ProgramPdas;

    useEffect(()=> {
        fetchOnChainAccounts()
    }, [wallet.address, wallet.networkName])

    useEffect(() => {

      //console.log("Heyyyy => ", selectedWaitTermDays)
      const mintReward = MintAlgo.calculateFinalReward(
        globalRank + 1, // user rank
        globalRank + 1, // new global rank after user mints
        selectedWaitTermDays, //lock period
        0
      )

      setMintRewardInfo(mintReward)

    }, [selectedWaitTermDays, globalRank])

    const fetchOnChainAccounts = async () => {
        try {

            setPageLoading(true)
            setPageError("")

            if(!wallet.isConnected) return;

            //setPageLoading(true)

            // @ts-ignore
            const network = wallet.networkName;

            const programPdas = await web3.getProgramPdas(network);


            //console.log(wallet)

            const programId = await web3.getProgramId(network)

            const [userRankInfoPda] = await web3.findProgramAddress(
                [Buffer.from("rank_info"), (new PublicKey(wallet.address)).toBuffer()],
                programId
            );

            const idl = maxxpainnIdl;

            const resultStatus = await web3.fetchAccountsInfo({
              network,
              accounts: {
                mainConfig:            { idl, programId, pubkey: programPdas.mainConfigPda, accountName: "mainConfig" },
                globalRank:            { idl, programId, pubkey: programPdas.globalRankPda, accountName: "globalRank" },
                userRankInfo:          { idl, programId, pubkey: userRankInfoPda, accountName: "rankInfo" },
                tokenInfo:             { idl, programId, pubkey: programPdas.mintPda, accountName: "splTokenInfo" }
              }
            })

            //console.log("resultStatus====>", resultStatus)

            if(resultStatus.isError()) {
              setPageError(resultStatus.getMessage())
              return;
            }

            const acctsInfoObj: Record<string, DecodedAccountInfo> = resultStatus.getData()

            //console.log("acctsInfoObj===>", acctsInfoObj)
            const userRankInfo = acctsInfoObj.userRankInfo || null;

            if(userRankInfo != null){
              navigate("/mint/claim")
              return true;
            }

            const mainConfig = acctsInfoObj.mainConfig.decodedData;
            const _globalRank = acctsInfoObj.globalRank.decodedData.value;


            const rdScale = mainConfig.rankDifficultyScaleFactor;
            mainConfig.rankDifficultyScaleFactorNo = rdScale[0] / rdScale[1]

            const _tokenInfo = acctsInfoObj.tokenInfo.decodedData;

            //console.log("_rankDiffcultyConfig===>", _rankDiffcultyConfig.growthRateNo )

            _tokenInfo.supplyFormatted = utils.formatUnit(_tokenInfo.supply, _tokenInfo.decimals);

            //console.log("_tokenInfo===>", _tokenInfo)

            if(!mainConfig.isInitialized){
              setPageError("Smart contract hasn’t been initialized yet. Please reach out to the dev team.")
              return;
            }

            if(!mainConfig.canMint){
              setPageError("Minting is temporarily unavailable. Please try again soon.")
              return;
            }

            let maxLockPeriodSecs = MintCore.maxLockPeriodSecondsForRank(_globalRank.toNumber() + 1)

            // sec to days
            setMaxLockTermDays(Math.floor(maxLockPeriodSecs / 86400));

            //console.log("mainConfig====>", mainConfig)
            setProgramConfig(mainConfig)
            setGlobalRank(_globalRank.toNumber())
            setTokenInfo(_tokenInfo)
            setPageInited(true)

        } catch(e){
            utils.logError("Mint#fetchOnChainAccounts:", e)
            setPageError(utils.systemError)
        } finally{
            setPageLoading(false)
        }

    }


    const getTokenClaimDate = () => {
        const today = new Date();
        const unlockDate = new Date(today.getTime() + selectedWaitTermDays * 24 * 60 * 60 * 1000);
        return unlockDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };


    const processFormSubmit = async (data: ClaimRankForm) => {
        try{

            if(!wallet.isConnected){
                toast.error("Connect wallet to continue")
                return;
            }

            if(!selectedClanId || selectedClanId == 0){
                toast.error("Select clan to continue")
                return;
            }

            // lets validate lock term
            let waitPeriod = Number(data.term)

            if(waitPeriod < mintConfig.minLockDays){
                toast.error(`Wait period cannot be lower than ${mintConfig.minLockDays}`)
                return;
            }

            if(waitPeriod > maxLockTermDays){
                toast.error(`Wait period cannot exceed ${maxLockTermDays}`)
                return;
            }

            setLoading(true)

            const network = wallet.networkName;

            const programId = await web3.getProgramId(network)

            const [rankInfoPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("rank_info"), (new PublicKey(wallet.address)).toBuffer()],
                programId
            );

            const [rankDifficultyPda, rankDifficultyBump] = PublicKey.findProgramAddressSync(
              [Buffer.from("rank_difficulty"), wallet.publicKey.toBuffer()],
              programId
            );

            const programPdas = await web3.getProgramPdas(network);

            const accounts = {
              signer:                 wallet.publicKey,
              mainConfig:             programPdas.mainConfigPda,
              globalRank:             programPdas.globalRankPda,
              rankInfo:               rankInfoPda,
              rankDifficulty:         rankDifficultyPda,
              systemProgram:          SystemProgram.programId,
            }

            const clanId = new BN(selectedClanId);

            const txStatus = await web3.sendTx({
                              network,
                              method: "claimRank",
                              idl:    "maxxpainn",
                              programId: programId.toBase58(),
                              args:   [new BN(waitPeriod), clanId, rankDifficultyBump],
                              accounts
                            })

            //console.log("txStatus===>", txStatus)

            if(txStatus.isError()){
                toast.error(txStatus.getMessage())
                return;
            }

            const txData: SendTxResult = txStatus.getData() as SendTxResult;

            const txSig = txData.txSig;
            const evts = txData.getEvent("claimRankLog")

            const rankNo = evts.rankNo.toNumber();

            // now lets save the story if there is one
            if(painStory != ""){
                const reqParams = {
                    clanId: selectedClanId,
                    content: painStory,
                    txSig,
                    rankNo,
                    type: "pain_story"
                }
                const saveStory = await api.post("/post/new", reqParams)
                //console.log("saveStory==>", saveStory)
            }

            toast.success("Mint initiated sucessfully")

            navigate("/mint/claim");

        } catch(e){
            utils.logError("ClaimRank#processFormSubmit:", e)
            toast.error(utils.systemError)
        } finally {
            setLoading(false)
        }
    }

    const getEarlyAdopterMultiplier = () => {
       const eam = MintAlgo.format(MintAlgo.getEarlyAdopterMultiplier(globalRank + 1))
       return utils.truncDecimals(eam, 2) + "x"
    }

    return (
        <div className="min-h-screen bg-black text-white bg-gradient-to-br from-gray-900 via-black to-purple-900/20">
            <Navigation />
            <main className="pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">

                    <EnsureConnected className="min-h-[50vh]">
                        <LoadingView error={pageError} onReload={fetchOnChainAccounts} loading={pageLoading} className="min-h-[50vh]">
                            <>
                                { pageInited && (
                                    <div className="mb-12">
                                        <>
                                          <div className="text-center mb-12">
                                            <h1 className="text-2xl sm:text-4xl  md:text-6xl font-black bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                                                Mint
                                            </h1>
                                          </div>
                                            <div className="mb-12 text-center">
                                                <MintStats
                                                    stats={{
                                                        globalRank:     utils.toShortNumber(globalRank),
                                                        eam:            getEarlyAdopterMultiplier(),
                                                        mintDifficulty: programConfig.rankDifficultyScaleFactorNo,
                                                        tokenSupply:    utils.toShortNumber(tokenInfo.supplyFormatted)
                                                    }}
                                                />
                                            </div>

                                            {/** Main Grid */}
                                            <div className="grid lg:grid-cols-3 gap-8">

                                                 {/* Left Column - Mint Form */}
                                                <div className="lg:col-span-2 space-y-6">
                                                    <div className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 shadow-2xl">
                                                        <div className="mb-8">
                                                            <h2 className="text-3xl font-bold text-white mb-2">Mint Your
                                                                 <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent ms-1">$PAINN</span>
                                                            </h2>
                                                            <p className="text-gray-400">
                                                                Initiate the mint, wait your selected term, then claim — longer waits earn more.
                                                            </p>
                                                        </div>
                                                        <div >
                                                            <form className="space-y-8" onSubmit={handleSubmit(processFormSubmit)}>
                                                                {/* Clan Selector */}
                                                                <div>
                                                                    <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                                                                        Select Your Clan
                                                                    </label>
                                                                    <ClansModal
                                                                        onChange={ (clan: ClanData) => {
                                                                            //sconsole.log("clan2===>", clan)
                                                                            setSelectedClanId(clan.id)
                                                                        }}
                                                                    />
                                                                </div>

                                                                {/* Lock Period Slider */}
                                                                <div>
                                                                    <div className="flex justify-between items-center mb-3">
                                                                        <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                                                            Wait Period
                                                                        </label>
                                                                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                                                            {selectedWaitTermDays} Days
                                                                        </span>
                                                                    </div>

                                                                    <div className="bg-gray-800/40 rounded-2xl p-6 border border-purple-500/20">
                                                                        <Input
                                                                            type="range"
                                                                            min={ mintConfig.minLockDays }
                                                                            max={maxLockTermDays}
                                                                            defaultValue={mintConfig.defaultLockPeriod}
                                                                            {...register("term", {
                                                                                required: true,
                                                                                min: { value: mintConfig.minLockDays, message: `Term cannot be lower then ${mintConfig.minLockDays} days`},
                                                                                max: { value: maxLockTermDays, message: `Term cannot exceed ${maxLockTermDays} days` }
                                                                            })}
                                                                            className="w-full px-0 h-3 bg-gray-700 rounded-full appearance-none cursor-pointer slider-purple"
                                                                            style={{
                                                                                background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(168 85 247) ${((selectedWaitTermDays / maxLockTermDays) * 100) - 1}%, rgb(55 65 81) ${(selectedWaitTermDays / maxLockTermDays) * 100}%, rgb(55 65 81) 100%)`
                                                                            }}
                                                                            error={errors.term?.message}
                                                                        />
                                                                        <div className="flex justify-between text-sm text-gray-500 mt-3">
                                                                            <span>1 day</span>
                                                                            <span>{maxLockTermDays} Days</span>
                                                                        </div>

                                                                        <div className="flex items-center gap-3 mt-6 p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
                                                                            <Calendar className="text-purple-400 h-5 w-5 flex-shrink-0" />
                                                                            <div className="flex-1">
                                                                            <span className="text-sm text-gray-400">Claim Date: </span>
                                                                            <span className="text-lg text-purple-300 font-bold">{getTokenClaimDate()}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>


                                                                {/* Pain Story */}
                                                                <div>
                                                                    <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                                                                        Your Pain Story (Optional)
                                                                    </label>
                                                                    <Textarea
                                                                        className="w-full bg-gray-800/60 border-2 border-purple-500/20 rounded-2xl px-6 py-4 text-white focus:border-purple-500/60 focus:outline-none resize-none transition-all duration-300 placeholder:text-gray-600"
                                                                        rows={4}
                                                                        maxLength={500}
                                                                        placeholder="Share your crypto pain story... How did you get here? What drove you to this moment?"
                                                                        disabled={loading}
                                                                        {...register("painStory", {
                                                                            maxLength: { value: 500, message: "description cannot exceed 500 characters" }
                                                                        })}
                                                                        hint={`Share your journey and inspire others (${painStory.trim().length}/500)`}
                                                                        error={errors.painStory?.message}
                                                                    />
                                                                </div>

                                                                {/* Mint Button */}
                                                                <Button loading={loading} size="lg" variant="primary" className="w-full">
                                                                    Mint Your Tokens
                                                                </Button>
                                                            </form>
                                                        </div>
                                                    </div>

                                                    {/* Warning Card */}
                                                    <div className="bg-gradient-to-r from-red-900/40 to-red-800/40 border-2 border-red-500/50 p-6 rounded-2xl backdrop-blur-sm">
                                                        <div className="flex gap-4">
                                                            <div className="text-3xl">⚠️</div>
                                                            <div>
                                                                <p className="text-red-200 font-semibold mb-2">Token Claim Delay Warning</p>
                                                                <p className="text-red-300/90 text-sm">
                                                                    To avoid losing a portion of your rewards, claim your tokens exactly on {getTokenClaimDate()}.
                                                                    Each additional day you wait triggers a penalty that increases daily.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> {/** End Form Section */}

                                                <div className="space-y-6"> {/* Right Column - Mint Preview */}
                                                    <MintPreview
                                                        baseReward = { mintRewardInfo.baseReward }
                                                        earlyAdopterMultiplier={ mintRewardInfo.earlyAdopterMultiplier }
                                                        lockPeriodMultiplier={ mintRewardInfo.lockPeriodMultiplier }
                                                        networkMultiplier={ mintRewardInfo.networkMultiplier }
                                                        minRewardAmount={ mintRewardInfo.rewardAmount }
                                                    />

                                                    <PainMeter
                                                        lockPeriod = { selectedWaitTermDays }
                                                        maxLockPeriod ={ maxLockTermDays }
                                                    />

                                                    <PainBadges
                                                        lockPeriod = { selectedWaitTermDays }
                                                    />
                                                </div>

                                            </div> {/** End main grid */}
                                        </>
                                    </div>
                                )}
                            </>
                        </LoadingView>
                    </EnsureConnected>
                </div>
            </main>
            <Footer />

            <style>{`
                .slider-purple::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgb(168 85 247), rgb(236 72 153));
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.6);
                    transition: transform 0.2s ease;
                }

                .slider-purple::-webkit-slider-thumb:hover {
                    transform: scale(1.3);
                }

                .slider-purple::-moz-range-thumb {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgb(168 85 247), rgb(236 72 153));
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.6);
                    transition: transform 0.2s ease;
                }

                .slider-purple::-moz-range-thumb:hover {
                    transform: scale(1.3);
                }
            `}
            </style>
        </div>
    )
}
