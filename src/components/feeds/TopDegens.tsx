import { BadgeCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function TopDegens() {
  
  const [data, setData] = useState([])
  
  useEffect(() => {
    setData([
      { username: "0xwhisper",       rank: 7,    tw: "text-maxx-pink"    },
      { username: "clan_voidwalker",  rank: 88,   tw: "text-maxx-violet"  },
      { username: "degen_rex",        rank: 420,  tw: "text-maxx-violetLt"},
      { username: "patience_maxi",    rank: 1337, tw: "text-maxx-mid"     },
    ])
  },[])
  
  return (
    <div className="bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-5 relative overflow-hidden overflow-y-auto h-[300px]">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-maxx-violet/50 via-maxx-pink/20 to-transparent" />
      <div className="eyebrow mb-4"><span className="eyebrow-dot" />Top Degens</div>
      <div className="space-y-3">
        { data.map(({ username, rank, tw }) => (
          <div key={username} className="flex items-center gap-2.5 group cursor-pointer hover:translate-x-0.5 transition-transform">
            <div className="w-8 h-8 rounded-full bg-grad-btn flex items-center justify-center font-mono font-black text-xs text-maxx-white flex-shrink-0">
              {username.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm font-bold text-maxx-bright truncate group-hover:text-maxx-violetLt transition-colors">
                @{username}
              </p>
              <p className={`font-mono text-xs ${tw}`}>Rank #{rank}</p>
            </div>
            <BadgeCheck className="w-3.5 h-3.5 text-maxx-pink flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
