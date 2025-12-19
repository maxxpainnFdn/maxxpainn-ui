
export default function StatBlock({ label, value, highlight = false, color, icon: Icon }: any) {
  return (
    <div className="bg-black/40 border border-white/5 p-4 rounded-2xl backdrop-blur-sm hover:bg-white/5 transition-colors group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest truncate">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors" />}
      </div>
      <div className={`text-2xl sm:text-3xl font-black ${color ? color : highlight ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}
