import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/auth/useAuth';
import { useCart } from '../../contexts/cart/useCart';
import { getOrderDetailPath, ROUTES } from '../../routes/routes';
import { createOrder } from '../../services/orders.service';

export function CheckoutPage() {
  const { user } = useAuth();
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.displayName ?? '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>(
    'card'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0 && !isSubmitting) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Finalizar Compra</h1>
        <EmptyState
          title="No tenés productos para procesar el checkout"
          description="Agregá herramientas al carrito antes de iniciar el proceso de confirmación de compra."
          action={
            <Link to={ROUTES.HOME}>
              <Button variant="primary">Explorar catálogo</Button>
            </Link>
          }
        />
      </section>
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('Debés iniciar sesión para confirmar tu pedido.');
      return;
    }

    if (
      !fullName.trim() ||
      !address.trim() ||
      !city.trim() ||
      !phone.trim()
    ) {
      setError('Por favor completá todos los datos de envío.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = await createOrder({
        userId: user.uid,
        userEmail: user.email,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        totalAmount: totalPrice,
        shippingInfo: {
          fullName: fullName.trim(),
          address: address.trim(),
          city: city.trim(),
          phone: phone.trim(),
        },
      });

      clearCart();
      navigate(getOrderDetailPath(orderId), {
        replace: true,
        state: { justCreated: true },
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'No pudimos procesar tu orden. Intentá nuevamente.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <Link
          to={ROUTES.CART}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          &larr; Volver al carrito
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          Finalizar Compra
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Revisá tu pedido y completá los datos de entrega para confirmar la
          orden.
        </p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <div className="grid gap-8 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-xs lg:col-span-2 dark:border-zinc-800 dark:bg-zinc-900"
          noValidate
        >
          <div>
            <h2 className="text-lg font-bold">1. Datos de Envío</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Dirección donde enviaremos tus herramientas.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                id="checkout-fullname"
                label="Nombre y apellido de quien recibe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isSubmitting}
                placeholder="Juan Pérez"
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                id="checkout-address"
                label="Dirección de entrega (calle y altura)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isSubmitting}
                placeholder="Av. Rivadavia 4520, Piso 2"
              />
            </div>

            <Input
              id="checkout-city"
              label="Ciudad / Localidad"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={isSubmitting}
              placeholder="CABA, Buenos Aires"
            />

            <Input
              id="checkout-phone"
              label="Teléfono de contacto"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubmitting}
              placeholder="+54 11 4455-6677"
            />
          </div>

          <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <h2 className="text-lg font-bold">
              2. Método de Pago (Simulación)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Simulación de pago para demostración — no se realizará ningún
              cargo real.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 text-sm transition ${
                  paymentMethod === 'card'
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  disabled={isSubmitting}
                  className="mt-1 accent-yellow-500"
                />
                <div>
                  <span className="block font-semibold">
                    Tarjeta de Crédito / Débito
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Aprobación inmediata simulada
                  </span>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 text-sm transition ${
                  paymentMethod === 'transfer'
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'transfer'}
                  onChange={() => setPaymentMethod('transfer')}
                  disabled={isSubmitting}
                  className="mt-1 accent-yellow-500"
                />
                <div>
                  <span className="block font-semibold">
                    Transferencia Bancaria
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Orden generada en estado pendiente
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
            >
              {isSubmitting
                ? 'Confirmando tu pedido...'
                : `Confirmar Compra ($${totalPrice.toLocaleString('es-AR')})`}
            </Button>
          </div>
        </form>

        <aside className="h-fit space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold">Resumen de tu Compra</h2>

          <ul className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">
                    {item.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {item.quantity} x ${item.price.toLocaleString('es-AR')}
                  </p>
                </div>
                <span className="font-semibold">
                  ${(item.price * item.quantity).toLocaleString('es-AR')}
                </span>
              </li>
            ))}
          </ul>

          <div className="space-y-1.5 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Total de unidades</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-zinc-900 dark:text-zinc-100">
              <span>Total final</span>
              <span>${totalPrice.toLocaleString('es-AR')}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
