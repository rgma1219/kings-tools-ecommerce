import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ORDER_STATUS_LABELS,
  OrderStatusBadge,
} from '../../components/orders/OrderStatusBadge';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Spinner } from '../../components/ui/Spinner';
import { getOrderDetailPath } from '../../routes/routes';
import {
  ALLOWED_ORDER_TRANSITIONS,
  getAllOrders,
  updateOrderStatus,
} from '../../services/orders.service';
import type { Order, OrderStatus } from '../../types/order.types';

const STATUS_OPTIONS: OrderStatus[] = [
  'pending',
  'processing',
  'completed',
  'cancelled',
];

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    orderId: string;
    nextStatus: OrderStatus;
  } | null>(null);

  const fetchOrders = useCallback(async (filter: OrderStatus | '') => {
    setLoading(true);
    setError(null);
    setPendingStatusChange(null);
    try {
      const result = await getAllOrders(filter);
      setOrders(result);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar las órdenes de la tienda.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders(statusFilter);
  }, [fetchOrders, statusFilter]);

  const handleStatusChange = async (
    orderId: string,
    currentStatus: OrderStatus,
    newStatus: OrderStatus
  ) => {
    if (currentStatus === newStatus) {
      return;
    }

    setUpdatingOrderId(orderId);
    setError(null);
    setSuccessMessage(null);

    try {
      await updateOrderStatus(orderId, newStatus, currentStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus, updatedAt: new Date() }
            : order
        )
      );
      setPendingStatusChange(null);
      setSuccessMessage(
        `Orden #${orderId.slice(0, 8).toUpperCase()} actualizada a "${ORDER_STATUS_LABELS[newStatus]}".`
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo actualizar el estado de la orden.'
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestión de Órdenes de Clientes
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Seguimiento global de compras, filtrado por estado y actualización
            en tiempo real ({orders.length}{' '}
            {orders.length === 1 ? 'orden' : 'órdenes'}).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="admin-order-status-filter"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
          >
            Estado:
          </label>
          <select
            id="admin-order-status-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter((e.target.value as OrderStatus) || '')
            }
            className="rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="">Todas las órdenes</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {ORDER_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {loading ? (
        <Spinner label="Consultando órdenes en Firestore..." />
      ) : orders.length === 0 ? (
        <EmptyState
          title="No hay órdenes para mostrar"
          description={
            statusFilter
              ? `No se encontraron órdenes con el estado "${ORDER_STATUS_LABELS[statusFilter]}".`
              : 'Todavía no se registraron compras en la tienda.'
          }
          action={
            statusFilter ? (
              <Button variant="secondary" onClick={() => setStatusFilter('')}>
                Ver todas las órdenes
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isUpdating = updatingOrderId === order.id;
            const allowedNextStatuses = ALLOWED_ORDER_TRANSITIONS[order.status];
            const isTerminalStatus = allowedNextStatuses.length === 0;
            const pendingForThisOrder =
              pendingStatusChange?.orderId === order.id
                ? pendingStatusChange.nextStatus
                : null;

            return (
              <article
                key={order.id}
                className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <OrderStatusBadge status={order.status} />
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {order.createdAt.toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-300">
                      Cliente:{' '}
                      <span className="font-semibold">{order.userEmail}</span> ·
                      Recibe:{' '}
                      <span className="font-semibold">
                        {order.shippingInfo.fullName}
                      </span>{' '}
                      ({order.shippingInfo.address}, {order.shippingInfo.city} ·
                      Tel: {order.shippingInfo.phone})
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {isTerminalStatus ? (
                      <span className="rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-400">
                        Orden finalizada
                      </span>
                    ) : pendingForThisOrder ? (
                      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-3 py-1.5">
                        <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                          ¿Pasar a{' '}
                          <strong>
                            {ORDER_STATUS_LABELS[pendingForThisOrder]}
                          </strong>
                          ?
                        </span>
                        <Button
                          variant={
                            pendingForThisOrder === 'cancelled'
                              ? 'danger'
                              : 'primary'
                          }
                          size="sm"
                          isLoading={isUpdating}
                          onClick={() =>
                            void handleStatusChange(
                              order.id,
                              order.status,
                              pendingForThisOrder
                            )
                          }
                        >
                          Confirmar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isUpdating}
                          onClick={() => setPendingStatusChange(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <>
                        <label
                          htmlFor={`status-${order.id}`}
                          className="text-xs font-medium text-zinc-500 dark:text-zinc-400"
                        >
                          Avanzar estado:
                        </label>
                        <select
                          id={`status-${order.id}`}
                          value={order.status}
                          disabled={isUpdating}
                          onChange={(e) => {
                            const selected = e.target.value as OrderStatus;
                            if (selected !== order.status) {
                              setPendingStatusChange({
                                orderId: order.id,
                                nextStatus: selected,
                              });
                            }
                          }}
                          className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-900 focus:border-yellow-500 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        >
                          <option value={order.status} disabled>
                            {ORDER_STATUS_LABELS[order.status]} (actual)
                          </option>
                          {allowedNextStatuses.map((status) => (
                            <option key={status} value={status}>
                              &rarr; {ORDER_STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                      </>
                    )}

                    <Link
                      to={getOrderDetailPath(order.id)}
                      state={{ fromAdmin: true }}
                    >
                      <Button variant="secondary" size="sm">
                        Ver comprobante
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-300">
                    {order.items.map((item) => (
                      <li key={item.productId}>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {item.quantity}x
                        </span>{' '}
                        {item.name}{' '}
                        <span className="text-zinc-400">
                          (${item.price.toLocaleString('es-AR')} c/u)
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="text-right">
                    <span className="text-xs uppercase tracking-wider text-zinc-400">
                      Total de la orden
                    </span>
                    <p className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
                      ${order.totalAmount.toLocaleString('es-AR')}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
