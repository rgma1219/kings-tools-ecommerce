import { EmptyState } from '../../components/ui/EmptyState';

export function CheckoutPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Finalizar Compra</h1>
      <EmptyState
        title="Ruta protegida de Checkout verificada"
        description="Solo usuarios autenticados pueden acceder a esta pantalla."
      />
    </section>
  );
}

