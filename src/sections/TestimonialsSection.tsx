import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Quote } from 'lucide-react';

import { Reveal } from '@components/animations/Reveal';
import { ImageSlot } from '@components/ImageSlot';
import { useResumeContext } from '@components/providers/ResumeProvider';
import { Button } from '@components/ui/button';
import { SectionHeading } from '@components/SectionHeading';

const testimonialSlots = ['testimonial-01', 'testimonial-02', 'testimonial-03'];

export function TestimonialsSection() {
  const { data } = useResumeContext();
  const testimonials = useMemo(() => data?.testimonials ?? [], [data?.testimonials]);
  const [index, setIndex] = useState(0);

  const active = testimonials[index];
  const avatarSlot = testimonialSlots[index % testimonialSlots.length];

  const next = () => setIndex((current) => (current + 1) % testimonials.length);
  const previous = () => setIndex((current) => (current - 1 + testimonials.length) % testimonials.length);

  const indicators = useMemo(() => testimonials.map((_, i) => i), [testimonials]);

  if (!testimonials.length) return null;

  return (
    <section id="testimonials" data-section="testimonials" className="py-24">
      <SectionHeading
        eyebrow="Testimonials"
        title="Trusted by cross-functional partners"
        description="Snapshots from collaborators who value energy, detail, and measurable follow-through."
      />
      <Reveal y={28}>
        <div className="mt-12 rounded-[36px] border border-border/40 bg-card/70 p-10 shadow-[0_28px_55px_-40px_rgba(15,23,42,0.55)]">
          <div className="flex items-start gap-6">
          <div className="hidden sm:block">
            <ImageSlot slotId={avatarSlot} alt={active.name} className="h-24 w-24 rounded-3xl" />
          </div>
          <div className="flex-1">
            <Quote className="h-10 w-10 text-accent" />
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={active.quote}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="mt-6 text-lg leading-relaxed text-foreground"
              >
                “{active.quote}”
              </motion.blockquote>
            </AnimatePresence>
            <div className="mt-6 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{active.name}</span>
              {active.role ? <span className="ml-2 text-muted-foreground/80">{active.role}</span> : null}
            </div>
            <div className="mt-6 flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={previous}>
                Previous
              </Button>
              <Button variant="ghost" size="sm" onClick={next}>
                Next
              </Button>
              <div className="ml-auto flex gap-1">
                {indicators.map((entry) => (
                  <span
                    key={entry}
                    className={entry === index ? 'h-2 w-6 rounded-full bg-accent' : 'h-2 w-2 rounded-full bg-muted'}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </Reveal>
    </section>
  );
}

