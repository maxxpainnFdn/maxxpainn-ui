// components/wallet/SignSessionContent.tsx
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNetwork } from '@/hooks/useNetwork';
import { NetworkConfig } from '@/types/NetworkConfig';
import SigningProgress from './signer/SigningProcess';
import SigningError from './signer/SigningError';
import SigningSuccess from './signer/SigningSuccess';
import SigningMain from './signer/SigningMain';
import UnsupportedNetworkCard from './signer/UnsupportedNetworkCard';

export interface SignSessionContentProps {
  currentNetwork: NetworkConfig;
  onSuccess?: () => void;
  onCancel?: () => void;
  onNetworkSwitch?: () => void;
  supportedNetworks?: string[];
}

type SigningState = 'idle' | 'fetching-nonce' | 'awaiting-signature' | 'verifying' | 'success' | 'error';

export default function SignSessionContent({
  currentNetwork,
  onSuccess,
  onCancel,
  onNetworkSwitch,
  supportedNetworks
}: SignSessionContentProps) {

  const { signIn, isSigningIn } = useAuth();
  const { isSupported } = useNetwork(supportedNetworks);

  const [signingState, setSigningState] = useState<SigningState>('idle');
  const [error, setError] = useState<string | null>(null);

  const isNetworkSupported = !supportedNetworks || isSupported(currentNetwork.name);

  // Format address for display
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Handle sign in
  const handleSignIn = async () => {

    setError(null);
    setSigningState('fetching-nonce');

    try {
      // Simulate state transitions for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      setSigningState('awaiting-signature');

      const success = await signIn();

      if (success) {
        setSigningState('success');
        await new Promise(resolve => setTimeout(resolve, 1000));
        onSuccess?.();
      } else {
        setSigningState('error');
        setError('Failed to verify signature. Please try again.');
      }
    } catch (err: any) {
      setSigningState('error');

      if (err?.message?.includes('User rejected') || err?.code === 4001) {
        setError('Signature request was rejected.');
      } else {
        setError(err?.message || 'An unexpected error occurred.');
      }
    }
  };

  // Reset state
  const handleRetry = () => {
    setSigningState('idle');
    setError(null);
  };

  const inputBgClass = "bg-gray-900/50 border-white/10";

  // Show network warning if unsupported
  if (!isNetworkSupported) {
    return (
      <UnsupportedNetworkCard
        currentNetwork={currentNetwork}
        inputBgClass={inputBgClass}
        onCancel={onCancel}
        onNetworkSwitch={onNetworkSwitch}
      />
    )
  }

  // Success State
  if (signingState === 'success') {
    return <SigningSuccess />
  }

  // Error State
  if (signingState === 'error') {
    return (
      <SigningError
        error={error}
        onRetry={handleRetry}
        onCancel={onCancel}
        inputBgClass={inputBgClass}
      />
    )
  }

  // Signing in progress states
  if (signingState !== 'idle') {
    return (
      <SigningProgress
        signingState={signingState}
        onCancel={onCancel}
        inputBgClass={inputBgClass}
      />
    );
  }

  // Idle State - Main Sign In UI (Reown SIWX Style)
  return (
    <SigningMain
      currentNetwork={currentNetwork}
      inputBgClass={inputBgClass}
      isSigningIn={isSigningIn}
      onSignIn={handleSignIn}
      onCancel={onCancel}
    />
  );
}
