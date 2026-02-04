import { Flame, Target, TrendingUp, Users } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { IClanStats } from "@/types/IClanStats"
import utils from "@/lib/utils"
import { tokenConfig } from "@/config/token"


export default function ClanStats ({ data }: { data: IClanStats }) {

    const statsMeta = {
        "totalMints": {
            mainBg: "from-purple-500/5",
            iconBg: "bg-purple-500/10",
            icon: <Target className="h-6 w-6 text-purple-400" />,
            title: "Mints",
            suffix: ""
        },
        "totalMembers": {
            mainBg: "from-blue-500/5",
            iconBg: "bg-blue-500/10",
            icon:  <Users className="h-6 w-6 text-blue-400" />,
            title: "Members",
            suffix: ""
        },
        "totalEarned": {
            mainBg: "from-green-500/5",
            iconBg: "bg-green-500/10",
            icon:  <TrendingUp className="h-6 w-6 text-green-400" />,
            title: "Earned",
            suffix: "USDC"
        },
        "totalTokensMinted": {
          mainBg: "from-yellow-500/5",
          iconBg: "bg-yellow-500/10",
          icon:  <Flame className="h-6 w-6 text-yellow-400" />,
          title: "Minted",
          suffix: <span className='yellow-500'>{ tokenConfig.symbol }</span>
        }
    }

    return (
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.keys(data).map(key => {
             
          let value = data[key]
          
          if (key == "totalTokensMinted") {
            value = utils.toShortNumber(value)
          }
          
          return ( 
              <Card key={key} className="relative overflow-hidden bg-gradient-to-br from-card to-card/50 border border-border/40 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${statsMeta[key].mainBg} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <CardContent className="p-6 relative">
                      <div className="flex items-center gap-3 mb-4">
                          <div className={`p-3 rounded-2xl ${statsMeta[key].iconBg}`}>
                              { statsMeta[key].icon }
                          </div>
                          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                              { statsMeta[key].title }
                          </span>
                      </div>
                      <p className="text-4xl font-black bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        { value } <span className="text-xl">{ statsMeta[key].suffix }</span>
                      </p>
                  </CardContent>
              </Card>
            )}
          )}
        </div>
    )
}
