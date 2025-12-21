import { NetworkConfig } from '@/types/NetworkConfig';
import { clusterApiUrl, Connection } from '@solana/web3.js';

// Define the custom network
export const SolanaMainnet: NetworkConfig = {
  id:             'solana_mainnet',
  name:           'solana_mainnet',
  displayName:    'Solana Mainnet',
  endpoint:       clusterApiUrl('mainnet-beta'),
  chainId:        'mainnet-beta',
  caipNetworkId:  'solana:mainnet',
  explorer:       'https://solscan.io',
  isTestnet:      false,
}
