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
  error,
}: SearchableSelectProps) {
  const [open, setOpen]                     = React.useState(false)
  const [searchQuery, setSearchQuery]       = React.useState("")
  const [highlightedIndex, setHighlightedIndex] = React.useState(0)
  const listRef    = React.useRef<HTMLDivElement>(null)
  const inputRef   = React.useRef<HTMLInputElement>(null)
  const isPointerRef = React.useRef(false)

  const filteredOptions = React.useMemo(
    () => options.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [options, searchQuery],
  )

  const selectedLabel = React.useMemo(
    () => options.find((item) => item.value === value)?.label,
    [options, value],
  )

  React.useEffect(() => { setHighlightedIndex(0) }, [searchQuery])

  // Keyboard-only auto-scroll — never interfere with touch/mouse scroll
  React.useEffect(() => {
    if (open && listRef.current && !isPointerRef.current) {
      const activeItem = listRef.current.children[highlightedIndex] as HTMLElement
      activeItem?.scrollIntoView({ block: "nearest", behavior: "smooth" })
    }
  }, [highlightedIndex, open])

  // Focus search on open — delayed slightly so popover is mounted
  React.useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 120)
      return () => clearTimeout(t)
    } else {
      setSearchQuery("")
    }
  }, [open])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === "ArrowDown") {
        setOpen(true)
        isPointerRef.current = false
        e.preventDefault()
      }
      return
    }
    isPointerRef.current = false
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((p) => Math.min(p + 1, filteredOptions.length - 1))
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((p) => Math.max(p - 1, 0))
        break
      case "Enter":
        e.preventDefault()
        if (filteredOptions[highlightedIndex]) handleSelect(filteredOptions[highlightedIndex].value)
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

  const handlePointerMove = () => { isPointerRef.current = true }

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      {/* ── Trigger ── */}
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          className={cn(
            "group flex h-11 w-full items-center justify-between rounded-md border px-4 text-base transition-all duration-200",
            "bg-maxx-bg0/60 text-maxx-bright",
            // Default
            !error && [
              "border-maxx-violet/20",
              "hover:border-maxx-violet/35",
              "data-[state=open]:border-maxx-violet/55",
              "data-[state=open]:shadow-[0_0_0_3px_color-mix(in_srgb,var(--maxx-violet)_12%,transparent)]",
            ],
            // Error
            error && [
              "border-maxx-pink/40",
              "hover:border-maxx-pink/60",
              "data-[state=open]:border-maxx-pink/70",
              "data-[state=open]:shadow-[0_0_0_3px_color-mix(in_srgb,var(--maxx-pink)_12%,transparent)]",
            ],
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          <span className={cn("truncate text-left text-base", !value && "text-maxx-dim")}>
            {selectedLabel || placeholder}
          </span>
          <ChevronsUpDown className={cn(
            "ml-2 h-3.5 w-3.5 shrink-0 text-maxx-sub transition-transform duration-200",
            open && "rotate-180 text-maxx-violet",
          )} />
        </button>
      </PopoverTrigger>

      {/* ── Dropdown ── */}
      <PopoverContent className="max-h-[120px] overflow-y-auto">
          {filteredOptions.map((option, index) => {
            const isSelected = value === option.value
            const isHighlighted = index === highlightedIndex

            return (
              <div>
            
                <span className="flex-1 truncate">{option.label}</span>

              </div>
            )
          })}
      </PopoverContent>
    </Popover>
  )
}
