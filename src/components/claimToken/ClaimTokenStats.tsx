import { Activity, Clock, Globe, Trophy } from "lucide-react";

const ClaimTokenStats = ({
  stats,
}: {
  stats: { globalRank: string; clan: string; rank: string; waitTime: string };
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatBox label="Rank No"     value={stats.rank}       icon={Activity} color="violet" />
      <StatBox label="Global Rank" value={stats.globalRank} icon={Globe}    color="blue"   />
      <StatBox label="Wait Term"   value={stats.waitTime}   icon={Clock}    color="pink"   />
      <StatBox label="Clan ID"     value={stats.clan}       icon={Trophy}   color="amber"  />
    </div>
  );
};

const colorMap: Record<string, { icon: string; border: string; bg: string }> = {
  violet: { icon: "text-maxx-violet", border: "border-maxx-violet/25", bg: "bg-maxx-violet/10" },
  blue:   { icon: "text-blue-400",    border: "border-blue-500/20",    bg: "bg-blue-500/10"    },
  pink:   { icon: "text-maxx-pink",   border: "border-maxx-pink/25",   bg: "bg-maxx-pink/10"   },
  amber:  { icon: "text-amber-400",   border: "border-amber-500/20",   bg: "bg-amber-500/10"   },
};

const StatBox = ({ label, value, icon: Icon, color }: any) => {
  const c = colorMap[color] ?? colorMap.violet;
  return (
    <div className="group relative overflow-hidden bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-5 transition-all duration-200 hover:border-maxx-violet/40">
      {/* top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet/40 to-transparent" />

      {/* icon badge — top right corner */}
      <div className={`absolute top-0 right-0 p-2.5 rounded-bl-md border-b border-l ${c.border} ${c.bg}`}>
        <Icon size={14} className={c.icon} />
      </div>

      <div className="relative z-10 mt-1">
        <p className="font-mono text-[0.65rem] tracking-widest uppercase text-maxx-sub mb-1.5">
          {label}
        </p>
        <p className="font-mono font-bold text-lg text-maxx-white tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
};

export default ClaimTokenStats;
