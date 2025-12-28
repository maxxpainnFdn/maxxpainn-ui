// hooks/useNetwork.ts
import { useState, useEffect,  } from 'react';
import { networks, getNetworkById } from '@/config/networks';
import { NetworkConfig } from '@/types/NetworkConfig';
import EventBus from '@/core/EventBus';
import { useAtom, useAtomValue } from 'jotai';
import { currentNetworkAtom, currentNetworkIdAtom } from '@/store'

interface UseNetworkReturn {
  currentNetworkId:   string;
  currentNetwork:     NetworkConfig;
  switchNetwork:      (networkId: string) => void;
  networks:           Record<string, NetworkConfig>;
  openNetworkModal:   () => void;
}

export function useNetwork(): UseNetworkReturn {

  const [currentNetworkId, setCurrentNetworkId] = useAtom(currentNetworkIdAtom);
  const currentNetwork = useAtomValue<NetworkConfig>(currentNetworkAtom);


  const switchNetwork = (networkId: string) => {
    if (networkId) {
      setCurrentNetworkId(networkId);
    }
  }

  const openNetworkModal = () => {
    EventBus.emit("walletModal:open", { view: "network" })
  }

  return {
    currentNetworkId,
    currentNetwork,
    switchNetwork,
    networks,
    openNetworkModal,
  };
}

export default useNetwork;
