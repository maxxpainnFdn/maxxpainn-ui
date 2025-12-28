// components/wallet/ConnectedWalletContent.tsx
import { CopyBtn } from "@/components/copyBtn/CopyBtn";
import toast from "@/hooks/toast";
import { useWalletCore } from "@/hooks/useWalletCore";
import { useWeb3 } from "@/hooks/useWeb3";
import utils from "@/lib/utils";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  ArrowUpRight,
  Coins,
  Loader2,
  Power,
  RefreshCw,
  Globe,
  ChevronRight,
  Wallet,
  User,
  EyeClosed
} from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { NetworkConfig } from "@/types/NetworkConfig";
import UserAccountCard from "./UserAccountCard";
import BalanceCard from "./BalanceCard";

export interface UserInfo {
  username?: string;
  displayName?: string;
  avatar?: string;
  isVerified?: boolean;
  email?: string;
}

export interface ConnectedWalletContentProps {
  setModalOpen?: (val: boolean) => void;
  currentNetwork: NetworkConfig;
  onNetworkClick: () => void;
  onAccountSettings?: () => void;
}

export default function ConnectedWalletContent({
  setModalOpen,
  currentNetwork,
  onNetworkClick,
  onAccountSettings
}: ConnectedWalletContentProps) {

  const { disconnect, address: fullAddress, publicKey: addressPubKey, wallet } = useWalletCore();

  const [disconnecting, setDisconnecting] = useState(false);


  // Handle disconnect
  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);
      await disconnect();
      setModalOpen?.(false);
      toast.success('Wallet disconnected');
    } catch (error) {
      utils.logError('Failed to disconnect:', error);
      toast.error('Failed to disconnect wallet');
    } finally {
      setDisconnecting(false);
    }
  }

  // View on explorer
  const viewOnExplorer = useCallback(() => {
    if (!fullAddress) return;
    const explorerBase = currentNetwork.explorer || 'https://solscan.io';
    const url = explorerBase.includes('?')
      ? `${explorerBase.split('?')[0]}/account/${fullAddress}?${explorerBase.split('?')[1]}`
      : `${explorerBase}/account/${fullAddress}`;
    window.open(url, '_blank');
  }, [fullAddress, currentNetwork]);


  const inputBgClass = "bg-gray-900/50 border-white/10";

  return (
    <div className="space-y-4 py-2">

      <UserAccountCard
        inputBgClass={inputBgClass}
        setModalOpen={setModalOpen}
      />

      {/* Wallet & Address Card */}
      <div className={`${inputBgClass} rounded-xl p-4 border hover:border-purple-500/30 transition-all duration-300`}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Wallet className="w-3 h-3" />
            Wallet
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Wallet Icon */}
          {wallet?.adapter?.icon ? (
            <img
              src={wallet.adapter.icon}
              alt={wallet.adapter.name}
              className="w-8 h-8 rounded-lg"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500" />
          )}

          {/* Wallet Name & Address */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm">
              {wallet?.adapter?.name || 'Wallet'}
            </p>
            <p className="text-gray-500 font-mono text-xs truncate">
              {fullAddress}
            </p>
          </div>

          <div className="flex gap-x-2">
            {/* Copy Button */}
            <CopyBtn
              textToCopy={fullAddress}
              className="p-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400"
              copiedClassName="p-2 px-3 bg-green-500/20 rounded-lg text-green-500"
            />
            <button
              onClick={viewOnExplorer}
              className={`p-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg`}
            >
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Network Card - Clickable */}
      <button
        onClick={onNetworkClick}
        className={`
          ${inputBgClass} rounded-xl p-4 border w-full text-left
          hover:border-purple-500/30 transition-all duration-300 group
        `}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Globe className="w-3 h-3" />
            Network
          </p>
          <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
        </div>
        <div className="flex items-center gap-3">
          <div className={`
            w-2.5 h-2.5 rounded-full
            ${currentNetwork.isTestnet ? 'bg-yellow-500' : 'bg-green-500'}
          `} />
          <span className="text-white font-bold">{currentNetwork.displayName}</span>
          {currentNetwork.isTestnet && (
            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded-full">
              Testnet
            </span>
          )}
        </div>
      </button>

      {/* Balance Card */}
      <div className={`${inputBgClass} rounded-xl p-4 border hover:border-purple-500/30 transition-all duration-300`}>
        <BalanceCard />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={()=> { setModalOpen(false) }}
          className={`
            flex items-center justify-center gap-2 px-4 py-3.5
            ${inputBgClass} border rounded-xl
            hover:bg-purple-500/10 hover:border-purple-500/50
            transition-all duration-300 group
          `}
        >
          <EyeClosed className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
          <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
            Close
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
  );
}
