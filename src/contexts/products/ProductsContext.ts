import { createContext } from 'react';
import type { ProductsContextType } from './ProductsContext.type';

export const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

