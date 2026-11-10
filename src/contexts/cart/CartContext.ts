import { createContext } from 'react';
import type { CartContextType } from './CartContext.type';

export const CartContext = createContext<CartContextType | undefined>(undefined);

