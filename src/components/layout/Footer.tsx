import { ArrowUpRight } from 'lucide-react';

import { useResumeContext } from '@components/providers/ResumeProvider';
import { useTheme } from '@components/providers/ThemeProvider';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';

export function Footer() {
  const { data } = useResumeContext();
  const { resolvedTheme, toggleTheme } = useTheme();

  const socials = data?.socials ?? [];
  const year = new Date().getFullYear();

  const handleBackToTop = () => {
    const top = document.querySelector('[data-section="hero"]');
    top?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="mt-28 border-t border-border/40 bg-background/60 py-12">
      <div className="mx-auto flex w-full max-w-[min(1320px,95%)] flex-col gap-6 px-4 text-sm text-muted-foreground sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">{resolvedTheme === 'dark' ? 'Night build' : 'Day build'}</p>
          <p className="text-sm">© {year} {data?.name ?? 'Portfolio'}. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {socials.map((social) => (
            <a
              key={social.url}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-border/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition hover:border-border hover:text-foreground"
            >
              {social.label}
              <ArrowUpRight className="h-3 w-3" />
            </a>
          ))}
          {!socials.length ? (
            <Badge variant="outline" className="text-xs uppercase tracking-[0.2em]">
              Add socials to resume.json
            </Badge>
          ) : null}
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            Toggle theme
          </Button>
          <Button variant="outline" size="sm" onClick={handleBackToTop}>
            Back to top
          </Button>
        </div>
      </div>
    </footer>
  );
}
