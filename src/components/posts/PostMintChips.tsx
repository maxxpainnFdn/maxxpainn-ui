import { Coins, Timer } from "lucide-react";

const fmtDay = d => d >= 365 ? `${(d / 365).toFixed(1)}y` : d >= 30 ? `${Math.round(d / 30)}mo` : `${d}d`;

/* ── Mint chips — pain stories only ── */
const PostMintChips = ({ amount, waitDays }) => (
  <div className="flex gap-2 flex-wrap">
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-maxx-pink/30 bg-maxx-pink/8 font-mono text-xs text-maxx-pinkLt font-bold">
      <Coins className="w-3.5 h-3.5 text-maxx-pink" />
      {amount} minted
    </div>
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-maxx-violet/30 bg-maxx-violet/10 font-mono text-xs text-maxx-violetLt font-bold">
      <Timer className="w-3.5 h-3.5 text-maxx-violet" />
      {fmtDay(waitDays)} wait
    </div>
  </div>
);

export default PostMintChips;
