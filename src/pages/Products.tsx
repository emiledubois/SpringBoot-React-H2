import React, { useState, useEffect } from 'react';
import ProductList from '../components/product/ProductList';
import productService from '../services/productService';
import { Product } from '../types';

interface ProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const Products: React.FC<ProductsProps> = ({ onAddToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAvailableProducts();
      setProducts(data);
    } catch (err: any) {
      console.error('Error cargando productos:', err);
      setError('Error al cargar productos. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-light py-4">
        <div className="container">
          <h2 className="mb-0">
            <i className="bi bi-grid me-2"></i>
            Catálogo de Productos
          </h2>
          <p className="text-muted mb-0">
            Encuentra los mejores productos tecnológicos
          </p>
        </div>
      </div>
      <ProductList products={products} onAddToCart={onAddToCart} />
    </div>
  );
};

export default Products;