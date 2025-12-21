export interface NetworkConfig {
  id: string;
  name: string;
  displayName: string;
  endpoint: string;
  chainId: string;
  caipNetworkId: string;
  explorer: string;
  icon?: string;
  isTestnet: boolean;
}
