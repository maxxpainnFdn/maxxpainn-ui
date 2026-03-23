// @/hooks/useWalletCore.ts

import walletConfig from '@/config/wallet';
import EventBus from '@/core/EventBus';
import { currentNetworkIdAtom } from '@/store';
import { MessageSignerWalletAdapterProps, WalletName } from '@solana/wallet-adapter-base';
import { useWallet, Wallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';

export interface UseWalletCoreResult {
  address:        string | null;
  publicKey:      PublicKey | null;
  isConnected:    boolean;
  isConnecting:   boolean;
  networkId:      string;
  openModal:      () => void;
  closeModal:     () => void;
  connect:        () => Promise<void>;
  disconnect:     () => Promise<void>;
  wallets:        Wallet[];
  wallet:         Wallet | null;
  select:         (walletName: WalletName | null) => void;
  signMessage:    MessageSignerWalletAdapterProps['signMessage'] | undefined;
}

export const useWalletCore = (): UseWalletCoreResult => {

  const {
    publicKey,
    connected,
    connect,
    connecting: isConnecting,
    disconnect: _disconnect,
    select,
    wallets,
    wallet,
    signMessage
  } = useWallet();

  const [isConnected, setIsConnected] = useState(connected && publicKey != null)
  const currentNetworkId = useAtomValue(currentNetworkIdAtom);
  

  useEffect(()=> {
    setIsConnected(connected && publicKey != null)
  }, [connected, publicKey])

  const openModal = (view = "wallet") => {
    EventBus.emit("walletModal:open");
  };

  const closeModal = () => {
    EventBus.emit("walletModal:close");
  };

  const disconnect = async () => {
    await _disconnect()
    select(null)
    localStorage.removeItem(walletConfig.walletStorageKey)
    setIsConnected(false)
  }

  return {
    address: publicKey?.toBase58() || null,
    publicKey,
    isConnected,
    isConnecting,
    networkId: currentNetworkId,
    connect,
    disconnect,
    select,
    wallets,
    wallet,
    signMessage,
    openModal,
    closeModal
  }

};
