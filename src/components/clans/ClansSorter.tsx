import { useState, useRef, useEffect, useMemo } from "react";
import { SearchableSelect } from "../ui/searchable-select";

export interface ClanSorterProps {
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholderClass?: string;
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
  disabled,
  className = "",
  placeholderClass=""
}: ClanSorterProps) => {
  
  const [selectedValue, setSelectedValue] = useState("")
  
  useEffect(() => {
    onChange?.(selectedValue)
  }, [selectedValue])
  
  const options = useMemo(
    () => Object.entries(SORT_OPTS).map(([value, label]) => ({ value, label })),
    [],
  );
  
  const _className = `
    w-full h-12 px-4 rounded-xl text-sm font-medium
     bg-white/[0.03] border border-white/[0.06] 
    text-gray-400 hover:border-white/[0.12] hover:text-gray-300
    ${className}
  `
  const _placeholderClass = "text-gray-400 " + placeholderClass;
  
  return (
    <SearchableSelect
      options={options}
      value={selectedValue}
      onChange={setSelectedValue}
      placeholder={"Sort"}
      hasSearch={false}
      className={_className}
      placeholderClass={_placeholderClass}
      disabled={disabled}
    />
  )
};

export default ClansSorter;
