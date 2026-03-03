
export interface ClanConfig {
  minRewardWithdrawalThresholdUsd: number,
  rewardsWithdrawalNetwork: string
}

export const  clanConfig: ClanConfig = {
  minRewardWithdrawalThresholdUsd: 5,
  rewardsWithdrawalNetwork: "solana:devnet"
}
