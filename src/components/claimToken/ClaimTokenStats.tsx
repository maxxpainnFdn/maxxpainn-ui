// =========================================================
// CLAIM TOKEN STATS COMPONENT
// =========================================================

import { Activity, Clock, Globe, Trophy } from "lucide-react";

const ClaimTokenStats = ({
  stats,
}: {
  stats: { globalRank: string; clan: string; rank: string; waitTime: string };
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatBox
        label="Rank No"
        value={`${stats.rank}`}
        icon={Activity}
        color="purple"
      />
      <StatBox
        label="Global Rank"
        value={`${stats.globalRank}`}
        icon={Globe}
        color="blue"
      />
      <StatBox
        label="Wait Term"
        value={stats.waitTime}
        icon={Clock}
        color="pink"
      />
      <StatBox
        label="Clan ID"
        value={`${stats.clan}`}
        icon={Trophy}
        color="yellow"
      />
    </div>
  );
};

const StatBox = ({ label, value, icon: Icon, color }: any) => {
  const colorStyles = {
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gray-900/40 border border-white/5 p-5 hover:border-white/10 transition-colors">
      <div
        className={`absolute top-0 right-0 p-3 rounded-bl-2xl border-b border-l ${colorStyles[color]} opacity-80`}
      >
        <Icon className="w-4 h-4" />
      </div>

      <div className="relative z-10">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 group-hover:text-gray-400 transition-colors">
          {label}
        </p>
        <p className="text-lg font-mono font-bold text-white tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
};

export default ClaimTokenStats;
