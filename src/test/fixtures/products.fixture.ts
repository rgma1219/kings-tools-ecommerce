import type { Product } from '../../types';

export const mockDrillProduct: Product = {
  id: 'prod-drill-1',
  name: 'Taladro Percutor Inalámbrico 20V Brushless',
  nameLower: 'taladro percutor inalámbrico 20v brushless',
  description: 'Taladro percutor de 13mm con motor sin escobillas.',
  price: 185000,
  stock: 5,
  categoryId: 'herramientas-electricas',
  imageUrl: 'https://i.ibb.co/G4ttxzN3/kingstools-imagen-producto.png',
  createdAt: new Date('2026-01-10T10:00:00.000Z'),
  updatedAt: new Date('2026-01-10T10:00:00.000Z'),
};

export const mockHammerProduct: Product = {
  id: 'prod-hammer-2',
  name: 'Martillo Galponero Encabado Fibra de Vidrio 20oz',
  nameLower: 'martillo galponero encabado fibra de vidrio 20oz',
  description: 'Martillo de uña curva con cabeza de acero forjado.',
  price: 19500,
  stock: 10,
  categoryId: 'herramientas-manuales',
  imageUrl: 'https://i.ibb.co/G4ttxzN3/kingstools-imagen-producto.png',
  createdAt: new Date('2026-01-10T10:00:00.000Z'),
  updatedAt: new Date('2026-01-10T10:00:00.000Z'),
};

