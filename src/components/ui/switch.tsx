import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as React from 'react';

import { cn } from '@lib/utils';

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>>(
  ({ className, ...props }, ref) => (
    <SwitchPrimitives.Root
      className={cn(
        'peer inline-flex h-[30px] w-[54px] shrink-0 cursor-pointer items-center rounded-full border border-border/60 bg-muted/70 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 data-[state=checked]:bg-accent data-[state=checked]:border-accent/80',
        className,
      )}
      ref={ref}
      {...props}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none block h-5 w-5 translate-x-[6px] rounded-full bg-background shadow transition data-[state=checked]:translate-x-[26px] data-[state=checked]:bg-white'
        )}
      />
    </SwitchPrimitives.Root>
  ),
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
