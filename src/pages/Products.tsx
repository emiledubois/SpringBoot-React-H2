import React, { useState, useEffect } from 'react';
import ProductList from '../components/product/ProductList';
import productService from '../services/productService';
import { Product } from '../types';

interface ProductsProps {
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
      setError('');
      
      console.log('Intentando cargar productos...');
      const data = await productService.getAllProducts();
      console.log('Productos cargados:', data);
      
      setProducts(data);
    } catch (err: any) {
      console.error('Error cargando productos:', err);
      
      let errorMessage = 'Error al cargar productos.';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:8080';
      } else if (err.response?.status === 403) {
        errorMessage = 'Acceso denegado. Verifica la configuración de CORS en el backend.';
      }
      
      setError(errorMessage);
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
          <h4 className="alert-heading">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Error al Cargar Productos
          </h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            <strong>Soluciones:</strong>
          </p>
          <ul>
            <li>Verifica que el backend esté corriendo: <code>cd backend && ./mvnw spring-boot:run</code></li>
            <li>Verifica que el backend esté en <code>http://localhost:8080</code></li>
            <li>Revisa la consola del navegador (F12) para más detalles</li>
          </ul>
          <button 
            className="btn btn-primary mt-3" 
            onClick={loadProducts}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info" role="alert">
          <h4 className="alert-heading">
            <i className="bi bi-info-circle me-2"></i>
            No hay productos disponibles
          </h4>
          <p>Aún no hay productos en la tienda.</p>
          <hr />
          <p className="mb-0">
            Si eres administrador, puedes agregar productos desde el panel de administración.
          </p>
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
            Encuentra los mejores productos tecnológicos ({products.length} productos disponibles)
          </p>
        </div>
      </div>
      <ProductList products={products} onAddToCart={onAddToCart} />
    </div>
  );
};

export default Products;