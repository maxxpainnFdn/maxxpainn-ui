import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { ChevronDown, Download } from "lucide-react";
import { useCallback, useState } from "react";
import WalletInstallCard from "./WalletInstalledCard";

export default function NotInstalledWallets ({
  wallets
}) {

  const inputBgClass = "bg-gray-900/50 border-white/10";

  const notInstalledWallets = []
  const installedWallets = []

  for (const w of wallets) {
    if (w.readyState === WalletReadyState.NotDetected) {
      notInstalledWallets.push(w)
    } else if (w.readyState === WalletReadyState.Installed || w.readyState === WalletReadyState.Loadable) {
      installedWallets.push(w)
    }
  }

  const [showMoreWallets, setShowMoreWallets] = useState(false);

  // Handle install redirect
  const handleInstallWallet = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);


  return (
    <>
      {notInstalledWallets.length > 0 && (
        <Collapsible open={showMoreWallets} onOpenChange={setShowMoreWallets}>
          <CollapsibleTrigger asChild>
            <button
              className={`
                w-full flex items-center justify-between p-4
                ${inputBgClass} border rounded-xl
                hover:bg-gray-800/60 hover:border-purple-500/30
                transition-all duration-300 group
              `}
            >
              <span className="flex items-center gap-3">
                <Download className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                <span className="text-sm font-semibold text-gray-400 group-hover:text-gray-300 transition-colors">
                  {installedWallets.length > 0 ? 'More Wallets' : 'Get a Wallet'}
                </span>
                <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">
                  {notInstalledWallets.length}
                </span>
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${showMoreWallets ? 'rotate-180' : ''}`} />
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="pt-3 space-y-2 animate-in slide-in-from-top-2">
            {notInstalledWallets.map((walletAdapter) => (
              <WalletInstallCard
                key={walletAdapter.adapter.name}
                name={walletAdapter.adapter.name}
                icon={walletAdapter.adapter.icon}
                url={walletAdapter.adapter.url}
                onInstall={() => handleInstallWallet(walletAdapter.adapter.url)}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </>
  )

}
