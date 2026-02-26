const FeedsSideStats = ({ label, value, pct, gradientCls }) => (
  <div>
    <div className="flex justify-between items-baseline mb-1.5">
      <span className="font-mono text-xs text-maxx-sub">{label}</span>
      <span className="font-mono font-bold text-sm text-maxx-bright">{value}</span>
    </div>
    <div className="h-[3px] w-full bg-maxx-violet/10 rounded-full overflow-hidden">
      <div className={`h-full bg-gradient-to-r ${gradientCls} transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  </div>
);

export default FeedsSideStats;
