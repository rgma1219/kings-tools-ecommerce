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
  hasNextPage: true,
  isLoadingMore: false,
  searchText: '',
  categoryId: '',
};

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProductsState>(initialState);
  const cursorRef = useRef<ProductCursor>(null);

  const debouncedSearch = useDebounce(state.searchText, 400);
  const searchPrefix =
    debouncedSearch.trim().length >= 2
      ? debouncedSearch.trim().toLowerCase()
      : undefined;

  const loadProducts = useCallback(
    async ({ reset = false }: { reset?: boolean } = {}) => {
      const isFirstPage = reset || cursorRef.current === null;
      const activeCursor = isFirstPage ? null : cursorRef.current;

      setState((prev) => ({
        ...prev,
        ...(isFirstPage
          ? { products: [], isLoading: true }
          : { isLoadingMore: true }),
        error: null,
      }));

      try {
        const { items, lastDoc } = await listProducts({
          categoryId: state.categoryId || null,
          searchPrefix,
          pageSize: PAGE_SIZE,
          cursor: activeCursor,
        });

        cursorRef.current = lastDoc;

        setState((prev) => ({
          ...prev,
          products: isFirstPage ? items : [...prev.products, ...items],
          cursor: lastDoc,
          hasNextPage: items.length === PAGE_SIZE,
          isLoading: false,
          isLoadingMore: false,
        }));
      } catch (err: unknown) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isLoadingMore: false,
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
    cursorRef.current = null;
    void loadProducts({ reset: true });
  }, [loadProducts]);

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
      setSearchText,
      setCategoryId,
      resetFilters,
    }),
    [state, loadProducts, setSearchText, setCategoryId, resetFilters]
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

