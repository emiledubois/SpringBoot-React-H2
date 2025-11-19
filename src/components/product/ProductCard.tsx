import React from 'react';
import { ProductCardProps } from '../../types';

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { id, name, price, image, stock, description } = product;
  const isOutOfStock = stock === 0;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div 
        className="card h-100 shadow-sm hover-card" 
        data-testid={`product-card-${id}`}
      >
        <img 
          src={image} 
          className="card-img-top" 
          alt={name}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-truncate" title={name}>
            {name}
          </h5>
          {description && (
            <p className="card-text text-muted small">
              {description.substring(0, 60)}...
            </p>
          )}
          <div className="mt-auto">
            <p className="card-text fw-bold text-primary fs-5 mb-2">
              {formatPrice(price)}
            </p>
            <p className="card-text">
              <small className={isOutOfStock ? 'text-danger fw-bold' : 'text-success'}>
                <i className={`bi ${isOutOfStock ? 'bi-x-circle' : 'bi-check-circle'} me-1`}></i>
                {isOutOfStock ? 'Sin stock' : `Stock: ${stock} unidades`}
              </small>
            </p>
            <button 
              className={`btn w-100 ${isOutOfStock ? 'btn-secondary' : 'btn-primary'}`}
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
              data-testid={`add-to-cart-btn-${id}`}
            >
              {isOutOfStock ? (
                <>
                  <i className="bi bi-x-circle me-1"></i>
                  Agotado
                </>
              ) : (
                <>
                  <i className="bi bi-cart-plus me-1"></i>
                  Agregar al Carrito
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;