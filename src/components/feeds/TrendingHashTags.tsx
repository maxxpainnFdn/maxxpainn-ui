import utils from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"

export default function TrendingHashTags() {
  
  const [hashTags, setHashTags] = useState<object[]>([])
  
  useEffect(() => {
    setHashTags([
      { tag: "5year", count: 21000 },
      { tag: "diamondhands", count: 1800 },
      { tag: "nem", count: 1400 },
      { tag: "clanwars", count: 987 },
      { tag: "freemint", count: 854 },
      { tag: "rugsurvivors", count: 712 },
    ])
  }, [])
  
  return (
    <div className="bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-maxx-violet/40 via-maxx-pink/25 to-transparent" />
      <div className="eyebrow mb-3"><span className="eyebrow-dot" />Trending</div>
      {hashTags.map((item, i) => (
        <div
          key={item.tag}
          className="flex items-center justify-between py-2.5 border-b border-maxx-violet/10 last:border-0 cursor-pointer group hover:translate-x-0.5 transition-transform"
        >
          <div>
            <p className="font-mono text-xs text-maxx-dim">#{i + 1} trending</p>
            <p className="font-mono text-sm font-bold text-maxx-bright group-hover:text-maxx-violetLt transition-colors">
              #{item.tag}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs text-maxx-sub">{utils.toShortNumber(item.count)}</span>
            <ChevronRight className="w-3 h-3 text-maxx-sub group-hover:text-maxx-violet transition-colors" />
          </div>
        </div>
      ))}
    </div>
  )
}
