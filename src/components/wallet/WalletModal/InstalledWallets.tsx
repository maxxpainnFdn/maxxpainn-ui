import { AlertCircle, Zap } from "lucide-react";
import WalletOptionCard from "./WalletOptionCard";
import { WalletReadyState } from "@solana/wallet-adapter-base";

export default function InstalledWallets ({
  wallets,
  onWalletSelect,
  connecting,
  connectingWallet
}) {

  // Categorize wallets
  const installedWallets = wallets.filter(
    (w) => w.readyState === WalletReadyState.Installed || w.readyState === WalletReadyState.Loadable
  );

  let renderedWallets = []

  return (
    <>
      {/* Installed Wallets */}
      {installedWallets.length > 0 && (
        <div className="space-y-3">
          <div className="pb-3 flex items-center gap-2 px-1">
            <Zap className="w-4 h-4 text-green-400" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Available Wallets
            </p>
            <div className="flex-1 h-px bg-gradient-to-r from-green-500/30 to-transparent" />
          </div>

          <div className="space-y-2">
            { installedWallets.map((walletAdapter, idx) => {

              const name = walletAdapter.adapter.name;

              // metamask lists multiple times, so we should check it
              if(renderedWallets.includes(name)) {
                return <span key={idx}></span>
              }

              renderedWallets.push(name)

              return (
                <WalletOptionCard
                  key={idx}
                  name={name}
                  icon={walletAdapter.adapter.icon}
                  onClick={() => onWalletSelect(name)}
                  isConnecting={ connectingWallet === name }
                  disabled={connecting || connectingWallet !== null}
                  detected
                />
              )
            })}
          </div>
        </div>
      )}

      {/* No Wallets Detected */}
      {installedWallets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="relative mb-5">
            <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full" />
            <div className="relative p-5 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl border border-yellow-500/30">
              <AlertCircle className="w-10 h-10 text-yellow-400" />
            </div>
          </div>
          <p className="text-white font-bold text-lg mb-2">No Wallets Detected</p>
          <p className="text-gray-500 text-sm max-w-xs">
            Install a Solana wallet to connect and start your journey
          </p>
        </div>
      )}

    </>
  )
}
