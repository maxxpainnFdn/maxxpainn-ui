
export interface PayoutHistory {
  id: number
  clanId: number
  amount: number
  currency: string
  networkId: string
  recipient: string
  status: string
  signature?: string
  createdAt: Date
}
