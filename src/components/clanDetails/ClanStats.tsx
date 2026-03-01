import { Flame, Target, TrendingUp, Users } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { IClanStats } from "@/types/IClanStats"
import utils from "@/lib/utils"
import { tokenConfig } from "@/config/token"
import { StatsCard } from "../StatsCard"


export default function ClanStats ({ data }: { data: IClanStats }) {

  const statsMeta = {
    "totalMints": {
      color: "indigo",
      icon: Target,
      title: "Mints",
      suffix: ""
    },
    "totalMembers": {
      icon:  Users,
      title: "Members",
      color: "ice",
      suffix: "",
    },
    "totalEarned": {
      title: "Earned",    
      color:  "gold",
      icon:   TrendingUp,
      suffix: "USDC",

    },
    "rewardPerMint": {
      title: "Reward Per Mint",
      suffix: "USDC",      
      icon: Flame,
      color: "amber",
    }
  }

    return (
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-8">
        {Object.keys(data).map(key => {
             
          let value = data[key]
          
          if (key == "totalTokensMinted") {
            value = utils.toShortNumber(value)
          }
          
          const itemMeta = statsMeta[key];
          
          return (
            <StatsCard
              key={key}
              title={itemMeta.title}
              value={<>{value} <span className="text-md">{itemMeta.suffix}</span></>}
              color={itemMeta.color}
              icon={itemMeta.icon}
            />
          )
        })}
      </div>
    )
}
