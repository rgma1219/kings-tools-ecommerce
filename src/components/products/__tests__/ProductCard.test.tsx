import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { mockDrillProduct } from '../../../test/fixtures/products.fixture';
import { ProductCard } from '../ProductCard';

describe('ProductCard component', () => {
  it('renderiza la información del producto y dispara onAdd al hacer clic en "+ Agregar"', async () => {
    const user = userEvent.setup();
    const handleAdd = vi.fn();

    render(
      <MemoryRouter>
        <ProductCard product={mockDrillProduct} onAdd={handleAdd} />
      </MemoryRouter>
    );

    expect(screen.getByText(mockDrillProduct.name)).toBeInTheDocument();
    expect(screen.getByText('Herramientas Eléctricas')).toBeInTheDocument();
    expect(
      screen.getByText(`Stock: ${mockDrillProduct.stock}`)
    ).toBeInTheDocument();

    const addButton = screen.getByRole('button', { name: '+ Agregar' });
    expect(addButton).toBeEnabled();

    await user.click(addButton);
    expect(handleAdd).toHaveBeenCalledTimes(1);
    expect(handleAdd).toHaveBeenCalledWith(mockDrillProduct);
  });

  it('muestra el indicador de unidades en el carrito y bloquea el botón al alcanzar el tope de stock', () => {
    render(
      <MemoryRouter>
        <ProductCard
          product={mockDrillProduct}
          quantityInCart={mockDrillProduct.stock}
          onAdd={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByText(`En carrito: ${mockDrillProduct.stock}`)
    ).toBeInTheDocument();

    const maxStockButton = screen.getByRole('button', { name: 'Máx. stock' });
    expect(maxStockButton).toBeDisabled();
  });

  it('deshabilita la compra cuando el producto tiene stock 0', () => {
    const outOfStockProduct = { ...mockDrillProduct, stock: 0 };

    render(
      <MemoryRouter>
        <ProductCard product={outOfStockProduct} onAdd={vi.fn()} />
      </MemoryRouter>
    );

    const outOfStockButton = screen.getByRole('button', { name: 'Sin stock' });
    expect(outOfStockButton).toBeDisabled();
  });
});

