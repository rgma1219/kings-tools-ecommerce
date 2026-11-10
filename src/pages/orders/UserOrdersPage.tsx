import { EmptyState } from '../../components/ui/EmptyState';

export function UserOrdersPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Mis Órdenes</h1>
      <EmptyState
        title="Todavía no registrás compras"
        description="Cuando confirmes un pedido en el checkout, podrás seguir su estado desde acá."
      />
    </section>
  );
}

