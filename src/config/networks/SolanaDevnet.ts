import { NetworkConfig } from '@/types/NetworkConfig';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl, Connection } from '@solana/web3.js';

const networkId = "solana:devnet"

// Define the custom network
export const SolanaDevnet: NetworkConfig = {
  id:             networkId,
  name:           networkId,
  displayName:    'Solana Devnet',
  endpoint:       clusterApiUrl('devnet'),
  chainId:        networkId,
  caipNetworkId:  networkId,
  genesisHash:    "EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG",
  explorer:       'https://solscan.io/?cluster=devnet',
  isTestnet:       true,
}
