import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProductForm } from '../../components/admin/ProductForm';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import { useProducts } from '../../contexts/products/useProducts';
import {
  createProduct,
  deleteProduct,
  listAllProducts,
  updateProduct,
} from '../../services/products.service';
import {
  PRODUCT_CATEGORIES,
  type CategoryId,
  type Product,
  type ProductFormData,
} from '../../types';

const categoryLabelMap: Record<CategoryId, string> = {
  'herramientas-electricas': 'Herramientas Eléctricas',
  'herramientas-manuales': 'Herramientas Manuales',
  'medicion-y-nivelacion': 'Medición y Nivelación',
  'seguridad-industrial': 'Seguridad Industrial',
  'fijaciones-y-tornilleria': 'Fijaciones y Tornillería',
  'accesorios-y-consumibles': 'Accesorios y Consumibles',
};

export function AdminProductsPage() {
  const { loadProducts: refreshPublicCatalog } = useProducts();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [searchFilter, setSearchFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | ''>('');

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAdminProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await listAllProducts();
      setProducts(items);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo cargar el listado de productos.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAdminProducts();
  }, [fetchAdminProducts]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchFilter.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        !categoryFilter || product.categoryId === categoryFilter;
      const matchesSearch =
        !normalizedSearch || product.nameLower.includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [products, searchFilter, categoryFilter]);

  const handleOpenCreate = () => {
    setSuccessMessage(null);
    setEditingProduct(null);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEdit = (product: Product) => {
    setSuccessMessage(null);
    setEditingProduct(product);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (formData: ProductFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        setSuccessMessage(
          `Producto "${formData.name}" actualizado correctamente.`
        );
      } else {
        await createProduct(formData);
        setSuccessMessage(`Producto "${formData.name}" creado correctamente.`);
      }

      handleCloseForm();
      await fetchAdminProducts();
      await refreshPublicCatalog({ reset: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    setDeletingId(product.id);
    setError(null);
    setSuccessMessage(null);

    try {
      await deleteProduct(product.id);
      setConfirmDeleteId(null);
      setSuccessMessage(`Producto "${product.name}" eliminado del catálogo.`);
      await fetchAdminProducts();
      await refreshPublicCatalog({ reset: true });
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar el producto de Firestore.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestión de Productos (CRUD)
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Administrá el inventario de King&apos;s Tools ({products.length}{' '}
            productos registrados).
          </p>
        </div>

        {!isFormOpen && (
          <Button variant="primary" onClick={handleOpenCreate}>
            + Nuevo producto
          </Button>
        )}
      </div>

      {error && <Alert variant="error">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {isFormOpen && (
        <ProductForm
          // Forzamos remount al cambiar entre alta y edición de distintos productos
          key={editingProduct?.id ?? 'new-product'}
          initialProduct={editingProduct}
          isSubmitting={isSubmitting}
          onSubmit={handleSaveProduct}
          onCancel={handleCloseForm}
        />
      )}

      <div className="grid grid-cols-1 gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-xs sm:grid-cols-[1fr_240px] dark:border-zinc-800 dark:bg-zinc-900">
        <Input
          id="admin-product-search"
          label="Buscar por nombre"
          placeholder="Buscar en el inventario..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
        />

        <div>
          <label
            htmlFor="admin-category-filter"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Filtrar por categoría
          </label>
          <select
            id="admin-category-filter"
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter((e.target.value as CategoryId) || '')
            }
            className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          >
            <option value="">Todas las categorías</option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <Spinner label="Cargando inventario de productos..." />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="No se encontraron productos"
          description="No hay productos que coincidan con el filtro actual o el catálogo está vacío."
          action={
            searchFilter || categoryFilter ? (
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchFilter('');
                  setCategoryFilter('');
                }}
              >
                Limpiar filtros
              </Button>
            ) : (
              <Button variant="primary" onClick={handleOpenCreate}>
                Crear primer producto
              </Button>
            )
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-400">
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredProducts.map((product) => {
                  const isConfirmingDelete = confirmDeleteId === product.id;
                  const isDeletingThis = deletingId === product.id;

                  return (
                    <tr
                      key={product.id}
                      className="transition hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-11 w-11 shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 object-contain p-1 dark:border-zinc-700 dark:bg-zinc-800"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
                              {product.name}
                            </p>
                            <p className="font-mono text-[11px] text-zinc-400">
                              ID: {product.id.slice(0, 10)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                        {categoryLabelMap[product.categoryId] ??
                          product.categoryId}
                      </td>

                      <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                        ${product.price.toLocaleString('es-AR')}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            product.stock === 0
                              ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                              : product.stock <= 5
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          {product.stock} u.
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        {isConfirmingDelete ? (
                          <div className="inline-flex items-center justify-end gap-2">
                            <Button
                              variant="danger"
                              size="sm"
                              isLoading={isDeletingThis}
                              onClick={() => handleDeleteProduct(product)}
                            >
                              Confirmar baja
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isDeletingThis}
                              onClick={() => setConfirmDeleteId(null)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-end gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleOpenEdit(product)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => setConfirmDeleteId(product.id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
