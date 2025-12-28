// components/wallet/WalletProvider.tsx
import { ReactNode, useMemo } from 'react';
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


interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({
  children,
}: WalletProviderProps) => {

  const { currentNetwork } = useNetwork()

  console.log("currentNetwork===>", currentNetwork)

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
    <ConnectionProvider endpoint={currentNetwork.endpoint}>
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
