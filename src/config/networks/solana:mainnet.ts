import { NetworkConfig } from '@/types/NetworkConfig';

const networkId = "solana:mainnet"

// Define the custom network
export const SolanaMainnet: NetworkConfig = {
  id:             networkId,
  name:           'Solana Mainnet',
  endpoint:       'https://solana-rpc.publicnode.com',
  chainId:        networkId,
  caipNetworkId:  networkId,
  genesisHash:    '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
  explorer:       'https://solscan.io',
  isTestnet:      false,
}
