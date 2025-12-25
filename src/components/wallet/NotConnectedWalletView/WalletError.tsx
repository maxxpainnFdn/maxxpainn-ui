import { AlertCircle } from "lucide-react";

export default function WalletError({ error, setError }: { error: string, setError: (val) => void }) {
  return (
    <>
      {error && (
        <div className="mb-4 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-400 font-semibold text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-400/70 text-xs mt-1 hover:text-red-300 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  )
}
