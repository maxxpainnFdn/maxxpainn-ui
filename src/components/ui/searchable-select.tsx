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
  placeholderClass?: string
  hasSearch?: boolean
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
  placeholderClass = "",
  hasSearch=true,
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
          <span className={cn("truncate text-left text-base", !value && `text-maxx-dim ${placeholderClass}`)}>
            {selectedLabel || placeholder}
          </span>
          <ChevronsUpDown className={cn(
            "ml-2 h-3.5 w-3.5 shrink-0 text-maxx-sub transition-transform duration-200",
            open && "rotate-180 text-maxx-violet",
          )} />
        </button>
      </PopoverTrigger>

      {/* ── Dropdown ── */}
      <PopoverContent
        className={cn(
          "min-w-[var(--radix-popover-trigger-width)] p-0 rounded-lg",
          "bg-maxx-bg1",
          "border border-maxx-violet/25",
          "shadow-[0_16px_48px_color-mix(in_srgb,black_70%,transparent)]",
          // Top accent line
          "overflow-hidden",
        )}
        align="center"
        sideOffset={6}
        // ── Mobile fix: prevent popover from stealing focus away from the
        //    touch scroll container, and avoid viewport shift on iOS
        onOpenAutoFocus={(e) => e.preventDefault()}
        // Keep popover in-bounds on small screens
        collisionPadding={12}
        avoidCollisions
      >
        {/* Top accent */}
        <div className="h-px bg-gradient-to-r from-maxx-violet/60 via-maxx-pink/30 to-transparent" />

        <div className="flex flex-col w-full">
          
          { hasSearch && (
            <div className="flex items-center gap-3 px-4 py-3 border-b border-maxx-violet/10 bg-maxx-bg0/90">
              <Search className="h-3.5 w-3.5 shrink-0 text-maxx-violet" />
              <input
                ref={inputRef}
                className="flex-1 bg-transparent text-sm text-maxx-bright outline-none placeholder:text-maxx-dim"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                // Prevent iOS zoom on focus (font-size >= 16px in native, but
                // we handle it via the parent text-base; this attr helps)
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              {searchQuery && (
                <button
                  type="button"
                  onPointerDown={(e) => { e.preventDefault(); setSearchQuery("") }}
                  className="text-maxx-dim hover:text-maxx-sub transition-colors"
                >
                  <span className="sr-only">Clear</span>
                  <span aria-hidden className="text-sm">✕</span>
                </button>
              )}
            </div>
          )}

          {/* ── Options list ──
              Key mobile fixes:
              - explicit max-h so it doesn't overflow viewport
              - -webkit-overflow-scrolling: touch for momentum scroll on iOS
              - overscroll-contain stops page scroll leaking through
              - touch-action: pan-y ensures vertical swipes scroll the list
          ── */}
          <div
            ref={listRef}
            onPointerMove={handlePointerMove}
            className="overflow-y-auto overscroll-contain p-1.5"
            style={{
              maxHeight: "min(280px, 40vh)",
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-y",
            }}
          >
            {filteredOptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <Ghost className="w-6 h-6 text-maxx-dim" />
                <span className="text-xs font-mono text-maxx-dim tracking-wide">{emptyMessage}</span>
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected    = value === option.value
                const isHighlighted = index === highlightedIndex

                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded px-3.5 py-2.5 text-sm hover:bg-white/5",
                      "transition-all duration-150 mb-0.5 last:mb-0 outline-none hover:",
                      isHighlighted && !isSelected && "bg-maxx-violet/8 text-maxx-bright pl-5",
                      !isHighlighted && !isSelected && "text-maxx-mid",
                      isSelected && "bg-maxx-violet/12 text-maxx-violet-lt font-semibold pl-5",
                    )}
                  >
                    {/* Left indicator bar */}
                    {(isHighlighted || isSelected) && (
                      <div className={cn(
                        "absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full transition-all duration-150",
                        isSelected
                          ? "bg-maxx-violet h-1/2"
                          : "bg-maxx-violet/40 h-1/3",
                      )} />
                    )}

                    <span className="flex-1 truncate">{option.label}</span>

                    {isSelected && (
                      <Check className="ml-2 h-3.5 w-3.5 text-maxx-violet shrink-0" />
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
