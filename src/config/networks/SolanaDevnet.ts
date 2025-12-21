import { NetworkConfig } from '@/types/NetworkConfig';
import { clusterApiUrl, Connection } from '@solana/web3.js';

// Define the custom network
export const SolanaDevnet: NetworkConfig = {
  id:             'solana_devnet',
  name:           'solana_devnet',
  displayName:    'Solana Devnet',
  endpoint:        clusterApiUrl('devnet'),
  chainId:        'solana_devnet',
  caipNetworkId:  'solana:devnet',
  explorer:       'https://solscan.io/?cluster=devnet',
  isTestnet:       true,
}
