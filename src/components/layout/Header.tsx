import { useEffect, useRef, useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';
import { MoonStar, SunMedium } from 'lucide-react';

import { useSmoothScroll } from '@components/layout/SmoothScrollProvider';
import { useTheme } from '@components/providers/ThemeProvider';
import { useDialogState } from '@components/providers/DialogStateProvider';
import { Button } from '@components/ui/button';
import { SECTION_NAV_ITEMS, type SectionNavItem } from '@config/sections';
import { cn, prefersReducedMotion } from '@lib/utils';

interface HeaderProps {
  activeId: string;
  resumeName: string;
  resumeTitle?: string;
  availableSections: SectionNavItem[];
}

const hoverMotion: MotionProps = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.08 },
};

export function Header({ activeId, resumeName, resumeTitle, availableSections }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [navActiveId, setNavActiveId] = useState(activeId);
  const [pendingNavId, setPendingNavId] = useState<string | null>(null);
  const pendingTimerRef = useRef<number | null>(null);
  const fallbackAnimationRef = useRef<number | null>(null);
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const { isDialogOpen } = useDialogState();
  const smoothScroll = useSmoothScroll();
  const isDarkMode = (resolvedTheme ?? theme) === 'dark';
  const logoSrc = isDarkMode ? '/assets/logo/SD_logo_light.png' : '/assets/logo/SD_logo_dark.png';
  const reduceMotion = prefersReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!pendingNavId && availableSections.some((section) => section.id === activeId)) {
      setNavActiveId(activeId);
      return;
    }

    if (pendingNavId && activeId === pendingNavId) {
      setNavActiveId(activeId);
      setPendingNavId(null);
      if (pendingTimerRef.current !== null) {
        window.clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = null;
      }
    }
  }, [activeId, availableSections, pendingNavId]);

  useEffect(
    () => () => {
      if (pendingTimerRef.current !== null) {
        window.clearTimeout(pendingTimerRef.current);
      }
      if (fallbackAnimationRef.current !== null) {
        window.cancelAnimationFrame(fallbackAnimationRef.current);
      }
    },
    [],
  );

  const cancelFallbackAnimation = () => {
    if (fallbackAnimationRef.current !== null) {
      window.cancelAnimationFrame(fallbackAnimationRef.current);
      fallbackAnimationRef.current = null;
    }
  };

  const animateScrollFallback = (to: number) => {
    cancelFallbackAnimation();

    const start = window.scrollY || window.pageYOffset;
    const distance = to - start;
    if (Math.abs(distance) < 1) {
      window.scrollTo({ top: to });
      return;
    }

    const baseDuration = 0.9;
    const distanceFactor = Math.min(2.5, Math.abs(distance) / 1200);
    const durationMs = Math.max(600, Math.min(2200, (baseDuration + distanceFactor * 0.75) * 1000));
    const anticipationCutoff = 0.1;

    const ease = (t: number) => {
      if (t < anticipationCutoff) {
        return Math.pow((t / anticipationCutoff) * 1.1, 1.25) * 0.06;
      }
      const adjustedT = (t - anticipationCutoff) / (1 - anticipationCutoff);
      return 0.06 + (1 - Math.pow(1 - adjustedT, 3.6)) * 0.94;
    };

    let startTime = 0;
    const step = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = ease(progress);

      window.scrollTo({
        top: start + distance * eased,
        behavior: 'auto',
      });

      if (progress < 1) {
        fallbackAnimationRef.current = window.requestAnimationFrame(step);
      } else {
        fallbackAnimationRef.current = null;
      }
    };

    fallbackAnimationRef.current = window.requestAnimationFrame(step);
  };

  // Keeps the highlight anchored on the tapped nav item while the scroll animation is in flight.
  const schedulePendingNavReset = (targetId: string) => {
    setPendingNavId(targetId);
    if (pendingTimerRef.current !== null) {
      window.clearTimeout(pendingTimerRef.current);
    }
    pendingTimerRef.current = window.setTimeout(() => {
      setPendingNavId(null);
      pendingTimerRef.current = null;
    }, 2400);
  };

  const handleNavigate = (id: string) => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;

    cancelFallbackAnimation();

    const target = document.querySelector<HTMLElement>(`[data-section="${id}"]`);
    if (!target) return;

    // Anticipation delay: Update highlight first, then scroll
    // This creates a more intentional, premium feel
    requestAnimationFrame(() => {
      setNavActiveId(id);
      schedulePendingNavReset(id);
    });

    const headerElement = document.querySelector<HTMLElement>('[data-site-header]');
    const headerOffset = (headerElement?.offsetHeight ?? 0) + 16;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    const top = Math.max(targetTop, 0);

    if (smoothScroll?.lenis) {
      const lenisInstance = smoothScroll.lenis;
      if (!smoothScroll.isEnabled) {
        smoothScroll.start();
      }

      const currentPosition = lenisInstance.scroll;
      const distance = Math.abs(currentPosition - top);

      // Premium duration calculation with min/max bounds
      const baseDuration = 0.9;
      const distanceFactor = Math.min(2.5, distance / 1200);
      const duration = Math.max(0.6, Math.min(2.2, baseDuration + distanceFactor * 0.75));

      // Ultra-smooth with slight delay for highlight to settle (120ms)
      setTimeout(() => {
        lenisInstance.scrollTo(target, {
          offset: -headerOffset,
          duration,
          // Premium easing: ease-out-expo for buttery deceleration
          easing: (t: number) => {
            // Custom bezier: anticipation + smooth deceleration
            // Starts slow (anticipation), accelerates, then smooth ease-out
            if (t < 0.1) {
              // Slight anticipation (10% of journey)
              return Math.pow(t * 10, 1.2) * 0.05;
            }
            // Main movement with expo ease-out
            const adjustedT = (t - 0.1) / 0.9;
            return 0.05 + (1 - Math.pow(1 - adjustedT, 3.5)) * 0.95;
          },
          // Smooth velocity inheritance
          lerp: 0.08,
        });
      }, 120);
      return;
    }

    // Fallback for browsers without Lenis
    setTimeout(() => {
      animateScrollFallback(top);
    }, 120);
  };

  const displayName = resumeName?.trim() || 'Portfolio';
  const titleSuffix = resumeTitle?.trim() ? ` – ${resumeTitle}` : '';

  return (
    <header
      data-site-header
      style={
        isDialogOpen || scrolled
          ? {
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            }
          : undefined
      }
      className={cn(
        'sticky top-5 z-50 mx-auto w-full max-w-[min(1320px,95%)] overflow-hidden rounded-full border px-3 transition-all duration-500 ease-out',
        isDialogOpen
          ? isDarkMode
            ? 'border-slate-700/70 bg-slate-900/75 shadow-xl shadow-black/30'
            : 'border-slate-300/70 bg-white/75 shadow-xl shadow-slate-900/20'
          : scrolled
            ? 'border-border/70 bg-background/80 shadow-lg shadow-black/10'
            : 'border-transparent bg-transparent',
      )}
    >
      <nav className="flex items-center justify-between gap-4 px-4 py-3">
        <motion.button
          {...hoverMotion}
          type="button"
          onClick={() => handleNavigate('hero')}
          className="group flex shrink-0 items-center justify-center rounded-full bg-foreground/5 px-3 py-2 backdrop-blur-lg transition"
          aria-label={`Navigate to hero section (${displayName}${titleSuffix})`}
        >
          <img
            src={logoSrc}
            alt={`${displayName} logo`}
            className="h-9 w-auto transition-transform duration-300 group-hover:scale-[1.04]"
            loading="lazy"
          />
          <span className="sr-only">{displayName}{titleSuffix}</span>
        </motion.button>

        <LayoutGroup id="header-nav">
          <ul className="relative hidden flex-1 list-none items-center justify-center gap-1 md:flex">
            {availableSections.map((item) => {
              const isActive = navActiveId === item.id;
              return (
                <motion.li key={item.id} layout className="relative isolate px-1 py-0.5">
                  <button
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'relative z-10 flex items-center justify-center rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ease-out',
                      isActive
                        ? 'text-background drop-shadow-[0_10px_25px_rgba(15,23,42,0.18)]'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <span className="relative z-10">{item.label}</span>
                  </button>
                  {isActive ? (
                    <>
                      <motion.span
                        layoutId="navHighlightBlur"
                        className="pointer-events-none absolute inset-0 -z-20 rounded-full bg-foreground/45 blur-2xl"
                        transition={
                          reduceMotion
                            ? { duration: 0.15 }
                            : {
                                type: 'spring',
                                stiffness: 380,
                                damping: 42,
                                mass: 0.8,
                                velocity: 2,
                              }
                        }
                      />
                      <motion.span
                        layoutId="navHighlight"
                        className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-foreground via-foreground to-foreground/80 shadow-[0_20px_45px_-25px_rgba(15,23,42,0.55)]"
                        transition={
                          reduceMotion
                            ? { duration: 0.15 }
                            : {
                                type: 'spring',
                                stiffness: 400,
                                damping: 40,
                                mass: 0.85,
                                velocity: 2,
                              }
                        }
                      />
                    </>
                  ) : null}
                </motion.li>
              );
            })}
          </ul>
        </LayoutGroup>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Toggle theme (${theme})`}
            className="rounded-full border border-border/50"
          >
            {resolvedTheme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          </Button>
        </div>
      </nav>
    </header>
  );
}

export function buildAvailableSections({
  includeTestimonials,
  includeBlog,
  includeEducation,
  includeCertifications,
}: {
  includeTestimonials: boolean;
  includeBlog: boolean;
  includeEducation: boolean;
  includeCertifications: boolean;
}) {
  return SECTION_NAV_ITEMS.filter((item) => {
    if (item.id === 'testimonials' && !includeTestimonials) return false;
    if (item.id === 'blog' && !includeBlog) return false;
    if (item.id === 'education' && !includeEducation) return false;
    if (item.id === 'certifications' && !includeCertifications) return false;
    return true;
  });
}
