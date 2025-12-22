import { CopyBtn } from "@/components/copyBtn/CopyBtn";
import toast from "@/hooks/toast";
import { useWalletCore } from "@/hooks/useWalletCore";
import { useWeb3 } from "@/hooks/useWeb3";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ArrowUpRight, Coins, Loader2, Power, RefreshCw, User } from "lucide-react";
import { useCallback, useState, useEffect } from "react";

export default function WalletContent() {

  const web3Core = useWeb3()
  const { disconnect, address: fullAddress, publicKey: addressPubKey } = useWalletCore()

  const connection = useConnection()
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [nativeBalance, setNativeBalance] = useState(null)
  const [disconnecting, setDisconnecting] = useState(false)

  // Fetch balance
  const fetchBalanceCore = async () => {

    if (!fullAddress || !connection){
      setNativeBalance(null)
      return;
    }

    setLoadingBalance(true);

    let balanceStatus = await web3Core.getNativeBalance(addressPubKey)

    setLoadingBalance(false);

    if(balanceStatus.isError()){
      setNativeBalance(null)
      return;
    }

    let balance = balanceStatus.getData().balance;

    setNativeBalance(balance)
  };


  useEffect(()=>{
    fetchBalanceCore()
  }, [])

  const fetchBalance = useCallback(fetchBalanceCore,  [fullAddress, connection])

  // Handle disconnect
  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      setNativeBalance(null);
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect:', error);
      toast.error('Failed to disconnect wallet');
    }
  }, [disconnect]);

  // View on explorer
  const viewOnExplorer = useCallback(() => {
    if (!fullAddress) return;
    window.open(`https://solscan.io/account/${fullAddress}`, '_blank');
  }, [fullAddress]);

  const inputBgClass = "bg-gray-900/50 border-white/10";

  return (
    <div>
      <div className="flex-1 py-2 space-y-5">
        {/* Address Card */}
        <div className={`${inputBgClass} rounded-xl p-4 border group hover:border-purple-500/30 transition-all duration-300`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <User className="w-3 h-3" />
              Address
            </p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-white font-mono text-sm truncate flex-1 select-all">
              {fullAddress}
            </p>
            <CopyBtn
              textToCopy={fullAddress}
              className="p-2 bg-none text-white"
              copiedClassName="p-2 bg-none text-green-600"
            />
          </div>
        </div>
      </div>
      {/* Balance Card */}
      <div className={`${inputBgClass} rounded-xl p-4 border group hover:border-purple-500/30 transition-all duration-300`}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Coins className="w-3 h-3" />
            Balance
          </p>
          <button
            onClick={fetchBalance}
            disabled={loadingBalance}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-300 group/refresh disabled:opacity-50"
            title="Refresh balance"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gray-400 group-hover/refresh:text-purple-400 transition-colors ${loadingBalance ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="flex items-baseline gap-2">
          {loadingBalance ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
              <span className="text-gray-400">Fetching...</span>
            </div>
          ) : nativeBalance !== null ? (
            <>
              <span className="text-4xl font-black text-white tracking-tight">
                {nativeBalance.toFixed(4)}
              </span>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                SOL
              </span>
            </>
          ) : (
            <span className="text-gray-400">Unable to fetch</span>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <button
          onClick={viewOnExplorer}
          className={`
            flex items-center justify-center gap-2 px-4 py-3.5
            ${inputBgClass} border rounded-xl
            hover:bg-purple-500/10 hover:border-purple-500/50
            transition-all duration-300 group
          `}
        >
          <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
          <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
            View Explorer
          </span>
        </button>

        <button
          onClick={handleDisconnect}
          disabled={disconnecting}
          className={`
            flex items-center justify-center gap-2 px-4 py-3.5
            bg-red-500/10 border border-red-500/30 rounded-xl
            hover:bg-red-500/20 hover:border-red-500/50
            transition-all duration-300 group
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {disconnecting ? (
            <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
          ) : (
            <Power className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors" />
          )}
          <span className="text-sm font-bold text-red-400 group-hover:text-red-300 transition-colors">
            Disconnect
          </span>
        </button>
      </div>

    </div>
  )
}
