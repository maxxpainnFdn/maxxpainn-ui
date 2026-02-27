import { useEffect, useState } from "react";

export default function OrbitalTimer({ lockedDate, targetDate }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculate = () => {
      const now           = new Date().getTime();
      const start         = new Date(lockedDate).getTime();
      const end           = new Date(targetDate).getTime();
      const totalDuration = end - start;
      const elapsed       = now - start;
      const remaining     = end - now;

      const pct = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
      setProgress(pct);

      if (remaining <= 0) { setTimeLeft(null); return; }

      setTimeLeft({
        days:    Math.floor(remaining / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((remaining / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((remaining / 1000 / 60) % 60),
        seconds: Math.floor((remaining / 1000) % 60),
        totalSeconds: Math.floor(remaining / 1000),
      });
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [lockedDate, targetDate]);

  /* Unlocked — render nothing (parent shows "Unlocked" label) */
  if (!timeLeft) return <></>;

  const getDisplayUnit = () => {
    const { days, hours, minutes, seconds } = timeLeft;
    if (days > 0)    return { value: days,    label: "Days" };
    if (hours > 0)   return { value: hours,   label: "Hours" };
    if (minutes > 0) return { value: minutes, label: "Mins" };
    return              { value: seconds,  label: "Secs" };
  };

  const display = getDisplayUnit();

  /* SVG config */
  const size        = 120;
  const sw          = 7;
  const center      = size / 2;
  const radius      = size / 2 - sw * 2;
  const circumference = 2 * Math.PI * radius;
  const offset      = circumference - (progress / 100) * circumference;

  const timeBoxes = [
    { label: "DAY",  val: timeLeft.days,    active: timeLeft.days > 0 },
    { label: "HR",   val: timeLeft.hours,   active: timeLeft.days === 0 && timeLeft.hours > 0 },
    { label: "MIN",  val: timeLeft.minutes, active: timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes > 0 },
    { label: "SEC",  val: timeLeft.seconds, active: timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 bg-maxx-bg0/60 border border-maxx-violet/20 rounded-lg p-5 w-full">

      {/* SVG ring */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <div className="absolute inset-0 bg-maxx-violet/15 blur-xl rounded-full pointer-events-none" />
        <svg className="transform -rotate-90 w-full h-full relative z-10">
          <circle
            stroke="rgba(61,43,92,0.5)" fill="transparent"
            strokeWidth={sw} r={radius} cx={center} cy={center}
          />
          <circle
            stroke="url(#orbitalGrad)" fill="transparent"
            strokeWidth={sw} strokeDasharray={circumference}
            strokeDashoffset={offset} strokeLinecap="round"
            r={radius} cx={center} cy={center}
            className="transition-all duration-1000 ease-out"
            style={{ filter: "drop-shadow(0 0 6px rgba(139,92,246,0.5))" }}
          />
          <defs>
            <linearGradient id="orbitalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ff2d78" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-sans font-black text-3xl text-maxx-white leading-none tabular-nums">
            {display.value}
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-widest text-maxx-sub mt-0.5">
            {display.label}
          </span>
        </div>
      </div>

      {/* Progress bar + time boxes */}
      <div className="flex-1 w-full min-w-0">

        {/* Progress bar */}
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-[0.65rem] tracking-widest uppercase text-maxx-sub">
            Progress to Unlock
          </span>
          <span className="font-mono text-xs font-bold text-maxx-violet">
            {progress.toFixed(1)}%
          </span>
        </div>
        <div className="maxx-track mb-4">
          <div
            className="h-full rounded-sm transition-all duration-1000"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #8b5cf6, #ff2d78)",
            }}
          />
        </div>

        {/* Time boxes */}
        <div className="grid grid-cols-4 gap-1.5">
          {timeBoxes.map((item, i) => (
            <div
              key={i}
              className={`rounded-md py-2 border text-center transition-colors duration-300 ${
                item.active
                  ? "bg-maxx-violet/10 border-maxx-violet/35"
                  : "bg-maxx-bg0/40 border-maxx-violet/10"
              }`}
            >
              <div className={`font-mono font-bold text-base leading-none tabular-nums ${item.active ? "text-maxx-white" : "text-maxx-dim"}`}>
                {String(item.val).padStart(2, "0")}
              </div>
              <div className={`font-mono text-[0.55rem] uppercase tracking-widest mt-1 ${item.active ? "text-maxx-violet" : "text-maxx-dim/60"}`}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
