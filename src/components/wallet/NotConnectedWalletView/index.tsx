// components/wallet/WalletModal.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base';

import toast from '@/hooks/toast';
import Modal from '@/components/modal/Modal';
import WalletModalFooter from './WalletModalFooter';
import InstalledWallets from './InstalledWallets';
import NotInstalledWallets from './NotInstalledWallets';
import WalletSecurityWarning from './WalletSecurityWarning';
import WalletError from './WalletError';
import { isMobile } from 'react-device-detect';
import { useWalletCore } from '@/hooks/useWalletCore';
import utils from '@/lib/utils';
import walletConfig from '@/config/wallet';
import { currentNetworkAtom, currentNetworkIdAtom } from '@/store'
import { useAtomValue } from 'jotai';
import { NetworkConfig } from '@/types/NetworkConfig';
import Networks from './Networks';
import { ChevronRight } from 'lucide-react';


interface NotConnectedWalletViewProps {
  modalOpen?: boolean;
  setModalOpen:  React.Dispatch<React.SetStateAction<boolean>>;
}

export const NotConnectedWalletView = ({
  modalOpen,
  setModalOpen
}: NotConnectedWalletViewProps) => {

  const { wallets, select, connect, isConnecting, wallet: selectedWallet } = useWalletCore();
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkConfig|null>(null)
  

  // handle the modal open or close
  useEffect(()=>{
    if (!modalOpen) {
      setConnectingWallet(null);
      setError(null);
    } else {
      localStorage.removeItem(walletConfig.walletStorageKey)
      openMobileNativeDialog()
    }
  }, [modalOpen])


  const openMobileNativeDialog = () => {
      if (isMobile) {

        // 2. Find the Mobile Wallet Adapter in your wallets list
        // Note: The official name constant is usually 'Mobile Wallet Adapter'
        const mobileWallet = wallets.find(
            (w) => w.adapter.name === 'Mobile Wallet Adapter'
        );

        // 3. If it exists and is ready (Loadable), connect to it directly
        if (mobileWallet && mobileWallet.readyState !== WalletReadyState.Unsupported) {
          select(mobileWallet.adapter.name);
          connect(); // This triggers the Android Native Sheet
          return;
        }
    }
  }

  // Handle wallet selection and connection
  const handleWalletSelect =  (walletName: WalletName) => {
    setError(null);
    setConnectingWallet(walletName);

    try {
      select(walletName);
    } catch (err: any) {
      console.error('Wallet selection error:', err);
      setError(err.message || 'Failed to select wallet');
      setConnectingWallet(null);
    }
  }

  const connectWallet = async () => {

    const walletName = selectedWallet?.adapter?.name

    if (selectedWallet && connectingWallet === walletName) {
      try {

        setConnectingWallet(walletName);

        await connect();

        toast.success(`Connected to ${walletName}`);
        setConnectingWallet(null);

      } catch (err: any) {

        console.error('Connection error:', err);

        if (err.name !== 'WalletConnectionError' || !err.message.includes('User rejected')) {
          setError(err.message || 'Failed to connect wallet');
          toast.error('Connection failed. Please try again.');
        }

        setConnectingWallet(null);
      }

    }
  };

  // Connect after selection
  useEffect(() => {
    connectWallet();
  }, [selectedWallet, connectingWallet, modalOpen]);

  return (
    <div> {/** Content */}
      {/* Error Message */}
      
      <WalletError error={error} setError={setError} />
      
      {selectedNetwork == null ? (
        <Networks 
          onSelect={(network: NetworkConfig) => setSelectedNetwork(network) }
        />
      ) : (
        <div className="space-y-2">
            <button className={`
                w-full flex
                justify-between align-middle
                p-4 mb-5
                bg-black/5 border border-white/10 rounded-xl
                hover:bg-purple-400/10 hover:border-purple-500/50
                hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]
                group
              `}
              onClick={(e) => setSelectedNetwork(null)}
            >
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Selected Network
              </p>
              <div className="flex items-center gap-3">
                <div className={`
                  w-3 h-3 rounded-full
                  ${ selectedNetwork.isTestnet
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }
                `} />
                <span className="text-white font-bold">
                  {selectedNetwork.name}
                </span>
                {selectedNetwork.isTestnet  && (
                  <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded-full">
                    Testnet
                  </span>
                )}
              </div>
            </div>
            <ChevronRight className={` w-5 h-5 text-white/30 group-hover:text-purple-400 group-hover:translate-x-1`} />
          </button>
          
          <InstalledWallets
            connecting={isConnecting}
            connectingWallet={connectingWallet}
            wallets={wallets}
            onWalletSelect={handleWalletSelect}
          />
  
          <NotInstalledWallets
            wallets={wallets}
          />
  
        </div>
      )}
      
      <div className="mt-3">
        <WalletSecurityWarning />
      </div>
       
    </div>
  );
};


export default NotConnectedWalletView;
