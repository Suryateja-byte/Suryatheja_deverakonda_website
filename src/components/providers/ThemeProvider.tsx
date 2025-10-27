import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { isBrowser } from '@lib/utils';

type Theme = 'light' | 'dark';
type ThemeSetting = Theme | 'system';

type ThemeContextValue = {
  theme: ThemeSetting;
  resolvedTheme: Theme;
  setTheme: (value: ThemeSetting) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'portfolio-theme-preference';

function getSystemTheme(): Theme {
  if (!isBrowser()) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  if (!isBrowser()) return;
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children, defaultTheme = 'system' }: { children: ReactNode; defaultTheme?: ThemeSetting }) {
  const [theme, setThemeSetting] = useState<ThemeSetting>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<Theme>(() => (defaultTheme === 'system' ? getSystemTheme() : defaultTheme));

  useEffect(() => {
    if (!isBrowser()) return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeSetting | null;
    if (stored) {
      setThemeSetting(stored);
      setResolvedTheme(stored === 'system' ? getSystemTheme() : stored);
    } else if (defaultTheme === 'system') {
      setResolvedTheme(getSystemTheme());
    }
  }, [defaultTheme]);

  useEffect(() => {
    const nextResolved = theme === 'system' ? getSystemTheme() : theme;
    setResolvedTheme(nextResolved);
    applyTheme(nextResolved);
    if (theme === 'system') {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme]);

  useEffect(() => {
    if (!isBrowser()) return;
    if (theme !== 'system') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const next = mediaQuery.matches ? 'dark' : 'light';
      setResolvedTheme(next);
      applyTheme(next);
    };
    handler();
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  const handleSetTheme = useCallback((value: ThemeSetting) => {
    setThemeSetting(value);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeSetting((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme: handleSetTheme, toggleTheme }),
    [theme, resolvedTheme, handleSetTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
