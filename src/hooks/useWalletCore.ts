// @/hooks/useWalletCore.ts

import EventBus from '@/core/EventBus';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';


export const useWalletCore = () => {

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
    let eventName = isConnected ? "openConnectedWalletModal" : "openWalletModal"
    EventBus.emit(eventName)
  }

  const closeModal = () => {
    let eventName = isConnected ? "closeConnectedWalletModal" : "closeWalletModal"
    EventBus.emit(eventName)
  }

  return {
    address: publicKey?.toBase58() || null,
    publicKey,
    isConnected,
    isConnecting,
    openModal,
    closeModal,
    disconnect,
    wallets,
    selectWallet: select,
    signMessage,
    currentWallet: wallet
  };
};
