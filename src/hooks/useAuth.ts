// hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { useWalletCore } from '@/hooks/useWalletCore';
import { useNetwork } from '@/hooks/useNetwork';
import  { authService } from '@/core/AuthService';
import { AuthNonce, SessionData, SessionWithAccountData } from '@/types/Auth';
import EventBus from '@/core/EventBus';
import bs58 from 'bs58';
import toast from './toast';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { authSessionInfoAtom, isAuthenticatedAtom, userAccountInfoAtom } from '@/store';
import authConfig from '@/config/auth';
import { useApi } from './useApi';
import { Status } from '@/core/Status';

interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  isSigningIn: boolean;
  session: SessionData | null;
  signIn: () => Promise<Status>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {

  const api = useApi()
  const { isConnected, address, signMessage, wallet } = useWalletCore();
  const { currentNetwork } = useNetwork();

  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authSession, setAuthSession] = useAtom(authSessionInfoAtom)
  const setUserAccountInfo = useSetAtom(userAccountInfoAtom)
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)

  const getSessions = () => {
    try{
      return JSON.parse(localStorage.getItem(authConfig.sessionStorageKey) || "{}")
    } catch(e){
      return {}
    }
  }

  const updateSessions = (address: string, sessionData: SessionData ) => {
    let sessions = getSessions()
    sessions[address] = sessionData
    localStorage.setItem(authConfig.sessionStorageKey, JSON.stringify(sessions))
  }

  const getSession = (address): SessionData | null  => {
    const _sess = getSessions()
    return _sess[address] || null
  }


  const initialise = () => {
    if (!isConnected || address == null) return;

    let sessions = getSessions()

    if (Object.keys(sessions).length == 0 || !(address in sessions)) return;

    setAuthSession(sessions[address])
  }

  useEffect(() => { initialise() }, []);

  useEffect(()=> {
    initialise()
  }, [isConnected, address])


  // Check session on mount and when wallet changes
  const checkSession = useCallback(async () => {

    if (!isConnected || !address) {
      setAuthSession(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    setAuthSession(getSession(address))

    setIsLoading(false);

  }, [isConnected, address]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Listen for wallet disconnect
  useEffect(() => {

    wallet?.adapter?.on("disconnect", ()=>{
      setAuthSession(null);
    })

    return () => {
      wallet?.adapter?.off("disconnect");
    }
  }, []);

  const   buildSignMessage =(
    address:   string,
    nonce:     string,
    chainId:   string,
    issuedAt:  number,
    expiresAt: number
  ): string => {
    const message = [
      `${authConfig.appDomain} wants you to sign in with your Solana account:`,
      address,
      '',
      authConfig.statement,
      '',
      `URI: ${authConfig.appUri}`,
      `Version: 1`,
      `Chain ID: ${chainId}`,
      `Nonce: ${nonce}`,
      `Issued At: ${new Date(issuedAt)}`,
      `Expiration Time: ${new Date(expiresAt)}`,
    ].join('\n');

    return message;
  }

  // Sign in with wallet
  const signIn = useCallback(async (): Promise<Status> => {

    if (!isConnected || !address || !signMessage) {
      return Status.error("Reconnect wallet to continue");
    }

    setIsSigningIn(true);

    try {

      const chainId = currentNetwork.chainId;
      const accountAddress = address;

      const nonceStatus = await api.post("/auth/nonce", { accountAddress, chainId })

      //console.log("nonceStatus===>", nonceStatus)

      if(nonceStatus.isError()){
        return Status.error(`Nonce Error: ${nonceStatus.getMessage()}`)
      }

      const nonce = nonceStatus.getData() as string;

      const issuedAt = Date.now()
      const expiresAt = issuedAt + (60 * 60 * 24 * 30) // 30days +

      // 2. Build the message
      const message = buildSignMessage(
        address,
        nonce,
        chainId,
        issuedAt,
        expiresAt
      );

      // 3. Sign the message
      const encodedMessage = new TextEncoder().encode(message);
      const signatureBytes = await signMessage(encodedMessage);
      const signature = bs58.encode(signatureBytes);

      const formData = {
        accountAddress,
        signature,
        message,
        nonce,
        chainId
      }

      const resultStatus = await api.post("/auth/verify", formData)

      if(resultStatus.isError()){
        return Status.error(resultStatus.getMessage())
      }

      const sessionAndAcctData = resultStatus.getData() as SessionWithAccountData;

      if (sessionAndAcctData.isAuthenticated) {

        const { accountInfo, ...sessData } = sessionAndAcctData;

        // set account info
        setUserAccountInfo(accountInfo)

        // set active session globally
        setAuthSession(sessData);

        // update the session pool
        updateSessions(accountAddress, sessData)
        return Status.success();
      }

      return Status.error("Failed to verify signature, please try again");

    } catch (error: any) {

      console.error('Sign in failed:', error);

      // User rejected the signature
      if (error?.message?.includes('User rejected') || error?.code === 4001) {
        return Status.error("User rejected request")
      }

      return Status.error("Failed to verify signature, please try again");

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
      setAuthSession(null);
    }
  }, []);

  return {
    isAuthenticated,
    isLoading,
    isSigningIn,
    session: authSession,
    signIn,
    signOut,
    checkSession,
  };
}

export default useAuth;
