import { createContext } from 'react';
import type { AuthContextType } from './AuthContext.type';

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

