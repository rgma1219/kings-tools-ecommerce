export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  // Snapshot del precio unitario al momento de la compra para que futuros cambios de catálogo no alteren órdenes históricas.
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingInfo: ShippingInfo;
  createdAt: Date;
  updatedAt: Date;
}

