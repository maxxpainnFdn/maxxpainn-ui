import { Download, Globe, Smartphone } from "lucide-react";

// Wallet Install Card Component
interface WalletInstallCardProps {
  name: string;
  icon: string;
  url: string;
  onInstall: () => void;
}

export default function WalletInstallCard ({
  name,
  icon,
  url,
  onInstall,
}: WalletInstallCardProps){

  // Determine platform icons based on wallet
  const getPlatformIcons = (walletName: string) => {
    const platforms = [];

    // Most wallets have browser extensions
    platforms.push({ icon: Globe, label: 'Browser' });

    // Most popular wallets have mobile apps
    if (['Phantom', 'Solflare', 'Trust Wallet', 'Backpack', 'Coinbase Wallet'].includes(walletName)) {
      platforms.push({ icon: Smartphone, label: 'Mobile' });
    }

    return platforms;
  };

  const platforms = getPlatformIcons(name);

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-900/30 border border-white/5 rounded-xl hover:border-white/10 transition-all duration-300 group">
      {/* Wallet Icon */}
      <div className="w-10 h-10 rounded-lg bg-gray-800/80 border border-white/10 flex items-center justify-center overflow-hidden">
        <img
          src={icon}
          alt={name}
          className="w-6 h-6 object-contain opacity-60 group-hover:opacity-100 transition-opacity"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      {/* Wallet Info */}
      <div className="flex-1">
        <p className="font-semibold text-gray-400 group-hover:text-gray-300 transition-colors text-sm">
          {name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {platforms.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1 text-gray-600">
              <Icon className="w-3 h-3" />
              <span className="text-[10px]">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Install Button */}
      <button
        onClick={onInstall}
        className="
          flex items-center gap-1.5 px-3 py-1.5
          bg-purple-500/10 border border-purple-500/30 rounded-lg
          text-purple-400 text-xs font-semibold
          hover:bg-purple-500/20 hover:border-purple-500/50
          transition-all duration-300
        "
      >
        <Download className="w-3 h-3" />
        Install
      </button>
    </div>
  );
};
