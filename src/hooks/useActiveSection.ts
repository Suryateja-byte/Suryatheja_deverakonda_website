import { useEffect, useRef, useState } from 'react';

const OBSERVER_OPTIONS: globalThis.IntersectionObserverInit = {
  rootMargin: '-45% 0px -45% 0px',
  threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
};

type SectionCandidate = [id: string, distance: number];

export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? 'hero');
  const visibilityMapRef = useRef<Map<string, { ratio: number; top: number; midpoint: number }>>(new Map());
  const activeIdRef = useRef<string>(activeId);
  const headerOffsetRef = useRef<number>(0);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    if (!sectionIds.length) {
      return;
    }

    if (!sectionIds.includes(activeIdRef.current)) {
      const nextId = sectionIds[0];
      activeIdRef.current = nextId;
      setActiveId(nextId);
    }
  }, [sectionIds]);

  useEffect(() => {
    const computeHeaderOffset = () => {
      const headerElement = document.querySelector<HTMLElement>('[data-site-header]');
      if (!headerElement) {
        headerOffsetRef.current = 0;
        return;
      }

      const style = window.getComputedStyle(headerElement);
      const marginTop = parseFloat(style.marginTop || '0');
      const marginBottom = parseFloat(style.marginBottom || '0');
      headerOffsetRef.current = headerElement.offsetHeight + marginTop + marginBottom + 16;
    };

    computeHeaderOffset();

    const resizeObserver = new ResizeObserver(computeHeaderOffset);
    const headerElement = document.querySelector<HTMLElement>('[data-site-header]');
    if (headerElement) {
      resizeObserver.observe(headerElement);
    }
    window.addEventListener('resize', computeHeaderOffset, { passive: true });

    return () => {
      window.removeEventListener('resize', computeHeaderOffset);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.querySelector<HTMLElement>(`[data-section="${id}"]`))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return () => undefined;

    const visibilityMap = visibilityMapRef.current;
    visibilityMap.clear();
    sectionIds.forEach((id) =>
      visibilityMap.set(id, { ratio: 0, top: Number.POSITIVE_INFINITY, midpoint: Number.POSITIVE_INFINITY }),
    );

    const observer = new IntersectionObserver((entries) => {
      let nextActiveId = activeIdRef.current;
      let headerPinnedCandidate: SectionCandidate | null = null;
      let nextCandidate: SectionCandidate | null = null;
      const viewportCenter = window.innerHeight / 2;

      entries.forEach((entry) => {
        const id = entry.target.getAttribute('data-section');
        if (!id) return;
        visibilityMap.set(id, {
          ratio: entry.isIntersecting ? entry.intersectionRatio : 0,
          top: entry.boundingClientRect.top,
          midpoint: entry.boundingClientRect.top + entry.boundingClientRect.height / 2,
        });
      });

      visibilityMap.forEach(({ ratio, top, midpoint }, id) => {
        if (ratio <= 0) return;
        const distanceToCenter = Math.abs(midpoint - viewportCenter);
        if (!nextCandidate || distanceToCenter <= nextCandidate[1]) {
          nextCandidate = [id, distanceToCenter];
        }

        const offsetFromHeader = top - headerOffsetRef.current;
        if (offsetFromHeader >= -16) {
          const distanceToHeader = Math.abs(offsetFromHeader);
          if (!headerPinnedCandidate || distanceToHeader < headerPinnedCandidate[1]) {
            headerPinnedCandidate = [id, distanceToHeader];
          }
        }
      });

      if (headerPinnedCandidate !== null) {
        nextActiveId = headerPinnedCandidate[0];
      } else if (nextCandidate !== null) {
        nextActiveId = nextCandidate[0];
      }

      if (!nextCandidate) {
        let fallbackCandidate: SectionCandidate | null = null;
        sectionIds.forEach((id) => {
          const element = document.querySelector<HTMLElement>(`[data-section="${id}"]`);
          if (!element) return;
          const rect = element.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const distance = Math.abs(center - viewportCenter);
          if (!fallbackCandidate || distance < fallbackCandidate[1]) {
            fallbackCandidate = [id, distance];
          }
        });

        if (fallbackCandidate !== null) {
          nextActiveId = fallbackCandidate[0];
        }
      }

      if (nextActiveId && nextActiveId !== activeIdRef.current) {
        activeIdRef.current = nextActiveId;
        setActiveId(nextActiveId);
      }
    }, OBSERVER_OPTIONS);

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [sectionIds]);

  return { activeId };
}
