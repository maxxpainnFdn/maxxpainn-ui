/**
 * MAXXPAINN — Account / Wallet Button
 *
 * Uses the Button component with btn-s (secondary) variant.
 * clip-edges from globals.css for the avatar badge.
 */

import utils from '@/lib/utils';
import ImageAvatar from "../ImageAvatar";
import { botttsNeutral } from "@dicebear/collection";
import { useWalletCore } from "@/hooks/useWalletCore";
import { Wallet } from "lucide-react";
import Button from '../button/Button';

export default function Account({ btnProps = {} }) {
  const {
    isConnected,
    isConnecting,
    openModal,
    address = "",
  } = useWalletCore();

  return (
    <div className="relative w-full md:w-auto">

      {/* ── NOT CONNECTED ── */}
      {(!isConnected || isConnecting) ? (
        <Button
          {...btnProps}
          variant="secondary"
          fullWidth
          onClick={() => openModal()}
          disabled={isConnecting}
          className="justify-center"
        >
          <Wallet
            size={16}
            className={isConnecting ? "text-purple-400/50 animate-pulse" : "text-purple-400"}
          />
          <span className="hidden sm:inline-block text-[0.82rem] tracking-[0.06em] uppercase">
            {isConnecting ? "..." : "CONNECT"}
          </span>
        </Button>

      ) : (

        /* ── CONNECTED ── */
        <Button
          {...btnProps}
          variant="secondary"
          fullWidth
          onClick={() => openModal()}
          className="h-12 !px-2 sm:!px-4 justify-center"
        >
          {/* avatar badge */}
          <div className="w-[22px] h-[22px] flex-shrink-0 overflow-hidden shadow-lg">
            <ImageAvatar
              seed={address}
              radius={2}
              className="w-[22px] h-[22px] rounded"
              avatarType={botttsNeutral}
            />
          </div>

          {/* masked address */}
          <span>
            {utils.maskAddress(address)}
          </span>
        </Button>
      )}

    </div>
  );
}
