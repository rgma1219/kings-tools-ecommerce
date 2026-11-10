import type { ReactNode } from 'react';
import { AuthProvider } from './auth/AuthProvider';
import { ProductsProvider } from './products/ProductsProvider';
import { ThemeProvider } from './theme/ThemeProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProductsProvider>{children}</ProductsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
