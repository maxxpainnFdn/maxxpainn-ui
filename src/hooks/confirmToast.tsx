import { toast } from "sonner"
import { AlertTriangle } from "lucide-react"

interface ConfirmOptions {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "danger"
}

export const confirmToast = ({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: ConfirmOptions): Promise<boolean> => {
  return new Promise((resolve) => {
    // Create overlay element
    const overlay = document.createElement("div")
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: 9998;
      animation: fadeIn 0.2s ease-out;
    `

    // Add animations to document
    const styleId = "sonner-confirm-styles"
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style")
      style.id = styleId
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        /* Remove Sonner's default toast styling */
        [data-sonner-toast][data-styled="false"] {
          border: none !important;
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
      `
      document.head.appendChild(style)
    }

    document.body.appendChild(overlay)

    const cleanup = () => {
      overlay.style.animation = "fadeOut 0.2s ease-out"
      setTimeout(() => {
        if (overlay.parentNode) {
          document.body.removeChild(overlay)
        }
      }, 200)
    }

    const handleConfirm = () => {
      cleanup()
      toast.dismiss()
      resolve(true)
    }

    const handleCancel = () => {
      cleanup()
      toast.dismiss()
      resolve(false)
    }

    // Show the custom toast
    toast.custom(
      (t) => (
        <div
          className="bg-card/95 text-card-foreground  backdrop-blur-xl rounded-xl gap-3 px-3 py-4 transition-all duration-300 min-w-[320px] max-w-md"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                variant === "danger" ? "text-pink-400" : "text-orange-400"
              }`}
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-base mb-1">{title}</div>
              {description && (
                <div className="text-muted-foreground text-sm font-medium">
                  {description}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <button
              onClick={handleCancel}
              className="bg-muted text-muted-foreground rounded-lg px-4 py-2 hover:bg-muted/80 transition-all font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`rounded-lg px-4 py-2 font-semibold transition-all shadow-md ${
                variant === "danger"
                  ? "bg-pink-500 text-white hover:bg-pink-600"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        unstyled: true,
      }
    )
  })
}