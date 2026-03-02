import utils, { cn } from "@/lib/utils";
import { MintReferralTx } from "@/types/MintReferralTx";
import { ArrowUpRight } from "lucide-react";
import ImageAvatar from "../ImageAvatar";
import { tokenConfig } from "@/config/token";
import { CopyBtn } from "../copyBtn/CopyBtn";

export default function MintReferralTxRow({ data }: { data: MintReferralTx }) {
  
  const minter = data.referredAccount;
  const mintInfo = data.mint;
  //const referrer = data.referrerAccount;
  const amountMinted = Number(mintInfo.amountMinted);
  
  const minterPhotoUrl = utils.getServerImage(minter.photo as string, "profile/photo", "small")
  
  const rankClaimExplorerUrl = utils.getExplorerUrl(mintInfo.networkId, `tx/${data.rankClaimTxSig}`)
  
  const minterAddrUrl = utils.getExplorerUrl(mintInfo.networkId, `address/${minter.address}`)
  
  console.log("")
  
  return (
    <div
      className="group flex flex-col sm:flex-row sm:items-center  justify-between gap-3 p-4  rounded-lg cursor-pointer transition-all duration-300 bg-zinc-900/50 border border-white/5 hover:bg-zinc-800 hover:border-teal-400/20"
    >
      <div className="flex items-center gap-4  min-w-0 flex-1">
        {/* Avatar */}
        <div className="relative shrink-0">
          <ImageAvatar
            src={minterPhotoUrl}
            seed={minter.address}
            radius={0}
            className="rounded w-[42px] h-[42px] object-cover"
            fallbackTextClass="bg-none"
          />
        </div>

        {/* Identity */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="font-semibold text-white text-sm">{minter.username}</div>
            <div className="flex align-middle font-mono text-[10px] px-2 py-1 rounded-md text-zinc-600 bg-zinc-950">
              <div>
                <a href={minterAddrUrl} target="_blank">
                  {utils.maskAddress(minter.address, 6, 6)}
                </a>
              </div>
              <div className="h-4">
                <CopyBtn
                  textToCopy={minter.address}
                  className="p-0 bg-none m-0 text-zinc-600 ms-2 h-4"
                  copiedClassName="p-0 bg-none m-0 text-pink-600 ms-2 h-4"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs mt-0 text-zinc-500">
            <span>{utils.getRelativeDate(data.createdAt)}</span>
            {amountMinted > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                <span className="text-purple-400">
                  {utils.toLocaleString(mintInfo.amountMinted)} ${tokenConfig.symbol}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reward chip + arrow */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="px-4 py-2 rounded-xl bg-teal-400/10 border border-teal-400/20">
          <span className="font-mono font-semibold text-sm text-teal-400">
            +{ data.rewardEarnedUsd }
          </span>
          <span className="text-xs ml-1 text-teal-400/60">USDC</span>
        </div>
        <a href={rankClaimExplorerUrl}
          target="_blank"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 transition-all duration-200 hover:text-white bg-white/10 hover:bg-purple-600"
        >
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
