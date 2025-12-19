import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"
import { CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react"
import "./sonner.css"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      className="toaster group"
      icons={{
        success: <CheckCircle2 className="h-5 w-5 text-cyan-400" />,
        error: <XCircle className="h-5 w-5 text-pink-400" />,
        info: <Info className="h-5 w-5 text-purple-600" />,
        warning: <AlertTriangle className="h-5 w-5 text-orange-400" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast", // Just needs the base classes now
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
        style: {
          zIndex: 9999,
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
