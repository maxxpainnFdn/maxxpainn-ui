import { Search } from "lucide-react";
import { useEffect, useRef } from "react";

/* ── Inject once ── */
let _csInjected = false;
function injectSearchStyles() {
  if (_csInjected || typeof document === "undefined") return;
  _csInjected = true;
  const s = document.createElement("style");
  s.textContent = `
    @keyframes _cs-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0); }
      50%      { box-shadow: 0 0 0 4px rgba(139,92,246,0.08); }
    }
    ._cs-wrap:focus-within {
      box-shadow:
        0 0 0 1px rgba(139,92,246,0.35),
        0 0 24px -6px rgba(139,92,246,0.18);
      animation: _cs-pulse 2.5s ease-in-out infinite;
    }
  `;
  document.head.appendChild(s);
}

export default function ClansSearch({
  onChange,
}: {
  onChange: (v: string) => void;
}) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    injectSearchStyles();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => onChange(v), 500);
  };

  return (
    <div className="flex-1 w-full">
      <div
        className="
          _cs-wrap group relative rounded-xl overflow-hidden
          bg-white/[0.03] border border-white/[0.06]
          hover:border-white/[0.12]
          focus-within:border-purple-500/40
          transition-all duration-300
        "
      >
        {/* focus tint */}
        <div
          className="absolute inset-0 bg-purple-500/[0.03] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"
          aria-hidden
        />

        <div className="relative flex items-center">
          <div className="pl-4 flex items-center">
            <Search
              className="w-[18px] h-[18px] text-maxx-white/70 group-focus-within:text-purple-400 group-focus-within:scale-110 transition-all duration-300"
              strokeWidth={2.2}
            />
          </div>
          <input
            placeholder="Search clans…"
            onChange={handleChange}
            className="
              w-full h-12 pl-3 pr-4 bg-transparent
              text-base font-medium text-white
              placeholder:text-gray-400
              focus:outline-none
            "
          />
        </div>
      </div>
    </div>
  );
}
