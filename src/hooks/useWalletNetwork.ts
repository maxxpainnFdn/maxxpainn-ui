import { useAppKitNetwork } from "@reown/appkit/react";

export const useWalletNetwork = () => {
    const network = useAppKitNetwork()
    return network;
}