import { NetworkConfig } from '@/types/NetworkConfig';
import { clusterApiUrl, Connection } from '@solana/web3.js';

const networkId = "solana:mainnet"

// Define the custom network
export const SolanaMainnet: NetworkConfig = {
  id:             networkId,
  name:           networkId,
  displayName:    'Solana Mainnet',
  endpoint:       'https://solana-rpc.publicnode.com',
  chainId:        'mainnet-beta',
  caipNetworkId:  networkId,
  genesisHash:    '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
  explorer:       'https://solscan.io',
  isTestnet:      false,
}
