import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';
import { MoonStar, SunMedium } from 'lucide-react';

import { useTheme } from '@components/providers/ThemeProvider';
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
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setNavActiveId(activeId);
  }, [activeId]);

  const handleNavigate = (id: string) => {
    setNavActiveId(id);

    if (typeof document === 'undefined' || typeof window === 'undefined') return;

    const target = document.querySelector<HTMLElement>(`[data-section="${id}"]`);
    if (!target) return;

    const headerElement = document.querySelector<HTMLElement>('[data-site-header]');
    const headerOffset = (headerElement?.offsetHeight ?? 0) + 16;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    const top = Math.max(targetTop, 0);
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth';

    window.scrollTo({ top, behavior });
  };

  const displayName = resumeName?.trim() || 'Portfolio';

  return (
    <header
      data-site-header
      className={cn(
        'sticky top-5 z-50 mx-auto w-full max-w-[min(1320px,95%)] overflow-hidden rounded-full border border-transparent px-3 transition-all',
        scrolled ? 'border-border/70 bg-background/80 shadow-lg shadow-black/10 backdrop-blur-xl' : 'bg-transparent',
      )}
    >
      <nav className="flex items-center justify-between gap-4 px-4 py-3">
        <motion.button
          {...hoverMotion}
          type="button"
          onClick={() => handleNavigate('hero')}
          className="shrink-0 rounded-full bg-foreground/10 px-4 py-2 text-left text-sm font-semibold text-foreground/90 backdrop-blur-lg"
        >
          <div className="leading-tight">
            <span className="block text-sm font-semibold text-foreground">{displayName}</span>
            {resumeTitle ? <span className="block text-xs text-muted-foreground">{resumeTitle}</span> : null}
          </div>
        </motion.button>

        <ul className="relative hidden flex-1 list-none items-center justify-center gap-1 md:flex">
          {availableSections.map((item) => {
            const isActive = navActiveId === item.id;
            return (
              <li key={item.id} className="relative isolate px-1 py-0.5">
                <button
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative z-10 flex items-center justify-center rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-200',
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
                      transition={{ type: 'spring', stiffness: 420, damping: 38, mass: 0.7 }}
                    />
                    <motion.span
                      layoutId="navHighlight"
                      className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-foreground via-foreground to-foreground/80 shadow-[0_20px_45px_-25px_rgba(15,23,42,0.55)]"
                      transition={{ type: 'spring', stiffness: 540, damping: 34, mass: 0.9 }}
                    />
                  </>
                ) : null}
              </li>
            );
          })}
        </ul>

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
