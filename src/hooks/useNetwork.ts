// hooks/useNetwork.ts
import { useState, useEffect, useCallback } from 'react';
import { networks, defaultNetwork, getNetworkById } from '@/config/networks';
import { NetworkConfig } from '@/types/NetworkConfig';
import EventBus from '@/core/EventBus';

interface UseNetworkReturn {
  currentNetwork: NetworkConfig;
  switchNetwork: (networkId: string) => void;
  isSupported: (networkId: string) => boolean;
  allNetworks: NetworkConfig[];
  openNetworkModal: () => void;
  triggerUnsupportedNetwork: () => void;
}

export function useNetwork(supportedNetworks?: string[]): UseNetworkReturn {

  const [currentNetwork, setCurrentNetwork] = useState<NetworkConfig>(defaultNetwork);

  // Initialize from localStorage
  useEffect(() => {
    const savedNetworkId = localStorage.getItem('mp_network');
    if (savedNetworkId && networks[savedNetworkId]) {
      setCurrentNetwork(networks[savedNetworkId]);
    }

    const handleNetworkChange = (network: NetworkConfig) => {
      setCurrentNetwork(network);
    };

    EventBus.on('networkChange', handleNetworkChange);

    return () => {
      EventBus.off('networkChange', handleNetworkChange);
    };
  }, []);

  const switchNetwork = useCallback((networkId: string) => {
    const network = getNetworkById(networkId);
    if (network) {
      setCurrentNetwork(network);
      localStorage.setItem('mp_network', network.name);
      EventBus.emit('networkChange', network);
    }
  }, []);

  const isSupported = useCallback((networkId: string) => {
    if (!supportedNetworks) return true;
    return supportedNetworks.includes(networkId);
  }, [supportedNetworks]);

  const openNetworkModal = useCallback(() => {
    EventBus.emit('openNetworkModal');
  }, []);

  const triggerUnsupportedNetwork = useCallback(() => {
    EventBus.emit('unsupportedNetwork');
  }, []);

  const allNetworks = Object.values(networks);

  return {
    currentNetwork,
    switchNetwork,
    isSupported,
    allNetworks,
    openNetworkModal,
    triggerUnsupportedNetwork,
  };
}

export default useNetwork;
