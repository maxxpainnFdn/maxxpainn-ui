import { useEffect, useState } from "react";
import Modal from "../../modal/Modal";
import { useWalletCore } from "@/hooks/useWalletCore";
import Button from "../../button/Button";
import EventBus from "@/core/EventBus";
import WalletContent from "./WalletContent";

export function ConnectedWalletModal() {

  const [modalOpen, setModalOpen] = useState(false)
  const { isConnected, disconnect, currentWallet, address } = useWalletCore()

  useEffect(()=>{
    EventBus.on("openConnectedWalletModal", ()=>{
      setModalOpen(true)
    })

    return () => {
      EventBus.off("openConnectedWalletModal");
    }
  }, [])

  const onOpenChange = (state) => {
    setModalOpen(state)
  }

  const walletAdapter = currentWallet?.adapter;

  return (
    <Modal
      open={modalOpen}
      onOpenChange={onOpenChange}
      title={ walletAdapter?.name || 'Wallet' }
      description="Connected"
      size="420"
      className="max-h-[85vh]"
    >

      <WalletContent />

    </Modal>
  )
}
