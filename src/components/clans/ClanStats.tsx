import { Axe, Castle, Coins, Diamond, DollarSign, Eye, Pickaxe, Users } from "lucide-react";
import ApiQuery from "../apiQuery/ApiQuery";
import { useEffect, useState } from "react";
import { SiCashapp } from "@icons-pack/react-simple-icons";

 
export default function ClanStats(){

    const [stats, setStats] = useState({})
    
  useEffect(() => {
    console.log(stats)
  }, [stats])

  const statsMeta = {
      totalClans: {
          title: "Clans",
          icon: Castle,
          color: 'bg-purple-500/10 text-purple-400'
      },
      clansTotalMembers: {
          title: "Total Members",
          icon: Users,
          color: 'bg-blue-500/10 text-blue-400'
      },
      
      clansTotalEarned: {
          title: "Total Earned",
          icon: DollarSign,
          color: 'bg-green-500/10 text-green-400'
      },

      clansTotalMints: {
          title: "Total Minted",
          icon: Diamond,
          color: 'bg-yellow-500/10 text-yellow-400'
      },
  }

  return (
    <ApiQuery
        uri="/clans/stats"
        onSuccess={data => setStats(data)}
        showError={false}
        loaderProps={{ className: "mb-4" }}
    >
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {Object.keys(statsMeta).map( key => {

                let item = statsMeta[key];
                let Icon = item.icon;
                let value = stats[key] || 0;

                return (
                    <div key={key} 
                        className="group bg-gray-900/80 backdrop-blur-sm border-2 border-purple-400/5 rounded-2xl p-6 shadow-xl hover:border-purple-400/20 hover:transform hover:translate-y-[-4px] transition-all duration-300"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`p-3 rounded-2xl  ${item.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className="w-6 h-6 " />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{item.title}</h3>
                        </div>
                        <p className="text-3xl font-black  text-white/90">
                            {value}
                        </p>
                    </div>
                )}
            )}
        </div>
    </ApiQuery>
   )
}
