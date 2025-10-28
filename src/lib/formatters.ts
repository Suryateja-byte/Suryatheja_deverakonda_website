import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

import type { ImageSlotDefinition } from '@config/IMAGE_SLOTS';
import { IMAGE_SLOTS } from '@config/IMAGE_SLOTS';
import type { Resume } from '@lib/resume';

dayjs.extend(advancedFormat);

export type ProjectCard = {
  id: string;
  name: string;
  summary: string;
  highlights: string[];
  tags: string[];
  desktopSlot: ImageSlotDefinition;
  mobileSlot: ImageSlotDefinition;
  links: {
    demo?: string;
    code?: string;
  };
};

export type SkillGroup = {
  title: string;
  skills: Array<{
    name: string;
    level: number;
    iconSlotId?: string;
  }>;
};

export type TimelineEntry = {
  title: string;
  subtitle?: string;
  location?: string;
  range: string;
  highlights: string[];
  logoSlot?: ImageSlotDefinition;
};

const skillIconMap: Record<string, string> = {
  React: 'skill-react',
  'Node.js': 'skill-node',
  Node: 'skill-node',
  Python: 'skill-python',
  SQL: 'skill-sql',
  AWS: 'skill-aws',
  Docker: 'skill-docker',
  Git: 'skill-git',
  'Machine Learning': 'skill-ml',
  MLOps: 'skill-ml',
};

const skillLevelSeed = new Map<string, number>([
  ['Python', 96],
  ['PyTorch', 93],
  ['TensorFlow', 89],
  ['scikit-learn', 92],
  ['AWS', 88],
  ['Azure', 84],
  ['Docker', 86],
  ['Kubernetes', 82],
  ['LangChain', 78],
  ['Transformers', 82],
  ['SQL', 87],
  ['ETL', 80],
  ['React', 83],
  ['Git', 85],
  ['CI/CD', 83],
  ['Feature stores', 80],
  ['MLOps', 82],
  ['Testing', 74],
]);

const oddEncodings: Array<[RegExp, string]> = [
  [/\u00e2\u20ac\u2014/g, '—'],
  [/\u00e2\u20ac\u2013/g, '–'],
  [/\u00e2\u20ac\u201c/g, '“'],
  [/\u00e2\u20ac\u201d/g, '”'],
  [/\u00e2\u20ac\u2122/g, '’'],
  [/\u00e2\u20ac\u0153/g, '“'],
  [/\u00e2\u20ac\u009d/g, '”'],
  [/\u00e2\u20ac\u00a6/g, '…'],
  [/\u00e2\u20ac\u2018/g, '‘'],
  [/\u00e2\u20ac\u2020/g, '→'],
  [/\u00e2\u20ac\u2019/g, '’'],
];

function normalizeText(value: string | undefined | null): string {
  if (!value) return '';
  let next = value;
  for (const [pattern, replacement] of oddEncodings) {
    next = next.replace(pattern, replacement);
  }
  next = next.split(String.fromCharCode(26)).join('→');
  return next.replace(/\s+/g, ' ').replace(/\s([,.;])/g, '$1').trim();
}

function formatRange(start?: string, end?: string) {
  if (!start && !end) return '';
  const startDate = start ? dayjs(start) : null;
  const endDate = !end || /present/i.test(end ?? '') ? dayjs() : dayjs(end);
  const startLabel = startDate?.isValid() ? startDate.format('MMM YYYY') : start ?? '';
  const endLabel = endDate?.isValid() && end ? endDate.format('MMM YYYY') : 'Present';
  return `${startLabel} — ${endLabel}`.trim();
}

export function buildProjects(resume: Partial<Resume> | null): ProjectCard[] {
  const base = resume?.projects ?? [];
  const maximum = Math.max(base.length, 3);

  const mapped: ProjectCard[] = base.map((project, index) => {
    const slotIndex = String(index + 1).padStart(2, '0');
    const desktopSlot = IMAGE_SLOTS[`project-${slotIndex}-desktop`] ?? IMAGE_SLOTS['project-01-desktop'];
    const mobileSlot = IMAGE_SLOTS[`project-${slotIndex}-mobile`] ?? IMAGE_SLOTS['project-01-mobile'];

    const summary = normalizeText(project.summary);
    const tags = (project.tags ?? []).map(normalizeText);
    const highlights = (project.highlights ?? []).map(normalizeText).filter(Boolean);

    let enrichedHighlights = highlights;
    if (!enrichedHighlights.length && summary) {
      const derived = summary
        .split(/(?:(?:\.|;)|\s—\s)/)
        .map((item) => normalizeText(item))
        .filter(Boolean);
      enrichedHighlights = derived.slice(0, 3);
    }

    return {
      id: `project-${slotIndex}`,
      name: normalizeText(project.name),
      summary,
      highlights: enrichedHighlights,
      tags,
      desktopSlot,
      mobileSlot,
      links: project.links ?? {},
    };
  });

  while (mapped.length < maximum) {
    const slotIndex = String(mapped.length + 1).padStart(2, '0');
    mapped.push({
      id: `project-${slotIndex}`,
      name: `Future Case Study ${slotIndex}`,
      summary:
        'Reserve this slot for the next flagship engagement. Swap in polished assets and final metrics when the story is ready to publish.',
      highlights: [
        'Use this tile to frame the challenge, your approach, and measurable impact.',
        'Replace the prompt in IMAGE_SLOTS once the art direction is ready.',
        'Link to the live experience or repo when it ships.',
      ],
      tags: ['Art Direction', 'Coming Soon'],
      desktopSlot: IMAGE_SLOTS[`project-${slotIndex}-desktop`] ?? IMAGE_SLOTS['project-01-desktop'],
      mobileSlot: IMAGE_SLOTS[`project-${slotIndex}-mobile`] ?? IMAGE_SLOTS['project-01-mobile'],
      links: {},
    });
  }

  return mapped.slice(0, maximum);
}

const skillCategories: Array<{ id: string; title: string; keywords: string[] }> = [
  { id: 'core', title: 'Core Product', keywords: ['react', 'typescript', 'javascript', 'css', 'git', 'html'] },
  { id: 'ml', title: 'ML & Data Science', keywords: ['torch', 'tensor', 'machine', 'scikit', 'xgboost', 'lightgbm', 'langchain', 'transformer'] },
  { id: 'cloud', title: 'Cloud & Infrastructure', keywords: ['aws', 'azure', 'docker', 'kubernetes', 'ci/cd', 'feature', 'sql'] },
  { id: 'ops', title: 'Ops & Delivery', keywords: ['testing', 'monitoring', 'agile', 'scrum', 'documentation', 'reproducibility'] },
];

function expandSkill(raw: string) {
  const normalized = normalizeText(raw);
  if (!normalized) return [];
  const expanded: string[] = [];
  const matches = [...normalized.matchAll(/\(([^)]+)\)/g)];
  matches.forEach((match) => {
    const extras = match[1]
      .split(/[,/]/)
      .map((token) => normalizeText(token))
      .filter(Boolean);
    expanded.push(...extras);
  });
  const base = normalized.replace(/\(([^)]+)\)/g, '').trim();
  return [base, ...expanded].map(normalizeText).filter(Boolean);
}

export function buildSkillGroups(resume: Partial<Resume> | null): SkillGroup[] {
  const skills = resume?.skills ?? [];
  const buckets = new Map<string, SkillGroup>();

  const assign = (title: string, name: string) => {
    const normalized = normalizeText(name);
    if (!normalized) return;
    const level = skillLevelSeed.get(normalized) ?? 72;
    const iconSlotId = skillIconMap[normalized] ?? undefined;
    if (!buckets.has(title)) {
      buckets.set(title, { title, skills: [] });
    }
    const group = buckets.get(title)!;
    if (!group.skills.some((skill) => skill.name === normalized)) {
      group.skills.push({ name: normalized, level: Math.min(100, Math.max(55, level)), iconSlotId });
    }
  };

  skills.forEach((skill) => {
    const expanded = expandSkill(skill);
    expanded.forEach((entry) => {
      const lower = entry.toLowerCase();
      const category = skillCategories.find((c) => c.keywords.some((keyword) => lower.includes(keyword)));
      if (category) {
        assign(category.title, entry);
      } else {
        assign('Additional Expertise', entry);
      }
    });
  });

  return Array.from(buckets.values()).map((group) => ({
    ...group,
    skills: group.skills.sort((a, b) => b.level - a.level),
  }));
}

export function buildExperienceTimeline(resume: Partial<Resume> | null): TimelineEntry[] {
  const experiences = resume?.experience ?? [];
  return experiences.map((experience, index) => {
    const slotKey = `company-0${String(index + 1)}-logo`;
    return {
      title: normalizeText(experience.company),
      subtitle: normalizeText(experience.role),
      location: normalizeText(experience.location),
      range: formatRange(experience.start, experience.end),
      highlights: (experience.bullets ?? []).map(normalizeText).filter(Boolean),
      logoSlot: IMAGE_SLOTS[slotKey],
    };
  });
}

export function buildEducationTimeline(resume: Partial<Resume> | null): TimelineEntry[] {
  const education = resume?.education ?? [];
  return education.map((item, index) => {
    const pieces = normalizeText(item.school).split('|');
    const title = pieces[0]?.trim() || normalizeText(item.school);
    const range = pieces[1]?.trim() || normalizeText(item.year) || '';
    const highlights: string[] = [];
    if (item.degree) {
      highlights.push(normalizeText(item.degree));
    }
    return {
      title,
      range,
      highlights,
      logoSlot: IMAGE_SLOTS[`company-0${String(index + 1)}-logo`],
    };
  });
}

export function buildHeroCopy(resume: Partial<Resume> | null) {
  const headline = normalizeText(resume?.title) || 'Product & ML Engineer';
  const intro =
    normalizeText(resume?.summary) ||
    'Designing resilient platforms with principled UX, measurable outcomes, and craftsmanship across every surface.';
  return { headline, intro };
}

export function getPrimaryEmail(resume: Partial<Resume> | null) {
  if (resume?.email) return resume.email;
  const socialEmail = resume?.socials?.find((social) => /@/.test(social.url));
  return socialEmail?.url ?? '';
}
