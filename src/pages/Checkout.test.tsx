import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Checkout from './Checkout';
import { CartItem } from '../types';

describe('Checkout Component', () => {
  const mockCart: CartItem[] = [
    {
      id: 1,
      name: 'Laptop HP',
      price: 599990,
      quantity: 1,
      stock: 5,
      category: 'Computadores',
      image: 'test.jpg'
    }
  ];

  const mockClearCart = vi.fn();

  it('Test 10: Validación de formulario (checkout)', () => {
    render(
      <BrowserRouter>
        <Checkout cart={mockCart} onClearCart={mockClearCart} />
      </BrowserRouter>
    );

    const submitButton = screen.getByTestId('submit-btn');
    fireEvent.click(submitButton);

    // Debe mostrar error de email requerido
    expect(screen.getByTestId('email-error')).toHaveTextContent('El email es requerido');
    expect(mockClearCart).not.toHaveBeenCalled();

    // Probar con email válido
    const emailInput = screen.getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Debería eliminar el error
    expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
  });

  it('Muestra mensaje cuando el carrito está vacío', () => {
    render(
      <BrowserRouter>
        <Checkout cart={[]} onClearCart={mockClearCart} />
      </BrowserRouter>
    );

    expect(screen.getByText('No hay productos en el carrito')).toBeInTheDocument();
  });

  it('Calcula correctamente el envío gratis sobre $50.000', () => {
    render(
      <BrowserRouter>
        <Checkout cart={mockCart} onClearCart={mockClearCart} />
      </BrowserRouter>
    );

    // El producto cuesta $599.990, debería tener envío gratis
    expect(screen.getByText('GRATIS')).toBeInTheDocument();
  });
});
