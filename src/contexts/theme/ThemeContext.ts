import { createContext } from 'react';
import type { ThemeContextType } from './ThemeContext.type';

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

