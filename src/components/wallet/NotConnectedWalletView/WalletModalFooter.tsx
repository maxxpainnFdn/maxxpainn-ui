import { ExternalLink, Sparkles } from "lucide-react";

export default function WalletModalFooter() {
  return (
    <div className="p-4 w-full border-t border-white/5 bg-black/20 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-xs text-gray-500">Powered by Solana</span>
        </div>
        <a
          href="https://solana.com/ecosystem/explore?categories=wallet"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors"
        >
          <span>Explore Wallets</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
