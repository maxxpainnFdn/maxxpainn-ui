import { Shield } from "lucide-react";

export default function WalletSecurityWarning() {
  return (
    <>
      {/* Security Notice */}
      <div className="flex items-start gap-3 p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
        <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Only connect to trusted applications. Your wallet will prompt you to approve the connection.
          </p>
        </div>
      </div>
    </>
  )
}
