import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react';

import type { Theme } from '@/lib/types';

type AppProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type AppProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: AppProviderState = {
  theme: 'system',
  setTheme: () => null
};

const AppProviderContext = createContext<AppProviderState>(initialState);

export function AppProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'app-theme',
  ...props
}: AppProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    if (theme === 'system') {
      const systemTheme = media.matches ? 'dark' : 'light';
      root.setAttribute('data-theme', systemTheme);
      return;
    }
    root.setAttribute('data-theme', theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    }
  };

  return (
    <AppProviderContext.Provider {...props} value={value}>
      {children}
    </AppProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(AppProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within an AppProvider');
  }

  return context;
};
