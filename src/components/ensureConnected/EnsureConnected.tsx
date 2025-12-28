import { ReactNode, useEffect } from "react"
import { useWalletCore } from "@/hooks/useWalletCore"
import Button from "../button/Button";
import useNetwork from "@/hooks/useNetwork";
import { getNetworkById } from "@/config/networks";

export interface EnsureConnected {
  networkId: string | null;
  className: string;
  children: ReactNode | any;
}

const EnsureConnected = ({
    networkId=null,
    children = <></>,
    className = "",
    ...props
}) => {

    const { openModal, isConnected } = useWalletCore()
    const { currentNetworkId, switchNetwork } = useNetwork()

    const handleSwitchNetwork = () => {
      switchNetwork(networkId)
    }
    return (
        <>
          { isConnected ?
              <>
                  {(networkId == null || networkId == currentNetworkId) ? (
                     <>{children}</>
                  ) : (
                      <div className={`m-4 py-5 flex align-middle items-center justify-center ${className}`}>
                          <Button variant="secondary"  size="lg" onClick={handleSwitchNetwork}>
                              Swicth to {getNetworkById(networkId).name}
                          </Button>
                      </div>
                  )}
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
