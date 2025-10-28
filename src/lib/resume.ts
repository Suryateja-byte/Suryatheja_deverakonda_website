import { z } from 'zod';

const resumeSocialSchema = z.object({
  label: z.string(),
  url: z.string().url(),
});

const resumeProjectLinksSchema = z.object({
  demo: z.string().optional().catch('').default(''),
  code: z.string().optional().catch('').default(''),
});

const resumeProjectSchema = z.object({
  name: z.string(),
  summary: z.string().optional().catch('').default(''),
  tags: z.array(z.string()).optional().catch([]).default([]),
  highlights: z.array(z.string()).optional().catch([]).default([]),
  links: resumeProjectLinksSchema.catch({ demo: '', code: '' }),
});

const resumeExperienceSchema = z.object({
  company: z.string().catch('').default(''),
  role: z.string().catch('').default(''),
  start: z.string().catch('').default(''),
  end: z.string().catch('').default(''),
  location: z.string().optional().catch('').default(''),
  summary: z.string().optional().catch('').default(''),
  bullets: z.array(z.string()).optional().catch([]).default([]),
});

const resumeEducationSchema = z.object({
  school: z.string().catch('').default(''),
  degree: z.string().optional().catch('').default(''),
  year: z.string().optional().catch('').default(''),
});

const resumeTestimonialSchema = z.object({
  name: z.string().catch('').default(''),
  role: z.string().optional().catch('').default(''),
  quote: z.string().catch('').default(''),
});

const resumeCertificationSchema = z.object({
  name: z.string().catch('').default(''),
  issuer: z.string().catch('').default(''),
  issueDate: z.string().catch('').default(''),
  credentialUrl: z.string().optional().catch('').default(''),
  skills: z.array(z.string()).optional().catch([]).default([]),
});

export const resumeSchema = z.object({
  name: z.string().min(2),
  title: z.string().optional().catch('').default(''),
  summary: z.string().optional().catch('').default(''),
  location: z.string().optional().catch('').default(''),
  email: z.string().optional().catch('').default(''),
  phone: z.string().optional().catch('').default(''),
  website: z.string().optional().catch('').default(''),
  socials: z.array(resumeSocialSchema).optional().catch([]).default([]),
  skills: z.array(z.string()).optional().catch([]).default([]),
  projects: z.array(resumeProjectSchema).optional().catch([]).default([]),
  experience: z.array(resumeExperienceSchema).optional().catch([]).default([]),
  education: z.array(resumeEducationSchema).optional().catch([]).default([]),
  testimonials: z.array(resumeTestimonialSchema).optional().catch([]).default([]),
  certifications: z.array(resumeCertificationSchema).optional().catch([]).default([]),
});

export type ResumeCertification = z.infer<typeof resumeCertificationSchema>;
export type Resume = z.infer<typeof resumeSchema>;

const RESUME_ENDPOINTS = ['/data/resume.normalized.json', '/data/resume.json'];

let resumeCache: Resume | null = null;

export async function loadResume(signal?: AbortSignal): Promise<Resume> {
  if (resumeCache) {
    return resumeCache;
  }

  const errors: string[] = [];

  for (const endpoint of RESUME_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, { signal, cache: 'no-cache' });
      if (!response.ok) {
        errors.push(`${endpoint} (${response.status})`);
        continue;
      }
      const data = await response.json();
      const parsed = resumeSchema.parse(data);
      resumeCache = parsed;
      return parsed;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        throw error;
      }
      errors.push(`${endpoint} (${(error as Error).message})`);
    }
  }

  throw new Error(`Unable to load resume data. Tried: ${errors.join(', ')}`);
}

export function clearResumeCache() {
  resumeCache = null;
}
