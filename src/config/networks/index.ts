// @/config/networks.ts

import { NetworkConfig } from '@/types/NetworkConfig';
import {  Connection } from '@solana/web3.js';
import { SolanaMainnet } from "./solana:mainnet"
import { SolanaDevnet } from './solana:devnet';
import { SolanaTestnet } from './solana:testnet';
import { SolanaLocalnet } from './soalana:localnet';

export const networks: Record<string, NetworkConfig> = {
  //"solana:mainnet":  SolanaMainnet,
  //"solana:devnet":   SolanaDevnet,
  "solana:testnet":  SolanaTestnet,
  //"solana:localnet": SolanaLocalnet
};


export const networksArr = Object.values(networks)

export const defaultNetwork = networks['solana:testnet'];

export const getNetworkById = (id: string): NetworkConfig | null => {
  return networks[id] || null;
};

export const getConnection = (networkId: string): Connection => {
  const network = networks[networkId] || defaultNetwork;
  return new Connection(network.endpoint, 'confirmed');
};
