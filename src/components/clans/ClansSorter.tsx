import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

/* ── Inject once ── */
let _sortInjected = false;
function injectSorterStyles() {
  if (_sortInjected || typeof document === "undefined") return;
  _sortInjected = true;
  const s = document.createElement("style");
  s.textContent = `
    @keyframes _srt-in {
      from { opacity: 0; transform: translateY(-8px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes _srt-item {
      from { opacity: 0; transform: translateX(-8px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `;
  document.head.appendChild(s);
}

const SORT_OPTS: Record<string, string> = {
  newest: "Newest",
  oldest: "Oldest",
  most_members: "Most Members",
  least_members: "Least Members",
  most_earned: "Highest Earnings",
  least_earned: "Lowest Earnings",
  most_mints: "Most Mints",
  least_mints: "Least Mints",
  az: "Name (A–Z)",
  za: "Name (Z–A)",
};

const ClansSorter: React.FC<{ onChange: (v: string) => void }> = ({
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("newest");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(injectSorterStyles, []);

  /* close on outside click */
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const pick = (key: string) => {
    setSelected(key);
    onChange(key);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full xs:w-[180px] sm:w-[220px]">
      {/* ── Trigger ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`
          w-full h-12 px-4 rounded-xl text-sm font-medium
          flex items-center justify-between gap-2
          transition-all duration-300 cursor-pointer
          ${
            open
              ? "bg-white/[0.05] border border-purple-500/35 text-white shadow-lg shadow-purple-500/10"
              : "bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:border-white/[0.12] hover:text-gray-300"
          }
        `}
      >
        <span className="truncate">{SORT_OPTS[selected]}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div
          className="
            absolute top-full mt-2 w-full z-30
            rounded-xl overflow-hidden
            border border-white/[0.08]
            bg-gray-950/90 backdrop-blur-2xl
            shadow-2xl shadow-black/50
          "
          style={{ animation: "_srt-in 0.2s ease both" }}
        >
          <div className="max-h-[280px] overflow-y-auto py-1 z-50">
            {Object.entries(SORT_OPTS).map(([key, label], i) => {
              const active = selected === key;
              return (
                <button
                  key={key}
                  onClick={() => pick(key)}
                  className={`
                    w-full px-4 py-2.5 text-left text-sm
                    flex items-center justify-between gap-2
                    transition-colors duration-150 cursor-pointer
                    ${
                      active
                        ? "bg-purple-500/15 text-purple-300 font-semibold"
                        : "text-gray-400 hover:bg-white/[0.05] hover:text-white"
                    }
                  `}
                  style={{
                    animation: `_srt-item 0.2s ease both`,
                    animationDelay: `${i * 20}ms`,
                  }}
                >
                  <span>{label}</span>
                  {active && (
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClansSorter;
