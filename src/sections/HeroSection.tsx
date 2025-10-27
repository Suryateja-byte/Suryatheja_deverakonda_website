import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight, FileDown } from 'lucide-react';
import { useMemo } from 'react';

import { ImageSlot } from '@components/ImageSlot';
import { useResumeContext } from '@components/providers/ResumeProvider';
import { Button } from '@components/ui/button';
import { buildHeroCopy, getPrimaryEmail } from '@lib/formatters';
import { prefersReducedMotion } from '@lib/utils';

const RESUME_CANDIDATES = ['/assets/docs/resume.docx', '/assets/docs/resume.pdf'];

export function HeroSection() {
  const { data } = useResumeContext();
  const { headline, intro } = useMemo(() => buildHeroCopy(data ?? null), [data]);
  const email = useMemo(() => getPrimaryEmail(data ?? null), [data]);
  const resumeHref = RESUME_CANDIDATES.find(Boolean) ?? '#';

  const scroll = useScroll();
  const reducedMotion = prefersReducedMotion();
  const parallaxY = useTransform(scroll.scrollY, [0, 300], [0, reducedMotion ? 0 : -120]);

  return (
    <section
      id="hero"
      data-section="hero"
      className="relative flex min-h-[80vh] flex-col justify-center overflow-hidden rounded-[36px] border border-border/40 bg-slate-950 text-foreground shadow-soft"
    >
      <motion.div style={{ y: reducedMotion ? 0 : parallaxY }} className="absolute inset-0">
        <ImageSlot slotId="hero-bg" alt="Hero background illustration" className="h-full w-full" />
      </motion.div>

      <div className="relative z-10 grid gap-16 px-6 py-24 sm:px-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.5fr)] md:py-28 lg:px-20">
        <div className="space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/80 shadow-lg shadow-black/30">
            <span>Premium Portfolio Build</span>
          </span>
          <h1 className="max-w-xl text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {headline}
          </h1>
          <p className="max-w-lg text-lg text-slate-100/80">{intro}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild className="h-12 rounded-full bg-white text-slate-900 shadow-lg shadow-black/20 hover:bg-slate-100">
              <a href={resumeHref} download>
                <FileDown className="mr-2 h-4 w-4" /> View Resume
              </a>
            </Button>
            {email ? (
              <Button
                variant="ghost"
                size="lg"
                className="h-12 rounded-full border border-white/40 bg-white/10 text-white hover:bg-white/20"
                onClick={() => {
                  window.location.href = `mailto:${email}`;
                }}
              >
                <ArrowDownRight className="mr-2 h-4 w-4" /> Contact Me
              </Button>
            ) : null}
          </div>
          <dl className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.4em] text-white/70">
            {data?.location ? (
              <div>
                <dt className="text-[0.55rem] text-white/50">Based in</dt>
                <dd className="text-sm uppercase tracking-[0.35em]">{data.location}</dd>
              </div>
            ) : null}
            {data?.socials?.length ? (
              <div>
                <dt className="text-[0.55rem] text-white/50">Social</dt>
                <dd className="text-sm uppercase tracking-[0.35em]">{data.socials[0].label}</dd>
              </div>
            ) : null}
          </dl>
        </div>
        <div className="hidden justify-end md:flex">
          <div className="relative w-full max-w-xs">
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/20 via-white/5 to-transparent blur-xl" aria-hidden="true" />
            <ImageSlot slotId="portrait" alt="Portrait placeholder" className="relative" />
          </div>
        </div>
      </div>
    </section>
  );
}

