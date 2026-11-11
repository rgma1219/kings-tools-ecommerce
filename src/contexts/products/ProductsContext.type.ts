import type { ProductCursor } from '../../services/products.service';
import type { CategoryId, Product } from '../../types';

export interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  cursor: ProductCursor;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  searchText: string;
  categoryId: CategoryId | '';
}

export interface ProductsContextType extends ProductsState {
  loadProducts: (options?: { reset?: boolean; page?: number }) => Promise<void>;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  setSearchText: (value: string) => void;
  setCategoryId: (value: CategoryId | '') => void;
  resetFilters: () => void;
}

