import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ROUTES } from '../../routes/routes';

export function CartPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Carrito de Compras</h1>
      <EmptyState
        title="Tu carrito está vacío"
        description="Explorá el catálogo de King's Tools para agregar herramientas a tu pedido."
        action={
          <Link to={ROUTES.HOME}>
            <Button variant="primary">Ir al catálogo</Button>
          </Link>
        }
      />
    </section>
  );
}

