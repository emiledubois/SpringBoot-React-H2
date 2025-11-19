import React from 'react';
import { CartItemProps } from '../../types';

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const { id, name, price, quantity, image } = item;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="card mb-3 shadow-sm" data-testid={`cart-item-${id}`}>
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-12 col-md-2 mb-3 mb-md-0">
            <img 
              src={image} 
              alt={name} 
              className="img-fluid rounded"
              style={{ maxHeight: '80px', objectFit: 'cover' }}
            />
          </div>
          <div className="col-12 col-md-3 mb-2 mb-md-0">
            <h6 className="mb-0">{name}</h6>
          </div>
          <div className="col-6 col-md-2 mb-2 mb-md-0">
            <p className="mb-0 text-muted">
              <small>Precio unitario:</small>
            </p>
            <p className="mb-0 fw-bold">{formatPrice(price)}</p>
          </div>
          <div className="col-6 col-md-3 mb-2 mb-md-0">
            <div className="input-group input-group-sm">
              <button
                className="btn btn-outline-secondary"
                onClick={() => onUpdateQuantity(id, quantity - 1)}
                disabled={quantity <= 1}
                data-testid={`decrease-quantity-${id}`}
              >
                <i className="bi bi-dash"></i>
              </button>
              <input
                type="number"
                className="form-control text-center"
                value={quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value) || 1;
                  onUpdateQuantity(id, newQuantity);
                }}
                min="1"
                data-testid={`quantity-input-${id}`}
              />
              <button
                className="btn btn-outline-secondary"
                onClick={() => onUpdateQuantity(id, quantity + 1)}
                data-testid={`increase-quantity-${id}`}
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>
          </div>
          <div className="col-12 col-md-2 text-end">
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onRemove(id)}
              data-testid={`remove-item-${id}`}
            >
              <i className="bi bi-trash"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;