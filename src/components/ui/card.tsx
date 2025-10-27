import * as React from 'react';

import { cn } from '@lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('group/card relative flex flex-col rounded-3xl border border-border/40 bg-card/80 shadow-lg shadow-black/5 backdrop-blur-xl transition hover:shadow-xl hover:shadow-black/10', className)}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-2 border-b border-border/40 px-6 pb-6 pt-5', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-1 flex-col gap-4 px-6 py-6', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('mt-auto flex items-center justify-between gap-3 border-t border-border/40 px-6 py-5', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
