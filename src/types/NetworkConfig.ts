export interface NetworkConfig {
  id: string;
  name: string;
  displayName: string;
  endpoint: string;
  chainId: string;
  caipNetworkId: string;
  explorer: string;
  genesisHash: string;
  icon?: string;
  isTestnet: boolean;
}
