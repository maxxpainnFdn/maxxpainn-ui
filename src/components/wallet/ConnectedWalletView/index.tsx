// components/wallet/ConnectedWalletModal.tsx
import { useEffect, useState } from "react";
import { useWalletCore } from "@/hooks/useWalletCore";
import ConnectedWalletContent from "./ConnectedWalletContent";
import NetworkSelectContent from "./NetworkSelectContent";
import SignSessionContent from "./SignSessionContent";
import toast from "@/hooks/toast";
import useNetwork from "@/hooks/useNetwork";
import useAuth from "@/hooks/useAuth";

type ConnectedModalView = 'wallet' | 'network' | 'signSession';

export interface ConnectedWalletViewProps {
  modalOpen: boolean;
  setModalOpen:  React.Dispatch<React.SetStateAction<boolean>>;
  setModalTitle: (value: string) => void;
  setModalDesc:  (value: string) => void;
  setModalMeta:  (Record<string, any>);
}


export function ConnectedWalletView({
  modalOpen,
  setModalOpen,
  setModalMeta
}) {

  const { disconnect, wallet, isConnected } = useWalletCore();
  const { currentNetwork } = useNetwork()
  const { isAuthenticated } = useAuth()

  const [view, setView] = useState<ConnectedModalView>('wallet');


  const initialize = () => {
     if(!isAuthenticated){
      setView("signSession")
    } else {
      setView("wallet")
    }
  }

  // Get modal title based on view
  const updateModalMeta = () => {
    switch (view) {
      case 'network':
        setModalMeta({
          title:  'Select Network',
          description:  'Choose your preferred network'
        })
        break;
      case 'signSession':
        setModalMeta({
          title: 'Sign In',
          description: 'Verify wallet ownership'
        })
        break;
      default:
        setModalMeta({
          title: wallet?.adapter?.name || 'Wallet',
          description: 'Connected'
        })
    }
  };

  useEffect(()=>{
    initialize()
  }, [])

  useEffect(()=>{
    initialize()
  }, [modalOpen, isAuthenticated])

  useEffect(()=>{
    updateModalMeta()
  },[view])

  // Handle successful sign in
  const handleSignSuccess = () => {
    setView('wallet');
    toast.success('Successfully signed in!');
  };

  // Handle sign cancel
  const handleSignCancel = async () => {
    if (!isAuthenticated) {
      // Disconnect if signature was required
      try {

        await disconnect();
        toast.info('Wallet disconnected - signature required');

      } catch (error) {
        console.error('Failed to disconnect:', error);
      }
    }
    setModalOpen(false);
  };


  useEffect(()=>{
    if(!modalOpen){
      handleSignCancel()
    }
  }, [modalOpen])

  return (
    <>
      {view === 'wallet' && (
        <ConnectedWalletContent
          setModalOpen={setModalOpen}
          currentNetwork={currentNetwork}
          onNetworkClick={() => setView('network')}
        />
      )}

      {view === 'network' && (
        <NetworkSelectContent
          onBack={() => setView(isAuthenticated ? 'wallet' : 'signSession')}
          onNetworkChange={initialize}
          setModalOpen={setModalOpen}
        />
      )}

      { view === 'signSession' && (
        <SignSessionContent
          onSuccess={handleSignSuccess}
          onCancel={handleSignCancel}
        />
      )}
    </>
  )
}

export default ConnectedWalletView;
