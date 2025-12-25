// components/wallet/SignSessionContent.tsx
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNetwork } from '@/hooks/useNetwork';
import { NetworkConfig } from '@/types/NetworkConfig';
import SigningProgress from './signer/SigningProcess';
import SigningError from './signer/SigningError';
import SigningSuccess from './signer/SigningSuccess';
import SigningMain from './signer/SigningMain';
import utils from '@/lib/utils';

export interface SignSessionContentProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

type SigningState = 'idle' | 'fetching-nonce' | 'awaiting-signature' | 'verifying' | 'success' | 'error';

export default function SignSessionContent({
  onSuccess,
  onCancel,

}: SignSessionContentProps) {

  const { signIn, isSigningIn } = useAuth();
  const {  currentNetwork } = useNetwork();

  const [signingState, setSigningState] = useState<SigningState>('idle');
  const [error, setError] = useState<string | null>(null);


  // Handle sign in
  const handleSignIn = async () => {

    setError(null);
    setSigningState('fetching-nonce');

    try {
      // Simulate state transitions for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      setSigningState('awaiting-signature');

      const status = await signIn();

      if (status.isSuccess()) {
        setSigningState('success');
        await utils.sleep(1000)
        onSuccess?.();
      } else {
        setSigningState('error');
        setError(status.getMessage());
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
