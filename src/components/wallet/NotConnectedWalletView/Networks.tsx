import { Globe } from "lucide-react";
import { currentNetworkAtom, currentNetworkIdAtom } from '@/store'
import { useAtom, useSetAtom } from "jotai";
import { networks } from "@/config/networks";
import { NetworkConfig } from "@/types/NetworkConfig";
import { useEffect, useState } from "react";

export default function Networks({ onSelect }) {
  
  const [_,setCurrentNetworkId] = useAtom(currentNetworkIdAtom);
  
  const handleNetworkSelect = (network: NetworkConfig) => {
    setCurrentNetworkId(network.caipNetworkId)
    onSelect?.(network)
  }
  
  const inputBgClass = "bg-violet-250/10 border-white/10";
  
  return (
    <div className="space-y-3">
      <div className="pb-3 flex items-center gap-2 px-1">
        <Globe className="w-4 h-4 text-green-400" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Select Network
        </p>
        <div className="flex-1 h-px bg-gradient-to-r from-green-500/30 to-transparent" />
      </div>
      { Object.values(networks).map((network) => {

        return (
          <button
            key={network.name}
            onClick={() => handleNetworkSelect(network)}
    
            className={`
              flex items-center gap-4 p-4 w-full
              ${inputBgClass} border rounded-xl
              transition-all duration-300
              hover:border-purple-500/30 hover:bg-white/5 cursor-pointer
              disabled:cursor-not-allowed
            `}
          >
            {/* Network Icon */}
            <div className={`
              w-10 h-10 rounded-xl
              flex items-center justify-center
              ${network.isTestnet
                ? 'bg-yellow-500/20 border border-yellow-500/30'
                : 'bg-green-500/20 border border-green-500/30'
              }
            `}>
              <Globe className={`w-5 h-5 ${network.isTestnet ? 'text-yellow-500' : 'text-green-500'}`} />
            </div>

            {/* Network Info */}
            <div className="flex-1 text-left">
              <p className="text-white font-bold">{network.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {network.isTestnet ? 'Testnet' : 'Mainnet'}
              </p>
            </div>

          </button>
        );
      })}
    </div>
  )
}
