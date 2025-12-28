// components/wallet/NetworkSelectContent.tsx
import { useState } from 'react';
import { NetworkConfig } from '@/types/NetworkConfig';
import {
  Globe,
  Check,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import utils from '@/lib/utils';
import toast from '@/hooks/toast';
import useNetwork from '@/hooks/useNetwork';

export interface NetworkSelectContentProps {
  onBack: () => void;
  onNetworkChange: () => void;
  setModalOpen?: (val: boolean) => void;
}

export default function NetworkSelectContent({
  onBack,
  onNetworkChange,
}: NetworkSelectContentProps) {

  const { currentNetwork, networks, switchNetwork } = useNetwork()

  const [switching, setSwitching] = useState<string | null>(null);


  const handleNetworkSelect = async (network: NetworkConfig) => {

    //if (network.name === currentNetwork.name) return;

    setSwitching(network.name);

    switchNetwork(network.caipNetworkId)

    // Small delay for UX feedback
    await utils.sleep(500)

    toast.success(`Switched to ${network.displayName}`);

    onNetworkChange?.();
    setSwitching(null);
  };

  const inputBgClass = "bg-gray-900/50 border-white/10";

  return (
    <div className="space-y-4 py-2">

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors -mt-1 mb-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Wallet</span>
      </button>

      {/* Current Network Display */}
      <div className={`${inputBgClass} rounded-xl p-4 border`}>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
          Current Network
        </p>
        <div className="flex items-center gap-3">
          <div className={`
            w-3 h-3 rounded-full
            ${ currentNetwork.isTestnet
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }
          `} />
          <span className="text-white font-bold">
            {currentNetwork.displayName}
          </span>
          {currentNetwork.isTestnet  && (
            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded-full">
              Testnet
            </span>
          )}
        </div>
      </div>

      {/* Network List */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">
          Available Networks
        </p>

        { Object.values(networks).map((network) => {

          const isSelected = currentNetwork.name === network.name;
          const isSwitching = switching === network.name;

          return (
            <button
              key={network.name}
              onClick={() => handleNetworkSelect(network)}
              disabled={isSelected || switching !== null}
              className={`
                flex items-center gap-4 p-4 w-full
                ${inputBgClass} border rounded-xl
                transition-all duration-300
                ${isSelected
                  ? 'border-purple-500/50 bg-purple-500/10 cursor-default'
                  : 'hover:border-purple-500/30 hover:bg-white/5 cursor-pointer'
                }
                disabled:cursor-not-allowed
                ${switching !== null && !isSwitching ? 'opacity-50' : ''}
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
                <p className="text-white font-bold">{network.displayName}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {network.isTestnet ? 'Test Network' : 'Production Network'}
                </p>
              </div>

              {/* Status Indicator */}
              {isSwitching ? (
                <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
              ) : isSelected ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-purple-400 font-bold">Active</span>
                  <Check className="w-5 h-5 text-purple-400" />
                </div>
              ) : (
                <div className={`
                  w-3 h-3 rounded-full
                  ${network.isTestnet ? 'bg-yellow-500/50' : 'bg-green-500/50'}
                `} />
              )}
            </button>
          );
        })}
      </div>

      {/* Info Note */}
      <div className="flex items-start gap-3 p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
        <Globe className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-400 leading-relaxed">
          Switching networks will update your connection. Ensure you're on the correct network before making transactions.
        </p>
      </div>
    </div>
  );
}
