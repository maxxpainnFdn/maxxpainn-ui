import { Lock, ShieldCheck } from "lucide-react";
import OrbitalTimer from "../OrbitalTimer";
import utils from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/button/Button";
import { useStaking } from "@/hooks/useStaking";
import toast from "@/hooks/toast";
import { useAlertDialog } from "@/hooks/useAlertDialog";
import { stakingConfig } from "@/config/staking";
import { UserStakeInfo } from "@/types/UserStakeInfo";

export interface UnstakeProps {
  hasActiveStake: boolean;
  userStakeInfo: UserStakeInfo;
  rewards: number;
  onUnstakingSuccess: () => void | undefined
}

export default function Unstake({
  hasActiveStake,
  userStakeInfo,
  rewards,
  onUnstakingSuccess
}) {
  
  const alertDialog = useAlertDialog()
  const stakingCore = useStaking()
  const [unstaking, setUstaking] = useState(false)
  
  const canUnstake = useMemo(() => (userStakeInfo && (new Date) >= userStakeInfo.unlockDate), [userStakeInfo]);
  const totalValue = useMemo(() => ((!userStakeInfo) ? 0 : Number(userStakeInfo.amountFormatted) + rewards), [userStakeInfo]);
  
  const unstakeToken = async (isEmergency: boolean) => {
    
    if (isEmergency) {
      const confirm = await alertDialog.confirm(
        "Force Unstake? ",
        ` Forcing an unstake will deduct and burn ${stakingConfig.earlyUnstakePenalty}% of your principal. 
        All accrued rewards will be permanently forfeited.
        `
      )
      
      if (!confirm) {
        toast.error("User cancelled action")
        return;
      }
    }
    
    setUstaking(true)
    toast.loading("Unstaking...")
    
    const resultStatus = await stakingCore.unstakeTokens(isEmergency)
    
    setUstaking(false)
    toast.dismiss()
    
    if (resultStatus.isError()) {
      toast.error(resultStatus.getMessage())
      return;
    }
    
    onUnstakingSuccess?.();
  }
  
 
  
  return (
    <div className=" mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
      {!hasActiveStake ? (
         <div className="text-center py-20 opacity-50">
            <Lock className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-bold text-white">No Active Stakes</h3>
         </div>
      ) : (
         <div className=" p-2 md:p-4 pb-0 relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/20">
                    <ShieldCheck className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-white">Active Position</h3>
                     <div className="text-sm text-green-400 font-bold flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> { canUnstake ? "Unlocked" : "Earning Rewards"}
                     </div>
                  </div>
               </div>

               {/* ORBITAL TIMER REPLACING TEXT */}
               <div className="flex-1 w-full">
                 <OrbitalTimer lockedDate={userStakeInfo.lockedDate} targetDate={userStakeInfo.unlockDate} />
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-xs text-gray-500 uppercase mb-1">Principal</div>
                <div className="text-xl font-bold text-white">{utils.toLocaleString(userStakeInfo.amountFormatted)}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-xs text-gray-500 uppercase mb-1">Yield</div>
                <div className="text-xl font-bold text-white">{ Number(userStakeInfo.yield).toFixed(2) }%</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-xs text-gray-500 uppercase mb-1">Earned</div>
                <div className="text-xl font-bold text-green-400">+{ utils.toLocaleString(rewards) }</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-xs text-gray-500 uppercase mb-1">Total Value</div>
                <div className="text-xl font-bold text-white">{ utils.toLocaleString(totalValue) }</div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant={ canUnstake  ? "success" : "ghost"}
                disabled={!canUnstake}
                fullWidth
                className="flex-1"
                size="lg"
                loading={unstaking}
                onClick={() => unstakeToken(false) }
              >
                {canUnstake ? 'CLAIM & UNSTAKE' : 'LOCKED'}
              </Button>
              {!canUnstake &&
                <Button
                  variant="danger"
                  size="lg"
                  loading={unstaking}
                  onClick={() => unstakeToken(true) }
                >
                  FORCE UNSTAKE
                </Button>
              }
            </div>
         </div>
      )}
    </div>
  )
}
