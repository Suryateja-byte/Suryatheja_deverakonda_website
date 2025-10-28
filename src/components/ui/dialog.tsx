import * as DialogPrimitive from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import * as React from 'react';

import { cn } from '@lib/utils';
import { useTheme } from '@components/providers/ThemeProvider';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(
  ({ className, ...props }, ref) => {
    const { theme, resolvedTheme } = useTheme();
    const isDarkMode = (resolvedTheme ?? theme) === 'dark';

    return (
      <DialogPrimitive.Overlay asChild ref={ref} {...props}>
        <motion.div
          data-lenis-prevent
          className={cn(
            'fixed inset-0 z-40',
            isDarkMode
              ? 'bg-slate-950/80'
              : 'bg-slate-950/60',
            className,
          )}
          style={{
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            willChange: 'opacity',
          }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
            opacity: { duration: 0.3 }
          }}
          onAnimationComplete={(definition) => {
            // Remove will-change after animation
            if (definition === 'animate' || definition === 'exit') {
              const elements = document.querySelectorAll('[data-radix-dialog-overlay]');
              elements.forEach((el) => {
                if (el instanceof HTMLElement) {
                  el.style.willChange = 'auto';
                }
              });
            }
          }}
        />
      </DialogPrimitive.Overlay>
    );
  },
);
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    open?: boolean;
    onExitComplete?: () => void;
  }
>(
  ({ className, children, open, onExitComplete, ...props }, ref) => (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        // Ensure cleanup after exit animation completes
        if (typeof window !== 'undefined') {
          // Force a reflow to prevent flickering
          void document.body.offsetHeight;
        }
        onExitComplete?.();
      }}
    >
      {open && (
        <DialogPortal forceMount>
          <DialogOverlay />
          <DialogPrimitive.Content asChild {...props}>
            <motion.div
              data-lenis-prevent
              ref={ref}
              className={cn(
                'fixed inset-x-4 top-[10%] z-50 mx-auto w-full max-w-3xl origin-center rounded-3xl border border-border/60 bg-background/95 p-8 shadow-2xl',
                className,
              )}
              style={{
                backdropFilter: 'blur(24px) saturate(190%)',
                WebkitBackdropFilter: 'blur(24px) saturate(190%)',
                willChange: 'opacity, transform',
              }}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
                opacity: { duration: 0.3 }
              }}
              onAnimationComplete={(definition) => {
                // Remove will-change after animation to free GPU
                if (definition === 'animate' || definition === 'exit') {
                  const element = ref && 'current' in ref ? ref.current : null;
                  if (element && element.style) {
                    element.style.willChange = 'auto';
                  }
                }
              }}
            >
              {children}
            </motion.div>
          </DialogPrimitive.Content>
        </DialogPortal>
      )}
    </AnimatePresence>
  ),
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('space-y-2 text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Title ref={ref} className={cn('text-2xl font-semibold text-foreground', className)} {...props} />
  ),
);
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Description>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  ),
);
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription };
