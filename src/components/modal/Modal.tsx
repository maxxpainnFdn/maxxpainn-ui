import React, { ReactNode, useEffect, useState } from "react";
import { Drawer } from "vaul";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

// Simple hook to detect mobile screen
function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);
  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }
    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);
    return () => result.removeEventListener("change", onChange);
  }, [query]);
  return value;
}

export interface ModalProps {
  open?: boolean;
  title: string | ReactNode;
  description?: string  | ReactNode;
  icon?: any;
  trigger?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  desktopClass?: string;
  desktopDialogProps?: object;
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
  desktopClass = "",
  desktopDialogProps = {},
  size,
  children = <></>,
  modalFooter
}: ModalProps) {

  const [isOpen, setIsOpen] = useState(open);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  //console.log("desktopClass====>", desktopClass)

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleOpenChange = (val: boolean) => {
    setIsOpen(val);
    onOpenChange?.(val);
  };

  const Icon = icon;
  const desktopWidth = size ? (typeof size === 'number' ? `${size}px` : size) : "520px";

  // The Gradient Line Component
  const GradientLine = () => (
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 z-10" />
  );

  ///console.log("icon===>", icon)

  // Shared Header Content (Removed the gradient from here)
  const HeaderContent = () => (
    <div className="p-5 sm:p-6 pb-4 border-b border-white/5 bg-black/20 flex-shrink-0">
      <div className="text-left space-y-0">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-3">
          {icon && (
            <>
              { ("displayName" in icon && "render" in icon) ? (
                <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 shrink-0">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
              ) : (
                  <>{ icon }</>
              )}
            </>
          )}
          <span>{title}</span>
        </h2>
        {description && (
          <p className="text-gray-400 mt-2 text-sm sm:text-base">{description}</p>
        )}
      </div>
    </div>
  );

  // Shared Footer Content
  const FooterContent = () => (
    modalFooter ? (
      <div className="p-5 sm:p-6 pt-4 border-t border-white/5 bg-black/20">
        <div className="flex flex-col-reverse sm:flex-row w-full gap-3 sm:gap-2 [&>*]:w-full [&>*]:sm:w-auto [&>*]:h-12 [&>*]:sm:h-10">
          {modalFooter}
        </div>
      </div>
    ) : null
  );

  // --- MOBILE VIEW (Physic-based Drawer) ---
  if (!isDesktop) {
    return (
      <Drawer.Root
        open={isOpen}
        onOpenChange={handleOpenChange}
        shouldScaleBackground
      >
        {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
          <Drawer.Content
            className={`
              bg-gray-900 border-t border-white/10 flex flex-col rounded-t-[20px]
              h-auto max-h-[90vh] mt-24 fixed bottom-0 left-0 right-0 z-50 focus:outline-none
              shadow-[0_-10px_40px_rgba(0,0,0,0.6)]
              overflow-hidden ${className} 
            `}
          >
            {/* 1. Gradient Line at the absolute top */}
            <GradientLine />

            {/* Accessible Titles */}
            <Drawer.Title className="sr-only">{title}</Drawer.Title>
            <Drawer.Description className="sr-only">{description}</Drawer.Description>

            {/* 2. The Handle (now below the gradient) */}
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-600/50 mb-2 mt-4 relative z-20" />

            <div className="flex flex-col overflow-hidden bg-gray-900/50 backdrop-blur-2xl h-full w-full">
              <HeaderContent />
              <div className="flex-1 overflow-y-auto p-5 pb-8">
                {children}
              </div>
              <FooterContent />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  let dialogContentExtraProps = {}

  if(isDesktop){
    dialogContentExtraProps = {
      onEscapeKeyDown: ((e) => e.preventDefault()),
      onPointerDownOutside: ((e) => e.preventDefault()),
      ...desktopDialogProps
    }
  }

  // --- DESKTOP VIEW (Standard Modal) ---
  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleOpenChange}
    >

      {trigger && <DialogTrigger asChild className="z-10">{trigger}</DialogTrigger>}

      <DialogContent
        style={{ '--desktop-width': desktopWidth } as React.CSSProperties}
        className={`
          flex flex-col bg-gray-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl p-0 gap-0 overflow-hidden
          fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]
          w-[var(--desktop-width)] rounded-xl h-auto max-h-[85vh]
          data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-1/2
          ${className} ${desktopClass}
        `}
        { ...dialogContentExtraProps }
      >
        {/* 1. Gradient Line at the absolute top */}
        <GradientLine />

        {/* Accessible Titles */}
        <DialogTitle className="sr-only text-lg">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>

        <HeaderContent />

        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {modalFooter && (
          <DialogFooter className="p-0 block">
             <FooterContent />
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
