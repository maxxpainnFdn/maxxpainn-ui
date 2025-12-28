import { isAuthenticatedAtom, userAccountInfoAtom } from "@/store"
import { useAtom, useAtomValue } from "jotai"
import { useWalletCore } from "./useWalletCore";
import { useEffect, useState } from "react";
import { useApi } from "./useApi";
import { AccountData } from "@/types/AccountData";

export const useUserAccount = () => {

  const api = useApi()
  const { address } = useWalletCore()
  const [userAccountInfo, setUserAccountInfo] = useAtom(userAccountInfoAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)

  const [isFetchingAccount, setIsFetchingAccount] = useState(false)

  useEffect(()=>{
    if(userAccountInfo == null || address != userAccountInfo.address){
      gettUserAccountInfo()
    }
  }, [address, isAuthenticated])

  const gettUserAccountInfo = async () => {

    setIsFetchingAccount(true)

    const resultStatus = await api.getWithAuth("/account")

    setIsFetchingAccount(false)

    const data = resultStatus.getData() as AccountData

    if(!resultStatus.isError() && data != null){
      setUserAccountInfo(data)
    }
  }

  return {
    userAccountInfo,
    isFetchingAccount,
    gettUserAccountInfo
  }
}
