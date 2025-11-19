import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';
import { Product } from '../../types';

describe('ProductCard Component', () => {
  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    price: 10000,
    image: 'test.jpg',
    stock: 5,
    category: 'Test',
    description: 'Test description'
  };

  const mockAddToCart = vi.fn();

  it('Test 1: Componente ProductCard se renderiza correctamente', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/10\.000/)).toBeInTheDocument();
    expect(screen.getByText(/Stock: 5 unidades/)).toBeInTheDocument();
  });

  it('Test 7: Botón de agregar al carrito está deshabilitado cuando no hay stock', () => {
    const outOfStockProduct: Product = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} onAddToCart={mockAddToCart} />);
    
    const button = screen.getByTestId(`add-to-cart-btn-${outOfStockProduct.id}`);
    expect(button).toBeDisabled();
    expect(screen.getByText('Sin stock')).toBeInTheDocument();
  });
});