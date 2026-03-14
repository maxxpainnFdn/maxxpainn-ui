import utils, { cn } from "@/lib/utils";
import { PayoutHistory } from "@/types/PayoutHistory";
import { ArrowUpRight, Clock, Calendar, CheckCircle2, ExternalLink } from "lucide-react";

export default function PayoutHistoryItem({ data }: { data: PayoutHistory }) {
  
  const status = data.status.toLowerCase()
  const recipientExplorerUrl = utils.getAccountExplorerUrl(data.networkId, data.recipient)
  const sigExplorerUrl = (status !== "completed") ? "" : utils.getExplorerUrl(data.networkId, `tx/${data.signature}`)

  return (
    <div key={data.id} className="group p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Left: Icon & Date */}
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center border",
          status === 'completed' 
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
            : "bg-amber-500/10 border-amber-500/20 text-amber-500"
        )}>
          {status === 'completed' ? <ArrowUpRight size={18} /> : <Clock size={18} />}
        </div>
        <div>
          <div className="text-white font-semibold flex items-center gap-2">
            <a href={recipientExplorerUrl} target="_blank">{ utils.maskAddress(data.recipient, 8, 6) }</a>
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-zinc-400 font-mono uppercase">
              { data.settlementCurrency }
            </span>
          </div>
          <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
            <Calendar size={10} /> {(new Date(data.createdAt)).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Right: Amount & Status */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        <div className="text-left sm:text-right">
          <div className="text-lg font-bold text-white font-mono">
            -${Number(data.rewardAmount).toFixed(2)}
          </div>
          { status == "completed" && (
            <div className="flex items-center justify-end gap-1 text-[10px] uppercase text-zinc-500 font-mono">
              {data.settlementAmount} {data.settlementCurrency}
            </div>
          )}
        </div>

        <div className="text-right min-w-[100px]">
          {status === 'completed' ? (
            <a href={sigExplorerUrl}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" /> Paid
               <ExternalLink className="opacity-50 w-4 h-4" />
             </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-medium animate-pulse">
               <Clock size={12} /> Processing
            </span>
          )}
        </div>
      </div>

    </div>
  )
}
