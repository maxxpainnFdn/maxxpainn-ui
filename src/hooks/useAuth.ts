// hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { useWalletCore } from '@/hooks/useWalletCore';
import { useNetwork } from '@/hooks/useNetwork';
import  { authService } from '@/core/AuthService';
import { AuthNonce, SessionStatus } from '@/types/Auth';
import EventBus from '@/core/EventBus';
import bs58 from 'bs58';
import toast from './toast';

interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  isSigningIn: boolean;
  session: SessionStatus | null;
  signIn: () => Promise<boolean>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const { isConnected, address, signMessage } = useWalletCore();
  const { currentNetwork } = useNetwork();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [session, setSession] = useState<SessionStatus | null>(null);

  // Check session on mount and when wallet changes
  const checkSession = useCallback(async () => {

    if (!isConnected || !address) {
      setIsAuthenticated(false);
      setSession(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {

      const status = await authService.getSession(address);

      if(status.isError()){
        setIsAuthenticated(true);
        setSession(null);
        return;
      }

      const data = status.getData() as SessionStatus;

      setIsAuthenticated(data.isAuthenticated);
      setSession(data)

    } catch (error) {
      console.error('Failed to check session:', error);
      setIsAuthenticated(false);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Listen for wallet disconnect
  useEffect(() => {

    const handleDisconnect = () => {
      setIsAuthenticated(false);
      setSession(null);
    };

    EventBus.on('walletDisconnected', handleDisconnect);
    return () => EventBus.off('walletDisconnected', handleDisconnect);
  }, []);

  // Sign in with wallet
  const signIn = useCallback(async (): Promise<boolean> => {

    if (!isConnected || !address || !signMessage) {
      return false;
    }

    setIsSigningIn(true);

    try {

      // 1. Get nonce from server
      const nonceStatus = await authService.getNonce(address);

      if(nonceStatus.isError){
        toast.error(`Fetch Nonce Failed: ${nonceStatus.getMessage()}`)
        return;
      }

      const nonceData = nonceStatus.getData() as AuthNonce;

      // 2. Build the message
      const message = authService.buildSignMessage(
        address,
        nonceData.nonce,
        currentNetwork.chainId,
        nonceData.issuedAt,
        nonceData.expiresAt
      );

      // 3. Sign the message
      const encodedMessage = new TextEncoder().encode(message);
      const signatureBytes = await signMessage(encodedMessage);
      const signature = bs58.encode(signatureBytes);

      // 4. Verify with server
      const resultStatus = await authService.verifySignature({
                              address,
                              signature,
                              message,
                              nonce: nonceData.nonce,
                            });

      if(resultStatus.isError()){
        toast.error(`Failed to veriy signature: ${resultStatus.getMessage()}`)
        return false;
      }

      const sessionData = resultStatus.getData() as SessionStatus;

      if (sessionData.isAuthenticated) {
        setIsAuthenticated(true);
        setSession(sessionData);
        EventBus.emit('sessionAuthenticated', sessionData);
        return true;
      }

      return false;

    } catch (error: any) {
      console.error('Sign in failed:', error);

      // User rejected the signature
      if (error?.message?.includes('User rejected') || error?.code === 4001) {
        EventBus.emit('signatureRejected');
      }

      return false;
    } finally {
      setIsSigningIn(false);
    }
  }, [isConnected, address, signMessage]);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setSession(null);
      EventBus.emit('sessionLoggedOut');
    }
  }, []);

  return {
    isAuthenticated,
    isLoading,
    isSigningIn,
    session,
    signIn,
    signOut,
    checkSession,
  };
}

export default useAuth;
