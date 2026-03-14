
export interface PayoutHistory {
  id: number
  clanId: number
  rewardAmount: number
  settlementAmount: number
  rewardCurrency: string
  settlementCurrency: string
  networkId: string
  recipient: string
  status: string
  signature?: string
  createdAt: Date
}
