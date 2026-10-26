import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem('codeloop-theme') as ThemeMode) || 'dark';
  });
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = (localStorage.getItem('codeloop-theme') as ThemeMode) || 'dark';
    return stored === 'system' ? getSystemTheme() : stored;
  });

  useEffect(() => {
    const resolved = theme === 'system' ? getSystemTheme() : theme;
    setResolvedTheme(resolved);

    const root = document.documentElement;
    if (resolved === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
    localStorage.setItem('codeloop-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const sys = getSystemTheme();
      setResolvedTheme(sys);
      const root = document.documentElement;
      if (sys === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
      } else {
        root.classList.add('dark');
        root.classList.remove('light');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = (t: ThemeMode) => setThemeState(t);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
