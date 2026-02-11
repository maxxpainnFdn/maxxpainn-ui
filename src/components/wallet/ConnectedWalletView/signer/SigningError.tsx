import { RefreshCw, X } from "lucide-react";

export interface SigningErrorProps {
  error: string;
  onCancel: () => void;
  onRetry: () => void;
  inputBgClass: string
}

export default function SigningError({
  error,
  onRetry,
  onCancel,
  inputBgClass
}: SigningErrorProps) {
  return (
    <div className="space-y-6 py-4 w-full">
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center">
            <X className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white">Sign In Failed</h3>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">
          {error}
        </p>
      </div>

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
          onClick={onRetry}
          className="
            flex-1 py-3.5 rounded-xl font-bold text-sm
            bg-gradient-to-r from-purple-600 to-pink-600
            hover:from-purple-500 hover:to-pink-500
            text-white shadow-lg shadow-purple-500/25
            transition-all duration-300 flex items-center justify-center gap-2
          "
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}
