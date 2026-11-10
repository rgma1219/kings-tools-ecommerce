export const ROUTES = {
  HOME: '/',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
} as const;

export function getProductDetailPath(id: string): string {
  return `/products/${id}`;
}

export function getOrderDetailPath(id: string): string {
  return `/orders/${id}`;
}

