import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  type DocumentData,
  type DocumentSnapshot,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type {
  Order,
  OrderItem,
  OrderStatus,
  ShippingInfo,
} from '../types/order.types';

const ordersCollection = collection(db, 'orders');

export interface CreateOrderInput {
  userId: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  shippingInfo: ShippingInfo;
}

function mapToOrder(
  snapshot:
    | QueryDocumentSnapshot<DocumentData>
    | DocumentSnapshot<DocumentData>
): Order {
  const data = snapshot.data();
  if (!data) {
    throw new Error('Documento de orden vacío.');
  }

  const rawItems = Array.isArray(data.items) ? data.items : [];
  const items: OrderItem[] = rawItems.map((item: Record<string, unknown>) => ({
    productId: String(item.productId ?? ''),
    name: String(item.name ?? ''),
    price: Number(item.price ?? 0),
    quantity: Number(item.quantity ?? 0),
    imageUrl: String(
      item.imageUrl ?? 'https://i.ibb.co/G4ttxzN3/kingstools-imagen-producto.png'
    ),
  }));

  const rawShipping = (data.shippingInfo ?? {}) as Record<string, unknown>;

  return {
    id: snapshot.id,
    userId: String(data.userId ?? ''),
    userEmail: String(data.userEmail ?? ''),
    items,
    totalAmount: Number(data.totalAmount ?? 0),
    status: (data.status as OrderStatus) ?? 'pending',
    shippingInfo: {
      fullName: String(rawShipping.fullName ?? ''),
      address: String(rawShipping.address ?? ''),
      city: String(rawShipping.city ?? ''),
      phone: String(rawShipping.phone ?? ''),
    },
    createdAt:
      data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
    updatedAt:
      data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
  };
}

export async function createOrder(input: CreateOrderInput): Promise<string> {
  if (input.items.length === 0) {
    throw new Error('No se puede crear una orden con el carrito vacío.');
  }

  const docRef = await addDoc(ordersCollection, {
    userId: input.userId,
    userEmail: input.userEmail,
    items: input.items,
    totalAmount: input.totalAmount,
    status: 'pending' satisfies OrderStatus,
    shippingInfo: input.shippingInfo,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const userOrdersQuery = query(
    ordersCollection,
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(userOrdersQuery);
  const orders = snapshot.docs.map((docSnap) => mapToOrder(docSnap));
  return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const orderRef = doc(db, 'orders', orderId);
  const snapshot = await getDoc(orderRef);

  if (!snapshot.exists()) {
    return null;
  }

  return mapToOrder(snapshot);
}

export async function getAllOrders(
  statusFilter?: OrderStatus | ''
): Promise<Order[]> {
  const constraints: QueryConstraint[] = statusFilter
    ? [where('status', '==', statusFilter)]
    : [orderBy('createdAt', 'desc')];

  const allOrdersQuery = query(ordersCollection, ...constraints);
  const snapshot = await getDocs(allOrdersQuery);
  const orders = snapshot.docs.map((docSnap) => mapToOrder(docSnap));
  return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export const ALLOWED_ORDER_TRANSITIONS: Record<
  OrderStatus,
  readonly OrderStatus[]
> = {
  pending: ['processing', 'completed', 'cancelled'],
  processing: ['completed'],
  completed: [],
  cancelled: [],
};

export function canTransitionOrderStatus(
  currentStatus: OrderStatus,
  nextStatus: OrderStatus
): boolean {
  return ALLOWED_ORDER_TRANSITIONS[currentStatus].includes(nextStatus);
}

export async function updateOrderStatus(
  orderId: string,
  nextStatus: OrderStatus,
  currentStatus?: OrderStatus
): Promise<void> {
  if (
    currentStatus &&
    !canTransitionOrderStatus(currentStatus, nextStatus)
  ) {
    throw new Error(
      `Transición de estado no permitida (${currentStatus} -> ${nextStatus}).`
    );
  }

  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, {
    status: nextStatus,
    updatedAt: serverTimestamp(),
  });
}


