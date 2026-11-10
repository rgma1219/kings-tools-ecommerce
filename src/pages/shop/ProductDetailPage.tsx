import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Spinner } from '../../components/ui/Spinner';
import { ROUTES } from '../../routes/routes';
import { getProductById } from '../../services/products.service';
import {
  PRODUCT_CATEGORIES,
  type Product,
} from '../../types/product.types';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
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

    getProductById(id)
      .then((result) => {
        if (!cancelled) {
          setProduct(result);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Error al obtener el detalle del producto.'
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
    return <Spinner label="Cargando ficha técnica del producto..." />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="error">{error}</Alert>
        <Link to={ROUTES.HOME}>
          <Button variant="secondary">&larr; Volver al catálogo</Button>
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <EmptyState
        title="Producto no encontrado"
        description="El producto que buscás no existe o fue eliminado del catálogo."
        action={
          <Link to={ROUTES.HOME}>
            <Button variant="primary">Volver al catálogo</Button>
          </Link>
        }
      />
    );
  }

  const categoryLabel =
    PRODUCT_CATEGORIES.find((c) => c.id === product.categoryId)?.label ??
    product.categoryId;
  const hasStock = product.stock > 0;

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          &larr; Volver al catálogo
        </Link>
      </div>

      <article className="grid gap-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs md:grid-cols-2 md:p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="aspect-square overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                'https://i.ibb.co/G4ttxzN3/kingstools-imagen-producto.png';
            }}
          />
        </div>

        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="inline-block rounded-md bg-yellow-500/15 px-3 py-1 text-xs font-semibold text-yellow-700 dark:text-yellow-400">
              {categoryLabel}
            </span>

            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
              {product.name}
            </h1>

            <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
              ${product.price.toLocaleString('es-AR')}
            </p>

            <div className="border-y border-zinc-200 py-4 dark:border-zinc-800">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Descripción técnica
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-zinc-500 dark:text-zinc-400">
                Disponibilidad:
              </span>
              <span
                className={`font-semibold ${
                  hasStock
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {hasStock
                  ? `${product.stock} unidades disponibles`
                  : 'Agotado temporalmente'}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Button variant="primary" size="lg" fullWidth disabled={!hasStock}>
              {hasStock ? 'Agregar al carrito' : 'Sin stock disponible'}
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}

