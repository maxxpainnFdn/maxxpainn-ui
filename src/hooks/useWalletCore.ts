// @/hooks/useWalletCore.ts

import EventBus from '@/core/EventBus';
import { MessageSignerWalletAdapterProps, WalletName } from '@solana/wallet-adapter-base';
import { useConnection, useWallet, Wallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';

export interface UseWalletCoreResult {
  address:        string | null;
  publicKey:      PublicKey | null;
  isConnected:    boolean;
  isConnecting:   boolean;
  openModal:      () => void;
  closeModal:     () => void;
  disconnect:     () => void;
  wallets:        Wallet[];
  selectWallet:   (walletName: WalletName | null) => void;
  signMessage:    MessageSignerWalletAdapterProps['signMessage'] | undefined;
  currentWallet:  Wallet
}

export const useWalletCore = (): UseWalletCoreResult => {
  const {
    publicKey,
    connected: isConnected,
    connecting: isConnecting,
    disconnect,
    select: selectWallet,
    wallets,
    wallet: currentWallet,
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
    openModal,
    closeModal,
    disconnect,
    wallets,
    selectWallet,
    signMessage,
    currentWallet
  };
};
