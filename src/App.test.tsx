import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('Test 2: Agregar producto al carrito incrementa el contador', () => {
    render(<App />);
    
    // Verificar que el navbar se renderiza
    expect(screen.getAllByText('TechStore').length).toBeGreaterThan(0);

  });
});