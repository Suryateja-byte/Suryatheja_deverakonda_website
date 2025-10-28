import { type LucideIcon, ShieldCheck, Sparkles, Workflow, Users } from 'lucide-react';

export type Principle = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const CORE_PRINCIPLES: Principle[] = [
  {
    title: 'Reliability First',
    description: 'Obsess over systems that stay stable in production—instrumented, resilient, and easy to operate under pressure.',
    icon: ShieldCheck,
  },
  {
    title: 'Elegant Delivery',
    description: 'Transform complex ideas into interfaces with clarity, impeccable spacing, and premium polish.',
    icon: Sparkles,
  },
  {
    title: 'Human Collaboration',
    description: 'Pair tightly with cross-functional partners, translating business goals into experiences users love.',
    icon: Users,
  },
  {
    title: 'Continuous Iteration',
    description: 'Ship small, learn fast, and refine relentlessly with real user feedback and sharp analytics.',
    icon: Workflow,
  },
];
