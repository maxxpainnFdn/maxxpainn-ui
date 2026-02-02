import { UserStakeInfo } from "@/types/UserStakeInfo";
import { AlertTriangle } from "lucide-react";

export interface UserStakeInfoColProps {
  badge: any;
  userStakeInfo: UserStakeInfo;
}

export default function UserStakeInfoCol({
  badge,
  userStakeInfo,
}: UserStakeInfoColProps) {

  
  //console.log("userStakeInfo===>", userStakeInfo)

  return (
    <div className="lg:col-span-5 space-y-6">
      <div
        className={`rounded-3xl border ${badge.border} bg-black/20 p-8 relative overflow-hidden`}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">{badge.icon}</div>
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Rank
              </div>
              <div className={`text-3xl font-black ${badge.color}`}>
                {badge.label}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-gray-400 font-medium">Staking Term</span>
              <span className="text-white font-bold font-mono">
                {userStakeInfo.termDays} Days
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-gray-400 font-medium">Unlock Date</span>
              <span className="text-purple-300 font-bold font-mono">
                { userStakeInfo.unlockDate.toLocaleString() }
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-2xl p-4 flex gap-4 items-start">
        <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
        <div>
          <h4 className="text-yellow-500 font-bold mb-1">Top Up Warning</h4>
          <p className="text-xs text-yellow-500/80 leading-relaxed">
            Adding to your position will add the new amount to your existing
            stake. The unlock date will be adjusted.
          </p>
        </div>
      </div>
    </div>
  );
}
