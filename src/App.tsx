import { useMemo } from 'react';

import { ResumeGuard } from '@components/ResumeGuard';
import { useResumeContext } from '@components/providers/ResumeProvider';
import { DialogStateProvider } from '@components/providers/DialogStateProvider';
import { buildAvailableSections, Header } from '@components/layout/Header';
import { AmbientBackground } from '@components/layout/AmbientBackground';
import { SmoothScrollProvider } from '@components/layout/SmoothScrollProvider';
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
    <DialogStateProvider>
      <SmoothScrollProvider>
        <main className="relative min-h-screen bg-background text-foreground">
          <AmbientBackground />
          <ResumeGuard loading={loading} error={error}>
            <div className="pb-20">
              <Header
                activeId={activeId}
                resumeName={data?.name ?? 'Portfolio'}
                resumeTitle={data?.title ?? ''}
                availableSections={availableSections}
              />
              <div className="mx-auto mt-14 flex w-full max-w-[min(1320px,95%)] flex-col gap-28 px-4 sm:px-6 lg:px-8">
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
      </SmoothScrollProvider>
    </DialogStateProvider>
  );
};

export default App;



