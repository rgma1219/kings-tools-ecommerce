import { EmptyState } from '../../components/ui/EmptyState';

export function AdminOrdersPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Gestión de Órdenes de Clientes
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Seguimiento, filtrado por estado y actualización de pedidos.
        </p>
      </div>
      <EmptyState
        title="Panel Admin de Órdenes protegido por rol"
        description="Acá se listarán todas las órdenes de la tienda con filtro por estado (pending, processing, completed, cancelled)."
      />
    </section>
  );
}

