import { Info, Shield, Target, TrendingUp, Zap } from "lucide-react"
import Popover from "../popover/Popover"
import utils from "@/lib/utils"
import { StatsCard } from "../StatsCard"

export default function ClaimRankStats({ stats }) {

    const statsMeta = {
        globalRank:     { 
            title:      "Global Rank",
            color: 'purple',
            icon: Target
        },
        eam:   { 
            title: "EAM",
            color: 'yellow',
            icon: Zap
        },
        mintDifficulty: { 
            title:   "Mint Difficulty",
            color: 'red',
            icon: Shield
        },
        tokenSupply:    { 
            title: "Current Supply",
            color: 'green',
            icon: TrendingUp
        }
    }

    return (
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
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
