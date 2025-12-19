import { useAppKitAccount } from "@reown/appkit/react";

export const useWalletAccount = () => {
    const account = useAppKitAccount()
    return account;
}