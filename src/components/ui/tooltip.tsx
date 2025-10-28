import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn } from '@lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;
const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>>(
  ({ className, sideOffset = 8, ...props }, ref) => (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'rounded-full border border-border/40 bg-foreground px-3 py-1 text-xs font-medium text-background shadow-lg shadow-black/20',
        className,
      )}
      {...props}
    />
  ),
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { TooltipProvider, TooltipRoot as Tooltip, TooltipTrigger, TooltipContent };
