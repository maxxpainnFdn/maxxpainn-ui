import authConfig from "./auth";

export interface WalletConfig {
  networkStorageKey: string;
  walletStorageKey: string;
}

export const walletConfig: WalletConfig = {
  networkStorageKey: "__network",
  walletStorageKey: "__wallet"
}

export default walletConfig;
