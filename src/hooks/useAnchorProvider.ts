import { AnchorProvider } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type { AnchorWallet } from "@solana/wallet-adapter-react";
import { Commitment } from "@solana/web3.js";

export function useAnchorProvider() {

  const { connection } = useConnection();
  const wallet = useWallet();

  const getProvider = (commitment: Commitment = "confirmed") => {
    if (!wallet.publicKey) return null;

    return new AnchorProvider(connection, wallet as AnchorWallet, { commitment });
  };

  return { getProvider };
}
