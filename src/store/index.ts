import { defaultNetwork, getNetworkById, networks } from '@/config/networks'
import walletConfig from '@/config/wallet'
import { AccountData } from '@/types/AccountData'
import { SessionData } from '@/types/Auth'
import { NetworkConfig } from '@/types/NetworkConfig'
import { atom, PrimitiveAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils';

export const currentNetworkIdAtom = atomWithStorage<string>( walletConfig.networkStorageKey, defaultNetwork.caipNetworkId)

export const currentNetworkAtom = atom<NetworkConfig>((get)=>{
  const networkName = get(currentNetworkIdAtom)
  return getNetworkById(networkName);
})

// auth session info
export const authSessionInfoAtom = atom<SessionData | null>(null) as  PrimitiveAtom<SessionData | null>

export const isAuthenticatedAtom = atom((get)=>{
  const sessInfo = get(authSessionInfoAtom)
  return (sessInfo == null) ? false : sessInfo.isAuthenticated;
})


// user Account info
export const userAccountInfoAtom = atom<AccountData | null>(null) as  PrimitiveAtom<AccountData | null>
