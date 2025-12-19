import { ChainNamespace } from "@reown/appkit/networks";
import { useAppKit, Views,  } from "@reown/appkit/react";

export function useWalletModal() {
  const { open, close } = useAppKit();

  const openModal = (
    view: Views = "Connect",
    namespace: ChainNamespace = "solana"
  ) => {
    return open({ view, namespace })
  }

  return { 
    openModal, 
    closeModal: close
  }
}