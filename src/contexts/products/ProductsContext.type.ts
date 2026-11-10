import type { ProductCursor } from '../../services/products.service';
import type { CategoryId, Product } from '../../types';

export interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  cursor: ProductCursor;
  hasNextPage: boolean;
  isLoadingMore: boolean;
  searchText: string;
  categoryId: CategoryId | '';
}

export interface ProductsContextType extends ProductsState {
  loadProducts: (options?: { reset?: boolean }) => Promise<void>;
  setSearchText: (value: string) => void;
  setCategoryId: (value: CategoryId | '') => void;
  resetFilters: () => void;
}

