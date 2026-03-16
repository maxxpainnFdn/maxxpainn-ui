// hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { useWalletCore } from '@/hooks/useWalletCore';
import { useNetwork } from '@/hooks/useNetwork';
import  { authService } from '@/core/AuthService';
import { AuthNonce, SessionData, SessionWithAccountData } from '@/types/Auth';
import bs58 from 'bs58';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { authSessionInfoAtom, isAuthenticatedAtom, userAccountInfoAtom } from '@/store';
import authConfig from '@/config/auth';
import { Status } from '@/core/Status';
import http from "@/core/HttpClient"
import utils from '@/lib/utils';
import { AccountData } from '@/types/AccountData';

interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  isSigningIn: boolean;
  session: SessionData | null;
  signIn: () => Promise<Status>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<Status>;
}

export function useAuth(): UseAuthReturn {

    const {
        isConnected,
        address,
        signMessage,
        wallet,
        networkId,
        openModal
    } = useWalletCore();
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [authSession, setAuthSession] = useAtom(authSessionInfoAtom)
    const [userAccountInfo, setUserAccountInfo] = useAtom(userAccountInfoAtom)
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
        const sessKey = utils.uuidFromSeed(address)
        sessions[sessKey] = sessionData
        localStorage.setItem(authConfig.sessionStorageKey, JSON.stringify(sessions))
    }


    const initialize = () => {

      if (!isConnected || address == null) return;
  
      let sessions = getSessions()
      
      const sessKey = utils.uuidFromSeed(address)
      
      let session = sessions[sessKey] || null
      
      if (!session) {
        //console.log("Session not found")
        setAuthSession(null)
        openModal()
        return;
      }
      
      getUserAccountInfo()

      setAuthSession(sessions[sessKey])
    }
    
    useEffect(() => { initialize() }, []);
    
    useEffect(()=> {
        initialize()
    }, [isConnected, address])
    

  // Listen for wallet disconnect
  useEffect(() => {

    wallet?.adapter?.on("disconnect", ()=>{
      setAuthSession(null);
    })

    //return () => {
    //  wallet?.adapter?.off("disconnect");
    //}
  }, []);

  const   buildSignMessage =(
    address:    string,
    nonce:      string,
    chainId:    string,
    timestamp:  number,
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
      `Timestamp: ${timestamp}`,
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
    
        const accountAddress = address;
        const chainId = networkId;
    
        const nonceStatus = await http.post("/auth/nonce", { accountAddress, chainId })
    
        //console.log("nonceStatus===>", nonceStatus)
    
        if(nonceStatus.isError()){
          return Status.error(`Nonce Error: ${nonceStatus.getMessage()}`)
        }
    
        const nonce = nonceStatus.getData() as string;
    
        const timestamp = Date.now()
    
        // 2. Build the message
        const message = buildSignMessage(
            address,
            nonce,
            chainId,
            timestamp
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
    
        const resultStatus = await http.post("/auth/verify", formData)
    
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

        //console.error('Sign in failed:', error);
    
        // User rejected the signature
        if (error?.message?.includes('User rejected') || error?.code === 4001) {
            return Status.error("User rejected request")
        }
    
        return Status.error("Failed to verify signature, please try again");

    } finally {
        setIsSigningIn(false);
    }
  }, [isConnected, address, signMessage]);


  // get access token
  const getAccessToken = async (): Promise<Status> => {

    if(!isAuthenticated || authSession == null){
      return Status.error("login required")
    }

    //lets check if the the auth session has expired, if it has, lets refresh it first
    const now = Date.now() - 5_000

    if(authSession.accessTokenExpiryMs > now){
      return Status.successData(authSession.accessToken)
    }

    //const chainId = currentNetwork.chainId;
    const accountAddress = address;

    let refreshStatus = await http.post("/auth/refresh", { accountAddress, chainId: networkId })

    if(refreshStatus.isError()){
      return refreshStatus
    }

    //lets update the new accessToken
    let authData = refreshStatus.getData() as SessionData | null;
    
    if (!authData || authData == null) {
      setAuthSession(null)
      return Status.error("login required");
    }

    if(authData.isAuthenticated){

      // set active session globally
      setAuthSession(authData);

      // update the session pool
      updateSessions(address, authData)
    }

    return Status.successData(authData.accessToken)
  }
  
  const getUserAccountInfo = async (): Promise<AccountData | null> => {
    
    if (!isAuthenticated) {
      setUserAccountInfo(null)
      return null;
    }
    
    if (userAccountInfo != null) {
      return userAccountInfo
    }
      
    const accessTokenStatus = await getAccessToken()
    
    if (!accessTokenStatus) {
      setUserAccountInfo(null)
      return null
    }

    if (accessTokenStatus.isError()) {
      setUserAccountInfo(null)
      return null
    }

    const accessToken = accessTokenStatus.getData() as string;

    const headers = { "Authorization": `Bearer ${accessToken}`,}

    const userInfoStatus = await http.get("/account", {}, headers);
    
    if (userInfoStatus.isError()) {
      setUserAccountInfo(null)
      return null
    }
    
    const data = userInfoStatus.getData() as AccountData | null
    setUserAccountInfo(data)
    
    return data
  }

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
    getUserAccountInfo,
    signIn,
    signOut,
    getAccessToken
  };
}

export default useAuth;
