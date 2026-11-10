import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { MainLayout } from '../layouts/MainLayout';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { UserOrdersPage } from '../pages/orders/UserOrdersPage';
import { CartPage } from '../pages/shop/CartPage';
import { CatalogPage } from '../pages/shop/CatalogPage';
import { CheckoutPage } from '../pages/shop/CheckoutPage';
import { ProductDetailPage } from '../pages/shop/ProductDetailPage';
import { AdminRoute } from './AdminRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES } from './routes';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<CatalogPage />} />
          <Route
            path={ROUTES.PRODUCT_DETAIL}
            element={<ProductDetailPage />}
          />
          <Route path={ROUTES.CART} element={<CartPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
            <Route path={ROUTES.ORDERS} element={<UserOrdersPage />} />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route
              path={ROUTES.ADMIN}
              element={<Navigate to={ROUTES.ADMIN_PRODUCTS} replace />}
            />
            <Route
              path={ROUTES.ADMIN_PRODUCTS}
              element={<AdminProductsPage />}
            />
            <Route path={ROUTES.ADMIN_ORDERS} element={<AdminOrdersPage />} />
          </Route>
        </Route>

        <Route
          path="*"
          element={<Navigate to={ROUTES.HOME} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

