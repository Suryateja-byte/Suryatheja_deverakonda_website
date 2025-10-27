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
import { useActiveSection } from '@hooks/useActiveSection';

const SECTION_ORDER = ['hero', 'about', 'projects', 'skills', 'experience', 'education', 'testimonials', 'contact'];

const App = () => {
  const { data, loading, error } = useResumeContext();

  const availableSections = useMemo(() => {
    const includeTestimonials = Boolean(data?.testimonials?.length);
    const includeBlog = false;
    const includeEducation = Boolean(data?.education?.length);
    return buildAvailableSections({ includeTestimonials, includeBlog, includeEducation });
  }, [data?.education?.length, data?.testimonials?.length]);

  const sectionIds = useMemo(() => SECTION_ORDER.filter((id) => availableSections.some((section) => section.id === id) || ['hero', 'about', 'projects', 'skills', 'experience', 'contact'].includes(id)), [availableSections]);

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



