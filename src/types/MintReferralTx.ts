import { AccountData } from "./AccountData";
import { MintData } from "./MintData";

export interface MintReferralTx {
  id: number
  createdAt: Date
  referredAccountId: number
  referrerAccountId: number
  referrerAccount: AccountData
  referredAccount: AccountData
  clanId: number
  mint: MintData
  rewardEarnedUsd: number | string
  rankClaimTxSig: string 
  
}
