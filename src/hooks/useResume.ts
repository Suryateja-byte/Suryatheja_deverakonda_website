import { useCallback, useEffect, useState } from 'react';

import { clearResumeCache, loadResume, type Resume } from '@lib/resume';

type ResumeState = {
  data: Resume | null;
  error: Error | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

export function useResume(): ResumeState {
  const [data, setData] = useState<Resume | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    try {
      const resume = await loadResume(controller.signal);
      setData(resume);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError(err as Error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(async () => {
    clearResumeCache();
    await fetchData();
  }, [fetchData]);

  return { data, error, loading, refresh };
}
