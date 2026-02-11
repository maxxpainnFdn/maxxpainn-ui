import {
  Shield,
  Loader2,
  Fingerprint,

} from 'lucide-react';


export interface SigningProgressProps {
  signingState: string;
  onCancel: () => void;
  inputBgClass: string
}

export default function SigningProgress({
  signingState,
  onCancel,
  inputBgClass
}: SigningProgressProps ) {

  return (
    <div className="space-y-6 py-4 w-full">
      {/* Animated Icon */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full animate-pulse" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
            {signingState === 'fetching-nonce' && (
              <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
            )}
            {signingState === 'awaiting-signature' && (
              <Fingerprint className="w-10 h-10 text-purple-400 animate-pulse" />
            )}
            {signingState === 'verifying' && (
              <Shield className="w-10 h-10 text-purple-400 animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white">
          {signingState === 'fetching-nonce' && 'Preparing...'}
          {signingState === 'awaiting-signature' && 'Awaiting Signature'}
          {signingState === 'verifying' && 'Verifying...'}
        </h3>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">
          {signingState === 'fetching-nonce' && 'Getting authentication challenge...'}
          {signingState === 'awaiting-signature' && 'Please sign the message in your wallet to verify ownership.'}
          {signingState === 'verifying' && 'Confirming your signature...'}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        <div className={`w-2 h-2 rounded-full transition-colors ${
          signingState === 'fetching-nonce' ? 'bg-purple-500 animate-pulse' : 'bg-purple-500'
        }`} />
        <div className={`w-8 h-0.5 transition-colors ${
          signingState !== 'fetching-nonce' ? 'bg-purple-500' : 'bg-gray-700'
        }`} />
        <div className={`w-2 h-2 rounded-full transition-colors ${
          signingState === 'awaiting-signature' ? 'bg-purple-500 animate-pulse' :
          signingState === 'verifying' ? 'bg-purple-500' : 'bg-gray-700'
        }`} />
        <div className={`w-8 h-0.5 transition-colors ${
          signingState === 'verifying' ? 'bg-purple-500' : 'bg-gray-700'
        }`} />
        <div className={`w-2 h-2 rounded-full transition-colors ${
          signingState === 'verifying' ? 'bg-purple-500 animate-pulse' : 'bg-gray-700'
        }`} />
      </div>

      {/* Cancel Button (only during awaiting-signature) */}
      {signingState === 'awaiting-signature' && (
        <button
          onClick={onCancel}
          className={`
            w-full py-3 rounded-xl font-bold text-sm
            ${inputBgClass} border text-gray-400
            hover:bg-white/5 hover:text-gray-300
            transition-all duration-300
          `}
        >
          Cancel
        </button>
      )}
    </div>
  )
}
