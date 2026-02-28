import { ClanCategories } from "@/data/clanCategories";
import { useMemo } from "react";
import { SearchableSelect } from "../ui/searchable-select";

export interface ClanCategorySelectProps {
  onChange: (value: string) => void;
  value?: string,
  placeholder?: string,
  inputCls?: string,
  loading?: boolean;
  errors?: string;
}

export default function ClanCategorySelect({
  onChange,
  value = "",
  placeholder="Category",
  className = "",
  placeholderClass = "",
  loading = false,
  error = ""
}) {
  
  const categoryOptions = useMemo(
    () => Object.entries(ClanCategories).map(([value, label]) => ({ value, label })),
    [],
  );
  
  return (
    <SearchableSelect
      options={categoryOptions}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder="Search.."
      className={className}
      placeholderClass={placeholderClass}
      disabled={loading}
      error={error}
    />
  )
}
