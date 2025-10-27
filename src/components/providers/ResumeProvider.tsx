import { createContext, useContext, type ReactNode } from 'react';

import { useResume } from '@hooks/useResume';
import type { Resume } from '@lib/resume';

interface ResumeContextValue {
  data: Resume | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

const ResumeContext = createContext<ResumeContextValue | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const resume = useResume();
  return <ResumeContext.Provider value={resume}>{children}</ResumeContext.Provider>;
}

export function useResumeContext() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResumeContext must be used within a ResumeProvider');
  }
  return context;
}
