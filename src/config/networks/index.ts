// @/config/networks.ts

import { NetworkConfig } from '@/types/NetworkConfig';
import {  Connection } from '@solana/web3.js';
import { SolanaMainnet } from "./SolanaMainnet"
import { SolanaDevnet } from './SolanaDevnet';
import { SolanaTestnet } from './SolanaTestnet';

export const networks: Record<string, NetworkConfig> = {
  "solana:mainnet": SolanaMainnet,
  "solana:devnet":  SolanaDevnet,
  "solana:testnet": SolanaTestnet
};


export const networksArr = Object.values(networks)

export const defaultNetwork = networks['solana:devnet'];

export const getNetworkById = (id: string): NetworkConfig | null => {
  return networks[id] || null;
};

export const getConnection = (networkId: string): Connection => {
  const network = networks[networkId] || defaultNetwork;
  return new Connection(network.endpoint, 'confirmed');
};
