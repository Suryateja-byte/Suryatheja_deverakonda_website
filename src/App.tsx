import { useMemo } from 'react';

import { ResumeGuard } from '@components/ResumeGuard';
import { useResumeContext } from '@components/providers/ResumeProvider';
import { buildAvailableSections, Header } from '@components/layout/Header';
import { Footer } from '@components/layout/Footer';
import { AboutSection } from '@sections/AboutSection';
import { ContactSection } from '@sections/ContactSection';
import { ExperienceSection } from '@sections/ExperienceSection';
import { HeroSection } from '@sections/HeroSection';
import { ProjectsSection } from '@sections/ProjectsSection';
import { SkillsSection } from '@sections/SkillsSection';
import { TestimonialsSection } from '@sections/TestimonialsSection';
import { CertificationsSection } from '@sections/CertificationsSection';
import { useActiveSection } from '@hooks/useActiveSection';

const SECTION_ORDER = [
  'hero',
  'about',
  'projects',
  'skills',
  'experience',
  'certifications',
  'education',
  'testimonials',
  'contact',
];

const App = () => {
  const { data, loading, error } = useResumeContext();

  const availableSections = useMemo(() => {
    const includeTestimonials = Boolean(data?.testimonials?.length);
    const includeEducation = Boolean(data?.education?.length);
    const includeCertifications = Boolean(data?.certifications?.length);
    const includeBlog = false;

    return buildAvailableSections({
      includeTestimonials,
      includeBlog,
      includeEducation,
      includeCertifications,
    });
  }, [data?.certifications?.length, data?.education?.length, data?.testimonials?.length]);

  const includeTestimonials = Boolean(data?.testimonials?.length);
  const includeEducation = Boolean(data?.education?.length);
  const includeCertifications = Boolean(data?.certifications?.length);

  const sectionIds = useMemo(
    () =>
      SECTION_ORDER.filter((id) => {
        if (['hero', 'about', 'projects', 'skills', 'experience', 'contact'].includes(id)) {
          return true;
        }
        if (id === 'certifications') return includeCertifications;
        if (id === 'education') return includeEducation;
        if (id === 'testimonials') return includeTestimonials;
        return availableSections.some((section) => section.id === id);
      }),
    [availableSections, includeCertifications, includeEducation, includeTestimonials],
  );

  const { activeId } = useActiveSection(sectionIds);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ResumeGuard loading={loading} error={error}>
        <div className="pb-16">
          <Header
            activeId={activeId}
            resumeName={data?.name ?? 'Portfolio'}
            resumeTitle={data?.title ?? ''}
            availableSections={availableSections}
          />
          <div className="container mt-10 grid gap-16">
            <HeroSection />
            <AboutSection />
            <ProjectsSection />
            <SkillsSection />
            <ExperienceSection />
            {includeCertifications ? <CertificationsSection /> : null}
            <TestimonialsSection />
            <ContactSection />
          </div>
          <Footer />
        </div>
      </ResumeGuard>
    </main>
  );
};

export default App;



