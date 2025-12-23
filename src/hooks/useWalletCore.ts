// @/hooks/useWalletCore.ts

import EventBus from '@/core/EventBus';
import { MessageSignerWalletAdapterProps, WalletName } from '@solana/wallet-adapter-base';
import { useWallet, Wallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

export interface UseWalletCoreResult {
  address:        string | null;
  publicKey:      PublicKey | null;
  isConnected:    boolean;
  isConnecting:   boolean;
  openModal:      () => void;
  closeModal:     () => void ;
  disconnect:     () => void;
  wallets:        Wallet[];
  wallet:         Wallet | null;
  select:         (walletName: WalletName | null) => void;
  signMessage:    MessageSignerWalletAdapterProps['signMessage'] | undefined;
}

export const useWalletCore = (): UseWalletCoreResult => {

  const {
    publicKey,
    connected: isConnected,
    connecting: isConnecting,
    disconnect,
    select,
    wallets,
    wallet,
    signMessage
  } = useWallet();


  const openModal = () => {
    EventBus.emit(
      isConnected ? 'openConnectedWalletModal' : 'openWalletModal'
    );
  };

  const closeModal = () => {
    EventBus.emit(
      isConnected ? 'closeConnectedWalletModal' : 'closeWalletModal'
    );
  };

  return {
    address: publicKey?.toBase58() || null,
    publicKey,
    isConnected,
    isConnecting,
    disconnect,
    select,
    wallets,
    wallet,
    signMessage,
    openModal,
    closeModal
  }

};
