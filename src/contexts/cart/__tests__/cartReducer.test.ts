import { describe, expect, it } from 'vitest';
import {
  mockDrillProduct,
  mockHammerProduct,
} from '../../../test/fixtures/products.fixture';
import type { CartState } from '../../../types';
import { cartReducer, initialCartState } from '../cartReducer';

describe('cartReducer', () => {
  it('agrega un producto nuevo al carrito con ADD_ITEM', () => {
    const nextState = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: {
        productId: mockDrillProduct.id,
        name: mockDrillProduct.name,
        price: mockDrillProduct.price,
        imageUrl: mockDrillProduct.imageUrl,
        stock: mockDrillProduct.stock,
        quantity: 2,
      },
    });

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0]).toEqual({
      productId: mockDrillProduct.id,
      name: mockDrillProduct.name,
      price: mockDrillProduct.price,
      imageUrl: mockDrillProduct.imageUrl,
      stock: mockDrillProduct.stock,
      quantity: 2,
    });
    expect(initialCartState.items).toHaveLength(0);
  });

  it('incrementa la cantidad si el producto ya existe en el carrito sin superar el stock máximo', () => {
    const stateWithOne: CartState = {
      items: [
        {
          productId: mockDrillProduct.id,
          name: mockDrillProduct.name,
          price: mockDrillProduct.price,
          imageUrl: mockDrillProduct.imageUrl,
          stock: 5,
          quantity: 4,
        },
      ],
    };

    const nextState = cartReducer(stateWithOne, {
      type: 'ADD_ITEM',
      payload: {
        productId: mockDrillProduct.id,
        name: mockDrillProduct.name,
        price: mockDrillProduct.price,
        imageUrl: mockDrillProduct.imageUrl,
        stock: 5,
        quantity: 3,
      },
    });

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].quantity).toBe(5);
  });

  it('actualiza la cantidad de un ítem con UPDATE_QUANTITY respetando el tope de stock', () => {
    const currentState: CartState = {
      items: [
        {
          productId: mockDrillProduct.id,
          name: mockDrillProduct.name,
          price: mockDrillProduct.price,
          imageUrl: mockDrillProduct.imageUrl,
          stock: 5,
          quantity: 1,
        },
      ],
    };

    const updatedState = cartReducer(currentState, {
      type: 'UPDATE_QUANTITY',
      payload: { productId: mockDrillProduct.id, quantity: 3 },
    });

    expect(updatedState.items[0].quantity).toBe(3);

    const cappedState = cartReducer(updatedState, {
      type: 'UPDATE_QUANTITY',
      payload: { productId: mockDrillProduct.id, quantity: 99 },
    });

    expect(cappedState.items[0].quantity).toBe(5);
  });

  it('elimina el ítem automáticamente cuando UPDATE_QUANTITY recibe cantidad 0 o menor', () => {
    const currentState: CartState = {
      items: [
        {
          productId: mockDrillProduct.id,
          name: mockDrillProduct.name,
          price: mockDrillProduct.price,
          imageUrl: mockDrillProduct.imageUrl,
          stock: 5,
          quantity: 1,
        },
      ],
    };

    const nextState = cartReducer(currentState, {
      type: 'UPDATE_QUANTITY',
      payload: { productId: mockDrillProduct.id, quantity: 0 },
    });

    expect(nextState.items).toHaveLength(0);
  });

  it('elimina únicamente el producto indicado con REMOVE_ITEM', () => {
    const currentState: CartState = {
      items: [
        {
          productId: mockDrillProduct.id,
          name: mockDrillProduct.name,
          price: mockDrillProduct.price,
          imageUrl: mockDrillProduct.imageUrl,
          stock: 5,
          quantity: 1,
        },
        {
          productId: mockHammerProduct.id,
          name: mockHammerProduct.name,
          price: mockHammerProduct.price,
          imageUrl: mockHammerProduct.imageUrl,
          stock: 10,
          quantity: 2,
        },
      ],
    };

    const nextState = cartReducer(currentState, {
      type: 'REMOVE_ITEM',
      payload: { productId: mockDrillProduct.id },
    });

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].productId).toBe(mockHammerProduct.id);
  });

  it('vacía por completo el carrito con CLEAR_CART', () => {
    const currentState: CartState = {
      items: [
        {
          productId: mockDrillProduct.id,
          name: mockDrillProduct.name,
          price: mockDrillProduct.price,
          imageUrl: mockDrillProduct.imageUrl,
          stock: 5,
          quantity: 2,
        },
      ],
    };

    const nextState = cartReducer(currentState, { type: 'CLEAR_CART' });
    expect(nextState.items).toEqual([]);
  });
});

