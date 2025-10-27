import type { ReactNode } from 'react';

import { cn } from '@lib/utils';

type ResumeGuardProps = {
  loading: boolean;
  error: Error | null;
  children: ReactNode;
  skeletonClassName?: string;
};

export const ResumeGuard = ({ loading, error, children, skeletonClassName }: ResumeGuardProps) => {
  if (loading) {
    return (
      <div
        className={cn(
          'animate-pulse space-y-3 rounded-3xl border border-border/40 bg-muted/40 p-6 shadow-inner shadow-black/5 dark:bg-muted/10',
          skeletonClassName,
        )}
        aria-busy="true"
        aria-live="polite"
      >
        <div className="h-5 w-24 rounded-full bg-foreground/10" />
        <div className="h-4 w-3/4 rounded bg-foreground/10" />
        <div className="h-4 w-2/3 rounded bg-foreground/10" />
        <div className="h-4 w-1/2 rounded bg-foreground/10" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-100">
        <p className="font-semibold">Unable to load resume data.</p>
        <p className="mt-1 opacity-80">{error.message}</p>
      </div>
    );
  }

  return <>{children}</>;
};
