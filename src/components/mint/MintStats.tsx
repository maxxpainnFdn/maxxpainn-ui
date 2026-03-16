import { Info, Shield, Target, TrendingUp, Zap } from "lucide-react"
import Popover from "../popover/Popover"
import utils from "@/lib/utils"
import { StatsCard } from "../StatsCard"

export default function ClaimRankStats({ stats }) {

    const statsMeta = {
        globalRank:     { 
          title: "Global Rank",
          color: 'ice',
          icon: Target
        },
        eam:   { 
            title: "EAM",
            color: 'gold',
            icon: Zap
        },
        mintDifficulty: { 
            title:   "Mint Difficulty",
            color: 'neon',
            icon: Shield
        },
        tokenSupply:    { 
            title: "Current Supply",
            color: 'indigo',
            icon: TrendingUp
        }
    }

    return (
         <div className="grid grid-cols-2 md:grid-cols-4 gap-2  mx-auto">
            { Object.keys(stats).map(key => {

                let meta = statsMeta[key]
                let value = stats[key]

                return (
                  <StatsCard
                    key={key}
                    value={value}
                    { ...meta }
                  />
                );
            })}
        </div>
    )
}
