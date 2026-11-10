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
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(userOrdersQuery);
  return snapshot.docs.map((docSnap) => mapToOrder(docSnap));
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
  const constraints: QueryConstraint[] = [];

  if (statusFilter) {
    constraints.push(where('status', '==', statusFilter));
  }

  constraints.push(orderBy('createdAt', 'desc'));

  const allOrdersQuery = query(ordersCollection, ...constraints);
  const snapshot = await getDocs(allOrdersQuery);
  return snapshot.docs.map((docSnap) => mapToOrder(docSnap));
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

