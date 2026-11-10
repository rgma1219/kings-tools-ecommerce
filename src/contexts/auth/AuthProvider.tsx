import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getOrCreateUserProfile,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  registerWithEmail,
  subscribeToAuthChanges,
} from '../../services/auth.service';
import type { UserProfile } from '../../types';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  // Arranca en true y no pasa a false hasta haber leído el rol en Firestore, evitando que las rutas protegidas redirijan prematuramente.
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const profile = await getOrCreateUserProfile(firebaseUser);
        setUser(profile);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo cargar el perfil del usuario.'
        );
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      setLoading(true);
      setError(null);
      try {
        const profile = await registerWithEmail(email, password, displayName);
        setUser(profile);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Error al registrar usuario.';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const profile = await loginWithEmail(email, password);
      setUser(profile);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al iniciar sesión.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await loginWithGoogle();
      setUser(profile);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al iniciar sesión con Google.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await logoutUser();
      setUser(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al cerrar sesión.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAdmin: user?.role === 'admin',
      register,
      login,
      loginGoogle,
      logout,
      clearError,
    }),
    [user, loading, error, register, login, loginGoogle, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

