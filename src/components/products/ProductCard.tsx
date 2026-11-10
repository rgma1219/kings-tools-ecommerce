import { Link } from 'react-router-dom';
import { getProductDetailPath } from '../../routes/routes';
import {
  PRODUCT_CATEGORIES,
  type Product,
} from '../../types/product.types';
import { Button } from '../ui/Button';

interface ProductCardProps {
  product: Product;
  quantityInCart?: number;
  onAdd?: (product: Product) => void;
}

export function ProductCard({
  product,
  quantityInCart = 0,
  onAdd,
}: ProductCardProps) {
  const categoryLabel =
    PRODUCT_CATEGORIES.find((c) => c.id === product.categoryId)?.label ??
    product.categoryId;

  const hasStock = product.stock > 0;
  const reachedStockLimit = quantityInCart >= product.stock;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <Link
        to={getProductDetailPath(product.id)}
        className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-950"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              'https://i.ibb.co/G4ttxzN3/kingstools-imagen-producto.png';
          }}
        />
        <span className="absolute top-3 left-3 rounded-md bg-zinc-900/80 px-2.5 py-1 text-[11px] font-medium text-zinc-100 backdrop-blur-xs">
          {categoryLabel}
        </span>
        {quantityInCart > 0 && (
          <span className="absolute top-3 right-3 rounded-md bg-yellow-500 px-2 py-0.5 text-[11px] font-bold text-zinc-950">
            En carrito: {quantityInCart}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link
          to={getProductDetailPath(product.id)}
          className="line-clamp-2 text-base font-semibold text-zinc-900 hover:text-yellow-600 dark:text-zinc-100 dark:hover:text-yellow-400"
        >
          {product.name}
        </Link>

        <p className="mt-1.5 line-clamp-2 flex-1 text-xs text-zinc-500 dark:text-zinc-400">
          {product.description}
        </p>

        <div className="mt-4 flex items-baseline justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            ${product.price.toLocaleString('es-AR')}
          </span>
          <span
            className={`text-xs font-medium ${
              hasStock
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {hasStock ? `Stock: ${product.stock}` : 'Sin stock'}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link to={getProductDetailPath(product.id)}>
            <Button variant="secondary" size="sm" fullWidth>
              Ver detalle
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            fullWidth
            disabled={!hasStock || reachedStockLimit}
            onClick={() => onAdd?.(product)}
          >
            {!hasStock
              ? 'Sin stock'
              : reachedStockLimit
                ? 'Máx. stock'
                : '+ Agregar'}
          </Button>
        </div>
      </div>
    </article>
  );
}
