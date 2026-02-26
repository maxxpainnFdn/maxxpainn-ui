import { Flame, Sparkles, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

export default function FeedFilter({ onSort }) {
  
  const [sortBy, setSort] = useState("new")
  
  useEffect(() => {
    onSort?.(sortBy)
  }, [sortBy])
  
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-0.5 bg-maxx-bg1/80 border border-maxx-violet/15 rounded-lg p-1">
        {[["hot", "Hot", Flame], ["new", "New", Sparkles], ["top", "Top", Trophy]].map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setSort(id)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-mono text-sm uppercase tracking-wider transition-all ${sortBy === id
                ? "bg-maxx-violet/20 text-maxx-white"
                : "text-maxx-sub hover:text-maxx-bright"
              }`}
          >
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>
    </div>
  )
}
