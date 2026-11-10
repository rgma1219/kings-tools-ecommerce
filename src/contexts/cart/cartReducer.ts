import type { CartAction, CartState } from '../../types';

export const initialCartState: CartState = {
  items: [],
};

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { productId, name, price, imageUrl, stock, quantity = 1 } =
        action.payload;

      if (stock <= 0 || quantity <= 0) {
        return state;
      }

      const existingIndex = state.items.findIndex(
        (item) => item.productId === productId
      );

      if (existingIndex >= 0) {
        const existingItem = state.items[existingIndex];
        const nextQuantity = Math.min(existingItem.quantity + quantity, stock);

        if (nextQuantity === existingItem.quantity) {
          return state;
        }

        return {
          ...state,
          items: state.items.map((item, idx) =>
            idx === existingIndex ? { ...item, quantity: nextQuantity } : item
          ),
        };
      }

      const initialQuantity = Math.min(quantity, stock);
      return {
        ...state,
        items: [
          ...state.items,
          {
            productId,
            name,
            price,
            imageUrl,
            stock,
            quantity: initialQuantity,
          },
        ],
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(
          (item) => item.productId !== action.payload.productId
        ),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.productId !== productId),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(quantity, item.stock) }
            : item
        ),
      };
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
      };
    }

    default:
      return state;
  }
}

