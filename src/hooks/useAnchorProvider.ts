import { AnchorProvider } from "@coral-xyz/anchor";
import { useWallet, type AnchorWallet } from "@solana/wallet-adapter-react";
import { Commitment, Connection } from "@solana/web3.js";
import useNetwork from "./useNetwork";
import { useWalletCore } from "./useWalletCore";
import { getNetworkById } from "@/config/networks";

export function useAnchorProvider() {

  const { isConnected } = useWalletCore()
  const wallet = useWallet()
  const { currentNetwork } = useNetwork()


  const getProvider = (networkId: string | undefined = undefined) => {

    if (!isConnected) return null;

    const commitment = "confirmed"

    const networkInfo = (!networkId) ? currentNetwork : getNetworkById(networkId);

    const connection =  new Connection(networkInfo.endpoint, commitment);

    //console.log("wallet===>", wallet)

    return new AnchorProvider(connection, wallet as AnchorWallet,  AnchorProvider.defaultOptions());
  };

  return { getProvider };
}
