import { NetworkConfig } from '@/types/NetworkConfig';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl, Connection } from '@solana/web3.js';

// Define the custom network
export const SolanaDevnet: NetworkConfig = {
  id:             WalletAdapterNetwork.Devnet,
  name:           'solana_devnet',
  displayName:    'Solana Devnet',
  endpoint:        clusterApiUrl('devnet'),
  chainId:        'solana_devnet',
  caipNetworkId:  'solana:devnet',
  genesisHash:     "EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
  explorer:       'https://solscan.io/?cluster=devnet',
  isTestnet:       true,
}
