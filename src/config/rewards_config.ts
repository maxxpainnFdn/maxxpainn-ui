
export interface RewardsConfig {
  minCashoutThresholdUsd: number
  cashoutNetwork: string
  cashoutFeeUsd: number
}

export const  rewardsConfig: RewardsConfig = {
  minCashoutThresholdUsd: 1,
  cashoutNetwork: "solana:devnet",
  cashoutFeeUsd: 0.1
}
