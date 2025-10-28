import { createContext, useContext, useState, type ReactNode } from 'react';

interface DialogStateContextType {
  isDialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

const DialogStateContext = createContext<DialogStateContextType | undefined>(undefined);

export function DialogStateProvider({ children }: { children: ReactNode }) {
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <DialogStateContext.Provider value={{ isDialogOpen, setDialogOpen }}>
      {children}
    </DialogStateContext.Provider>
  );
}

export function useDialogState() {
  const context = useContext(DialogStateContext);
  if (context === undefined) {
    throw new Error('useDialogState must be used within a DialogStateProvider');
  }
  return context;
}
