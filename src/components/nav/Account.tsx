import utils from '@/lib/utils'
import ImageAvatar from "../ImageAvatar";
import { botttsNeutral } from "@dicebear/collection";
import { useWalletCore } from "@/hooks/useWalletCore";
import { Wallet } from "lucide-react";
import Button from '../button/Button';

export default function Account({
  btnProps = {}
}) {

    const {
      isConnected,
      isConnecting,
      openModal,
      address
    } = useWalletCore()

    return (
      <div className="relative group w-full">
        {(!isConnected || isConnecting) ? (
          <Button
            {...btnProps}
            variant="secondary"
            size="md"
            onClick={() => openModal()}
            disabled={isConnecting}
            className="px-2 h-12 w-12 sm:w-full sm:px-6  hover:scale-100 active:scale-100" // Square-ish on mobile
          >
            <div className="relative flex items-center justify-center gap-2">
              <Wallet className="w-6 h-6 text-purple-300" />

              <span className="hidden sm:inline">
                {isConnecting ? '...' : 'CONNECT'}
              </span>
            </div>
          </Button>
        ) : (
          <Button
            onClick={() => openModal() }
             {...btnProps}
            size="md"
            variant="secondary"
            className="px-2 h-12 w-12 sm:w-full sm:px-6 hover:scale-100 active:scale-100"
          >
            <div className="flex items-center gap-2 sm:gap-3 justify-center">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0">
                <ImageAvatar seed={address} radius={0} className="w-6 h-6 rounded-md" avatarType={botttsNeutral} />
              </div>
              <span className="">{utils.maskAddress(address)}</span>
            </div>
          </Button>
        )}
      </div>
    )
}
