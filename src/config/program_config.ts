import { PublicKey } from "@solana/web3.js";

export interface ProgramConfig {
  treasuryWallet: PublicKey
}

const programConfig: ProgramConfig = {
  treasuryWallet: new PublicKey("3RbC4A66LP6AwAHYHr89BxFHBCdPpZg6eDBfRiokDeyK") // treasury wallet
}

export default programConfig;
