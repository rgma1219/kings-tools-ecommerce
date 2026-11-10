import type { UserProfile } from '../../types';

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  register: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

