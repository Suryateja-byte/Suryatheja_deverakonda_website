import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Lenis from 'lenis';

import { prefersReducedMotion } from '@lib/utils';

type SmoothScrollProviderProps = {
  children: ReactNode;
};

type SmoothScrollContextValue = {
  lenis: Lenis | null;
  isEnabled: boolean;
  stop: () => void;
  start: () => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const frameRef = useRef<number>(0);
  const [isEnabled, setIsEnabled] = useState(false);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const reduceMotion = prefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      return () => undefined;
    }

    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 1.6),
      smoothWheel: true,
      gestureOrientation: 'vertical',
      touchMultiplier: 1.1,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);
    (window as WindowWithLenis).__lenis = lenis;
    setIsEnabled(true);

    const raf = (time: number) => {
      lenis.raf(time);
      frameRef.current = requestAnimationFrame(raf);
    };

    frameRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameRef.current);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
      (window as WindowWithLenis).__lenis = undefined;
      root.style.scrollBehavior = previousScrollBehavior;
      setIsEnabled(false);
    };
  }, [reduceMotion]);

  const stop = useCallback(() => {
    const instance = lenisRef.current;
    if (!instance) return;
    instance.stop();
    setIsEnabled(false);
  }, []);

  const start = useCallback(() => {
    const instance = lenisRef.current;
    if (!instance) return;
    instance.start();
    setIsEnabled(true);
  }, []);

  const contextValue = useMemo<SmoothScrollContextValue>(
    () => ({
      lenis: lenisInstance,
      isEnabled: !reduceMotion && isEnabled,
      stop,
      start,
    }),
    [isEnabled, lenisInstance, reduceMotion, start, stop],
  );

  return <SmoothScrollContext.Provider value={contextValue}>{children}</SmoothScrollContext.Provider>;
}

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

type WindowWithLenis = Window & {
  __lenis?: Lenis;
};
