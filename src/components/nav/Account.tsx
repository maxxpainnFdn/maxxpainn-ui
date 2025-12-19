import utils from '@/lib/utils'
import { useWalletAccount } from "@/hooks/useWalletAccount";
import ImageAvatar from "../ImageAvatar";
import { botttsNeutral } from "@dicebear/collection";
import { useWalletCore } from "@/hooks/useWalletCore";
import { Wallet } from "lucide-react";
import Button from '../button/Button';

export default function Account({
  btnProps = {}
}) {
    const account = useWalletAccount()
    const wallet = useWalletCore()

    const isConnecting = ["connecting", "reconnecting"].includes(account.status)
 
    return (
      <div className="relative group w-full">
        {(!wallet.isConnected || isConnecting) ? (
          <Button
            {...btnProps}
            variant="secondary"  
            size="md"
            onClick={() => wallet.openModal()}
            disabled={isConnecting}
            className="px-2 h-12 w-12 sm:w-full sm:px-6 " // Square-ish on mobile
          >  
            <div className="relative flex items-center justify-center gap-2">
              <Wallet className="w-6 h-6 text-purple-300" />
              
              {/* Text only visible on Desktop (sm and up) */}
              <span className="hidden sm:inline">
                {isConnecting ? '...' : 'CONNECT'}
              </span>
            </div>
          </Button>
        ) : (
          <Button
            onClick={() => wallet.openModal("Account")}
             {...btnProps}
            size="md"
            variant="secondary" 
            className="px-2 h-12 w-12 sm:w-full sm:px-6"
          >
            <div className="flex items-center gap-2 sm:gap-3 justify-center">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0">
                <ImageAvatar seed={wallet.address} radius={0} className="w-6 h-6 rounded-md" avatarType={botttsNeutral} />
              </div>
              <span className="hidden xs:inline">{utils.maskAddress(wallet.address)}</span>
            </div>
          </Button>
        )}
      </div>
    )
}