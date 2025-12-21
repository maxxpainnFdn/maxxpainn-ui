// @/hooks/useWalletCore.ts

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from "@solana/wallet-adapter-react-ui"


export const useWalletCore = () => {

  const { setVisible } = useWalletModal()
  const {
    publicKey,
    connected,
    disconnect,
    select,
    wallets,
    wallet,
    signMessage
  } = useWallet();


  return {
    address: publicKey?.toBase58() || null,
    publicKey,
    isConnected: connected,
    openModal: () => setVisible(true),
    closeModal: () => setVisible(false),
    disconnect,
    wallets,
    selectWallet: select,
    signMessage,
    currentWallet: wallet
  };
};
