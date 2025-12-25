import { useWalletCore } from "@/hooks/useWalletCore";
import { useEffect, useState } from "react";
import ConnectedWalletView from "./ConnectedWalletView";
import NotConnectedWalletView from "./NotConnectedWalletView";
import Modal from "../modal/Modal";
import EventBus from "@/core/EventBus";


interface WalletViewProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface ModalMeta {
  title: string;
  description: string;
  icon?: any
}

export default function WalletModal({ open, onOpenChange }: WalletViewProps) {

  const { isConnected } = useWalletCore()
  const [modalMeta, setModalMeta] = useState<ModalMeta>({ title: "", description: "", icon: undefined})
  const [modalOpen, setModalOpen] = useState(open)

  useEffect(()=>{
    setModalOpen(open)
  },[open])

  useEffect(()=>{
    EventBus.on("walletModal:open", ()=>{
      setModalOpen(true)
    })

    return () => {
      EventBus.off("openWalletModal");
    }
  }, [])

  useEffect(()=>{
    if(!isConnected){
      setModalMeta({
        title: "Connect Wallet",
        description: "Select your preferred Solana wallet to continue"
      })
    }
  }, [isConnected])

  const handleModalClose = (state) => {
    setModalOpen(state)
    onOpenChange?.(state)
  }

  return (
    <Modal
      open={modalOpen}
      onOpenChange={handleModalClose}
      title={ modalMeta.title }
      description={ modalMeta.description }
      size="480"
      className="max-h-[85vh] min-w-[280px] rounded-xl"
    >
      {isConnected ? (
        <ConnectedWalletView
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          setModalMeta={setModalMeta}
        />
      ) : (
        <>
          <NotConnectedWalletView
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
          />
        </>
      )}
    </Modal>
  )
}
