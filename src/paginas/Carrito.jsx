import React from 'react';
import Header from '../componentes/Header';
import Footer from '../componentes/Footer';
import { useCart } from '../utiles/CartContext';

export default function Carrito() {
    const { items, totalPrice, setQty, removeFromCart, clearCart } = useCart();

    return (
        <div className="container-fluid p-0">
            <Header />

            <main className="container py-4">
                <h1 className="mb-3">Carrito de compras</h1>

                {items.length === 0 ? (
                    <div className="alert alert-info">Tu carrito está vacío.</div>
                ) : (
                    <>
                        <div className="table-responsive mb-3">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th style={{ width: 120 }}>Precio</th>
                                        <th style={{ width: 140 }}>Cantidad</th>
                                        <th style={{ width: 120 }}>Subtotal</th>
                                        <th style={{ width: 80 }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(it => (
                                        <tr key={it.id}>
                                            <td className="d-flex align-items-center gap-2">
                                                {it.image && (
                                                    <img
                                                        src={it.image}
                                                        alt={it.title}
                                                        width="48" height="48"
                                                        className="rounded object-fit-cover"
                                                    />
                                                )}
                                                <span>{it.title}</span>
                                            </td>
                                            <td>${it.price.toLocaleString('es-CL')}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    min="1"
                                                    value={it.qty}
                                                    onChange={e => setQty(it.id, Number(e.target.value || 1))}
                                                />
                                            </td>
                                            <td className="fw-semibold">
                                                ${(it.price * it.qty).toLocaleString('es-CL')}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-link text-danger p-0"
                                                    onClick={() => removeFromCart(it.id)}
                                                >
                                                    Quitar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={3} className="text-end fw-semibold">Total</td>
                                        <td className="fw-bold">${totalPrice.toLocaleString('es-CL')}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="d-flex gap-2">
                            <button className="btn btn-outline-secondary" onClick={clearCart}>Vaciar carrito</button>
                            <button className="btn btn-dark">Pagar</button>
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
