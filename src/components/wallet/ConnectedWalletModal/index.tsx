// components/wallet/ConnectedWalletModal.tsx
import { useEffect, useState } from "react";
import Modal from "../../modal/Modal";
import { useWalletCore } from "@/hooks/useWalletCore";
import EventBus from "@/core/EventBus";
import ConnectedWalletContent from "./ConnectedWalletContent";
import NetworkSelectContent from "./NetworkSelectContent";
import { networks, defaultNetwork } from "@/config/networks";
import { NetworkConfig } from "@/types/NetworkConfig";
import toast from "@/hooks/toast";
import walletConfig from "@/config/wallet"

type ModalView = 'wallet' | 'network';

export function ConnectedWalletModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState<ModalView>('wallet');
  const [currentNetwork, setCurrentNetwork] = useState<NetworkConfig>(defaultNetwork);
  const [isUnsupportedNetwork, setIsUnsupportedNetwork] = useState(false);

  const { isConnected, disconnect, currentWallet } = useWalletCore();

  useEffect(()=>{
    console.log("Hellooooo==>", isConnected)
  }, [isConnected])

  // Initialize network from localStorage
  useEffect(() => {

    const savedNetworkId = localStorage.getItem(walletConfig.localStorageKey);


    if (savedNetworkId && networks[savedNetworkId]) {
      setCurrentNetwork(networks[savedNetworkId]);
    }

    const handleNetworkChange = (network: NetworkConfig) => {
      setCurrentNetwork(network);
      setIsUnsupportedNetwork(false);
    };

    EventBus.on('networkChange', handleNetworkChange);

    return () => {
      EventBus.off('networkChange', handleNetworkChange);
    };
  }, []);

  // Event listeners
  useEffect(() => {
    const openWalletModal = () => {
      setView('wallet');
      setModalOpen(true);
    };

    const openNetworkModal = () => {
      setView('network');
      setModalOpen(true);
    };

    const handleUnsupportedNetwork = () => {
      setIsUnsupportedNetwork(true);
      setView('network');
      setModalOpen(true);
    };

    EventBus.on("openConnectedWalletModal", openWalletModal);
    EventBus.on("openNetworkModal", openNetworkModal);
    EventBus.on("unsupportedNetwork", handleUnsupportedNetwork);

    return () => {
      EventBus.off("openConnectedWalletModal");
      EventBus.off("openNetworkModal");
      EventBus.off("unsupportedNetwork");
    };
  }, []);

  // Handle modal close
  const onOpenChange = async (state: boolean) => {
    if (!state) {
      // If closing while on unsupported network, disconnect wallet
      if (isUnsupportedNetwork && isConnected) {
        try {
          await disconnect();
          toast.info('Wallet disconnected due to unsupported network');
        } catch (error) {
          console.error('Failed to disconnect:', error);
        }
        setIsUnsupportedNetwork(false);
      }

      // Reset view when closing
      setView('wallet');
    }
    setModalOpen(state);
  };

  // Get modal title based on view
  const getTitle = () => {
    if (view === 'network') {
      return isUnsupportedNetwork ? 'Unsupported Network' : 'Select Network';
    }
    return currentWallet?.adapter?.name || 'Wallet';
  };

  // Get modal description based on view
  const getDescription = () => {
    if (view === 'network') {
      return isUnsupportedNetwork
        ? 'Please switch to a supported network'
        : 'Choose your preferred network';
    }
    return 'Connected';
  };

  const walletAdapter = currentWallet?.adapter;

  const icon = walletAdapter?.icon

  return (
    <Modal
      open={modalOpen}
      onOpenChange={onOpenChange}
      title={getTitle()}
      description={getDescription()}
      size="420"
      className="max-h-[85vh]"
      icon={view === 'wallet' && icon ? (
        <img
          src={icon}
          alt=""
          className="w-6 h-6 rounded-lg"
        />
      ) : undefined}
    >
      {view === 'wallet' ? (
        <ConnectedWalletContent
          setModalOpen={setModalOpen}
          currentNetwork={currentNetwork}
          onNetworkClick={() => setView('network')}
        />
      ) : (
        <NetworkSelectContent
          currentNetwork={currentNetwork}
          isUnsupportedNetwork={isUnsupportedNetwork}
          onBack={() => setView('wallet')}
          onNetworkSelect={(network) => {
            setCurrentNetwork(network);
            setIsUnsupportedNetwork(false);
            localStorage.setItem('mp_network', network.name);
            EventBus.emit('networkChange', network);
            toast.success(`Switched to ${network.displayName}`);
            setView('wallet');
          }}
          setModalOpen={setModalOpen}
        />
      )}
    </Modal>
  );
}

export default ConnectedWalletModal;
