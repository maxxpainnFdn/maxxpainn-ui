import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { AppKitNetwork } from "@reown/appkit/networks";
import { projectId, metadata, networks } from "@/config/wallet";
import { DefaultSIWX, InformalMessenger } from "@reown/appkit-siwx"
import app from "@/config/app"
import { SolanaAuthVerifier } from "./auth/SolanaAuthVerifier";
import { AuthStorage } from "./auth/AuthStorage";
import AuthCore from "./auth/AuthCore";
import AuthGuard from "./AuthGuard";
import EventBus from "@/core/EventBus";
import { useEffect, useState } from "react";

// Initialize AppKit outside component to ensure it's created only once
const solanaWeb3JsAdapter = new SolanaAdapter();

const networksArr = Object.values(networks) as [AppKitNetwork, ...AppKitNetwork[]];

const modal = createAppKit({
    adapters: [solanaWeb3JsAdapter],
    networks: networksArr,
    metadata: metadata,
    themeMode: "dark",
    projectId,
    features: {
        analytics: true,
    },
    siwx: new DefaultSIWX({
          messenger: new InformalMessenger({
                domain: app.domain,
                uri:  app.url,
                getNonce: AuthCore.getNonce
            }),
        verifiers: [ new SolanaAuthVerifier() ],
        storage: new AuthStorage()
    }),
});

export default function Wallet({ children }){
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Subscribe to events once
        const unsubscribe = modal.subscribeEvents((event) => {
            const evtName = event.data.event 
            
            if(evtName == "DISCONNECT_SUCCESS"){
                EventBus.emit("WALLET_DISCONNECTED")
                AuthCore.doLogout();
            }

            if(evtName == "CONNECT_SUCCESS"){
                EventBus.emit("WALLET_CONNECTED")
            }
        });

        // Mark as ready after a brief delay to ensure context is available
        setTimeout(() => setIsReady(true), 0);

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    if (!isReady) {
        return <>{children}</>;
    }

    return (<AuthGuard>{children}</AuthGuard>);
}
