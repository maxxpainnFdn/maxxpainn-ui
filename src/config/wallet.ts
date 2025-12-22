import { NetworkConfig } from "@/types/NetworkConfig";
import { SolanaLocalnet } from "./networks/SolanaLocalnet";
import { SolanaDevnet } from "./networks/SolanaDevnet";


export const networks: Record<string, NetworkConfig> = {
  "solana-devnet":  SolanaDevnet,
  "solana-localnet": SolanaLocalnet
}

export const defaultNetwork = SolanaDevnet.id
