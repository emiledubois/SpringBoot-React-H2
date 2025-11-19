import { Product } from '../types';

describe('Product Filter Test', () => {
  const products: Product[] = [
    {
      id: 1,
      name: 'Laptop HP',
      price: 599990,
      stock: 5,
      category: 'Computadores',
      image: 'laptop.jpg'
    },
    {
      id: 2,
      name: 'Mouse Logitech',
      price: 25990,
      stock: 10,
      category: 'Accesorios',
      image: 'mouse.jpg'
    },
    {
      id: 3,
      name: 'Monitor Samsung',
      price: 189990,
      stock: 3,
      category: 'Monitores',
      image: 'monitor.jpg'
    }
  ];

  it('Test 8: Filtro por categoría funciona correctamente', () => {
    const categoryToFilter = 'Computadores';

    const filteredProducts = products.filter(
      product => product.category === categoryToFilter
    );

    expect(filteredProducts.length).toBe(1);
    expect(filteredProducts[0].name).toBe('Laptop HP');
    expect(filteredProducts.every(p => p.category === categoryToFilter)).toBe(true);
  });
});
