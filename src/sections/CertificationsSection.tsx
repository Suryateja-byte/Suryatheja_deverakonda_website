import dayjs from 'dayjs';
import { ArrowUpRight } from 'lucide-react';

import { useResumeContext } from '@components/providers/ResumeProvider';
import { SectionHeading } from '@components/SectionHeading';
import { Badge } from '@components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@components/ui/card';

function formatIssueDate(value: string) {
  const parsed = dayjs(value);
  if (parsed.isValid()) {
    return parsed.format('MMM YYYY');
  }
  return value;
}

export function CertificationsSection() {
  const { data } = useResumeContext();
  const certifications = data?.certifications ?? [];

  if (!certifications.length) {
    return null;
  }

  return (
    <section id="certifications" data-section="certifications" className="container py-24">
      <SectionHeading
        eyebrow="Credentials"
        title="Certified learning sprints"
        description="Industry-recognized programs that sharpened applied ML, product, and platform instincts."
      />

      <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {certifications.map((certification) => {
          const skills = certification.skills ?? [];
          const issueLabel = formatIssueDate(certification.issueDate);

          return (
            <Card key={`${certification.name}-${certification.issuer}-${certification.issueDate}`} className="border-border/50 bg-card/70">
              <CardHeader className="space-y-1 border-border/40 bg-background/40">
                <h3 className="text-lg font-semibold text-foreground">{certification.name}</h3>
                <p className="text-sm text-muted-foreground">{certification.issuer}</p>
              </CardHeader>
              <CardContent className="gap-6">
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">Issued</p>
                  <p className="text-sm text-foreground">{issueLabel}</p>
                </div>
                {skills.length ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-[10px] uppercase tracking-[0.3em]">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </CardContent>
              {certification.credentialUrl ? (
                <CardFooter className="border-border/40 bg-background/30">
                  <a
                    href={certification.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-foreground/80"
                  >
                    View credential <ArrowUpRight className="h-4 w-4" />
                  </a>
                </CardFooter>
              ) : null}
            </Card>
          );
        })}
      </div>
    </section>
  );
}

