export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  // Conservamos el stock disponible en el ítem para validar topes de cantidad dentro del reducer puro sin consultar servicios externos.
  stock: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | {
      type: 'ADD_ITEM';
      payload: Omit<CartItem, 'quantity'> & { quantity?: number };
    }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | {
      type: 'UPDATE_QUANTITY';
      payload: { productId: string; quantity: number };
    }
  | { type: 'CLEAR_CART' };

