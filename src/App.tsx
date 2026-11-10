import { useState } from 'react';
import { useAuth } from './contexts/auth/useAuth';
import { useTheme } from './contexts/theme/useTheme';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { user, loading, isAdmin, logout } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="King's Tools Logo"
              className="h-10 w-10 rounded object-contain"
              onError={(e) => {
                e.currentTarget.src = '/images/product-placeholder.svg';
              }}
            />
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                KING&apos;S <span className="text-yellow-500">TOOLS</span>
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Ferretería Industrial &amp; Herramientas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="cursor-pointer rounded-md border border-zinc-300 bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-800 transition hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
            </button>

            {user && (
              <button
                type="button"
                onClick={logout}
                disabled={loading}
                className="cursor-pointer rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        {loading && !user ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-yellow-500 dark:border-zinc-700 dark:border-t-yellow-500" />
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              Verificando sesión y rol de usuario...
            </p>
          </div>
        ) : user ? (
          <div className="mx-auto max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <span className="inline-block rounded bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Sesión Activa
              </span>
              <span
                className={`inline-block rounded px-2.5 py-1 text-xs font-semibold uppercase ${
                  isAdmin
                    ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                    : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                }`}
              >
                Rol: {user.role}
              </span>
            </div>

            <h2 className="mt-4 text-xl font-bold">{user.displayName}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {user.email}
            </p>
            <p className="mt-2 font-mono text-xs text-zinc-400">
              UID: {user.uid}
            </p>
          </div>
        ) : authView === 'login' ? (
          <LoginPage onSwitchToRegister={() => setAuthView('register')} />
        ) : (
          <RegisterPage onSwitchToLogin={() => setAuthView('login')} />
        )}
      </main>
    </div>
  );
}
