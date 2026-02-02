import { PublicKey } from "@solana/web3.js";

export interface UserStakeInfo {
  owner: PublicKey;
  amount: number;
  amountFormatted?: string; 
  rewards?: number;
  startTime: number;
  endTime: number;
  termDays: number;
  lockedDate: Date;
  unlockDate: Date;
  pendingRewards: number;
  isActive: number;
}
