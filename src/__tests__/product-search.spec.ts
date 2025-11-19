import { Product } from '../types';

describe('Product Search Test', () => {
  const products: Product[] = [
    {
      id: 1,
      name: 'Laptop HP Pavilion',
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
      name: 'Teclado Mecánico',
      price: 89990,
      stock: 8,
      category: 'Accesorios',
      image: 'keyboard.jpg'
    }
  ];

  it('Test 9: Búsqueda retorna resultados correctos', () => {
    const searchTerm = 'Laptop';

    const searchResults = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    expect(searchResults.length).toBe(1);
    expect(searchResults[0].name).toContain('Laptop');
  });

  it('Test 9b: Búsqueda sin resultados retorna array vacío', () => {
    const searchTerm = 'iPhone';

    const searchResults = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    expect(searchResults.length).toBe(0);
    expect(searchResults).toEqual([]);
  });
});
