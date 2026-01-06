export interface NetworkConfig {
  id: string;
  name: string;
  endpoint: string;
  chainId: string;
  caipNetworkId: string;
  explorer: string;
  genesisHash: string;
  icon?: string;
  isTestnet: boolean;
}
