import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

export interface CommentsSorterProps {
  onChange: (s: string) => void;
}

export default function CommentsSorter({ onChange }: CommentsSorterProps) {
  
  const [sort, setSort] = useState("newest");
  
  useEffect(() => {
    onChange?.(sort)
  }, [sort])

  return (
    <>
      <Select value={sort} onValueChange={setSort}>
        <SelectTrigger className="w-[130px] h-8 text-xs">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="top">Top</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
        </SelectContent>
      </Select>
    </>
  )
}
