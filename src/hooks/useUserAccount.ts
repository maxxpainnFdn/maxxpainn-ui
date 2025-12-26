import { isAuthenticatedAtom, userAccountInfoAtom } from "@/store"
import { useAtom, useAtomValue } from "jotai"
import { useEffect } from "node_modules/react-resizable-panels/dist/declarations/src/vendor/react";
import { useWalletCore } from "./useWalletCore";
import { useState } from "react";
import { useApi } from "./useApi";

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
    const resultStatus = await api.get("/account")
  }


}
