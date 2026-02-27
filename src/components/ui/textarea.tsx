import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  hint?: string
  success?: boolean
  label?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, hint, success, label, ...props }, ref) => {
    return (
      <div className="w-full">

        {/* Label */}
        {label && (
          <label className="font-mono text-[0.7rem] font-medium tracking-[0.14em] uppercase text-maxx-violet block mb-2">
            {label}
          </label>
        )}

        {/* Textarea container */}
        <div className="relative group">
          <textarea
            className={cn(
              // Base
              "flex min-h-[120px] w-full rounded-md px-4 py-3.5 text-base leading-relaxed transition-all duration-200",
              "bg-maxx-bg0/60 text-maxx-bright placeholder:text-maxx-dim",
              "border resize-y focus-visible:outline-none",
              // Disabled
              "disabled:cursor-not-allowed disabled:opacity-50",
              // Default state
              !error && !success && [
                "border-maxx-violet/20",
                "hover:border-maxx-violet/35",
                "focus-visible:border-maxx-violet/55",
                "focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--maxx-violet)_12%,transparent)]",
              ],
              // Success state
              success && !error && [
                "border-emerald-500/40",
                "hover:border-emerald-500/60",
                "focus-visible:border-emerald-500/70",
                "focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--maxx-emerald)_12%,transparent)]",
              ],
              // Error state
              error && [
                "border-maxx-pink/40",
                "hover:border-maxx-pink/60",
                "focus-visible:border-maxx-pink/70",
                "focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--maxx-pink)_12%,transparent)]",
              ],
              // Icon padding
              (error || success) && "pr-11",
              className
            )}
            ref={ref}
            {...props}
          />

          {/* Success icon */}
          {success && !error && (
            <div className="absolute right-3.5 top-3.5 pointer-events-none">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          )}

          {/* Error icon */}
          {error && (
            <div className="absolute right-3.5 top-3.5 pointer-events-none">
              <AlertCircle className="w-4 h-4 text-maxx-pink" />
            </div>
          )}
        </div>

        {/* Hint */}
        {hint && !error && (
          <p className="mt-2 text-xs text-maxx-sub flex items-start gap-1.5">
            <span className="inline-block w-1 h-1 rounded-sm bg-maxx-dim mt-[5px] shrink-0" />
            <span>{hint}</span>
          </p>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-maxx-pink">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Success message */}
        {success && !error && !hint && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium">Looks good!</span>
          </div>
        )}

      </div>
    )
  }
)

Textarea.displayName = "Textarea"
export { Textarea }
