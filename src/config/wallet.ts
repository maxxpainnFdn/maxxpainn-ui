export interface WalletConfig {
  networkStorageKey: string;
  localStorageKey: string;
}

const config: WalletConfig = {
  networkStorageKey: "__network",
  localStorageKey: "__wallet"
}

export default config;
