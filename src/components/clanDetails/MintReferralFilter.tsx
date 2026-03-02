import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export interface MintReferralFilterProps {
  onChange: (v: string) => void;
}

export default function MintReferralFilter({ onChange }: MintReferralFilterProps) {
  
  const filters =  ["all", "today", "week", "month"]
  const [filter, setFilter] = useState<"all" | "today" | "week">("all");
  
  useEffect(() => {
    onChange?.(filter);
  },[filter])
  
  return (
    <div className="flex gap-1 p-1 rounded-xl bg-zinc-950">
      {filters.map(f => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-medium transition-all",
            filter === f
              ? "bg-zinc-800 text-white"
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  )
}
