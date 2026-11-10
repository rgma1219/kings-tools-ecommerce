import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../contexts/auth/useAuth';
import { ROUTES } from './routes';

export function AdminRoute() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <Spinner label="Verificando permisos de administrador..." />;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
}

