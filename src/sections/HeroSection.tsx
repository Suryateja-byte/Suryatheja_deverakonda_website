import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight, FileDown } from 'lucide-react';
import { useMemo } from 'react';

import { Reveal } from '@components/animations/Reveal';
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
        <ImageSlot
          slotId="hero-bg"
          alt="Hero background illustration"
          className="h-full w-full"
          priority
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-900/20 to-slate-950/70" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(148,163,184,0.18),transparent_60%)]" aria-hidden="true" />

      <div className="relative z-10 grid gap-16 px-6 py-24 sm:px-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.5fr)] md:py-28 lg:px-20">
        <div className="space-y-8">
          <Reveal y={18}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] uppercase tracking-[0.35em] text-white/80 shadow-lg shadow-black/30">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Premium Portfolio Build
            </span>
          </Reveal>
          <Reveal delay={0.08} y={34}>
            <h1 className="max-w-xl text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {headline}
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="max-w-lg text-lg leading-relaxed text-slate-100/85">{intro}</p>
          </Reveal>
          <Reveal delay={0.24} y={32}>
            <div className="flex flex-wrap items-center gap-3">
              <motion.div whileHover={{ y: -4 }} whileTap={{ y: 0 }}>
                <Button asChild className="h-12 rounded-full bg-white text-slate-900 shadow-lg shadow-black/20 hover:bg-slate-100">
                  <a href={resumeHref} download>
                    <FileDown className="mr-2 h-4 w-4" /> View Resume
                  </a>
                </Button>
              </motion.div>
              {email ? (
                <motion.div whileHover={{ y: -4 }} whileTap={{ y: 0 }}>
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
                </motion.div>
              ) : null}
            </div>
          </Reveal>
          <Reveal delay={0.3} y={16}>
            <dl className="flex flex-wrap gap-6 text-[11px] uppercase tracking-[0.4em] text-white/70">
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
          </Reveal>
        </div>
        <div className="hidden justify-end md:flex">
          <motion.div
            className="relative w-full max-w-xs"
            animate={reducedMotion ? undefined : { y: [0, -16, 0], rotate: [0, 0.8, 0] }}
            transition={reducedMotion ? undefined : { duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/20 via-white/5 to-transparent blur-xl" aria-hidden="true" />
            <ImageSlot slotId="portrait" alt="Portrait placeholder" className="relative" priority />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

