import { useState, useRef, useEffect, useMemo } from "react";
import { SearchableSelect } from "../ui/searchable-select";

export interface ClanSorterProps {
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
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
  className=""
}: ClanSorterProps) => {
  
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
      className={className}
      placeholderClass={"text-gray-300"}
      disabled={disabled}
    />
  )
};

export default ClansSorter;
