import { ChevronRight, Loader2 } from "lucide-react";

// Wallet Option Card Component
interface WalletOptionCardProps {
  name: string;
  icon: string;
  onClick: () => void;
  isConnecting?: boolean;
  disabled?: boolean;
  detected?: boolean;
}

export default function WalletOptionCard ({
  name,
  icon,
  onClick,
  isConnecting = false,
  disabled = false,
  detected = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-4 p-4
        bg-gray-900/50 border border-white/10 rounded-xl
        hover:bg-gray-800/80 hover:border-purple-500/50
        hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]
        active:scale-[0.98]
        transition-all duration-300 group
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-white/10
        ${isConnecting ? 'border-purple-500/50 bg-purple-500/10' : ''}
      `}
    >
      {/* Wallet Icon */}
      <div className={`
        relative w-12 h-12 rounded-xl
        bg-gradient-to-br from-gray-800 to-gray-900
        border border-white/10
        flex items-center justify-center overflow-hidden
        group-hover:border-purple-500/30
        transition-all duration-300
        ${isConnecting ? 'border-purple-500/50' : ''}
      `}>
        {isConnecting ? (
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
        ) : (
          <img
            src={icon}
            alt={name}
            className="w-7 h-7 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.innerHTML = `
                <div class="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
              `;
            }}
          />
        )}

        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-colors duration-300 rounded-xl" />
      </div>

      {/* Wallet Info */}
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <p className={`
            font-bold transition-colors duration-300
            ${isConnecting ? 'text-purple-300' : 'text-white group-hover:text-purple-300'}
          `}>
            {name}
          </p>
          {detected && !isConnecting && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">
                Ready
              </span>
            </span>
          )}
        </div>
        {isConnecting && (
          <p className="text-xs text-purple-400 mt-1 animate-pulse">
            Connecting...
          </p>
        )}
      </div>

      {/* Arrow */}
      <ChevronRight className={`
        w-5 h-5 transition-all duration-300
        ${isConnecting
          ? 'text-purple-400 opacity-0'
          : 'text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1'
        }
      `} />
    </button>
  );
};
