// components/wallet/WalletProvider.tsx
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  LedgerWalletAdapter,
  CoinbaseWalletAdapter,
  TrustWalletAdapter,
  SafePalWalletAdapter,
  Coin98WalletAdapter,
  MathWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { initializeWhenDetected } from '@solflare-wallet/metamask-wallet-standard';
import WalletModal from './WalletModal';
import walletConfig from "@/config/wallet"
import useNetwork from '@/hooks/useNetwork';
import { getNetworkById } from '@/config/networks';


interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({
  children,
}: WalletProviderProps) => {

  const { currentNetwork } = useNetwork()
  
  const [pageKey, setPageKey] = useState(1)
  
  useEffect(() => {
    const oldNetwork = localStorage.get(walletConfig.networkStorageKey) || ""
    if (oldNetwork != "" && getNetworkById(oldNetwork) == null) {
      localStorage.removeItem(walletConfig.networkStorageKey)
      setPageKey(prev => (prev++))
    }
  }, [])

  ///console.log("currentNetwork===>", currentNetwork)

  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new TrustWalletAdapter(),
    new CoinbaseWalletAdapter(),
    new LedgerWalletAdapter(),
    new MathWalletAdapter(),
    new Coin98WalletAdapter(),
    new SafePalWalletAdapter(),
  ], []);

  initializeWhenDetected()

  return (
    <ConnectionProvider key={pageKey} endpoint={currentNetwork.endpoint}>
      <SolanaWalletProvider
        wallets={wallets}
        autoConnect
        localStorageKey={walletConfig.walletStorageKey}
      >
        <WalletModal />
        <> {children} </>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

export default WalletProvider;
