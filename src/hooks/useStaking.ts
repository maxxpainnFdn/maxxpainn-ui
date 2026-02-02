import utils from "@/lib/utils";
import { useWalletCore } from "./useWalletCore";
import { DecodedAccountInfo, useWeb3 } from "./useWeb3";
import { tokenConfig } from "@/config/token";
import { StakingMath } from "@/core/StakingMath";
import { Status } from "@/core/Status";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { UserStakeInfo } from "@/types/UserStakeInfo";
import { BN } from "@coral-xyz/anchor";
import { stakingConfig } from "@/config/staking";
import programConfig from "@/config/program_config";

export interface FetchOnchainDataProps {
  networkId: string;
  accountPublickey: PublicKey;
}

export interface FetchOnchainDataReturn {
  totalStaked:  {
     valueRaw: bigint;
     valueFormatted: string;
 };
  userStakeInfo: UserStakeInfo | null;
  userBalanceInfo: null | { valueRaw: any; value: string };
}

const { minTermDays, maxTermDays } = stakingConfig

export const useStaking = () => {
  
  const web3 = useWeb3();
  const { networkId, publicKey: accountPublickey, isConnected } = useWalletCore()

  const fetchOnchainData = async (
    networkId: string,
    accountPublickey: PublicKey,
  ): Promise<Status<FetchOnchainDataReturn | null>> => {
    const programId = await web3.getProgramId(networkId);
    const { stakingVaultPda } = await web3.getStakingPdas(networkId);

    const [userStakeInfoPda] = await web3.findProgramAddress(
      [Buffer.from("stake_info"), accountPublickey.toBuffer()],
      programId,
    );

    const accountTokenAddr = await web3.getAccountTokenAddress(
      accountPublickey,
      networkId,
    );

    const idl = "maxxpainn";

    const resultStatus = await web3.fetchAccountsInfo({
      network: networkId,
      accounts: {
        stakingVault: {
          idl,
          programId,
          pubkey: stakingVaultPda,
          accountName: "splTokenAccountInfo",
        },
        userStakeInfo: {
          idl,
          programId,
          pubkey: userStakeInfoPda,
          accountName: "stakeInfo",
        },
        userTokenInfo: {
          idl,
          programId,
          pubkey: accountTokenAddr,
          accountName: "splTokenAccountInfo",
        },
      },
    });

    if (resultStatus.isError()) {
      return Status.error(resultStatus.getMessage());
    }

    const acctsObj: Record<string, DecodedAccountInfo> = resultStatus.getData();
    
    //console.log("acctsObj====>", acctsObj)

    const userStakeInfo = acctsObj?.userStakeInfo?.decodedData;
    const stakingVaultAcctInfo = acctsObj?.stakingVault?.decodedData;
    const userTokenInfo = acctsObj?.userTokenInfo?.decodedData;
    
    const totalStakedRaw = BigInt(stakingVaultAcctInfo?.amount?.toString() || "0");
    
    const totalStaked = {
      valueRaw: totalStakedRaw,
      valueFormatted: utils.formatUnit(totalStakedRaw, tokenConfig.decimals)
    }

    const userBalanceInfo = {
      valueRaw: BigInt(userTokenInfo?.amount.toString() || "0"),
      value:  userTokenInfo ? utils.formatUnit(userTokenInfo.amount, tokenConfig.decimals) : "0"
    };


    if (userStakeInfo) {
      
      //console.log("userStakeInfo===>", userStakeInfo)
      
      userStakeInfo.yield = StakingMath.getFixedYieldPercent(
        userStakeInfo.termDays,
      );
      
      userStakeInfo.amountFormatted = utils.formatUnit(userStakeInfo.amount, tokenConfig.decimals)
      userStakeInfo.termDays = Number(userStakeInfo.termDays.toString())
      
      const startTimeSecs = Number(userStakeInfo.startTime.toString());
      
      userStakeInfo.lockedDate = new Date(startTimeSecs * 1000);
      
      userStakeInfo.unlockDate = new Date(Number(userStakeInfo.endTime.toString()) * 1000);
      
      const reward = StakingMath.getReward(
        Number(userStakeInfo.amountFormatted),
        userStakeInfo.termDays,
        ((Date.now() / 1000) - startTimeSecs)
      )
      
      const pendingReward = utils.formatUnit(userStakeInfo.pendingRewards, tokenConfig.decimals)

      userStakeInfo.rewards = Number(pendingReward) + reward;
    }

    return Status.successData({
      totalStaked,
      userStakeInfo,
      userBalanceInfo,
    });
  };
  
  const getRewards = (userStakeInfo: UserStakeInfo): number => {
    
    if (!userStakeInfo) return 0;
    
    const startTimeSecs = Number(userStakeInfo.startTime.toString());
    
    const reward = StakingMath.getReward(
      Number(userStakeInfo.amountFormatted),
      userStakeInfo.termDays,
      ((Date.now() / 1000) - startTimeSecs)
    )
    
    const pendingReward = utils.formatUnit(userStakeInfo.pendingRewards, tokenConfig.decimals)

    return (Number(pendingReward) + reward);
  }
  
  const stakeTokens = async (
    stakeAmount: number,
    stakingTerm: number,
  ): Promise<Status> => {
    try {
      
      if (!isConnected) {
        return Status.error("Connect wallet to proceed")
      }
      
      if (stakeAmount <= 0) {
        return Status.error("Staking amount exceed 0")
      }
      
      if (stakingTerm < minTermDays || stakingTerm > maxTermDays) {
        return Status.error("Invalid staking term")
      }
      
      const programId = await web3.getProgramId(networkId)
      const {
        mainConfigPda,
        mintPda,
        mintAuthorityPda,
      } = await web3.getProgramPdas(networkId);
      
      const [stakeInfoPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("stake_info"), accountPublickey.toBuffer()],
        programId
      );
      
      const [stakingVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("staking_vault"), mintPda.toBuffer()],
        programId
      );
      
      const amountToStake = utils.toUnits(stakeAmount, tokenConfig.decimals)
      
      const txStatus = await web3.sendTx({
        network: networkId,
        method:     "stake",
        idl:        "maxxpainn",
        programId:  programId.toBase58(),
        args:       [ amountToStake, new BN(stakingTerm) ],
        accounts: {
          signer:         accountPublickey,
          mainConfig:     mainConfigPda,
          mintAuthority:  mintAuthorityPda,
          stakeInfo:      stakeInfoPda,
          stakingVault:   stakingVaultPda,
          systemProgram:  SystemProgram.programId,
        }
      });

      return txStatus
    } catch(e) {
      console.log("useStaking#stakeTokens:", e)
      return Status.error(utils.systemError)
    }
  };
  
  const unstakeTokens = async (isEmergency: boolean): Promise<Status> => {
    try {
      
      if (!isConnected) {
        return Status.error("Connect wallet to proceed")
      }
      
      const programId = await web3.getProgramId(networkId)
      
      const {
        mainConfigPda,
        mintPda,
        mintAuthorityPda,
        protocolStatePda
      } = await web3.getProgramPdas(networkId);
      
      const [stakeInfoPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("stake_info"), accountPublickey.toBuffer()],
        programId
      );
    
      
      const [stakingVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("staking_vault"), mintPda.toBuffer()],
        programId
      );
      
      const unstakeTx = {
        network: networkId,
        method:     "unstake",
        idl:        "maxxpainn",
        programId:  programId.toBase58(),
        args:       [ isEmergency ],
        accounts: {
          signer:         accountPublickey,
          mainConfig:     mainConfigPda,
          mintAuthority:  mintAuthorityPda,
          stakeInfo:      stakeInfoPda,
          stakingVault:   stakingVaultPda,
          protocolState:  protocolStatePda,
          systemProgram:  SystemProgram.programId,
        }
      }
      
      const closeStakeAcctIx = {
        method: "closeStakeAccount",
        idl:    "maxxpainn",
        programId: programId.toBase58(),
        args: [],
        accounts: {
          signer:        accountPublickey,
          mainConfig:    mainConfigPda,
          stakeInfo:     stakeInfoPda,
          stakeOwner:    accountPublickey,
          treasury:      programConfig.treasuryWallet,
          systemProgram: SystemProgram.programId,
        },
      };

      const instructions = [unstakeTx, closeStakeAcctIx];
      
      const txStatus = await web3.sendBatchTx({
        network: networkId,
        instructions,
      });
      
      return txStatus;
      
    } catch(e) {
      console.log("unstakeTokens:", e)
      return Status.error(utils.systemError)
    }
  };
  
  return { fetchOnchainData,stakeTokens, unstakeTokens, getRewards };
};
