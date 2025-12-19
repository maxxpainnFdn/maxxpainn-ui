export default function QuickStatCard({ icon: Icon, label, value, sub, color, trend }: any) {
  const colors: any = {
    purple: "text-purple-400 from-purple-600 to-purple-700 shadow-purple-500/30 border-purple-500/30",
    blue: "text-blue-400 from-blue-600 to-blue-700 shadow-blue-500/30 border-blue-500/30",
    emerald: "text-emerald-400 from-emerald-600 to-emerald-700 shadow-emerald-500/30 border-emerald-500/30",
    yellow: "text-yellow-400 from-yellow-600 to-yellow-700 shadow-yellow-500/30 border-yellow-500/30",
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-gray-800/50 rounded-3xl p-6 hover:border-purple-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/20 group">
      <div className="flex items-start justify-between mb-6">
        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colors[color]} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            {trend}
          </span>
        )}
      </div>
      <div className="text-4xl font-black text-white mb-2 group-hover:scale-105 transition-transform duration-300">
        {value}
      </div>
      <div className="text-sm text-gray-400 font-semibold mb-2">{label}</div>
      <div className="text-xs text-gray-600 font-medium">{sub}</div>
    </div>
  );
}
