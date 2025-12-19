import { useEffect, useState } from "react";
import { useAppKit, useAppKitProvider, Views } from "@reown/appkit/react";
import type { Provider } from '@reown/appkit-adapter-solana/react'
import { ChainNamespace } from "@reown/appkit/networks";

export const useWalletCore = () => {

    const { walletProvider } = useAppKitProvider<Provider>('solana')
    const { open, close } = useAppKit();


    const [address, setAddress] = useState(null)
    const [publicKey, setPublicKey] = useState(null)
    const [isConnected, setConnected] = useState(false);
    const [networkName, setNetworkName] = useState(null)
    const [networkInfo, setNetworkInfo] = useState(null)
    

    useEffect(()=> {

        if(!walletProvider) return; 

        initialize();

        walletProvider.on("connect", () => initialize(true))

        walletProvider.on("disconnect", () => {
            setConnected(false)
            setNetworkInfo(null)
            setAddress(null)
        })

        walletProvider.on("accountsChanged", () => {
            console.log("Account Changed")
            initialize()
        });

        walletProvider.on("chainChanged", () => initialize());

        return () => {
            walletProvider.removeListener("accountsChanged", ()=>{});
            walletProvider.removeListener("chainChanged", ()=>{});
            walletProvider.removeListener("connect", ()=>{})
            walletProvider.removeListener("disconnect", ()=>{})
        }
    }, [walletProvider])

    const initialize = (_isConnected: boolean | undefined | null = null) => {

        if(!walletProvider) return;

       // walletProvider.connect({ chainId: "solana:C7PPtqrayTxjudYFNtv2hbWcU6SzEgvGjoZer4eAxv4V" }).then(r => console.log("result===>",r));


        //@ts-ignore
        let chainInfo = walletProvider.getActiveChain();
        let addr = walletProvider.publicKey.toBase58();

        if(!_isConnected) {
            _isConnected = (chainInfo && typeof addr != 'undefined')
        }

        setConnected(_isConnected)
        setAddress(addr)
        setNetworkInfo(chainInfo)
        setNetworkName(chainInfo?.network)
        setPublicKey(walletProvider.publicKey)
    }

      const openModal = (
        view: Views = "Connect",
        namespace: ChainNamespace = "solana"
      ) => {
        return open({ view, namespace })
      }

    return {
        address,
        networkInfo,
        networkName,
        isConnected,
        publicKey,
        openModal,
        closeModal: close
    }
}