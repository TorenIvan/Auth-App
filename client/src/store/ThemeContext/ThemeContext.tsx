import { createContext, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Constants, Theme } from '../../utils';
import { useLocalStorage } from '../../hooks';

interface IThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const defaultTheme = prefersDark ? Constants.DarkPalette : Constants.LightPalette;

const ThemeContext = createContext<IThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>('app-theme', defaultTheme);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const newTheme =
      theme === Constants.LightPalette ? Constants.DarkPalette : Constants.LightPalette;
    setTheme(newTheme);
  }, [theme, setTheme]);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return [context.theme, context.toggleTheme] as const;
}
