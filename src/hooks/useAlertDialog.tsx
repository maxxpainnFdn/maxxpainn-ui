import * as React from "react"

type ConfirmOptions = {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
}

type Resolver = (value: boolean) => void

type AlertDialogContextType = {
  confirm: (
    title: string,
    description?: string,
    options?: Partial<ConfirmOptions>
  ) => Promise<boolean>
}

export const AlertDialogContext =
  React.createContext<AlertDialogContextType | null>(null)

export function useAlertDialog() {
  const ctx = React.useContext(AlertDialogContext)
  if (!ctx) {
    throw new Error("useAlertDialog must be used within AlertDialogProvider")
  }
  return ctx
}
