import { useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Info, Wallet } from "lucide-react";
import Modal from "../modal/Modal";
// Assuming you have a standard class merger like clsx/tailwind-merge. 
// If not, you can replace cn() with standard template literals.
import utils, { cn } from "@/lib/utils"; 
import { rewardsConfig } from "@/config/rewards_config";
import { useWalletCore } from "@/hooks/useWalletCore";
import { getNetworkById } from "@/config/networks";
import { useApi } from "@/hooks/useApi";
import toast from "@/hooks/toast";
import Button from "../button/Button";

// Renamed slightly to append "Props" to avoid naming conflicts in some TS setups
export interface EarningsWithdrawalModalProps {
  clanId: number;
  amount: number;
}

export default function EarningsWithdrawalModal({ 
  clanId,
  amount 
}: EarningsWithdrawalModalProps) {
  
  const { address: accountAddr, isConnected } = useWalletCore()
  const api = useApi()
  
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- Configuration & Mock Data ---
  const cashoutFee = rewardsConfig.cashoutFeeUsd; 
  const destNetworkInfo = getNetworkById(rewardsConfig.cashoutNetwork)
  
  const isEligible = amount >= rewardsConfig.minCashoutThresholdUsd;
  const finalAmount = Math.max(0, amount - cashoutFee);
  
  const handleConfirm = async () => {
    
    if (!isEligible) return;
    setIsProcessing(true);
    
    const resultStatus = await api.postWithAuth(`/clans/${clanId}/enable-cashout`)
    
    setIsProcessing(false);

    if (resultStatus.isError()) {
      toast.error(resultStatus.getMessage())
      return;
    }
    
    setIsSuccess(true)
    toast.success("Cashout enabled, withdrawal pending.")
  };

  return (
    <>
      <div className="">
        <button 
          onClick={() => setDialogOpen(true)}
          className="px-6 py-3 rounded-lg bg-teal-400 text-teal-950 font-semibold hover:bg-teal-300 transition-colors"
        >
          Withdraw Earnings
        </button>
      </div>
      <Modal
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
        title="Confirm Cashout"
        desktopClass="w-full max-w-md" // Adjusted width for a better prompt appearance
        description="Review your transaction details before confirming."
        desktopDialogProps={{
          onOpenAutoFocus: (e) => e.preventDefault(),
        }}
      >
        <div className="space-y-6 pt-2">
          
          {/* Amount Display */}
          <div className="flex flex-col items-center justify-center p-6 bg-zinc-900/80 rounded-2xl border border-white/5">
            <span className="text-sm text-zinc-400 mb-1">Available Balance</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">{amount.toFixed(2)}</span>
              <span className="text-zinc-500 font-medium">USDC</span>
            </div>
          </div>

          {/* Threshold Warning Box */}
          {!isEligible && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-pink-700/90 border border-pink-500/20 text-pink-200">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Minimum threshold not met</p>
                <p className="text-pink-200/90">
                  You need at least {rewardsConfig.minCashoutThresholdUsd} USDC to process a withdrawal. 
                  Keep earning to unlock!
                </p>
              </div>
            </div>
          )}

          {/* Transaction Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <Wallet className="w-4 h-4 text-zinc-400" />
              Transfer Details
            </h4>
            
            <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Connected Wallet</span>
                <span className="font-mono text-zinc-200 bg-zinc-800 px-2 py-1 rounded-md">
                  <a href={utils.getAccountExplorerUrl(rewardsConfig.cashoutNetwork,accountAddr)}
                    target="_blank"
                  >
                    {utils.maskAddress(accountAddr, 4, 6)}
                  </a>
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Network</span>
                <span className="text-zinc-200">{destNetworkInfo.name}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-1">
                  Network Fee
                  <Info className="w-3.5 h-3.5 text-zinc-600" />
                </span>
                <span className="text-zinc-200">
                  {cashoutFee.toFixed(2)} USDC
                </span>
              </div>

              <div className="h-px w-full bg-white/5 my-2" />

              <div className="flex items-center justify-between font-medium">
                <span className="text-zinc-300">Minimum Output</span>
                <span className={cn(
                  "text-base", 
                  isEligible ? "text-teal-400" : "text-zinc-500"
                )}>
                  {isEligible ? finalAmount.toFixed(2) : "0.00"} USDC
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setDialogOpen(false)}
              disabled={isProcessing || isSuccess}
              className="flex-1 px-4 py-3 rounded-xl font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <Button
              onClick={handleConfirm}
              disabled={!isEligible || isProcessing || isSuccess}
              loading={isProcessing}
              loadingText="Processing..."
              variant="secondary"
              className={cn(
                "flex-1 px-4 py-3 rounded-xl border-0 font-semibold flex items-center justify-center gap-2 transition-all",
                !isEligible 
                  ? "bg-zinc-800 text-zinc-600 hover:text-zinc-600 cursor-not-allowed" 
                  : isSuccess
                    ? "bg-emerald-500 text-white"
                    : "bg-teal-400 text-teal-950 hover:text-teal-950 hover:bg-teal-300"
              )}
            >
              Confirm
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
