import React from 'react';
import CartItem from './CartItem';
import { CartProps } from '../../types';
import { Link } from 'react-router-dom';

const Cart: React.FC<CartProps> = ({ cart, onUpdateQuantity, onRemove, onClearCart }) => {
    const calculateTotal = (): number => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    };

    if (cart.length === 0) {
        return (
            <div className="container mt-5 mb-5">
                <div className="alert alert-info text-center" data-testid="empty-cart-message">
                    <i className="bi bi-cart-x display-1 d-block mb-3"></i>
                    <h4>Tu carrito está vacío</h4>
                    <p className="mb-3">Agrega productos para comenzar tu compra</p>
                    <Link to="/productos" className="btn btn-primary">
                        <i className="bi bi-arrow-left me-2"></i>
                        Ver Productos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 mb-5">
            <h2 className="mb-4">
                <i className="bi bi-cart3 me-2"></i>
                Carrito de Compras
            </h2>

            <div className="row">
                <div className="col-lg-8 mb-4">
                    {cart.map(item => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onUpdateQuantity={onUpdateQuantity}
                            onRemove={onRemove}
                        />
                    ))}
                </div>

                <div className="col-lg-4">
                    <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
                        <div className="card-body">
                            <h5 className="card-title mb-3">
                                <i className="bi bi-receipt me-2"></i>
                                Resumen del Pedido
                            </h5>
                            <hr />
                            <div className="d-flex justify-content-between mb-2">
                                <span>Productos ({cart.length}):</span>
                                <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} unidades</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span>Subtotal:</span>
                                <span className="fw-bold" data-testid="cart-total">
                                    {formatPrice(calculateTotal())}
                                </span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between mb-3">
                                <strong>Total:</strong>
                                <strong className="text-primary fs-5">
                                    {formatPrice(calculateTotal())}
                                </strong>
                            </div>
                            <Link to="/checkout" className="btn btn-success w-100 mb-2">
                                <i className="bi bi-credit-card me-2"></i>
                                Proceder al Pago
                            </Link>
                            <Link to="/productos" className="btn btn-outline-primary w-100 mb-2">
                                <i className="bi bi-arrow-left me-2"></i>
                                Seguir Comprando
                            </Link>
                            <button
                                className="btn btn-outline-danger w-100"
                                onClick={onClearCart}
                                data-testid="clear-cart-btn"
                            >
                                <i className="bi bi-trash me-2"></i>
                                Vaciar Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;