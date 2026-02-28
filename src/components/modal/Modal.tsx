import React, { ReactNode, useEffect, useState } from "react";
import { Drawer } from "vaul";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "../ui/dialog";

function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);
  useEffect(() => {
    function onChange(event: MediaQueryListEvent) { setValue(event.matches); }
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
  description?: string | ReactNode;
  icon?: any;
  trigger?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  desktopClass?: string;
  desktopDialogProps?: object;
  children?: ReactNode | any;
  size?: number | string;
  modalFooter?: ReactNode | any;
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
  modalFooter,
}: ModalProps) {
  const [isOpen, setIsOpen] = useState(open);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => { setIsOpen(open); }, [open]);

  const handleOpenChange = (val: boolean) => {
    setIsOpen(val);
    onOpenChange?.(val);
  };

  const Icon = icon;
  const desktopWidth = size ? (typeof size === "number" ? `${size}px` : size) : "520px";

  /* ── top accent line (replaces the old solid gradient bar) ── */
  const AccentLine = () => (
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet/70 via-maxx-pink/40 to-transparent z-10 pointer-events-none" />
  );
  
  const AmbientGlows = () => (
    <>
      <div className="fixed -top-32 -right-32 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,45,120,0.05)_0%,transparent_60%)] pointer-events-none z-0" />
      <div className="fixed top-[30%] -left-24 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(139,92,246,0.05)_0%,transparent_65%)] pointer-events-none z-0" />
      <div className="fixed -bottom-10 right-[5%] w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(6,182,212,0.04)_0%,transparent_70%)] pointer-events-none z-0" />
    </>
  );

  /* ── header ── */
  const HeaderContent = () => (
    <div className="relative px-6 pt-6 pb-4 border-b border-maxx-violet/15 flex-shrink-0">
      <div className="text-left space-y-0">
        <h2 className="font-sans font-black text-maxx-white tracking-tight flex items-center gap-3">
          {icon && (
            ("displayName" in icon && "render" in icon) ? (
              <div className="p-2 bg-maxx-violet/10 rounded-md border border-maxx-violet/20 shrink-0">
                <Icon className="w-5 h-5 text-maxx-violet" />
              </div>
            ) : (
              <>{icon}</>
            )
          )}
          <span>{title}</span>
        </h2>
        {description && (
          <p className="text-sm text-maxx-mid mt-1.5">{description}</p>
        )}
      </div>
    </div>
  );

  /* ── footer ── */
  const FooterContent = () => (
    modalFooter ? (
      <div className="px-6 py-4 border-t border-maxx-violet/15 bg-maxx-bg0/40">
        <div className="flex flex-col-reverse sm:flex-row w-full gap-3 sm:gap-2 [&>*]:w-full [&>*]:sm:w-auto [&>*]:h-12 [&>*]:sm:h-10">
          {modalFooter}
        </div>
      </div>
    ) : null
  );

  /* ════════════════════════════════════════
     MOBILE — Vaul Drawer
  ════════════════════════════════════════ */
  if (!isDesktop) {
    return (
      <Drawer.Root open={isOpen} onOpenChange={handleOpenChange} shouldScaleBackground>
        {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-maxx-bg0/80 backdrop-blur-sm z-50" />
          <Drawer.Content
            className={`
              bg-maxx-bg0 border-t border-maxx-violet/25
              flex flex-col rounded-t-lg
              h-auto max-h-[90vh] mt-24
              fixed bottom-0 left-0 right-0 z-50
              focus:outline-none overflow-hidden
              shadow-[0_-10px_40px_rgba(0,0,0,0.7)]
              overflow-x-hidden
              ${className}
            `}
          >
            <AccentLine />

            <Drawer.Title className="sr-only">{title}</Drawer.Title>
            <Drawer.Description className="sr-only">{description}</Drawer.Description>

            {/* drag handle */}
            <div className="mx-auto w-10 h-1 flex-shrink-0 rounded-sm bg-maxx-violet/60 mt-4 mb-2 relative z-20" />

            <div className="flex flex-col overflow-hidden h-full w-full ">
              <HeaderContent />
              
              <div className="flex-1 overflow-y-auto p-5 pb-8 bg-maxx-bg1/20 overflow-x-hidden">
                {/* ambient glows — larger, more layered */}
                <AmbientGlows />
                
                {children}
              </div>
              <FooterContent />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  /* ════════════════════════════════════════
     DESKTOP — Dialog
  ════════════════════════════════════════ */
  const dialogContentExtraProps = {
    onEscapeKeyDown:      (e) => e.preventDefault(),
    onPointerDownOutside: (e) => e.preventDefault(),
    ...desktopDialogProps,
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild className="z-10">{trigger}</DialogTrigger>}

      <DialogContent
        style={{ "--desktop-width": desktopWidth } as React.CSSProperties}
        className={`
          flex flex-col
          bg-maxx-bg0 backdrop-blur-xl
          border border-maxx-violet/25
          shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(139,92,246,0.06)]
          p-0 gap-0 overflow-hidden
          fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]
          w-[var(--desktop-width)] rounded-lg
          h-auto max-h-[85vh]
          data-[state=open]:slide-in-from-left-1/2
          data-[state=open]:slide-in-from-top-1/2
          overflow-x-hidden
          ${className} ${desktopClass}
        `}
        {...dialogContentExtraProps}
      >
        <AccentLine />

        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>

        <HeaderContent />

        <div className="flex-1 overflow-y-auto p-6 overflow-x-hidden">
          {/* noise */}
          <div className="fixed inset-0 pointer-events-none z-0 bg-noise-pattern opacity-100" />
  
          {/* ambient glows — larger, more layered */}
          <div className="fixed -top-40 -right-40 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(255,45,120,0.06)_0%,transparent_60%)] pointer-events-none z-0" />
          <div className="fixed top-[28%] -left-28 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(139,92,246,0.055)_0%,transparent_65%)] pointer-events-none z-0" />
          <div className="fixed bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(168,85,247,0.04)_0%,transparent_70%)] pointer-events-none z-0" />

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
