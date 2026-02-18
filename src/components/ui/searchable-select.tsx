import * as React from "react"
import { Check, ChevronsUpDown, Search, Ghost } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Option {
  value: string
  label: string
}

interface SearchableSelectProps {
  options: Option[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
  error?: string
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found",
  className,
  disabled,
  error
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [highlightedIndex, setHighlightedIndex] = React.useState(0)
  const listRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  
  // FIX 1: Track if the user is using a pointer (mouse/touch) or keyboard
  const isPointerRef = React.useRef(false)

  const filteredOptions = React.useMemo(() => {
    return options.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [options, searchQuery])

  const selectedLabel = React.useMemo(() =>
    options.find((item) => item.value === value)?.label,
  [options, value])

  React.useEffect(() => {
    setHighlightedIndex(0)
  }, [searchQuery])

  React.useEffect(() => {
    // FIX 2: Only programmatically scroll if the user is using the KEYBOARD.
    // If they are scrolling with mouse/touch, let native CSS scroll handle it.
    if (open && listRef.current && !isPointerRef.current) {
      const activeItem = listRef.current.children[highlightedIndex] as HTMLElement
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [highlightedIndex, open])

  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    }
  }, [open])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === "ArrowDown") {
        setOpen(true)
        // Reset pointer flag so auto-scroll works immediately
        isPointerRef.current = false 
        e.preventDefault()
      }
      return
    }

    // Set to keyboard mode
    isPointerRef.current = false

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0))
        break
      case "Enter":
        e.preventDefault()
        if (filteredOptions.length > 0) {
          const selected = filteredOptions[highlightedIndex]
          if (selected) {
            handleSelect(selected.value)
          }
        }
        break
      case "Escape":
        setOpen(false)
        break
    }
  }

  const handleSelect = (newValue: string) => {
    onChange(newValue)
    setOpen(false)
    setSearchQuery("")
  }

  // FIX 3: Detect pointer movement to disable auto-scroll
  const handlePointerMove = () => {
    isPointerRef.current = true
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          className={cn(
            "group flex h-12 w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-base transition-all duration-300",
            "bg-gray-900/40 backdrop-blur-sm border-white/10 text-white",
            "hover:border-purple-500/50 hover:bg-gray-900/60",
            "data-[state=open]:border-purple-500 data-[state=open]:ring-4 data-[state=open]:ring-purple-500/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500/50 hover:border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20",
            className
          )}
        >
          <span className={cn("truncate text-left ", !value && "text-gray-500")}>
            {selectedLabel || placeholder}
          </span>
          <ChevronsUpDown className={cn(
            "ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-300",
            open && "rotate-180 text-purple-400 opacity-100"
          )} />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 bg-[#0a0a0b]/95 backdrop-blur-2xl border-white/10 rounded-xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]"
        align="start"
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col w-full overflow-hidden rounded-xl">
          {/* Search Header */}
          <div className="flex items-center border-b border-white/5 px-4 py-4 bg-white/[0.02]">
            <Search className="mr-3 h-5 w-5 shrink-0 text-purple-500" />
            <input
              ref={inputRef}
              className="flex h-6 w-full bg-transparent text-base sm:text-sm font-medium outline-none placeholder:text-gray-600 text-white"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

          {/* Options List */}
          <div
            ref={listRef}
            // Add pointer move handler to the container
            onPointerMove={handlePointerMove}
            className="overflow-y-auto overscroll-contain p-2"
            style={{
              maxHeight: '300px',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {filteredOptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-sm text-gray-500 gap-2">
                <Ghost className="w-8 h-8 opacity-20" />
                <span className="text-gray-600">{emptyMessage}</span>
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = value === option.value
                const isHighlighted = index === highlightedIndex

                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    onMouseEnter={() => {
                        // Only highlight if we are actually moving the pointer,
                        // not just scrolling the page under the pointer
                        isPointerRef.current = true
                        setHighlightedIndex(index)
                    }}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-lg px-3.5 py-3.5 text-base sm:text-sm outline-none transition-all duration-200 mb-1 last:mb-0",
                      isHighlighted ? "bg-white/5 text-purple-100 pl-5" : "text-gray-400",
                      isSelected && "bg-purple-500/10 text-purple-400 font-bold"
                    )}
                  >
                    {(isHighlighted || isSelected) && (
                      <div className={cn(
                        "absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-200",
                        isSelected ? "bg-purple-500 h-1/2" : "bg-purple-500/50 h-1/3"
                      )} />
                    )}

                    <span className="flex-1 truncate">{option.label}</span>

                    {isSelected && (
                      <Check className="ml-2 h-5 w-5 text-purple-500 animate-in zoom-in-50 duration-200" />
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
