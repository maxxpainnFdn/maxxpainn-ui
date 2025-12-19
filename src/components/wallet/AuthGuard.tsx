import { useAppKitProvider } from '@reown/appkit/react'
import { useEffect, useRef, useState } from 'react'
import { useWalletCore } from '@/hooks/useWalletCore';
import { AuthStorage } from './auth/AuthStorage';
import toast from '@/hooks/toast';

export default function AuthGuard({ children }){

    const wallet = useWalletCore()

    const prevAddr = useRef(null)
    const prevNet = useRef(null)

    const authStorage = new AuthStorage()


    useEffect(()=>{
        processAuth().finally(()=> {
            prevAddr.current = wallet.address
            prevNet.current = (!wallet.networkInfo) ? null : wallet.networkInfo.network;
        })
    }, [wallet.address, wallet.networkInfo])

    const processAuth = async () => {

                console.log("Heyyyy !!!!!!!")

        if(!wallet.address || !wallet.networkInfo || !wallet.isConnected) return;
        if(prevAddr.current == null) return;

        // @ts-ignore
        if(prevAddr.current == wallet.address && prevNet.current == wallet.networkInfo.network){
            return;
        }


        let caipNetworkId = wallet.networkInfo.caipNetworkId;

        toast.loading("Authenticating user")

        //lets authenticate user
        let sessionsArr = await authStorage.get(caipNetworkId, wallet.address)

        toast.dismiss()

        if(sessionsArr.length == 0){
            toast.error("Session expired, relogin")
            window.location.reload()
        }

    }

    return (
        <div>{children}</div>
    )
    
}