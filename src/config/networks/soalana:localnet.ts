import { NetworkConfig } from "@/types/NetworkConfig";

const network = "solana:localnet";

// Define the custom network
export const SolanaLocalnet: NetworkConfig = {
  id:             network,
  name:           'Solana Localnet',
  endpoint:       'http://127.0.0.1:8899',
  chainId:        network,
  caipNetworkId:  network,
  genesisHash:    '',
  explorer:       'https://solscan.io/?cluster=localnet',
  isTestnet:      true,
}
