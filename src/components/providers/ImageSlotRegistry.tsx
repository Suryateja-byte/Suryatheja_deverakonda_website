import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { ImageSlotDefinition } from '@config/IMAGE_SLOTS';

type SlotStatus = 'loading' | 'resolved' | 'missing';

export interface ImageSlotEntry {
  definition: ImageSlotDefinition;
  status: SlotStatus;
}

interface ImageSlotRegistryContextValue {
  slots: Record<string, ImageSlotEntry>;
  reportSlotStatus: (id: string, definition: ImageSlotDefinition, status: SlotStatus) => void;
}

const ImageSlotRegistryContext = createContext<ImageSlotRegistryContextValue | undefined>(undefined);

export function ImageSlotRegistryProvider({ children }: { children: ReactNode }) {
  const [slots, setSlots] = useState<Record<string, ImageSlotEntry>>({});

  const reportSlotStatus = (id: string, definition: ImageSlotDefinition, status: SlotStatus) => {
    setSlots((previous) => {
      const existing = previous[id];
      if (existing?.status === status) return previous;
      return {
        ...previous,
        [id]: {
          definition,
          status,
        },
      };
    });
  };

  const value = useMemo(() => ({ slots, reportSlotStatus }), [slots]);

  return <ImageSlotRegistryContext.Provider value={value}>{children}</ImageSlotRegistryContext.Provider>;
}

export function useImageSlotRegistry() {
  const context = useContext(ImageSlotRegistryContext);
  if (!context) {
    throw new Error('useImageSlotRegistry must be used within an ImageSlotRegistryProvider');
  }

  const missing = Object.values(context.slots).filter((entry) => entry.status === 'missing');
  const pending = Object.values(context.slots).filter((entry) => entry.status === 'loading');
  const resolved = Object.values(context.slots).filter((entry) => entry.status === 'resolved');

  return {
    ...context,
    missing,
    pending,
    resolved,
  };
}
