import { Button } from '../ui/Button';
import {
  PRODUCT_CATEGORIES,
  type CategoryId,
} from '../../types/product.types';

interface ProductFiltersProps {
  searchText: string;
  categoryId: CategoryId | '';
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: CategoryId | '') => void;
  onReset: () => void;
}

export function ProductFilters({
  searchText,
  categoryId,
  onSearchChange,
  onCategoryChange,
  onReset,
}: ProductFiltersProps) {
  const hasActiveFilters = searchText.trim().length > 0 || categoryId !== '';

  return (
    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label htmlFor="catalog-search" className="sr-only">
            Buscar herramientas por nombre
          </label>
          <input
            id="catalog-search"
            type="search"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre (ej. taladro, amoladora, llave)..."
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-yellow-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onCategoryChange('')}
          className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            categoryId === ''
              ? 'bg-yellow-500 text-zinc-950 font-semibold'
              : 'border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800'
          }`}
        >
          Todas
        </button>

        {PRODUCT_CATEGORIES.map((category) => {
          const isSelected = categoryId === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                isSelected
                  ? 'bg-yellow-500 text-zinc-950 font-semibold'
                  : 'border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

