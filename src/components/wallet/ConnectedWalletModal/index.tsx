// components/wallet/ConnectedWalletModal.tsx
import { useEffect, useState } from "react";
import Modal from "../../modal/Modal";
import { useWalletCore } from "@/hooks/useWalletCore";
import { useAuth } from "@/hooks/useAuth";
import EventBus from "@/core/EventBus";
import ConnectedWalletContent from "./ConnectedWalletContent";
import NetworkSelectContent from "./NetworkSelectContent";
import SignSessionContent from "./SignSessionContent";
import { networks, defaultNetwork } from "@/config/networks";
import { NetworkConfig } from "@/types/NetworkConfig";
import toast from "@/hooks/toast";
import walletConfig from "@/config/wallet";

type ModalView = 'wallet' | 'network' | 'sign-session';

const NETWORK_STORAGE_KEY = walletConfig.networkStorageKey || 'mp_network';

export function ConnectedWalletModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState<ModalView>('wallet');
  const [currentNetwork, setCurrentNetwork] = useState<NetworkConfig>(defaultNetwork);
  const [isUnsupportedNetwork, setIsUnsupportedNetwork] = useState(false);
  const [requiresSignature, setRequiresSignature] = useState(false);

  const { isConnected, disconnect, wallet } = useWalletCore();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Supported networks for your dApp (optional - set to undefined for all networks)
  const supportedNetworks = ['solana_mainnet', 'solana_devnet'];

  // Initialize network from localStorage
  useEffect(() => {
    const savedNetworkId = localStorage.getItem(NETWORK_STORAGE_KEY);

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

  // Check if signature is required after wallet connects
  useEffect(() => {
    if (isConnected && !isAuthLoading && !isAuthenticated) {
      // Check network first
      const isSupported = supportedNetworks.includes(currentNetwork.name);

      if (!isSupported) {
        setIsUnsupportedNetwork(true);
        setView('network');
        setModalOpen(true);
      } else {
        // Network is supported, prompt for signature
        setRequiresSignature(true);
        setView('sign-session');
        setModalOpen(true);
      }
    } else if (isAuthenticated) {
      setRequiresSignature(false);
    }
  }, [isConnected, isAuthLoading, isAuthenticated, currentNetwork]);

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

    const openSignModal = () => {
      setView('sign-session');
      setModalOpen(true);
    };

    const handleUnsupportedNetwork = () => {
      setIsUnsupportedNetwork(true);
      setView('network');
      setModalOpen(true);
    };

    const handleRequireSignature = () => {
      setRequiresSignature(true);
      setView('sign-session');
      setModalOpen(true);
    };

    EventBus.on("openConnectedWalletModal", openWalletModal);
    EventBus.on("openNetworkModal", openNetworkModal);
    EventBus.on("openSignSessionModal", openSignModal);
    EventBus.on("unsupportedNetwork", handleUnsupportedNetwork);
    EventBus.on("requireSignature", handleRequireSignature);

    return () => {
      EventBus.off("openConnectedWalletModal");
      EventBus.off("openNetworkModal");
      EventBus.off("openSignSessionModal");
      EventBus.off("unsupportedNetwork");
      EventBus.off("requireSignature");
    };
  }, []);

  // Handle modal close
  const onOpenChange = async (state: boolean) => {
    if (!state) {
      // If closing while on unsupported network or requires signature, disconnect wallet
      if ((isUnsupportedNetwork || requiresSignature) && isConnected) {
        try {
          await disconnect();
          toast.info(
            isUnsupportedNetwork
              ? 'Wallet disconnected due to unsupported network'
              : 'Wallet disconnected - signature required'
          );
        } catch (error) {
          console.error('Failed to disconnect:', error);
        }
        setIsUnsupportedNetwork(false);
        setRequiresSignature(false);
      }

      // Reset view when closing
      setView('wallet');
    }
    setModalOpen(state);
  };

  // Handle network selection
  const handleNetworkSelect = (network: NetworkConfig) => {
    setCurrentNetwork(network);
    setIsUnsupportedNetwork(false);
    localStorage.setItem(NETWORK_STORAGE_KEY, network.name);
    EventBus.emit('networkChange', network);
    toast.success(`Switched to ${network.displayName}`);

    // After network switch, check if signature is needed
    if (requiresSignature || !isAuthenticated) {
      setView('sign-session');
    } else {
      setView('wallet');
    }
  };

  // Handle successful sign in
  const handleSignSuccess = () => {
    setRequiresSignature(false);
    setView('wallet');
    toast.success('Successfully signed in!');
  };

  // Handle sign cancel
  const handleSignCancel = async () => {
    if (requiresSignature) {
      // Disconnect if signature was required
      try {
        await disconnect();
        toast.info('Wallet disconnected - signature required');
      } catch (error) {
        console.error('Failed to disconnect:', error);
      }
      setRequiresSignature(false);
    }
    setModalOpen(false);
  };

  // Get modal title based on view
  const getTitle = () => {
    switch (view) {
      case 'network':
        return isUnsupportedNetwork ? 'Unsupported Network' : 'Select Network';
      case 'sign-session':
        return 'Sign In';
      default:
        return wallet?.adapter?.name || 'Wallet';
    }
  };

  // Get modal description based on view
  const getDescription = () => {
    switch (view) {
      case 'network':
        return isUnsupportedNetwork
          ? 'Please switch to a supported network'
          : 'Choose your preferred network';
      case 'sign-session':
        return 'Verify wallet ownership';
      default:
        return 'Connected';
    }
  };

  const icon = wallet?.adapter?.icon;

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
      {view === 'wallet' && (
        <ConnectedWalletContent
          setModalOpen={setModalOpen}
          currentNetwork={currentNetwork}
          onNetworkClick={() => setView('network')}
        />
      )}

      {view === 'network' && (
        <NetworkSelectContent
          currentNetwork={currentNetwork}
          isUnsupportedNetwork={isUnsupportedNetwork}
          onBack={() => setView(requiresSignature ? 'sign-session' : 'wallet')}
          onNetworkSelect={handleNetworkSelect}
          setModalOpen={setModalOpen}
          supportedNetworks={supportedNetworks}
        />
      )}

      {view === 'sign-session' && (
        <SignSessionContent
          currentNetwork={currentNetwork}
          onSuccess={handleSignSuccess}
          onCancel={handleSignCancel}
          onNetworkSwitch={() => setView('network')}
          supportedNetworks={supportedNetworks}
        />
      )}
    </Modal>
  );
}

export default ConnectedWalletModal;
