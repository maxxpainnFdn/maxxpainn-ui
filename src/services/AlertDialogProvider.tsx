import * as React from "react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { AlertDialogContext } from "../hooks/useAlertDialog"
import Modal from "@/components/modal/Modal"
import Button from "@/components/button/Button"

export function AlertDialogProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const [state, setState] = React.useState<{
    title: string
    description?: string
    confirmText?: string
    cancelText?: string
    resolver?: (value: boolean) => void
  } | null>(null)

  const confirm = (
    title: string,
    description?: string,
    options?: {
      confirmText?: string
      cancelText?: string
    }
  ) => {
    return new Promise<boolean>((resolve) => {
      setState({
        title,
        description,
        confirmText: options?.confirmText,
        cancelText: options?.cancelText,
        resolver: resolve,
      })
      setOpen(true)
    })
  }

  const close = (result: boolean) => {
    state?.resolver?.(result)
    setOpen(false)
    setState(null)
  }

  return (
    <AlertDialogContext.Provider value={{ confirm }}>
      {children}
      <Modal
        open={open}
        onOpenChange={(o) => !o && close(false)}
        title={state?.title || "Confirm"}
      >
        <div className="pb-6">
          {state?.description || ""}
        </div>
        <div className="flex gap-x-2 justify-end">
          <Button variant="secondary" onClick={() => close(false)}>
            {state?.cancelText ?? "Cancel"}
          </Button>
          <Button variant="primary" onClick={() => close(true)}>
             {state?.confirmText ?? "Continue"}
          </Button>
         </div>
      </Modal>
    </AlertDialogContext.Provider>
  )
}
