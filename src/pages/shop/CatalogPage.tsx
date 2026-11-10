import { ProductCard } from '../../components/products/ProductCard';
import { ProductFilters } from '../../components/products/ProductFilters';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Spinner } from '../../components/ui/Spinner';
import { useCart } from '../../contexts/cart/useCart';
import { useProducts } from '../../contexts/products/useProducts';

export function CatalogPage() {
  const {
    products,
    isLoading,
    error,
    hasNextPage,
    isLoadingMore,
    searchText,
    categoryId,
    setSearchText,
    setCategoryId,
    resetFilters,
    loadProducts,
  } = useProducts();

  const { addToCart, getItemQuantity } = useCart();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Catálogo de Herramientas
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Equipamiento profesional e industrial para taller y obra.
        </p>
      </div>

      <ProductFilters
        searchText={searchText}
        categoryId={categoryId}
        onSearchChange={setSearchText}
        onCategoryChange={setCategoryId}
        onReset={resetFilters}
      />

      {error && <Alert variant="error">{error}</Alert>}

      {isLoading ? (
        <Spinner label="Cargando herramientas del catálogo..." />
      ) : products.length === 0 ? (
        <EmptyState
          title="No encontramos herramientas que coincidan"
          description="Probá buscando con otro término o seleccionando otra categoría del catálogo."
          action={
            <Button variant="secondary" onClick={resetFilters}>
              Ver todo el catálogo
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantityInCart={getItemQuantity(product.id)}
                onAdd={addToCart}
              />
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="secondary"
                isLoading={isLoadingMore}
                onClick={() => void loadProducts({ reset: false })}
              >
                {isLoadingMore
                  ? 'Cargando más...'
                  : 'Cargar más herramientas'}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
