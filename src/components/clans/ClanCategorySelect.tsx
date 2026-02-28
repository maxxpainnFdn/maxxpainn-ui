import { ClanCategories } from "@/data/clanCategories";
import { useEffect, useMemo, useState } from "react";
import { SearchableSelect } from "../ui/searchable-select";

export interface ClanCategorySelectProps {
  onChange: (value: string) => void;
  value?: string,
  placeholder?: string,
  inputCls?: string,
  disabled?: boolean;
  errors?: string;
}

export default function ClanCategorySelect({
  onChange,
  value = "",
  placeholder="Category",
  className = "",
  placeholderClass = "",
  disabled = false,
  error = ""
}) {
  
  const [selectedValue, setSelectedValue] = useState(value)
  
  useEffect(() => {
    onChange?.(selectedValue)
  }, [selectedValue])
  
  
  const categoryOptions = useMemo(
    () => Object.entries(ClanCategories).map(([value, label]) => ({ value, label })),
    [],
  );
  
  return (
    <SearchableSelect
      options={categoryOptions}
      value={selectedValue}
      onChange={setSelectedValue}
      placeholder={placeholder}
      searchPlaceholder="Search.."
      className={className}
      placeholderClass={placeholderClass}
      disabled={disabled}
      error={error}
    />
  )
}
