import { ReactNode, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";


export interface ModalProps {
  open?: boolean;
  title: string;
  description?: string;
  icon?: ReactNode | any;
  trigger?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children?: ReactNode | any;
  size?: number | string;
  modalFooter?: ReactNode | any
}

export default function Modal({
  open = false,
  title,
  description = "",
  icon,
  trigger,
  onOpenChange,
  className = "",
  size,
  children = <></>,
  modalFooter
}: ModalProps) {

   const [isDialogOpen, setDialogOpen] = useState(open);

   useEffect(()=> {
     setDialogOpen(open)
   }, [open])

  const handleOpenChange = (open: boolean) => {
     setDialogOpen(open);
     onOpenChange?.(open);
  };

  size = (size) ? size + "px" : "520px";

  const Icon = icon;

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange} modal={true}>
      {trigger &&
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      }
      <DialogContent
        className={`
          sm:max-w-[${size}]
          flex flex-col bg-gray-900/95
          backdrop-blur-2xl
          border border-white/10
          shadow-[0_0_50px_rgba(0,0,0,0.5)]
          p-0 gap-0 overflow-hidden
          ${className}
        `}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >

        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-white/5 bg-black/20 flex-shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600" />
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-3">
              { icon && (
                <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <Icon className="w-6 h-6 text-purple-400" />
                </div>
              )}
              { title }
            </DialogTitle>
            <DialogDescription className="text-gray-400 ml-1">
              { description }
            </DialogDescription>
          </DialogHeader>
        </div>
        {/* Content */}
        {/* Scrollable Content */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain p-6"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          { children }
        </div>

        {modalFooter &&
          <DialogFooter>
            { modalFooter }
          </DialogFooter>
        }
      </DialogContent>
    </Dialog>
  )
}
