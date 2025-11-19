import { useCart } from '../utiles/CartContext';

export default function CartOffcanvas() {
    const { items, totalPrice, setQty, removeFromCart, clearCart } = useCart();

    return (
        <div
            className="offcanvas offcanvas-end"
            tabIndex={-1}
            id="cartOffcanvas"
            aria-labelledby="cartOffcanvasLabel"
            style={{ width: 380 }}
        >
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="cartOffcanvasLabel">Tu carrito</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>

            <div className="offcanvas-body d-flex flex-column">
                {items.length === 0 ? (
                    <p className="text-muted">Aún no tienes productos.</p>
                ) : (
                    <ul className="list-group mb-3">
                        {items.map(it => (
                            <li className="list-group-item d-flex align-items-center" key={it.id}>
                                {it.image && (
                                    <img
                                        src={it.image}
                                        alt={it.title}
                                        width={48}
                                        height={48}
                                        className="rounded me-2 object-fit-cover"
                                    />
                                )}
                                <div className="flex-grow-1">
                                    <div className="fw-medium">{it.title}</div>
                                    <small className="text-muted">${it.price.toLocaleString('es-CL')}</small>
                                    <div className="input-group input-group-sm mt-1" style={{ maxWidth: 150 }}>
                                        <span className="input-group-text">Cant.</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min={1}
                                            value={it.qty}
                                            onChange={e => setQty(it.id, Number(e.target.value || 1))}
                                        />
                                    </div>
                                </div>
                                <div className="ms-2 text-end">
                                    <div className="fw-semibold">
                                        ${(it.price * it.qty).toLocaleString('es-CL')}
                                    </div>
                                    <button className="btn btn-link text-danger p-0 mt-1" onClick={() => removeFromCart(it.id)}>
                                        Quitar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="fw-semibold">Total</span>
                        <span className="fs-5 fw-bold">${totalPrice.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-outline-secondary w-50" onClick={clearCart}>Vaciar</button>
                        <button className="btn btn-dark w-50">Pagar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
