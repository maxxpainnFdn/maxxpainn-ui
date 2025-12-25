import { Check } from "lucide-react";

export default function SigningSuccess(){
  return  (
    <div className="space-y-6 py-8">
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
            <Check className="w-10 h-10 text-green-500" />
          </div>
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white">Successfully Signed In</h3>
        <p className="text-gray-400 text-sm">
          Your session has been verified.
        </p>
      </div>
    </div>
  );
}
