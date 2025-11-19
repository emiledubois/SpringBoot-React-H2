import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cart from '../../components/cart/Cart';
import { CartItem } from '../../types';

describe('Cart Logic Tests', () => {
  const mockCart: CartItem[] = [
    { 
      id: 1, 
      name: 'Product 1', 
      price: 10000, 
      quantity: 2, 
      stock: 10, 
      category: 'Test',
      image: 'test1.jpg'
    },
    { 
      id: 2, 
      name: 'Product 2', 
      price: 20000, 
      quantity: 1, 
      stock: 5, 
      category: 'Test',
      image: 'test2.jpg'
    }
  ];

  const mockUpdateQuantity = vi.fn();
  const mockRemove = vi.fn();
  const mockClearCart = vi.fn();

  it('Test 5: Cálculo del total del carrito es correcto', () => {
    render(
      <BrowserRouter>
        <Cart 
          cart={mockCart} 
          onUpdateQuantity={mockUpdateQuantity}
          onRemove={mockRemove}
          onClearCart={mockClearCart}
        />
      </BrowserRouter>
    );
    
    const total = screen.getByTestId('cart-total');
    // 10000 * 2 + 20000 * 1 = 40000
    expect(total).toHaveTextContent('40.000');
  });

  it('Test 6: Carrito vacío muestra mensaje apropiado', () => {
    render(
      <BrowserRouter>
        <Cart 
          cart={[]} 
          onUpdateQuantity={mockUpdateQuantity}
          onRemove={mockRemove}
          onClearCart={mockClearCart}
        />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('empty-cart-message')).toBeInTheDocument();
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
  });

  it('Test 3: Eliminar producto del carrito funciona', () => {
    render(
      <BrowserRouter>
        <Cart 
          cart={mockCart} 
          onUpdateQuantity={mockUpdateQuantity}
          onRemove={mockRemove}
          onClearCart={mockClearCart}
        />
      </BrowserRouter>
    );
    
    const removeButton = screen.getByTestId('remove-item-1');
    fireEvent.click(removeButton);
    
    expect(mockRemove).toHaveBeenCalledWith(1);
  });

  it('Test 4: Actualizar cantidad de producto', () => {
    render(
      <BrowserRouter>
        <Cart 
          cart={mockCart} 
          onUpdateQuantity={mockUpdateQuantity}
          onRemove={mockRemove}
          onClearCart={mockClearCart}
        />
      </BrowserRouter>
    );
    
    const increaseButton = screen.getByTestId('increase-quantity-1');
    fireEvent.click(increaseButton);
    
    expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 3);
  });
});