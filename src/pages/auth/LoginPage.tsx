import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/auth/useAuth';
import { ROUTES } from '../../routes/routes';
import type { UserRole } from '../../types';

function getPostLoginRedirectPath(
  role: UserRole,
  fromPathname?: string
): string {
  if (role === 'admin') {
    return fromPathname?.startsWith(ROUTES.ADMIN)
      ? fromPathname
      : ROUTES.ADMIN_PRODUCTS;
  }
  return fromPathname ?? ROUTES.HOME;
}

export function LoginPage() {
  const { user, login, loginGoogle, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const fromPathname = (
    location.state as { from?: { pathname?: string } } | null
  )?.from?.pathname;

  if (user) {
    return (
      <Navigate
        to={getPostLoginRedirectPath(user.role, fromPathname)}
        replace
      />
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!email.trim() || !password) {
      setValidationError('Completá tu correo electrónico y contraseña.');
      return;
    }

    try {
      const profile = await login(email.trim(), password);
      navigate(getPostLoginRedirectPath(profile.role, fromPathname), {
        replace: true,
      });
    } catch {
      // El mensaje queda disponible en el estado error de AuthContext
    }
  };

  const handleGoogleLogin = async () => {
    setValidationError(null);
    clearError();
    try {
      const profile = await loginGoogle();
      navigate(getPostLoginRedirectPath(profile.role, fromPathname), {
        replace: true,
      });
    } catch {
      // El mensaje queda disponible en el estado error de AuthContext
    }
  };

  const activeError = validationError ?? error;

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Iniciar sesión
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Ingresá a tu cuenta de King&apos;s Tools
        </p>
      </div>

      {activeError && (
        <div className="mb-4">
          <Alert variant="error">{activeError}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          id="login-email"
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          placeholder="tu@email.com"
        />

        <Input
          id="login-password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          placeholder="••••••••"
        />

        <Button type="submit" fullWidth isLoading={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-xs uppercase tracking-wider text-zinc-400">
          o continuar con
        </span>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <Button
        type="button"
        variant="secondary"
        fullWidth
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        Continuar con Google
      </Button>

      <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        ¿No tenés cuenta?{' '}
        <Link
          to={ROUTES.REGISTER}
          onClick={clearError}
          className="font-semibold text-yellow-600 hover:underline dark:text-yellow-400"
        >
          Registrate acá
        </Link>
      </p>
    </div>
  );
}
