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
  ) => Promise<UserProfile>;
  login: (email: string, password: string) => Promise<UserProfile>;
  loginGoogle: () => Promise<UserProfile>;
  logout: () => Promise<void>;
  clearError: () => void;
}

