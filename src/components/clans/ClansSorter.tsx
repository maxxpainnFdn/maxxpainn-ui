import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { SearchableSelect } from "../ui/searchable-select";

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

const ClansSorter = ({
  onChange,
  disabled
}) => {
  
  const [selectedValue, setSelectedValue] = useState("")
  
  useEffect(() => {
    onChange?.(selectedValue)
  }, [selectedValue])
  
  const options = useMemo(
    () => Object.entries(SORT_OPTS).map(([value, label]) => ({ value, label })),
    [],
  );
  
  return (
    <SearchableSelect
      options={options}
      value={selectedValue}
      onChange={setSelectedValue}
      placeholder={"Sort"}
      hasSearch={false}
      className={`
        w-full h-12 px-4 rounded-xl text-sm font-medium
         bg-white/[0.03] border border-white/[0.06] 
        text-gray-400 hover:border-white/[0.12] hover:text-gray-300
      `}
      placeholderClass={"text-gray-300"}
      disabled={disabled}
    />
  )
};

export default ClansSorter;
