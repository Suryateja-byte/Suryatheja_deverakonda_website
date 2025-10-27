import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';
import { MoonStar, SunMedium } from 'lucide-react';

import { useTheme } from '@components/providers/ThemeProvider';
import { Button } from '@components/ui/button';
import { SECTION_NAV_ITEMS, type SectionNavItem } from '@config/sections';
import { cn } from '@lib/utils';

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
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (id: string) => {
    const target = document.querySelector<HTMLElement>(`[data-section="${id}"]`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const displayName = resumeName?.trim() || 'Portfolio';

  return (
    <header
      className={cn(
        'sticky top-5 z-50 mx-auto w-[min(1180px,95%)] rounded-full border border-transparent px-3 transition-all',
        scrolled ? 'border-border/70 bg-background/80 shadow-lg shadow-black/10 backdrop-blur-xl' : 'bg-transparent',
      )}
    >
      <nav className="flex items-center justify-between gap-4 px-4 py-3">
        <motion.button
          {...hoverMotion}
          type="button"
          onClick={() => handleNavigate('hero')}
          className="rounded-full bg-foreground/10 px-4 py-2 text-left text-sm font-semibold text-foreground/90 backdrop-blur-lg"
        >
          <div className="leading-tight">
            <span className="block text-sm font-semibold text-foreground">{displayName}</span>
            {resumeTitle ? <span className="block text-xs text-muted-foreground">{resumeTitle}</span> : null}
          </div>
        </motion.button>

        <ul className="hidden items-center gap-1 md:flex">
          {availableSections.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={cn(
                    'rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition',
                    isActive ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
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
}: {
  includeTestimonials: boolean;
  includeBlog: boolean;
  includeEducation: boolean;
}) {
  return SECTION_NAV_ITEMS.filter((item) => {
    if (item.id === 'testimonials' && !includeTestimonials) return false;
    if (item.id === 'blog' && !includeBlog) return false;
    if (item.id === 'education' && !includeEducation) return false;
    return true;
  });
}
