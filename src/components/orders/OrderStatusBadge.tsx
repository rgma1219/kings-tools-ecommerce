import type { OrderStatus } from '../../types/order.types';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  processing: 'En preparación',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

const STATUS_CLASSES: Record<OrderStatus, string> = {
  pending:
    'bg-yellow-500/15 text-yellow-700 border-yellow-500/30 dark:text-yellow-400',
  processing:
    'bg-blue-500/15 text-blue-700 border-blue-500/30 dark:text-blue-400',
  completed:
    'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400',
  cancelled:
    'bg-red-500/15 text-red-700 border-red-500/30 dark:text-red-400',
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASSES[status]}`}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}

