import type { Theme } from '../../types';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

