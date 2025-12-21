// @/config/networks.ts

import { NetworkConfig } from '@/types/NetworkConfig';
import {  Connection } from '@solana/web3.js';
import { SolanaMainnet } from "./SolanaMainnet"
import { SolanaDevnet } from './SolanaDevnet';
import { SolanaTestnet } from './SolanaTestnet';

export const networks: Record<string, NetworkConfig> = {
  solana_mainnet: SolanaMainnet,
  solana_devnet:  SolanaDevnet,
  solana_testnet: SolanaTestnet
};

export const defaultNetwork = networks['solana_devnet'];

export const getNetworkById = (id: string): NetworkConfig | null => {
  return networks[id] || null;
};

export const getConnection = (networkId: string): Connection => {
  const network = networks[networkId] || defaultNetwork;
  return new Connection(network.endpoint, 'confirmed');
};
