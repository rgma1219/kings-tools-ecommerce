import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/useAuth';
import { useTheme } from '../../contexts/theme/useTheme';
import { ROUTES } from '../../routes/routes';
import { Button } from '../ui/Button';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition ${
      isActive
        ? 'text-yellow-600 dark:text-yellow-400'
        : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-3"
          onClick={() => setMobileMenuOpen(false)}
        >
          <img
            src="/images/logo.png"
            alt="King's Tools Logo"
            className="h-10 w-10 rounded object-contain"
          />
          <div>
            <span className="block text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              KING&apos;S <span className="text-yellow-500">TOOLS</span>
            </span>
            <span className="block text-xs text-zinc-500 dark:text-zinc-400">
              Ferretería &amp; Herramientas
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to={ROUTES.HOME} end className={navLinkClass}>
            Catálogo
          </NavLink>
          <NavLink to={ROUTES.CART} className={navLinkClass}>
            Carrito
          </NavLink>
          {user && (
            <NavLink to={ROUTES.ORDERS} className={navLinkClass}>
              Mis Órdenes
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to={ROUTES.ADMIN_PRODUCTS}
              className="rounded-md bg-yellow-500/15 px-2.5 py-1 text-xs font-semibold text-yellow-700 transition hover:bg-yellow-500/25 dark:text-yellow-400"
            >
              Panel Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <Button variant="secondary" size="sm" onClick={toggleTheme}>
            {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
          </Button>

          {user ? (
            <div className="flex items-center gap-2.5 pl-2">
              <span className="max-w-36 truncate text-xs font-medium text-zinc-600 dark:text-zinc-300">
                {user.displayName}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                disabled={loading}
              >
                Salir
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to={ROUTES.LOGIN}>
                <Button variant="ghost" size="sm">
                  Ingresar
                </Button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button variant="primary" size="sm">
                  Crear cuenta
                </Button>
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Abrir menú de navegación"
          className="rounded-lg border border-zinc-300 p-2 text-xs font-medium text-zinc-700 md:hidden dark:border-zinc-700 dark:text-zinc-200"
        >
          {mobileMenuOpen ? 'Cerrar' : 'Menú'}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-4 md:hidden dark:border-zinc-800 dark:bg-zinc-900">
          <nav className="flex flex-col gap-3">
            <NavLink
              to={ROUTES.HOME}
              end
              className={navLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Catálogo
            </NavLink>
            <NavLink
              to={ROUTES.CART}
              className={navLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Carrito
            </NavLink>
            {user && (
              <NavLink
                to={ROUTES.ORDERS}
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Mis Órdenes
              </NavLink>
            )}
            {isAdmin && (
              <NavLink
                to={ROUTES.ADMIN_PRODUCTS}
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Panel de Administración
              </NavLink>
            )}
          </nav>

          <div className="mt-4 flex flex-col gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={toggleTheme}
            >
              {theme === 'dark'
                ? 'Cambiar a Modo Claro'
                : 'Cambiar a Modo Oscuro'}
            </Button>

            {user ? (
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-zinc-600 dark:text-zinc-300">
                  {user.displayName} ({user.role})
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    void logout();
                  }}
                >
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to={ROUTES.LOGIN}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="secondary" size="sm" fullWidth>
                    Ingresar
                  </Button>
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="primary" size="sm" fullWidth>
                    Crear cuenta
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

