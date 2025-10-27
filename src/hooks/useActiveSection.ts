import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? 'hero');

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.querySelector<HTMLElement>(`[data-section="${id}"]`))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          .forEach((entry) => {
            const id = entry.target.getAttribute('data-section');
            if (id) setActiveId(id);
          });
      },
      {
        rootMargin: '-40% 0px -50% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [sectionIds]);

  return { activeId };
}
