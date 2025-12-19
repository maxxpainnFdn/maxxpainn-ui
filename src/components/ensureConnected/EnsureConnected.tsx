import { useEffect } from "react"
import { networks } from "@/config/wallet";
import { useWalletCore } from "@/hooks/useWalletCore"
import { useWalletNetwork } from "@/hooks/useWalletNetwork";
import Button from "../button/Button";


const EnsureConnected = ({ 
    network=null,
    children = <></>,
    className = "",
    ...props
}) => {

    const { openModal, isConnected } = useWalletCore()
    const  walletNetwork  = useWalletNetwork()

    const switchChain = async (network) => {
        walletNetwork.switchNetwork(network)
    }
    return (
        <>
            { isConnected ?
                <>
                    {(network == null || network == walletNetwork.caipNetwork == network) ? 
                        <>{children}</> :
                        <div className={`m-4 py-5 flex align-middle items-center justify-center ${className}`}>
                            <Button variant="secondary"  size="lg" onClick={switchChain}>
                                Swicth to {networks["solana-devnet"].name}
                            </Button>
                        </div>
                    }
                </>
            :
                <div className={`m-4 py-4 flex align-middle items-center  justify-center  ${className}`}>
                    <Button variant="secondary" size="lg" onClick={ e => openModal() }>
                        Connect Wallet
                    </Button>
                </div>
            }
        </>
    )
}

export default EnsureConnected