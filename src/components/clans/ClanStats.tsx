import { Castle, Diamond, DollarSign, Users } from "lucide-react";
import ApiQuery from "../apiQuery/ApiQuery";
import { useEffect, useState } from "react";
import { StatsCard } from "../StatsCard";

export default function ClanStats() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    console.log(stats);
  }, [stats]);

  const statsMeta = {
    totalClans: {
      title: "Clans",
      icon: Castle,
      color: "purple",
    },
    clansTotalMembers: {
      title: "Members",
      icon: Users,
      color: "blue",
    },
    clansTotalEarned: {
      title: "Earned",
      icon: DollarSign,
      color: "emerald",
    },
    clansTotalMints: {
      title: "Minted",
      icon: Diamond,
      color: "amber",
    },
  };

  return (
    <ApiQuery
      uri="/clans/stats"
      onSuccess={(data) => setStats(data)}
      showError={false}
      loaderProps={{ className: "mb-4" }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4 mb-10">
        {Object.keys(statsMeta).map((key) => {
          const item = statsMeta[key];
          item.value = stats[key] || 0;

          return (
            <StatsCard
              key={key}
              {...item} 
            />
          );
        })}
      </div>
    </ApiQuery>
  );
}
