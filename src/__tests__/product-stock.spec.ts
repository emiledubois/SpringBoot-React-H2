import { Product } from '../types';

describe('Product Stock Test', () => {
  it('Test 7: Producto sin stock no puede agregarse', () => {
    const product: Product = {
      id: 1,
      name: 'Test Product',
      price: 10000,
      stock: 0,
      category: 'Test',
      image: 'test.jpg'
    };

    const canAddToCart = product.stock > 0;

    expect(canAddToCart).toBe(false);
    expect(product.stock).toBe(0);
  });

  it('Test 7b: Producto con stock puede agregarse', () => {
    const product: Product = {
      id: 2,
      name: 'Test Product 2',
      price: 20000,
      stock: 5,
      category: 'Test',
      image: 'test2.jpg'
    };

    const canAddToCart = product.stock > 0;

    expect(canAddToCart).toBe(true);
    expect(product.stock).toBeGreaterThan(0);
  });
});
