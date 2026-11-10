import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
  where,
  type DocumentData,
  type DocumentSnapshot,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { CategoryId, Product } from '../types';

const productsCollection = collection(db, 'products');

export type ProductCursor = QueryDocumentSnapshot<DocumentData> | null;

export interface ListProductsParams {
  categoryId?: CategoryId | null;
  searchPrefix?: string;
  pageSize?: number;
  cursor?: ProductCursor;
}

export interface ListProductsResult {
  items: Product[];
  lastDoc: ProductCursor;
}

function mapToProduct(
  snapshot:
    | QueryDocumentSnapshot<DocumentData>
    | DocumentSnapshot<DocumentData>
): Product {
  const data = snapshot.data();
  if (!data) {
    throw new Error('Documento de producto vacío.');
  }

  return {
    id: snapshot.id,
    name: String(data.name ?? ''),
    nameLower: String(data.nameLower ?? String(data.name ?? '').toLowerCase()),
    description: String(data.description ?? ''),
    price: Number(data.price ?? 0),
    stock: Number(data.stock ?? 0),
    categoryId: data.categoryId as CategoryId,
    imageUrl: String(
      data.imageUrl ??
        data.image ??
        'https://i.ibb.co/G4ttxzN3/kingstools-imagen-producto.png'
    ),
    createdAt:
      data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
    updatedAt:
      data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
  };
}

export async function listProducts({
  categoryId = null,
  searchPrefix,
  pageSize = 12,
  cursor = null,
}: ListProductsParams = {}): Promise<ListProductsResult> {
  const constraints: QueryConstraint[] = [];

  if (categoryId) {
    constraints.push(where('categoryId', '==', categoryId));
  }

  if (searchPrefix) {
    // El carácter Unicode \uf8ff actúa como límite superior para simular un operador startsWith sobre el campo indexado nameLower.
    constraints.push(
      where('nameLower', '>=', searchPrefix),
      where('nameLower', '<=', `${searchPrefix}\uf8ff`)
    );
  }

  constraints.push(orderBy('nameLower', 'asc'));

  if (cursor) {
    constraints.push(startAfter(cursor));
  }

  constraints.push(limit(pageSize));

  const productsQuery = query(productsCollection, ...constraints);
  const querySnapshot = await getDocs(productsQuery);

  const items = querySnapshot.docs.map((docSnap) => mapToProduct(docSnap));
  const lastDoc =
    querySnapshot.docs.length > 0
      ? querySnapshot.docs[querySnapshot.docs.length - 1]
      : null;

  return { items, lastDoc };
}

export async function getProductById(id: string): Promise<Product | null> {
  const productRef = doc(db, 'products', id);
  const snapshot = await getDoc(productRef);

  if (!snapshot.exists()) {
    return null;
  }

  return mapToProduct(snapshot);
}

