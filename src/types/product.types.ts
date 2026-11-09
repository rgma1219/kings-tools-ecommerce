export type CategoryId =
  | 'herramientas-electricas'
  | 'herramientas-manuales'
  | 'medicion-y-nivelacion'
  | 'seguridad-industrial'
  | 'fijaciones-y-tornilleria'
  | 'accesorios-y-consumibles';

export interface CategoryOption {
  id: CategoryId;
  label: string;
}

export const PRODUCT_CATEGORIES: readonly CategoryOption[] = [
  { id: 'herramientas-electricas', label: 'Herramientas Eléctricas' },
  { id: 'herramientas-manuales', label: 'Herramientas Manuales' },
  { id: 'medicion-y-nivelacion', label: 'Medición y Nivelación' },
  { id: 'seguridad-industrial', label: 'Seguridad Industrial' },
  { id: 'fijaciones-y-tornilleria', label: 'Fijaciones y Tornillería' },
  { id: 'accesorios-y-consumibles', label: 'Accesorios y Consumibles' },
] as const;

export interface Product {
  id: string;
  name: string;
  // Firestore no soporta búsqueda case-insensitive nativa; guardamos el nombre en minúsculas para filtrar por prefijo.
  nameLower: string;
  description: string;
  price: number;
  stock: number;
  categoryId: CategoryId;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: CategoryId;
  imageUrl: string;
}

