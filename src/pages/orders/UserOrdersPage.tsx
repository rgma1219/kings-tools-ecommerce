import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Spinner } from '../../components/ui/Spinner';
import { useAuth } from '../../contexts/auth/useAuth';
import { getOrderDetailPath, ROUTES } from '../../routes/routes';
import { getUserOrders } from '../../services/orders.service';
import type { Order } from '../../types/order.types';

export function UserOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getUserOrders(user.uid)
      .then((result) => {
        if (!cancelled) {
          setOrders(result);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'No se pudo cargar tu historial de órdenes.'
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mis Órdenes</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Consultá el estado y detalle de tus compras realizadas en King&apos;s
          Tools.
        </p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {loading ? (
        <Spinner label="Cargando tu historial de compras..." />
      ) : orders.length === 0 ? (
        <EmptyState
          title="Todavía no registrás compras"
          description="Cuando confirmes un pedido en el checkout, podrás seguir su estado desde acá."
          action={
            <Link to={ROUTES.HOME}>
              <Button variant="primary">Ir al catálogo</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const totalUnits = order.items.reduce(
              (sum, item) => sum + item.quantity,
              0
            );

            return (
              <article
                key={order.id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {totalUnits} {totalUnits === 1 ? 'producto' : 'productos'} —{' '}
                    <span className="font-bold">
                      ${order.totalAmount.toLocaleString('es-AR')}
                    </span>
                  </p>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Fecha:{' '}
                    {order.createdAt.toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div>
                  <Link to={getOrderDetailPath(order.id)}>
                    <Button variant="secondary" size="sm">
                      Ver detalle
                    </Button>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
