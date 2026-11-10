import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../../../contexts/auth/AuthContext';
import type { AuthContextType } from '../../../contexts/auth/AuthContext.type';
import { CartProvider } from '../../../contexts/cart/CartProvider';
import {
  mockDrillProduct,
  mockHammerProduct,
} from '../../../test/fixtures/products.fixture';
import type { Order } from '../../../types';

const { mockCreateOrder, mockGetOrderById } = vi.hoisted(() => ({
  mockCreateOrder: vi.fn(),
  mockGetOrderById: vi.fn(),
}));

vi.mock('../../../services/orders.service', () => ({
  createOrder: mockCreateOrder,
  getOrderById: mockGetOrderById,
}));

import { OrderDetailPage } from '../../orders/OrderDetailPage';
import { CheckoutPage } from '../CheckoutPage';

const mockAuthContextValue: AuthContextType = {
  user: {
    uid: 'user-customer-77',
    email: 'comprador@kingstools.com',
    displayName: 'Gabriel Rey',
    role: 'customer',
    createdAt: new Date('2026-01-10T10:00:00.000Z'),
  },
  loading: false,
  error: null,
  isAdmin: false,
  register: vi.fn(),
  login: vi.fn(),
  loginGoogle: vi.fn(),
  logout: vi.fn(),
  clearError: vi.fn(),
};

describe('Flujo de Integración: Carrito -> Checkout -> Confirmación de Orden', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    localStorage.setItem(
      'kings_tools_cart',
      JSON.stringify({
        items: [
          {
            productId: mockDrillProduct.id,
            name: mockDrillProduct.name,
            price: mockDrillProduct.price,
            imageUrl: mockDrillProduct.imageUrl,
            stock: mockDrillProduct.stock,
            quantity: 2,
          },
          {
            productId: mockHammerProduct.id,
            name: mockHammerProduct.name,
            price: mockHammerProduct.price,
            imageUrl: mockHammerProduct.imageUrl,
            stock: mockHammerProduct.stock,
            quantity: 1,
          },
        ],
      })
    );
  });

  it('valida datos de envío obligatorios, crea la orden en Firestore, vacía el carrito y redirige al comprobante', async () => {
    const user = userEvent.setup();
    const expectedTotal = mockDrillProduct.price * 2 + mockHammerProduct.price;

    const createdOrderMock: Order = {
      id: 'order-generated-999',
      userId: 'user-customer-77',
      userEmail: 'comprador@kingstools.com',
      items: [
        {
          productId: mockDrillProduct.id,
          name: mockDrillProduct.name,
          price: mockDrillProduct.price,
          quantity: 2,
          imageUrl: mockDrillProduct.imageUrl,
        },
        {
          productId: mockHammerProduct.id,
          name: mockHammerProduct.name,
          price: mockHammerProduct.price,
          quantity: 1,
          imageUrl: mockHammerProduct.imageUrl,
        },
      ],
      totalAmount: expectedTotal,
      status: 'pending',
      shippingInfo: {
        fullName: 'Gabriel Rey',
        address: 'Av. Corrientes 1234',
        city: 'CABA',
        phone: '1144556677',
      },
      createdAt: new Date('2026-01-15T12:00:00.000Z'),
      updatedAt: new Date('2026-01-15T12:00:00.000Z'),
    };

    mockCreateOrder.mockResolvedValueOnce('order-generated-999');
    mockGetOrderById.mockResolvedValueOnce(createdOrderMock);

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <CartProvider>
          <MemoryRouter initialEntries={['/checkout']}>
            <Routes>
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
            </Routes>
          </MemoryRouter>
        </CartProvider>
      </AuthContext.Provider>
    );

    expect(screen.getByText(mockDrillProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockHammerProduct.name)).toBeInTheDocument();

    const submitButton = screen.getByRole('button', {
      name: /Confirmar Compra/i,
    });
    await user.click(submitButton);

    expect(
      screen.getByText('Por favor completá todos los datos de envío.')
    ).toBeInTheDocument();
    expect(mockCreateOrder).not.toHaveBeenCalled();

    await user.type(
      screen.getByLabelText('Dirección de entrega (calle y altura)'),
      'Av. Corrientes 1234'
    );
    await user.type(screen.getByLabelText('Ciudad / Localidad'), 'CABA');
    await user.type(
      screen.getByLabelText('Teléfono de contacto'),
      '1144556677'
    );

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateOrder).toHaveBeenCalledTimes(1);
    });

    expect(mockCreateOrder).toHaveBeenCalledWith({
      userId: 'user-customer-77',
      userEmail: 'comprador@kingstools.com',
      items: [
        {
          productId: mockDrillProduct.id,
          name: mockDrillProduct.name,
          price: mockDrillProduct.price,
          quantity: 2,
          imageUrl: mockDrillProduct.imageUrl,
        },
        {
          productId: mockHammerProduct.id,
          name: mockHammerProduct.name,
          price: mockHammerProduct.price,
          quantity: 1,
          imageUrl: mockHammerProduct.imageUrl,
        },
      ],
      totalAmount: expectedTotal,
      shippingInfo: {
        fullName: 'Gabriel Rey',
        address: 'Av. Corrientes 1234',
        city: 'CABA',
        phone: '1144556677',
      },
    });

    await waitFor(() => {
      expect(
        screen.getByText(/¡Tu pedido fue confirmado con éxito!/i)
      ).toBeInTheDocument();
    });

    expect(screen.getByText('Av. Corrientes 1234')).toBeInTheDocument();

    const storedCart = JSON.parse(
      localStorage.getItem('kings_tools_cart') ?? '{"items":[]}'
    ) as { items: unknown[] };
    expect(storedCart.items).toHaveLength(0);
  });
});

