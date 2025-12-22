import { NetworkConfig } from "@/types/NetworkConfig";

// Define the custom network
export const SolanaLocalnet: NetworkConfig = {
  id:             'localnet',
  name:           'solana_localnet',
  displayName:    'Solana Localnet',
  endpoint:       'http://127.0.0.1:8899',
  chainId:        'solana_localnet',
  caipNetworkId:  'solana:localnet',
  genesisHash:    '',
  explorer:       'https://solscan.io/?cluster=localnet',
  isTestnet:      true,
}
