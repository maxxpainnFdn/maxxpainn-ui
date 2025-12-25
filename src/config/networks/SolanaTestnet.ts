import { NetworkConfig } from '@/types/NetworkConfig';
import { clusterApiUrl, Connection } from '@solana/web3.js';

const networkId = "solana:testnet"

// Define the custom network
export const SolanaTestnet: NetworkConfig = {
  id:             networkId,
  name:           'solana_testnet',
  displayName:    'Solana Testnet',
  endpoint:        clusterApiUrl('testnet'),
  chainId:        networkId,
  caipNetworkId:  networkId,
  genesisHash:    '4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY',
  explorer:       'https://solscan.io/?cluster=testnet',
  isTestnet:       true,
}
