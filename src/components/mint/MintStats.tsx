import { Info, Shield, Target, TrendingUp, Zap } from "lucide-react"
import Popover from "../popover/Popover"
import utils from "@/lib/utils"

export default function ClaimRankStats({ stats }) {

    const statsMeta = {
        globalRank:     { 
            textClass: "text-purple-400",  
            label:      "Global Rank",
            description: "A global counter that increments by 1 for each new mint event.",
            color: 'purple',
            icon: Target
        },
        eam:   { 
            textClass: "text-yellow-400",
            label: "EAM",
            description: "The Early Adopter’s Multiplier (EAM) gives early users an extra boost on top of the base reward",
            color: 'yellow',
            icon: Zap
        },
        mintDifficulty: { 
            textClass:  "text-red-400", 
            label:      "Mint Difficulty",
            description: "A dynamic value that increases with total mints, making future mints more expensive by utilizing Solana’s storage rent fees.",
            color: 'red',
            icon: Shield
        },
        tokenSupply:    { 
            textClass: "text-green-400",
            label: "Token Supply",
            description: "The total number of tokens currently in circulation",
            color: 'green',
            icon: TrendingUp
        }
    }

    return (
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            { Object.keys(stats).map(key => {

                let meta = statsMeta[key]
                let value = stats[key]
                let Icon = meta.icon;

                return (
                    <div key={key} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
                        <div className="flex items-center justify-center mb-3">
                            <Icon className={`w-6 h-6 text-${meta.color}-400`} />
                        </div>
                        <div className={`text-3xl font-bold mb-2 text-${meta.color}-400`}>
                            {value}
                        </div>
                        <div className="text-sm text-gray-400">{meta.label}</div>
                    </div>
                );
            })}
        </div>
    )
}