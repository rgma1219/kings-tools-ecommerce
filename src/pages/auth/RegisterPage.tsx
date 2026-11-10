import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/auth/useAuth';
import { ROUTES } from '../../routes/routes';

export function RegisterPage() {
  const { user, register, loginGoogle, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!displayName.trim() || !email.trim() || !password) {
      setValidationError('Completá todos los campos para crear tu cuenta.');
      return;
    }

    if (password.length < 6) {
      setValidationError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      await register(email.trim(), password, displayName.trim());
      navigate(ROUTES.HOME, { replace: true });
    } catch {
      // El mensaje queda disponible en el estado error de AuthContext
    }
  };

  const handleGoogleLogin = async () => {
    setValidationError(null);
    clearError();
    try {
      await loginGoogle();
      navigate(ROUTES.HOME, { replace: true });
    } catch {
      // El mensaje queda disponible en el estado error de AuthContext
    }
  };

  const activeError = validationError ?? error;

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Crear cuenta
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Registrate para comprar en King&apos;s Tools
        </p>
      </div>

      {activeError && (
        <div className="mb-4">
          <Alert variant="error">{activeError}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          id="register-name"
          label="Nombre completo"
          type="text"
          autoComplete="name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          disabled={loading}
          placeholder="Juan Pérez"
        />

        <Input
          id="register-email"
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          placeholder="tu@email.com"
        />

        <Input
          id="register-password"
          label="Contraseña (mínimo 6 caracteres)"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          placeholder="••••••••"
        />

        <Button type="submit" fullWidth isLoading={loading}>
          {loading ? 'Creando cuenta...' : 'Registrarme'}
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
        ¿Ya tenés cuenta?{' '}
        <Link
          to={ROUTES.LOGIN}
          onClick={clearError}
          className="font-semibold text-yellow-600 hover:underline dark:text-yellow-400"
        >
          Iniciá sesión
        </Link>
      </p>
    </div>
  );
}
