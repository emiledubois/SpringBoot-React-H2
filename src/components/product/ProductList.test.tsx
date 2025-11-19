import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductList from './ProductList';
import { mockProducts } from '../../mocks/mockData';

describe('ProductList Component', () => {
  const mockAddToCart = vi.fn();

  it('Test 8: Filtro de productos funciona correctamente', () => {
    render(<ProductList products={mockProducts} onAddToCart={mockAddToCart} />);
    
    const categoryFilter = screen.getByTestId('category-filter');
    fireEvent.change(categoryFilter, { target: { value: 'Computadores' } });
    
    const productCards = screen.getAllByTestId(/product-card-/);
    // Solo debe mostrar productos de categoría "Computadores"
    expect(productCards.length).toBeLessThan(mockProducts.length);
  });

  it('Test 9: Búsqueda de productos retorna resultados correctos', () => {
    render(<ProductList products={mockProducts} onAddToCart={mockAddToCart} />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Laptop' } });
    
    expect(screen.getByText('Laptop HP Pavilion')).toBeInTheDocument();
  });
});