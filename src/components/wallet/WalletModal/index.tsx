// components/wallet/WalletModal.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName } from '@solana/wallet-adapter-base';

import toast from '@/hooks/toast';
import Modal from '@/components/modal/Modal';
import WalletModalFooter from './WalletModalFooter';
import InstalledWallets from './InstalledWallets';
import NotInstalledWallets from './NotInstalledWallets';
import WalletSecurityWarning from './WalletSecurityWarning';
import WalletError from './WalletError';
import EventBus from '@/core/EventBus';

interface WalletModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ open, onOpenChange }) => {

  const { wallets, select, connect, connecting, connected, wallet: selectedWallet } = useWallet();
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(open)


  useEffect(()=>{
    EventBus.on("openWalletModal", ()=>{
      setModalOpen(true)
    })

    return () => {
      EventBus.off("openWalletModal");
    }
  }, [])

  const handleOnOpenChange = (state) => {

    setModalOpen(state)
    onOpenChange?.(state)

    if (!state) {
      setConnectingWallet(null);
      setError(null);
    }
  }

  // Handle wallet selection and connection
  const handleWalletSelect = useCallback(async (walletName: WalletName) => {
    setError(null);
    setConnectingWallet(walletName);

    try {
      select(walletName);
    } catch (err: any) {
      console.error('Wallet selection error:', err);
      setError(err.message || 'Failed to select wallet');
      setConnectingWallet(null);
    }
  }, [select]);

  // Connect after selection
  useEffect(() => {
    const connectWallet = async () => {
      if (selectedWallet && connectingWallet === selectedWallet.adapter.name) {
        try {
          await connect();
          toast.success(`Connected to ${selectedWallet.adapter.name}`);
          handleOnOpenChange(false);
        } catch (err: any) {
          console.error('Connection error:', err);
          if (err.name !== 'WalletConnectionError' || !err.message.includes('User rejected')) {
            setError(err.message || 'Failed to connect wallet');
            toast.error('Connection failed. Please try again.');
          }
        } finally {
          setConnectingWallet(null);
        }
      }
    };

    connectWallet();
  }, [selectedWallet, connectingWallet, connect, onOpenChange]);


  return (
      <Modal
        open={modalOpen}
        onOpenChange={handleOnOpenChange}
        title="Connect Wallet"
        description="Select your preferred Solana wallet to continue"
        size="480"
        className="max-h-[85vh]"
        modalFooter={<WalletModalFooter />}
      >

        <div> {/** Content */}
          {/* Error Message */}

          <WalletError error={error} setError={setError} />

          <div className="space-y-2">
            <InstalledWallets
              connecting={connecting}
              connectingWallet={connectingWallet}
              wallets={wallets}
              onWalletSelect={handleWalletSelect}
            />

            <NotInstalledWallets
              wallets={wallets}
            />

            <WalletSecurityWarning />
          </div>

        </div> {/** End Content */}
    </Modal>
  );
};


export default WalletModal;
