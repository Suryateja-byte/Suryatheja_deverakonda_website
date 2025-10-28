import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider transition-colors',
  {
    variants: {
      variant: {
        default: 'border-border bg-muted/60 text-muted-foreground',
        accent: 'border-transparent bg-accent text-accent-foreground shadow-sm',
        outline: 'border-border/80 text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, variant, ...props }, ref) => {
  return <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />;
});
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
