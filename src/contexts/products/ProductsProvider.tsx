import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import {
  listProducts,
  type ProductCursor,
} from '../../services/products.service';
import type { CategoryId } from '../../types';
import { ProductsContext } from './ProductsContext';
import type { ProductsState } from './ProductsContext.type';

const PAGE_SIZE = 12;

const initialState: ProductsState = {
  products: [],
  isLoading: true,
  error: null,
  cursor: null,
  currentPage: 1,
  hasNextPage: false,
  hasPrevPage: false,
  searchText: '',
  categoryId: '',
};

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProductsState>(initialState);
  // Almacena el cursor de inicio de cada página (índice 0 = página 1 con cursor null, índice 1 = página 2, etc.)
  const pageCursorsRef = useRef<ProductCursor[]>([null]);

  const debouncedSearch = useDebounce(state.searchText, 400);
  const searchPrefix =
    debouncedSearch.trim().length >= 2
      ? debouncedSearch.trim().toLowerCase()
      : undefined;

  const loadProducts = useCallback(
    async ({
      reset = false,
      page,
    }: { reset?: boolean; page?: number } = {}) => {
      const targetPage = reset ? 1 : (page ?? 1);

      if (reset) {
        pageCursorsRef.current = [null];
      }

      const startCursor = pageCursorsRef.current[targetPage - 1] ?? null;

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const { items, lastDoc, hasMore } = await listProducts({
          categoryId: state.categoryId || null,
          searchPrefix,
          pageSize: PAGE_SIZE,
          cursor: startCursor,
        });

        if (lastDoc && hasMore) {
          pageCursorsRef.current[targetPage] = lastDoc;
        }

        setState((prev) => ({
          ...prev,
          products: items,
          cursor: lastDoc,
          currentPage: targetPage,
          hasNextPage: hasMore,
          hasPrevPage: targetPage > 1,
          isLoading: false,
        }));
      } catch (err: unknown) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            err instanceof Error
              ? err.message
              : 'No se pudieron cargar los productos del catálogo.',
        }));
      }
    },
    [state.categoryId, searchPrefix]
  );

  useEffect(() => {
    void loadProducts({ reset: true });
  }, [loadProducts]);

  const nextPage = useCallback(async () => {
    if (!state.hasNextPage || state.isLoading) return;
    await loadProducts({ page: state.currentPage + 1 });
  }, [state.hasNextPage, state.isLoading, state.currentPage, loadProducts]);

  const prevPage = useCallback(async () => {
    if (state.currentPage <= 1 || state.isLoading) return;
    await loadProducts({ page: state.currentPage - 1 });
  }, [state.currentPage, state.isLoading, loadProducts]);

  const setSearchText = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      searchText: value,
    }));
  }, []);

  const setCategoryId = useCallback((value: CategoryId | '') => {
    setState((prev) => ({
      ...prev,
      categoryId: value,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setState((prev) => ({
      ...prev,
      searchText: '',
      categoryId: '',
    }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      loadProducts,
      nextPage,
      prevPage,
      setSearchText,
      setCategoryId,
      resetFilters,
    }),
    [
      state,
      loadProducts,
      nextPage,
      prevPage,
      setSearchText,
      setCategoryId,
      resetFilters,
    ]
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

