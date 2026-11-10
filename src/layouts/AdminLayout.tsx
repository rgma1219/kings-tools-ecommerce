import { Link, NavLink, Outlet } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/auth/useAuth';
import { useTheme } from '../contexts/theme/useTheme';
import { ROUTES } from '../routes/routes';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const adminNavClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3.5 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-yellow-500 text-zinc-950 font-semibold'
        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900 text-zinc-100">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="King's Tools Admin"
              className="h-9 w-9 rounded object-contain"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight">
                  KING&apos;S <span className="text-yellow-500">TOOLS</span>
                </span>
                <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-[11px] font-semibold uppercase text-yellow-400">
                  Admin
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Panel de Gestión de Catálogo y Órdenes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to={ROUTES.HOME}>
              <Button variant="secondary" size="sm">
                &larr; Ver Tienda
              </Button>
            </Link>
            <Button variant="secondary" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? 'Claro' : 'Oscuro'}
            </Button>
            {user && (
              <Button variant="ghost" size="sm" onClick={logout}>
                Salir
              </Button>
            )}
          </div>
        </div>

        <div className="border-t border-zinc-800 bg-zinc-900/80">
          <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2.5">
            <NavLink to={ROUTES.ADMIN_PRODUCTS} className={adminNavClass}>
              Productos (CRUD)
            </NavLink>
            <NavLink to={ROUTES.ADMIN_ORDERS} className={adminNavClass}>
              Órdenes de Clientes
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

