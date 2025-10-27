import { Mail, Send } from 'lucide-react';

import { ImageSlot } from '@components/ImageSlot';
import { useResumeContext } from '@components/providers/ResumeProvider';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { SectionHeading } from '@components/SectionHeading';
import { getPrimaryEmail } from '@lib/formatters';

export function ContactSection() {
  const { data } = useResumeContext();
  const email = data ? getPrimaryEmail(data) : '';
  const socials = data?.socials ?? [];

  return (
    <section id="contact" data-section="contact" className="container py-24">
      <SectionHeading
        eyebrow="Contact"
        title="Let’s build something premium"
        description="Ready when you are—drop a note, ship a brief, or schedule time to architect the next chapter."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)]">
        <Card className="border-border/40 bg-card/80">
          <CardContent className="space-y-6 px-6 py-8">
            <p className="text-lg text-muted-foreground">
              Whether you need a product sprint, ML system, or a full-stack delivery partner, I move with urgency and polish. Send the brief—I&apos;ll return with a plan.
            </p>
            {email ? (
              <Button asChild size="lg">
                <a href={`mailto:${email}`}>
                  <Mail className="mr-2 h-4 w-4" /> {email}
                </a>
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">Add an email to resume.json to enable direct contact.</p>
            )}
            <div className="flex flex-wrap gap-3">
              {socials.map((social) => (
                <Button key={social.url} variant="ghost" size="sm" asChild>
                  <a href={social.url} target="_blank" rel="noreferrer">
                    <Send className="mr-2 h-3.5 w-3.5" />
                    {social.label}
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="rounded-[24px] border border-border/40 bg-muted/20 p-4">
          <ImageSlot slotId="contact-art" alt="Contact section placeholder art" className="rounded-2xl" />
        </div>
      </div>
    </section>
  );
}
