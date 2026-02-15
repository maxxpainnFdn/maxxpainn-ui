import { Castle, Diamond, DollarSign, Users } from "lucide-react";
import ApiQuery from "../apiQuery/ApiQuery";
import { useEffect, useState } from "react";

export default function ClanStats() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    console.log(stats);
  }, [stats]);

  const statsMeta = {
    totalClans: {
      title: "Clans",
      icon: Castle,
      color: "text-purple-400",
      glow: "bg-purple-500/10",
    },
    clansTotalMembers: {
      title: "Members",
      icon: Users,
      color: "text-blue-400",
      glow: "bg-blue-500/10",
    },
    clansTotalEarned: {
      title: "Earned",
      icon: DollarSign,
      color: "text-emerald-400",
      glow: "bg-emerald-500/10",
    },
    clansTotalMints: {
      title: "Minted",
      icon: Diamond,
      color: "text-amber-400",
      glow: "bg-amber-500/10",
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
          const Icon = item.icon;
          const value = stats[key] || 0;

          return (
            <div
              key={key}
              className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3.5 md:p-5 hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-500 ease-out cursor-default overflow-hidden"
            >
              {/* Subtle gradient glow on hover */}
              <div
                className={`absolute inset-0 ${item.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl`}
              />

              <div className="relative z-10">
                <div
                  className={`inline-flex p-1.5 md:p-2 rounded-lg ${item.glow} mb-2.5 md:mb-3`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 md:w-4 md:h-4 ${item.color}`}
                    strokeWidth={2}
                  />
                </div>

                <p className="text-lg md:text-2xl font-bold tracking-tight text-white">
                  {value.toLocaleString()}
                </p>

                <p className="text-[11px] md:text-xs font-medium text-white/40 uppercase tracking-widest mt-0.5">
                  {item.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ApiQuery>
  );
}
