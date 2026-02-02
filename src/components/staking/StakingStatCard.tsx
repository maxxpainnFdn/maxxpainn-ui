
const styles = {
  purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]" },
  pink:   { text: "text-pink-400",   bg: "bg-pink-500/10",   border: "border-pink-500/20",   glow: "group-hover:shadow-[0_0_30px_rgba(236,72,153,0.2)]" },
  green:  { text: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/20",  glow: "group-hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]" },
  red:    { text: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/20",    glow: "group-hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]" },
};

// --- REUSABLE COMPONENTS ---
export default function StakingStatCard ({ label, value, subValue, icon: Icon, color = "purple" }){


  const s = styles[color];

  return (
    <div className={`
        relative overflow-hidden p-6 rounded-[2rem] border bg-gray-900/40 backdrop-blur-md
        transition-all duration-300 group hover:-translate-y-1 hover:border-white/20
        ${s.border} ${s.glow}
    `}>
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40 ${s.bg.replace('/10','/30')}`} />
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl border border-white/5 ${s.bg}`}>
                <Icon className={`w-6 h-6 ${s.text}`} />
            </div>
        </div>
        <div>
            <div className="text-3xl md:text-4xl font-black text-white tracking-tight mb-1">{value}</div>
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/5 bg-white/5 ${s.text}`}>
                    {subValue}
                </span>
            </div>
        </div>
      </div>
    </div>
  );
};
