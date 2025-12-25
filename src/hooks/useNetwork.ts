// hooks/useNetwork.ts
import { useState, useEffect,  } from 'react';
import { networks, getNetworkById } from '@/config/networks';
import { NetworkConfig } from '@/types/NetworkConfig';
import EventBus from '@/core/EventBus';
import walletConfig from "@/config/wallet"
import { useAtom } from 'jotai';
import { currentNetworkAtom } from '@/store'

interface UseNetworkReturn {
  currentNetwork: NetworkConfig;
  switchNetwork: (networkId: string) => void;
  networks: Record<string, NetworkConfig>;
  openNetworkModal: () => void;
}

export function useNetwork(): UseNetworkReturn {

  const [currentNetwork, setCurrentNetwork] = useAtom(currentNetworkAtom);

  const switchNetwork = (networkId: string) => {

    const network = getNetworkById(networkId);

    if (network) {
      setCurrentNetwork(network);
      localStorage.setItem(walletConfig.networkStorageKey, network.name);
      EventBus.emit('networkChange', network);
    }
  }

  const openNetworkModal = () => {
    EventBus.emit("walletModal:open", { view: "network" })
  }

  return {
    currentNetwork,
    switchNetwork,
    networks,
    openNetworkModal,
  };
}

export default useNetwork;
