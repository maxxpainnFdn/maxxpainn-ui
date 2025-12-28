import { CopyBtn } from "@/components/copyBtn/CopyBtn"
import LoadingView from "@/components/loadingView/LoadingView"
import { useWalletCore } from "@/hooks/useWalletCore"
import { useWeb3 } from "@/hooks/useWeb3";
import { useConnection } from "@solana/wallet-adapter-react";
import { Coins, RefreshCw, Wallet } from "lucide-react"
import { useEffect, useState } from "react";

export default function BalanceCard() {

  const web3Core = useWeb3();
  const { connection } = useConnection()
  const { publicKey, isConnected } = useWalletCore()

  const [nativeBalance, setNativeBalance] = useState(null)
  const [isLoading, setLoading] = useState(false)

  // Fetch balance
  const fetchBalance = async () => {

    if (!publicKey || !connection) {
      setNativeBalance(null);
      return;
    }

    setLoading(true);

    const balanceStatus = await web3Core.getNativeBalance(publicKey);

    setLoading(false);

    if (balanceStatus.isError()) {
      setNativeBalance(null);
      return;
    }

    const balance = balanceStatus.getData().balance;
    setNativeBalance(balance);
  };

  useEffect(() => {
    fetchBalance();
  }, [ publicKey, connection, isConnected]);


  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <Coins className="w-3 h-3" />
          Balance
        </p>
        <button
          onClick={fetchBalance}
          disabled={isLoading}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-300 disabled:opacity-50"
          title="Refresh balance"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-gray-400 hover:text-purple-400 transition-colors ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <LoadingView loading={isLoading}>
        { nativeBalance !== null ? (
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white tracking-tight">
              {nativeBalance.toFixed(4)}
            </span>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              SOL
            </span>
          </div>
        ) : (
          <span className="text-gray-400">Unable to fetch</span>
        )}
      </LoadingView>
    </>
  )
}
