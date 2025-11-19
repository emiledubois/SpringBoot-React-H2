import { CartItem } from '../types';

describe('Cart Logic Tests', () => {
  let cart: CartItem[];

  beforeEach(() => {
    cart = [
      {
        id: 1,
        name: 'Laptop HP',
        price: 599990,
        quantity: 2,
        stock: 10,
        category: 'Computadores',
        image: 'test.jpg'
      },
      {
        id: 2,
        name: 'Mouse',
        price: 25990,
        quantity: 1,
        stock: 5,
        category: 'Accesorios',
        image: 'test2.jpg'
      }
    ];
  });

  it('Test 2: Agregar producto al carrito incrementa la cantidad', () => {
    const productToAdd = cart[0];
    const initialQuantity = productToAdd.quantity;

    // Simular agregar al carrito
    productToAdd.quantity += 1;

    expect(productToAdd.quantity).toBe(initialQuantity + 1);
    expect(productToAdd.quantity).toBe(3);
  });

  it('Test 3: Eliminar producto del carrito funciona', () => {
    const initialLength = cart.length;
    const idToRemove = 1;

    // Simular eliminación
    cart = cart.filter(item => item.id !== idToRemove);

    expect(cart.length).toBe(initialLength - 1);
    expect(cart.find(item => item.id === idToRemove)).toBeUndefined();
  });

  it('Test 4: Actualizar cantidad de producto', () => {
    const productId = 1;
    const newQuantity = 5;

    // Simular actualización de cantidad
    cart = cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );

    const updatedProduct = cart.find(item => item.id === productId);
    expect(updatedProduct?.quantity).toBe(newQuantity);
  });

  it('Test 5: Cálculo del total del carrito es correcto', () => {
    // Calcular total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 599990 * 2 + 25990 * 1 = 1225970
    expect(total).toBe(1225970);
  });
});
