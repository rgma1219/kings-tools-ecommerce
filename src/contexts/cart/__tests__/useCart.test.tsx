import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  mockDrillProduct,
  mockHammerProduct,
} from '../../../test/fixtures/products.fixture';
import { CartProvider } from '../CartProvider';
import { useCart } from '../useCart';

function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe('useCart hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('lanza un error descriptivo si se invoca fuera de CartProvider', () => {
    expect(() => renderHook(() => useCart())).toThrow(
      'useCart debe usarse dentro de un <CartProvider>'
    );
  });

  it('agrega productos, calcula totalItems y totalPrice automáticamente y persiste en localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockDrillProduct, 2);
      result.current.addToCart(mockHammerProduct, 1);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(
      mockDrillProduct.price * 2 + mockHammerProduct.price
    );
    expect(result.current.getItemQuantity(mockDrillProduct.id)).toBe(2);

    const savedRaw = localStorage.getItem('kings_tools_cart');
    expect(savedRaw).not.toBeNull();
  });

  it('actualiza cantidades, elimina un producto y limpia el carrito', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockDrillProduct, 1);
      result.current.addToCart(mockHammerProduct, 2);
    });

    act(() => {
      result.current.updateQuantity(mockDrillProduct.id, 4);
    });
    expect(result.current.getItemQuantity(mockDrillProduct.id)).toBe(4);

    act(() => {
      result.current.removeFromCart(mockHammerProduct.id);
    });
    expect(result.current.items).toHaveLength(1);

    act(() => {
      result.current.clearCart();
    });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });
});

