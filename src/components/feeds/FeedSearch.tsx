import { Search } from "lucide-react"

export default function FeedSearch({ onSearch }) {
  
  const [keyword, setKeyword] = useState("")
  
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-maxx-sub pointer-events-none" />
      
      <input
        placeholder="Search posts…"
        value={keyword}
        onChange={onChange}
        className="w-full pl-9 pr-4 py-2.5 bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg text-sm text-maxx-bright placeholder:text-maxx-sub font-mono focus:outline-none focus:border-maxx-violet/45 transition-colors"
      />
    </div>
  )
}
