import { NetworkConfig } from "@/types/NetworkConfig";
import { AlertCircle, Globe } from "lucide-react";

export interface UnsupportedNetworkCardProps {
  currentNetwork: NetworkConfig;
  inputBgClass: string;
  onCancel: () => void;
  onNetworkSwitch: () => void;
}

export default function UnsupportedNetworkCard({
  currentNetwork,
  inputBgClass,
  onCancel,
  onNetworkSwitch
}: UnsupportedNetworkCardProps){
  return (
    <div className="space-y-6 py-4">
      {/* Warning Icon */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white">Unsupported Network</h3>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">
          Please switch to a supported network to continue signing in.
        </p>
      </div>

      {/* Current Network */}
      <div className={`${inputBgClass} rounded-xl p-4 border border-yellow-500/30`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <Globe className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">Current Network</p>
            <p className="text-white font-bold">{currentNetwork.displayName}</p>
          </div>
          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
            Unsupported
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className={`
            flex-1 py-3.5 rounded-xl font-bold text-sm
            ${inputBgClass} border text-gray-300
            hover:bg-white/5 hover:border-white/20
            transition-all duration-300
          `}
        >
          Cancel
        </button>
        <button
          onClick={onNetworkSwitch}
          className="
            flex-1 py-3.5 rounded-xl font-bold text-sm
            bg-gradient-to-r from-purple-600 to-pink-600
            hover:from-purple-500 hover:to-pink-500
            text-white shadow-lg shadow-purple-500/25
            transition-all duration-300
          "
        >
          Switch Network
        </button>
      </div>
    </div>
  )
}
