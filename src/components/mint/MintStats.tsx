import { Info, Shield, Target, TrendingUp, Zap } from "lucide-react"
import Popover from "../popover/Popover"
import utils from "@/lib/utils"

export default function ClaimRankStats({ stats }) {

    const statsMeta = {
        globalRank:     { 
            label:      "Global Rank",
            color: 'purple',
            icon: Target
        },
        eam:   { 
            label: "EAM",
            color: 'yellow',
            icon: Zap
        },
        mintDifficulty: { 
            label:   "Mint Difficulty",
            color: 'red',
            icon: Shield
        },
        tokenSupply:    { 
            label: "Current Supply",
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
                    value={value}
                    icon={meta.icon}
                    color={meta.color}
                    title={meta.title}
                  />
                );
            })}
        </div>
    )
}
