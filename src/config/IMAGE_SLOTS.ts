export type ImageSlotDefinition = {
  id: string;
  label: string;
  alt: string;
  aspectRatio: string;
  width: number;
  height: number;
  files: {
    webp?: string;
    fallback?: string;
    svg?: string;
  };
  prompt?: string;
};

const heroPrompt = 'ultra-clean, abstract tech gradient with soft volumetric light, deep blue and violet, high-end minimal aesthetic, smooth glass layers, no text, no watermark, 16:9, 4k';
const portraitPrompt = 'professional, friendly headshot in soft natural light, neutral backdrop, crisp focus, minimal styling, no text, 1:1';
const desktopPrompt = 'clean product UI screenshot composite, hero + dashboard, glassy panels, premium SaaS aesthetic, subtle shadows, 16:10, no branding, no text';
const mobilePrompt = 'mobile app UI mockup, elegant card layout, modern minimal design, premium feel, 9:16, no branding, no text';
const companyPrompt = 'flat vector logo mark inspired by modern fintech/tech, simple geometric shape, monochrome, clean lines, no text';
const testimonialPrompt = 'corporate headshot, soft key light, neutral background, 1:1, friendly expression, no text';
const contactPrompt = 'abstract city grid lines with soft gradients, minimalist map vibe, 3:2, no labels, no text';

export const IMAGE_SLOTS: Record<string, ImageSlotDefinition> = {
  'hero-bg': {
    id: 'hero-bg',
    label: 'Hero Background',
    alt: 'Abstract gradient background with layered glassy forms.',
    aspectRatio: '16/9',
    width: 1920,
    height: 1080,
    files: {
      webp: '/assets/hero/hero-bg.webp',
      fallback: '/assets/hero/hero-bg.jpg',
    },
    prompt: heroPrompt,
  },
  portrait: {
    id: 'portrait',
    label: 'Hero Portrait',
    alt: 'Placeholder portrait silhouette with gradient background.',
    aspectRatio: '1/1',
    width: 800,
    height: 800,
    files: {
      webp: '/assets/portrait/portrait-square.webp',
    },
    prompt: portraitPrompt,
  },
  'project-01-desktop': {
    id: 'project-01-desktop',
    label: 'Project 01 Desktop',
    alt: 'Placeholder for project desktop mockup.',
    aspectRatio: '16/10',
    width: 1440,
    height: 900,
    files: {
      webp: '/assets/projects/project-01-desktop.webp',
    },
    prompt: desktopPrompt,
  },
  'project-01-mobile': {
    id: 'project-01-mobile',
    label: 'Project 01 Mobile',
    alt: 'Placeholder for project mobile mockup.',
    aspectRatio: '9/16',
    width: 720,
    height: 1280,
    files: {
      webp: '/assets/projects/project-01-mobile.webp',
    },
    prompt: mobilePrompt,
  },
  'project-02-desktop': {
    id: 'project-02-desktop',
    label: 'Project 02 Desktop',
    alt: 'Placeholder for project desktop mockup.',
    aspectRatio: '16/10',
    width: 1440,
    height: 900,
    files: {
      webp: '/assets/projects/project-02-desktop.webp',
    },
    prompt: desktopPrompt,
  },
  'project-02-mobile': {
    id: 'project-02-mobile',
    label: 'Project 02 Mobile',
    alt: 'Placeholder for project mobile mockup.',
    aspectRatio: '9/16',
    width: 720,
    height: 1280,
    files: {
      webp: '/assets/projects/project-02-mobile.webp',
    },
    prompt: mobilePrompt,
  },
  'project-03-desktop': {
    id: 'project-03-desktop',
    label: 'Project 03 Desktop',
    alt: 'Placeholder for project desktop mockup.',
    aspectRatio: '16/10',
    width: 1440,
    height: 900,
    files: {
      webp: '/assets/projects/project-03-desktop.webp',
    },
    prompt: desktopPrompt,
  },
  'project-03-mobile': {
    id: 'project-03-mobile',
    label: 'Project 03 Mobile',
    alt: 'Placeholder for project mobile mockup.',
    aspectRatio: '9/16',
    width: 720,
    height: 1280,
    files: {
      webp: '/assets/projects/project-03-mobile.webp',
    },
    prompt: mobilePrompt,
  },
  'project-04-desktop': {
    id: 'project-04-desktop',
    label: 'Project 04 Desktop',
    alt: 'Placeholder for project desktop mockup.',
    aspectRatio: '16/10',
    width: 1440,
    height: 900,
    files: {
      webp: '/assets/projects/project-04-desktop.webp',
    },
    prompt: desktopPrompt,
  },
  'project-04-mobile': {
    id: 'project-04-mobile',
    label: 'Project 04 Mobile',
    alt: 'Placeholder for project mobile mockup.',
    aspectRatio: '9/16',
    width: 720,
    height: 1280,
    files: {
      webp: '/assets/projects/project-04-mobile.webp',
    },
    prompt: mobilePrompt,
  },
  'project-05-desktop': {
    id: 'project-05-desktop',
    label: 'Project 05 Desktop',
    alt: 'Placeholder for project desktop mockup.',
    aspectRatio: '16/10',
    width: 1440,
    height: 900,
    files: {
      webp: '/assets/projects/project-05-desktop.webp',
    },
    prompt: desktopPrompt,
  },
  'project-05-mobile': {
    id: 'project-05-mobile',
    label: 'Project 05 Mobile',
    alt: 'Placeholder for project mobile mockup.',
    aspectRatio: '9/16',
    width: 720,
    height: 1280,
    files: {
      webp: '/assets/projects/project-05-mobile.webp',
    },
    prompt: mobilePrompt,
  },
  'project-06-desktop': {
    id: 'project-06-desktop',
    label: 'Project 06 Desktop',
    alt: 'Placeholder for project desktop mockup.',
    aspectRatio: '16/10',
    width: 1440,
    height: 900,
    files: {
      webp: '/assets/projects/project-06-desktop.webp',
    },
    prompt: desktopPrompt,
  },
  'project-06-mobile': {
    id: 'project-06-mobile',
    label: 'Project 06 Mobile',
    alt: 'Placeholder for project mobile mockup.',
    aspectRatio: '9/16',
    width: 720,
    height: 1280,
    files: {
      webp: '/assets/projects/project-06-mobile.webp',
    },
    prompt: mobilePrompt,
  },
  'company-01-logo': {
    id: 'company-01-logo',
    label: 'Experience Logo 01',
    alt: 'Placeholder logo for experience 01.',
    aspectRatio: '1/1',
    width: 320,
    height: 320,
    files: {
      svg: '/assets/experience/company-01-logo.svg',
    },
    prompt: companyPrompt,
  },
  'company-02-logo': {
    id: 'company-02-logo',
    label: 'Experience Logo 02',
    alt: 'Placeholder logo for experience 02.',
    aspectRatio: '1/1',
    width: 320,
    height: 320,
    files: {
      svg: '/assets/experience/company-02-logo.svg',
    },
    prompt: companyPrompt,
  },
  'company-03-logo': {
    id: 'company-03-logo',
    label: 'Experience Logo 03',
    alt: 'Placeholder logo for experience 03.',
    aspectRatio: '1/1',
    width: 320,
    height: 320,
    files: {
      svg: '/assets/experience/company-03-logo.svg',
    },
    prompt: companyPrompt,
  },
  'company-04-logo': {
    id: 'company-04-logo',
    label: 'Experience Logo 04',
    alt: 'Placeholder logo for experience 04.',
    aspectRatio: '1/1',
    width: 320,
    height: 320,
    files: {
      svg: '/assets/experience/company-04-logo.svg',
    },
    prompt: companyPrompt,
  },
  'company-05-logo': {
    id: 'company-05-logo',
    label: 'Experience Logo 05',
    alt: 'Placeholder logo for experience 05.',
    aspectRatio: '1/1',
    width: 320,
    height: 320,
    files: {
      svg: '/assets/experience/company-05-logo.svg',
    },
    prompt: companyPrompt,
  },
  'company-06-logo': {
    id: 'company-06-logo',
    label: 'Experience Logo 06',
    alt: 'Placeholder logo for experience 06.',
    aspectRatio: '1/1',
    width: 320,
    height: 320,
    files: {
      svg: '/assets/experience/company-06-logo.svg',
    },
    prompt: companyPrompt,
  },
  'testimonial-01': {
    id: 'testimonial-01',
    label: 'Testimonial Avatar 01',
    alt: 'Placeholder avatar for testimonial 01.',
    aspectRatio: '1/1',
    width: 512,
    height: 512,
    files: {
      webp: '/assets/testimonials/avatar-01.webp',
    },
    prompt: testimonialPrompt,
  },
  'testimonial-02': {
    id: 'testimonial-02',
    label: 'Testimonial Avatar 02',
    alt: 'Placeholder avatar for testimonial 02.',
    aspectRatio: '1/1',
    width: 512,
    height: 512,
    files: {
      webp: '/assets/testimonials/avatar-02.webp',
    },
    prompt: testimonialPrompt,
  },
  'testimonial-03': {
    id: 'testimonial-03',
    label: 'Testimonial Avatar 03',
    alt: 'Placeholder avatar for testimonial 03.',
    aspectRatio: '1/1',
    width: 512,
    height: 512,
    files: {
      webp: '/assets/testimonials/avatar-03.webp',
    },
    prompt: testimonialPrompt,
  },
  'contact-art': {
    id: 'contact-art',
    label: 'Contact Section Art',
    alt: 'Abstract gradient map placeholder.',
    aspectRatio: '3/2',
    width: 1200,
    height: 800,
    files: {
      webp: '/assets/contact/map-placeholder.webp',
    },
    prompt: contactPrompt,
  },
  'blog-cover-default': {
    id: 'blog-cover-default',
    label: 'Blog Cover Placeholder',
    alt: 'Placeholder blog cover artwork.',
    aspectRatio: '1200/630',
    width: 1200,
    height: 630,
    files: {
      webp: '/assets/blog/cover-2025-default.webp',
    },
    prompt: 'editorial cover image, abstract geometric theme, premium magazine style, 1200x630, no text',
  },
  'skill-react': {
    id: 'skill-react',
    label: 'Skill Icon React',
    alt: 'React skill icon placeholder.',
    aspectRatio: '1/1',
    width: 160,
    height: 160,
    files: {
      svg: '/assets/skills/icon-react.svg',
    },
  },
  'skill-node': {
    id: 'skill-node',
    label: 'Skill Icon Node.ts',
    alt: 'Node.js skill icon placeholder.',
    aspectRatio: '1/1',
    width: 160,
    height: 160,
    files: {
      svg: '/assets/skills/icon-node.svg',
    },
  },
  'skill-python': {
    id: 'skill-python',
    label: 'Skill Icon Python',
    alt: 'Python skill icon placeholder.',
    aspectRatio: '1/1',
    width: 160,
    height: 160,
    files: {
      svg: '/assets/skills/icon-python.svg',
    },
  },
  'skill-sql': {
    id: 'skill-sql',
    label: 'Skill Icon SQL',
    alt: 'SQL skill icon placeholder.',
    aspectRatio: '1/1',
    width: 160,
    height: 160,
    files: {
      svg: '/assets/skills/icon-sql.svg',
    },
  },
  'skill-aws': {
    id: 'skill-aws',
    label: 'Skill Icon AWS',
    alt: 'AWS skill icon placeholder.',
    aspectRatio: '1/1',
    width: 160,
    height: 160,
    files: {
      svg: '/assets/skills/icon-aws.svg',
    },
  },
  'skill-docker': {
    id: 'skill-docker',
    label: 'Skill Icon Docker',
    alt: 'Docker skill icon placeholder.',
    aspectRatio: '1/1',
    width: 160,
    height: 160,
    files: {
      svg: '/assets/skills/icon-docker.svg',
    },
  },
  'skill-git': {
    id: 'skill-git',
    label: 'Skill Icon Git',
    alt: 'Git skill icon placeholder.',
    aspectRatio: '1/1',
    width: 160,
    height: 160,
    files: {
      svg: '/assets/skills/icon-git.svg',
    },
  },
  'skill-ml': {
    id: 'skill-ml',
    label: 'Skill Icon Machine Learning',
    alt: 'Machine learning skill icon placeholder.',
    aspectRatio: '1/1',
    width: 160,
    height: 160,
    files: {
      svg: '/assets/skills/icon-ml.svg',
    },
  },
};
