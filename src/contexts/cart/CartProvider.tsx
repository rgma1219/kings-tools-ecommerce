import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { CartState, Product } from '../../types';
import { CartContext } from './CartContext';
import { cartReducer, initialCartState } from './cartReducer';

const CART_STORAGE_KEY = 'kings_tools_cart';

function loadCartFromStorage(): CartState {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return initialCartState;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === 'object' &&
      'items' in parsed &&
      Array.isArray((parsed as { items: unknown }).items)
    ) {
      return { items: (parsed as CartState).items };
    }
    return initialCartState;
  } catch {
    return initialCartState;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialCartState,
    loadCartFromStorage
  );

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignora fallos de cuota de almacenamiento en modo privado
    }
  }, [state]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
        quantity,
      },
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { productId },
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, quantity },
    });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const getItemQuantity = useCallback(
    (productId: string): number => {
      const found = state.items.find((item) => item.productId === productId);
      return found ? found.quantity : 0;
    },
    [state.items]
  );

  const totalItems = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
  );

  const totalPrice = useMemo(
    () =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.items]
  );

  const value = useMemo(
    () => ({
      items: state.items,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemQuantity,
    }),
    [
      state.items,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemQuantity,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

