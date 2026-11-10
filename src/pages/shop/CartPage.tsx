import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { useCart } from '../../contexts/cart/useCart';
import { getProductDetailPath, ROUTES } from '../../routes/routes';

export function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Carrito de Compras
        </h1>
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

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Carrito de Compras
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Tenés {totalItems} {totalItems === 1 ? 'unidad' : 'unidades'} en tu
            pedido.
          </p>
        </div>

        <Button variant="danger" size="sm" onClick={clearCart}>
          Vaciar carrito
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const subtotal = item.price * item.quantity;

            return (
              <article
                key={item.productId}
                className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center gap-4">
                  <Link
                    to={getProductDetailPath(item.productId)}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://i.ibb.co/G4ttxzN3/kingstools-imagen-producto.png';
                      }}
                    />
                  </Link>

                  <div>
                    <Link
                      to={getProductDetailPath(item.productId)}
                      className="font-semibold text-zinc-900 hover:text-yellow-600 dark:text-zinc-100 dark:hover:text-yellow-400"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      Precio unitario: ${item.price.toLocaleString('es-AR')} (
                      Stock máx: {item.stock})
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-zinc-100 pt-3 sm:border-t-0 sm:pt-0 dark:border-zinc-800">
                  <div className="inline-flex items-center rounded-lg border border-zinc-300 dark:border-zinc-700">
                    <button
                      type="button"
                      aria-label={`Disminuir cantidad de ${item.name}`}
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="cursor-pointer px-3 py-1 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      -
                    </button>
                    <span className="min-w-9 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Aumentar cantidad de ${item.name}`}
                      disabled={item.quantity >= item.stock}
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="cursor-pointer px-3 py-1 text-sm font-bold hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-zinc-800"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      ${subtotal.toLocaleString('es-AR')}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId)}
                      className="cursor-pointer text-xs font-medium text-red-600 hover:underline dark:text-red-400"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="h-fit rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold">Resumen del Pedido</h2>

          <div className="mt-4 space-y-2 border-y border-zinc-200 py-4 text-sm dark:border-zinc-800">
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Unidades totales</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-zinc-900 dark:text-zinc-100">
              <span>Total a pagar</span>
              <span>${totalPrice.toLocaleString('es-AR')}</span>
            </div>
          </div>

          <div className="mt-6 space-y-2.5">
            <Link to={ROUTES.CHECKOUT} className="block">
              <Button variant="primary" size="lg" fullWidth>
                Continuar al Checkout
              </Button>
            </Link>
            <Link to={ROUTES.HOME} className="block">
              <Button variant="secondary" size="md" fullWidth>
                Seguir comprando
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
