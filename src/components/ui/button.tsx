import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-accent text-accent-foreground shadow-lg shadow-accent/25 hover:bg-accent/90 focus-visible:ring-accent',
        subtle: 'bg-card text-card-foreground border border-border/60 hover:bg-card/80 focus-visible:ring-border',
        outline: 'border border-border/70 bg-transparent hover:bg-foreground/10 focus-visible:ring-border',
        ghost: 'hover:bg-foreground/10 text-foreground focus-visible:ring-border',
        link: 'text-accent underline-offset-4 hover:underline focus-visible:ring-transparent',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-12 px-7 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = 'Button';

export { Button, buttonVariants };
