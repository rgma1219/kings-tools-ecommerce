import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../contexts/auth/useAuth';
import { ROUTES } from './routes';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner label="Verificando tu sesión..." />;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

