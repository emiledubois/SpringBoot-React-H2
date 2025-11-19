import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Componente de formulario de checkout simple para testing
const CheckoutForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [email, setEmail] = React.useState('');
  const [errors, setErrors] = React.useState<{ email?: string }>({});

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string } = {};
    
    if (!email) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email inválido';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit({ email });
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="checkout-form">
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        data-testid="email-input"
      />
      {errors.email && <span data-testid="email-error">{errors.email}</span>}
      <button type="submit" data-testid="submit-btn">Enviar</button>
    </form>
  );
};

describe('Form Validation Tests', () => {
  it('Test 10: Validación de formulario (checkout)', () => {
    const mockSubmit = vi.fn();
    render(<CheckoutForm onSubmit={mockSubmit} />);
    
    const submitButton = screen.getByTestId('submit-btn');
    fireEvent.click(submitButton);
    
    expect(screen.getByTestId('email-error')).toHaveTextContent('El email es requerido');
    expect(mockSubmit).not.toHaveBeenCalled();
    
    // Probar con email válido
    const emailInput = screen.getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    expect(mockSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
  });
});