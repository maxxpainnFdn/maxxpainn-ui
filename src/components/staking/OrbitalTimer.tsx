import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function OrbitalTimer({ lockedDate, targetDate }) {

    // --- HELPER: ORBITAL TIME GAUGE COMPONENT ---
    const [timeLeft, setTimeLeft] = useState(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {

      const calculate = () => {
        const now = new Date().getTime();
        const start = new Date(lockedDate).getTime();
        const end = new Date(targetDate).getTime();
        const totalDuration = end - start;
        const elapsed = now - start;
        const remaining = end - now;

        // Calculate Percentage (0 to 100)
        const pct = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
        setProgress(pct);

        if (remaining <= 0) {
          setTimeLeft(null); // Unlocked
          return;
        }

        setTimeLeft({
          days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
          hours: Math.floor((remaining / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((remaining / 1000 / 60) % 60),
          seconds: Math.floor((remaining / 1000) % 60),
          totalSeconds: Math.floor(remaining / 1000)
        });
      };

      calculate();
      const timer = setInterval(calculate, 1000);
      return () => clearInterval(timer);
    }, [lockedDate, targetDate]);

    if (!timeLeft) {
      {/* 
        <div className="flex items-center gap-4 bg-green-500/10 border border-green-500/20 px-6 py-4 rounded-2xl animate-pulse w-full">
          <div className="p-2 bg-green-500 text-black rounded-full"><ShieldCheck size={24} /></div>
          <span className="text-xl font-black text-green-400 tracking-widest">POSITION UNLOCKED</span>
        </div>
      */}
      return (<></>);
    }

    // --- DYNAMIC DISPLAY LOGIC ---
    const getDisplayUnit = () => {
      const { days, hours, minutes, seconds } = timeLeft;
      if (days > 0) return { value: days, label: 'Days' };
      if (hours > 0) return { value: hours, label: 'Hours' };
      if (minutes > 0) return { value: minutes, label: 'Mins' };
      return { value: seconds, label: 'Secs' };
    };

    const display = getDisplayUnit();

    // SVG Config
    const size = 140;
    const strokeWidth = 8;
    const center = size / 2;
    const radius = size / 2 - strokeWidth * 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
      <div className="flex flex-col sm:flex-row items-center gap-8 bg-black/40 border border-white/5 rounded-[2rem] p-6 backdrop-blur-md w-full">
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
          <svg className="transform -rotate-90 w-full h-full relative z-10">
            <circle className="text-gray-800" stroke="currentColor" fill="transparent" strokeWidth={strokeWidth} r={radius} cx={center} cy={center} />
            <circle className="text-purple-500 transition-all duration-1000 ease-out" stroke="currentColor" fill="transparent" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" r={radius} cx={center} cy={center} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-white leading-none">{display.value}</span>
            <span className="text-xs uppercase font-bold text-gray-500 tracking-wider mt-1">{display.label}</span>
          </div>
        </div>
        <div className="flex-1 w-full min-w-0">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Progress to Unlock</span>
              <span className="text-xs font-bold text-purple-400">{progress.toFixed(2)}%</span>
            </div>
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600" style={{ width: `${progress}%` }} />
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: 'DAY', val: timeLeft.days, active: timeLeft.days > 0 },
                { label: 'HR', val: timeLeft.hours, active: timeLeft.days === 0 && timeLeft.hours > 0 },
                { label: 'MIN', val: timeLeft.minutes, active: timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes > 0 },
                { label: 'SEC', val: timeLeft.seconds, active: timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 }
              ].map((item, i) => (
                  <div key={i} className={`rounded-lg py-2 border transition-colors duration-300 ${item.active ? 'bg-purple-500/20 border-purple-500/50' : 'bg-white/5 border-white/5'}`}>
                      <div className={`text-lg font-mono font-bold leading-none ${item.active ? 'text-white' : 'text-gray-400'}`}>
                        {String(item.val).padStart(2,'0')}
                      </div>
                      <div className={`text-[9px] font-bold mt-1 ${item.active ? 'text-purple-300' : 'text-gray-600'}`}>{item.label}</div>
                  </div>
              ))}
            </div>
        </div>
      </div>
    );
}
