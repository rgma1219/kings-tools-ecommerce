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
    currentPage,
    hasNextPage,
    hasPrevPage,
    searchText,
    categoryId,
    setSearchText,
    setCategoryId,
    resetFilters,
    nextPage,
    prevPage,
  } = useProducts();

  const { addToCart, getItemQuantity } = useCart();

  const handlePrevPage = () => {
    void prevPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    void nextPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

          <nav
            aria-label="Paginación de catálogo"
            className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
          >
            <Button
              variant="secondary"
              size="sm"
              disabled={!hasPrevPage || isLoading}
              onClick={handlePrevPage}
            >
              ← Anterior
            </Button>

            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Página{' '}
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                {currentPage}
              </span>
            </span>

            <Button
              variant="secondary"
              size="sm"
              disabled={!hasNextPage || isLoading}
              onClick={handleNextPage}
            >
              Siguiente →
            </Button>
          </nav>
        </>
      )}
    </section>
  );
}
