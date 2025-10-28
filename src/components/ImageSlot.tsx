import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { IMAGE_SLOTS, type ImageSlotDefinition } from '@config/IMAGE_SLOTS';
import { useImageSlotRegistry } from '@components/providers/ImageSlotRegistry';
import { cn, isBrowser, prefersReducedMotion } from '@lib/utils';

export type ImageSlotProps = {
  slotId: keyof typeof IMAGE_SLOTS | string;
  alt?: string;
  className?: string;
  withBorder?: boolean;
  priority?: boolean;
};

type SlotState = 'loading' | 'resolved' | 'missing';

const gradientBackground =
  'bg-gradient-to-br from-slate-900/90 via-slate-800/70 to-slate-900/95 dark:from-slate-100/10 dark:via-slate-200/5 dark:to-slate-100/10';

const deriveInitialState = (slot: ImageSlotDefinition | null): SlotState => {
  if (!slot) return 'missing';
  const candidate = slot.files.webp ?? slot.files.svg ?? slot.files.fallback;
  if (!candidate) return 'missing';
  if (!isBrowser()) return 'resolved';
  return 'loading';
};

export function ImageSlot({ slotId, alt, className, withBorder, priority = false }: ImageSlotProps) {
  const slot = useMemo(() => IMAGE_SLOTS[slotId] ?? null, [slotId]);
  const { reportSlotStatus } = useImageSlotRegistry();
  const [status, setStatus] = useState<SlotState>(() => deriveInitialState(slot));
  const [copied, setCopied] = useState(false);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    setStatus(deriveInitialState(slot));
  }, [slot]);

  useEffect(() => {
    if (!slot) return;
    reportSlotStatus(slot.id, slot, status);
  }, [slot, status, reportSlotStatus]);

  useEffect(() => {
    if (!slot) return;
    if (status === 'resolved' || status === 'missing') return;

    if (slot.files.fallback) {
      const fallbackImg = new Image();
      fallbackImg.src = slot.files.fallback;
    }
  }, [slot, status]);

  const handleCopyPrompt = useCallback(async () => {
    if (!slot?.prompt || !navigator?.clipboard) return;
    try {
      await navigator.clipboard.writeText(slot.prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch (error) {
      console.error('Unable to copy prompt', error);
    }
  }, [slot]);

  const handleLoad = useCallback(() => setStatus('resolved'), []);
  const handleError = useCallback(() => setStatus('missing'), []);

  if (!slot) {
    return (
      <div className={cn('relative aspect-[16/9] rounded-3xl border border-dashed border-muted-foreground/40', className)}>
        <span className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground/70">
          Unknown image slot: {slotId}
        </span>
      </div>
    );
  }

  const resolvedAlt = alt ?? slot.alt;
  const aspectStyle: CSSProperties = {
    aspectRatio: slot.aspectRatio,
  };

  const primaryAsset = slot.files.webp ?? slot.files.svg ?? slot.files.fallback ?? '';
  const loadingStrategy = priority ? 'eager' : 'lazy';
  const fetchPriority = priority ? 'high' : 'auto';
  const decodingStrategy = priority ? 'sync' : 'async';
  const shimmerStyle = {
    backgroundSize: '200% 100%',
  } satisfies CSSProperties;

  const placeholder = (
    <div
      className={cn(
        'absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/10 bg-slate-900/80 px-6 py-8 text-center text-sm text-slate-200 shadow-inner shadow-black/30 dark:border-white/5 dark:bg-slate-50/5 dark:text-slate-200',
        gradientBackground,
      )}
      data-slot={slot.id}
      data-prompt={slot.prompt ?? ''}
      aria-label={resolvedAlt}
      role="img"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_60%)]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/5 via-white/25 to-white/5 opacity-80"
        aria-hidden="true"
        style={{
          ...shimmerStyle,
          animation: reducedMotion ? undefined : 'shimmer 2.4s linear infinite',
        }}
      />
      <div className="relative flex flex-col items-center gap-3">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-widest text-white/80 dark:bg-white/10">
          {slot.label}
        </span>
        {slot.prompt ? (
          <p className="max-w-xs text-balance text-sm text-slate-200/90">{slot.prompt}</p>
        ) : (
          <p className="max-w-xs text-balance text-sm text-slate-200/90">
            Add your artwork to {primaryAsset || 'the configured asset path'}
          </p>
        )}
        {slot.prompt ? (
          <button
            type="button"
            onClick={handleCopyPrompt}
            className="group relative mt-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-white transition hover:border-white/40 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <span>Copy prompt</span>
            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: reducedMotion ? 0 : 0.18 }}
                  className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-900 shadow"
                >
                  Copied
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ) : null}
      </div>
    </div>
  );

  return (
    <figure
      className={cn(
        'relative flex w-full overflow-hidden rounded-3xl',
        withBorder && 'border border-border/40 backdrop-blur-lg supports-backdrop:bg-white/5',
        className,
      )}
      data-slot={slot.id}
      data-prompt={slot.prompt ?? ''}
    >
      <div className="relative h-full w-full" style={aspectStyle}>
        <picture className="block h-full w-full">
          {slot.files.webp ? <source srcSet={slot.files.webp} type="image/webp" /> : null}
          {slot.files.svg ? <source srcSet={slot.files.svg} type="image/svg+xml" /> : null}
          <img
            src={primaryAsset}
            alt={resolvedAlt}
            width={slot.width}
            height={slot.height}
            loading={loadingStrategy}
            fetchPriority={fetchPriority}
            decoding={decodingStrategy}
            className={cn(
              'h-full w-full object-cover object-center transition-opacity duration-700 ease-out',
              reducedMotion ? undefined : status === 'resolved' ? 'opacity-100' : 'opacity-0',
            )}
            onLoad={handleLoad}
            onError={handleError}
          />
        </picture>
        {status !== 'resolved' ? placeholder : null}
      </div>
    </figure>
  );
}
