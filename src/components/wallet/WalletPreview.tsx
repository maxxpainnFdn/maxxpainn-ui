// components/wallet/WalletPreview.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Wallet,
  ChevronDown,
  Copy,
  ExternalLink,
  LogOut,
  Check,
  Loader2,
  AlertCircle,
  Zap,
  RefreshCw,
  Eye,
  Monitor,
  Sparkles,
  Download,
  Shield,
  ChevronRight,
  User,
  Coins,
  ArrowUpRight,
  Power,
  Globe,
  Smartphone,
  Settings
} from 'lucide-react';
import Button from '@/components/button/Button';

// Mock wallet data
const MOCK_WALLETS_INSTALLED = [
  { name: 'Phantom', detected: true },
  { name: 'Solflare', detected: true },
];

const MOCK_WALLETS_NOT_INSTALLED = [
  { name: 'Backpack' },
  { name: 'Coinbase Wallet' },
  { name: 'Trust Wallet' },
  { name: 'Ledger' },
];

const MOCK_ADDRESS = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
const MOCK_BALANCE = 42.6969;

const WalletPreview: React.FC = () => {
  const [activePreview, setActivePreview] = useState<'select' | 'account' | 'states'>('select');
  const [mockConnecting, setMockConnecting] = useState(false);
  const [mockConnected, setMockConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [showMoreWallets, setShowMoreWallets] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);

  const inputBgClass = "bg-gray-900/50 border-white/10";
  const formattedAddress = `${MOCK_ADDRESS.slice(0, 4)}...${MOCK_ADDRESS.slice(-4)}`;

  const simulateConnect = (walletName: string) => {
    setConnectingWallet(walletName);
    setTimeout(() => {
      setConnectingWallet(null);
      setMockConnected(true);
    }, 2000);
  };

  const simulateCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulateRefresh = () => {
    setLoadingBalance(true);
    setTimeout(() => setLoadingBalance(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900/20 p-4 md:p-8">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-black">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Custom Wallet
              </span>{' '}
              <span className="text-pink-600">UI</span>
            </h1>
            <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />
          </div>
          <p className="text-gray-400 text-lg">
            Interactive preview of the custom Solana wallet adapter
          </p>
        </div>

        {/* Preview Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { id: 'select', label: 'Wallet Select', icon: Wallet },
            { id: 'account', label: 'Account Modal', icon: Eye },
            { id: 'states', label: 'Button States', icon: Monitor },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActivePreview(id as any)}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm
                transition-all duration-300
                ${activePreview === id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-gray-900/50 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/50'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-8">

          {/* Wallet Selection Modal */}
          {activePreview === 'select' && (
            <div className="flex justify-center">
              <div className="w-full max-w-[480px] bg-gray-900/95 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="relative p-6 pb-4 border-b border-white/5 bg-black/20">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600" />
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                      <div className="p-2.5 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30 shadow-lg shadow-purple-500/10">
                        <Wallet className="w-6 h-6 text-purple-400" />
                      </div>
                      Connect Wallet
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 mt-1">
                      Select your preferred Solana wallet to continue
                    </DialogDescription>
                  </DialogHeader>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                  {/* Installed Wallets */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                      <Zap className="w-4 h-4 text-green-400" />
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Available Wallets
                      </p>
                      <div className="flex-1 h-px bg-gradient-to-r from-green-500/30 to-transparent" />
                    </div>

                    <div className="space-y-2">
                      {MOCK_WALLETS_INSTALLED.map((wallet) => (
                        <button
                          key={wallet.name}
                          onClick={() => simulateConnect(wallet.name)}
                          disabled={connectingWallet !== null}
                          className={`
                            w-full flex items-center gap-4 p-4
                            bg-gray-900/50 border border-white/10 rounded-xl
                            hover:bg-gray-800/80 hover:border-purple-500/50
                            hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]
                            active:scale-[0.98]
                            transition-all duration-300 group
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${connectingWallet === wallet.name ? 'border-purple-500/50 bg-purple-500/10' : ''}
                          `}
                        >
                          <div className={`
                            relative w-12 h-12 rounded-xl
                            bg-gradient-to-br from-gray-800 to-gray-900
                            border border-white/10
                            flex items-center justify-center
                            group-hover:border-purple-500/30
                            transition-all duration-300
                            ${connectingWallet === wallet.name ? 'border-purple-500/50' : ''}
                          `}>
                            {connectingWallet === wallet.name ? (
                              <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                            )}
                          </div>

                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <p className={`font-bold transition-colors ${connectingWallet === wallet.name ? 'text-purple-300' : 'text-white group-hover:text-purple-300'}`}>
                                {wallet.name}
                              </p>
                              {wallet.detected && connectingWallet !== wallet.name && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded-full">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">
                                    Ready
                                  </span>
                                </span>
                              )}
                            </div>
                            {connectingWallet === wallet.name && (
                              <p className="text-xs text-purple-400 mt-1 animate-pulse">
                                Connecting...
                              </p>
                            )}
                          </div>

                          <ChevronRight className={`
                            w-5 h-5 transition-all duration-300
                            ${connectingWallet === wallet.name
                              ? 'text-purple-400 opacity-0'
                              : 'text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1'
                            }
                          `} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* More Wallets */}
                  <Collapsible open={showMoreWallets} onOpenChange={setShowMoreWallets}>
                    <CollapsibleTrigger asChild>
                      <button
                        className={`
                          w-full flex items-center justify-between p-4
                          ${inputBgClass} border rounded-xl
                          hover:bg-gray-800/60 hover:border-purple-500/30
                          transition-all duration-300 group
                        `}
                      >
                        <span className="flex items-center gap-3">
                          <Download className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                          <span className="text-sm font-semibold text-gray-400 group-hover:text-gray-300 transition-colors">
                            More Wallets
                          </span>
                          <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">
                            {MOCK_WALLETS_NOT_INSTALLED.length}
                          </span>
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${showMoreWallets ? 'rotate-180' : ''}`} />
                      </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="pt-3 space-y-2 animate-in slide-in-from-top-2">
                      {MOCK_WALLETS_NOT_INSTALLED.map((wallet) => (
                        <div
                          key={wallet.name}
                          className="flex items-center gap-4 p-4 bg-gray-900/30 border border-white/5 rounded-xl hover:border-white/10 transition-all duration-300 group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gray-800/80 border border-white/10 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 opacity-60" />
                          </div>

                          <div className="flex-1">
                            <p className="font-semibold text-gray-400 group-hover:text-gray-300 transition-colors text-sm">
                              {wallet.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1 text-gray-600">
                                <Globe className="w-3 h-3" />
                                <span className="text-[10px]">Browser</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <Smartphone className="w-3 h-3" />
                                <span className="text-[10px]">Mobile</span>
                              </div>
                            </div>
                          </div>

                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 text-xs font-semibold hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
                            <Download className="w-3 h-3" />
                            Install
                          </button>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Security Notice */}
                  <div className="flex items-start gap-3 p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                    <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Only connect to trusted applications. Your wallet will prompt you to approve the connection.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 bg-black/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <span className="text-xs text-gray-500">Powered by Solana</span>
                    </div>
                    <a
                      href="#"
                      className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <span>Explore Wallets</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Modal */}
          {activePreview === 'account' && (
            <div className="flex justify-center">
              <div className="w-full max-w-[420px] bg-gray-900/95 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="relative p-6 pb-5 border-b border-white/5 bg-black/20">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600" />

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center shadow-lg">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-gray-900 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        </div>
                      </div>

                      <div>
                        <p className="text-xl font-black text-white tracking-tight">
                          Phantom
                        </p>
                        <p className="text-gray-500 text-sm mt-0.5">
                          Connected
                        </p>
                      </div>
                    </div>

                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Settings className="w-4 h-4 text-gray-500 hover:text-gray-300" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                  {/* Address */}
                  <div className={`${inputBgClass} rounded-xl p-4 border group hover:border-purple-500/30 transition-all duration-300`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <User className="w-3 h-3" />
                        Address
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-white font-mono text-sm truncate flex-1">
                        {MOCK_ADDRESS}
                      </p>
                      <button
                        onClick={simulateCopy}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 group/copy"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400 group-hover/copy:text-purple-400 transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Balance */}
                  <div className={`${inputBgClass} rounded-xl p-4 border group hover:border-purple-500/30 transition-all duration-300`}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Coins className="w-3 h-3" />
                        Balance
                      </p>
                      <button
                        onClick={simulateRefresh}
                        disabled={loadingBalance}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-300 group/refresh disabled:opacity-50"
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
                      ) : (
                        <>
                          <span className="text-4xl font-black text-white tracking-tight">
                            {MOCK_BALANCE.toFixed(4)}
                          </span>
                          <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            SOL
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
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
                      className="
                        flex items-center justify-center gap-2 px-4 py-3.5
                        bg-red-500/10 border border-red-500/30 rounded-xl
                        hover:bg-red-500/20 hover:border-red-500/50
                        transition-all duration-300 group
                      "
                    >
                      <Power className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors" />
                      <span className="text-sm font-bold text-red-400 group-hover:text-red-300 transition-colors">
                        Disconnect
                      </span>
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/5 bg-black/20">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-gray-500">Connected to Solana Mainnet</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Button States */}
          {activePreview === 'states' && (
            <div className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <Monitor className="w-5 h-5 text-purple-400" />
                </div>
                Button States
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Disconnected */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Disconnected
                  </p>
                  <div className="bg-black/30 rounded-xl p-6 border border-white/5 flex justify-center min-h-[100px] items-center">
                    <Button
                      variant="primary"
                      size="md"
                      className="shadow-lg shadow-purple-500/20"
                    >
                      <Wallet className="w-5 h-5 mr-2" />
                      Connect Wallet
                    </Button>
                  </div>
                </div>

                {/* Connecting */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Connecting
                  </p>
                  <div className="bg-black/30 rounded-xl p-6 border border-white/5 flex justify-center min-h-[100px] items-center">
                    <Button
                      variant="primary"
                      size="md"
                      disabled
                      className="shadow-lg shadow-purple-500/20"
                    >
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Connecting...
                    </Button>
                  </div>
                </div>

                {/* Connected */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Connected
                  </p>
                  <div className="bg-black/30 rounded-xl p-6 border border-white/5 flex justify-center min-h-[100px] items-center">
                    <button
                      className="
                        flex items-center gap-3 px-4 py-2.5
                        bg-gradient-to-r from-gray-900/90 to-gray-800/90
                        backdrop-blur-sm
                        border border-purple-500/30
                        rounded-xl
                        hover:border-purple-500/60
                        hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]
                        transition-all duration-300
                        group
                      "
                    >
                      <div className="relative">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 border border-gray-900" />
                      </div>
                      <span className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                        {formattedAddress}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-all group-hover:rotate-180 duration-300" />
                    </button>
                  </div>
                </div>

                {/* Status Indicators */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Status Indicators
                  </p>
                  <div className="bg-black/30 rounded-xl p-6 border border-white/5 min-h-[100px] space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500" />
                      <span className="text-sm text-gray-500">Disconnected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                      <span className="text-sm text-gray-400">Connecting...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm text-green-400">Connected</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error States */}
              <div className="mt-8 pt-8 border-t border-white/5">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  Error States
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-red-400 font-semibold text-sm">Connection failed. Please try again.</p>
                      <button className="text-red-400/70 text-xs mt-1 hover:text-red-300 transition-colors">
                        Dismiss
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center py-6 text-center bg-black/30 rounded-xl border border-white/5">
                    <div className="p-3 bg-yellow-500/10 rounded-full mb-3">
                      <AlertCircle className="w-6 h-6 text-yellow-400" />
                    </div>
                    <p className="text-white font-bold text-sm mb-1">No Wallets Detected</p>
                    <p className="text-gray-500 text-xs">
                      Install a Solana wallet to continue
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-gray-500 text-sm">
            Custom Solana Wallet Adapter UI • Built for{' '}
            <span className="text-purple-400 font-bold">MAXXPAINN</span>
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <div className="w-2 h-2 rounded-full bg-pink-500"></div>
            <div className="w-2 h-2 rounded-full bg-pink-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPreview;
