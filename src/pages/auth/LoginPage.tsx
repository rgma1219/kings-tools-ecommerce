import { useState, type FormEvent } from 'react';
import { useAuth } from '../../contexts/auth/useAuth';

interface LoginPageProps {
  onSwitchToRegister?: () => void;
}

export function LoginPage({ onSwitchToRegister }: LoginPageProps) {
  const { login, loginGoogle, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!email.trim() || !password) {
      setValidationError('Completá tu correo electrónico y contraseña.');
      return;
    }

    try {
      await login(email.trim(), password);
    } catch {
      // El mensaje ya queda almacenado en el estado error de AuthContext
    }
  };

  const handleGoogleLogin = async () => {
    setValidationError(null);
    clearError();
    try {
      await loginGoogle();
    } catch {
      // El mensaje ya queda almacenado en el estado error de AuthContext
    }
  };

  const activeError = validationError ?? error;

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Iniciar sesión
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Ingresá a tu cuenta de King&apos;s Tools
        </p>
      </div>

      {activeError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          {activeError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Correo electrónico
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            placeholder="tu@email.com"
            className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Contraseña
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            placeholder="••••••••"
            className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer rounded-lg bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-xs uppercase tracking-wider text-zinc-400">
          o continuar con
        </span>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
      >
        Continuar con Google
      </button>

      {onSwitchToRegister && (
        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          ¿No tenés cuenta?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="cursor-pointer font-semibold text-yellow-600 hover:underline dark:text-yellow-400"
          >
            Registrate acá
          </button>
        </p>
      )}
    </div>
  );
}

