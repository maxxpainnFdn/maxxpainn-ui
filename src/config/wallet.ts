import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';

export interface NetworkConfig {
  name: string;
  id: WalletAdapterNetwork;
  endpoint: string;
}

export const NETWORKS: NetworkConfig[] = [
    {
        name: 'Solana Mainnet',
        id: WalletAdapterNetwork.Mainnet,
        endpoint: clusterApiUrl(WalletAdapterNetwork.Mainnet), // Or your custom RPC
    },
    {
        name: 'Solana Devnet',
        id: WalletAdapterNetwork.Devnet,
        endpoint: clusterApiUrl(WalletAdapterNetwork.Devnet),
    },
    {
        name: 'Solana Testnet',
        id: WalletAdapterNetwork.Testnet,
        endpoint: clusterApiUrl(WalletAdapterNetwork.Testnet),
    }
];

export const DEFAULT_NETWORK = NETWORKS[0];
