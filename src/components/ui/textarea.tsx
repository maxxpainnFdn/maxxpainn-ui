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
          <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
            {label}
          </label>
        )}

        {/* Textarea Container */}
        <div className="relative group">
          <textarea
            className={cn(
              // Base styles
              "flex min-h-[120px] w-full rounded-xl px-4 py-3 text-base transition-all duration-300",
              "bg-background border-2 text-foreground placeholder:text-muted-foreground",
              "resize-y",

              // Focus states
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",

              // Default border
              "border-input",

              // Hover state
              "hover:border-gray-700/70",

              // Focus state (default)
              !error && !success && "focus-visible:border-purple-500/60 focus-visible:ring-purple-500/30",

              // Success state
              success && !error && "border-emerald-500/50 focus-visible:border-emerald-500/70 focus-visible:ring-emerald-500/30",

              // Error state
              error && "border-red-500/50 focus-visible:border-red-500/70 focus-visible:ring-red-500/30",

              // Disabled state
              "disabled:cursor-not-allowed disabled:opacity-50",

              className
            )}
            ref={ref}
            {...props}
          />

          {/* Success Icon */}
          {success && !error && (
            <div className="absolute right-4 top-4 pointer-events-none">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
          )}

          {/* Error Icon */}
          {error && (
            <div className="absolute right-4 top-4 pointer-events-none">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
          )}
        </div>

        {/* Hint Text */}
        {hint && !error && (
          <p className="mt-2 text-xs text-muted-foreground flex items-start gap-1.5">
            <span className="inline-block w-1 h-1 rounded-full bg-gray-600 mt-1.5" />
            <span>{hint}</span>
          </p>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-2 flex items-start gap-2 text-sm text-red-400">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && !error && !hint && (
          <div className="mt-2 flex items-start gap-2 text-sm text-emerald-400">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="font-medium">Looks good!</span>
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
