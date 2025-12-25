// components/wallet/WalletProvider.tsx
import React, { FC, ReactNode, useMemo, useState, useEffect } from 'react';
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
import { defaultNetwork } from '@/config/networks';
import EventBus from '@/core/EventBus';
import WalletModal from './WalletModal';
import walletConfig from "@/config/wallet"


interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({
  children,
}: WalletProviderProps) => {

  const [network, setNetwork] = useState(defaultNetwork)

  useEffect(()=>{

    EventBus.on("networkChange", (networkInfo)=>{
      setNetwork(networkInfo)
    })

    return () => {
      EventBus.off("networkChange")
    }
  },[])

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
    <ConnectionProvider endpoint={network.endpoint}>
      <SolanaWalletProvider
        wallets={wallets}
        autoConnect
        localStorageKey={walletConfig.localStorageKey}
      >
        <WalletModal />
        <> {children} </>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

export default WalletProvider;
