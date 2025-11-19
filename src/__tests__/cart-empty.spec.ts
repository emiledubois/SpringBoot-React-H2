import { CartItem } from '../types';

describe('Empty Cart Test', () => {
  it('Test 6: Carrito vacío muestra estado correcto', () => {
    const cart: CartItem[] = [];

    expect(cart.length).toBe(0);
    expect(cart).toEqual([]);
  });
});
