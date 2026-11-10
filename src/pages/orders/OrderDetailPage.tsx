import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Spinner } from '../../components/ui/Spinner';
import { getProductDetailPath, ROUTES } from '../../routes/routes';
import { getOrderById } from '../../services/orders.service';
import type { Order } from '../../types/order.types';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const routeState = location.state as {
    justCreated?: boolean;
    fromAdmin?: boolean;
  } | null;
  const justCreated = Boolean(routeState?.justCreated);
  const fromAdmin = Boolean(routeState?.fromAdmin);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getOrderById(id)
      .then((result) => {
        if (!cancelled) {
          setOrder(result);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'No se pudo cargar el detalle de la orden.'
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
  }, [id]);

  if (loading) {
    return <Spinner label="Cargando comprobante de orden..." />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="error">{error}</Alert>
        <Link to={ROUTES.ORDERS}>
          <Button variant="secondary">&larr; Volver a Mis Órdenes</Button>
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <EmptyState
        title="Orden no encontrada"
        description="La orden solicitada no existe o no tenés permisos para visualizarla."
        action={
          <Link to={ROUTES.ORDERS}>
            <Button variant="primary">Ir a Mis Órdenes</Button>
          </Link>
        }
      />
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <Link
          to={fromAdmin ? ROUTES.ADMIN_ORDERS : ROUTES.ORDERS}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          &larr;{' '}
          {fromAdmin ? 'Volver a Gestión de Órdenes' : 'Volver a Mis Órdenes'}
        </Link>
      </div>

      {justCreated && (
        <Alert variant="success">
          ¡Tu pedido fue confirmado con éxito! Guardamos tu orden en estado
          pendiente de preparación.
        </Alert>
      )}

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Orden #{order.id}
            </p>
            <h1 className="mt-1 text-xl font-bold sm:text-2xl">
              Detalle de tu Compra
            </h1>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Realizada el{' '}
              {order.createdAt.toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <OrderStatusBadge status={order.status} />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Datos de Entrega
            </h2>
            <div className="mt-2 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                {order.shippingInfo.fullName}
              </p>
              <p>{order.shippingInfo.address}</p>
              <p>{order.shippingInfo.city}</p>
              <p>Tel: {order.shippingInfo.phone}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Resumen de Facturación
            </h2>
            <div className="mt-2 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
              <p>Cliente: {order.userEmail}</p>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Total abonado: ${order.totalAmount.toLocaleString('es-AR')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Productos incluidos ({order.items.length})
          </h2>

          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {order.items.map((item) => (
              <li
                key={item.productId}
                className="flex items-center justify-between gap-4 py-3.5"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-14 w-14 rounded-lg border border-zinc-200 object-cover dark:border-zinc-800"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://i.ibb.co/G4ttxzN3/kingstools-imagen-producto.png';
                    }}
                  />
                  <div>
                    <Link
                      to={getProductDetailPath(item.productId)}
                      className="text-sm font-semibold text-zinc-900 hover:text-yellow-600 dark:text-zinc-100 dark:hover:text-yellow-400"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {item.quantity} x ${item.price.toLocaleString('es-AR')}
                    </p>
                  </div>
                </div>

                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  ${(item.price * item.quantity).toLocaleString('es-AR')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

