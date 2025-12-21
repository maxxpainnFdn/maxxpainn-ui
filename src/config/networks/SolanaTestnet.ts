import { NetworkConfig } from '@/types/NetworkConfig';
import { clusterApiUrl, Connection } from '@solana/web3.js';

// Define the custom network
export const SolanaTestnet: NetworkConfig = {
  id:             'solana_testnet',
  name:           'solana_testnet',
  displayName:    'Solana Testnet',
  endpoint:        clusterApiUrl('testnet'),
  chainId:        'solana_testnet',
  caipNetworkId:  'solana:testnet',
  explorer:       'https://solscan.io/?cluster=testnet',
  isTestnet:       true,
}
