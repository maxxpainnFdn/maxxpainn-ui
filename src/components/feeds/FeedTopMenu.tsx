import { Search } from "lucide-react";
import FeedFilter from "./FeedFilter";

export default function FeedTopMenu({ onSort }) {
  return (
    <div className="flex justify-between align-middle ">
      <div className="flex items-center gap-0.5  bg-maxx-bg1/80 border border-maxx-violet/15 rounded-lg p-1 mb-4">
        <button
          className=" bg-maxx-violet/20 text-maxx-white flex items-center gap-1 gap-x-2 px-2.5 py-1.5 rounded-md font-mono text-sm uppercase tracking-wider transition-all"
        >
          <Search  className="text-violet-400 h-5 w-5" />
        </button>
      </div>
      <FeedFilter
        onSort={onSort}
      />
    </div>
  )
}
