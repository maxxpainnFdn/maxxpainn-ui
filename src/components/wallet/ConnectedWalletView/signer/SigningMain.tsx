import { ArrowRight, Clock, FileText, Fingerprint, Globe, Shield, Sparkles, Zap } from "lucide-react";
import authConfig from '@/config/auth';
import { NetworkConfig } from "@/types/NetworkConfig";
import { useWalletCore } from "@/hooks/useWalletCore";
import utils from "@/lib/utils";
import Button from "@/components/button/Button";

export interface SigningProgressProps {
  currentNetwork: NetworkConfig;
  isSigningIn: boolean;
  onSignIn: () => void;
  onCancel: () => void;
  inputBgClass: string;
}

export default function SigningMain({
  currentNetwork,
  inputBgClass,
  isSigningIn,
  onSignIn,
  onCancel
}) {

  const { address, wallet } = useWalletCore();

  return (
    <div className="space-y-5 pt-2 pb-10">

      {/* App Identity Header */}
      <div className="flex flex-col items-center text-center space-y-3">

        <div>
          <h3 className="text-lg font-bold text-white">{authConfig.appName}</h3>
          <p className="text-xs text-gray-500">{authConfig.appDomain}</p>
        </div>
      </div>

      {/* Connection Arrow */}
      <div className="flex items-center justify-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-700" />
        <div className="p-2 rounded-full bg-gray-800 border border-gray-700">
          <Zap className="w-4 h-4 text-gray-500" />
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-700" />
      </div>

      {/* Wallet Info */}
      <div className={`${inputBgClass} rounded-xl p-4 border`}>
        <div className="flex items-center gap-3">
          {wallet?.adapter?.icon ? (
            <img
              src={wallet.adapter.icon}
              alt=""
              className="w-10 h-10 rounded-xl"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-medium">Connected Wallet</p>
            <p className="text-white font-bold truncate">{utils.maskAddress(address || '', 6, 4)}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-500 font-medium">Connected</span>
          </div>
        </div>
      </div>

      {/* Network Info */}
      <div className={`${inputBgClass} rounded-xl p-4 border`}>
        <div className="flex items-center gap-3">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            ${currentNetwork.isTestnet
              ? 'bg-yellow-500/20 border border-yellow-500/30'
              : 'bg-green-500/20 border border-green-500/30'
            }
          `}>
            <Globe className={`w-5 h-5 ${currentNetwork.isTestnet ? 'text-yellow-500' : 'text-green-500'}`} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">Network</p>
            <p className="text-white font-bold">{currentNetwork.displayName}</p>
          </div>
          {currentNetwork.isTestnet && (
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded-full">
              Testnet
            </span>
          )}
        </div>
      </div>

      {/* Message Preview */}
      <div className={`${inputBgClass} rounded-xl p-4 border space-y-3`}>
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Message to Sign
          </p>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          {authConfig.statement}
        </p>
      </div>

      {/* Security Notice */}
      <div className="pb-5">
        <div className="flex items-start gap-3 p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl">
          <Shield className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 leading-relaxed">
            This signature proves wallet ownership without any blockchain transaction.
            Your private keys never leave your wallet.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="absolute left-0 bottom-0 w-full bg-gray-900 flex gap-3 p-2">
        <Button
          onClick={onCancel}
          variant="secondary"
          fullWidth
        >
          Cancel
        </Button>
        <Button
          onClick={onSignIn}
          disabled={isSigningIn}
          variant="primary"
          fullWidth
        >
          <Fingerprint className="w-4 h-4" />
          Sign In
        </Button>
      </div>
    </div>
  )
}
