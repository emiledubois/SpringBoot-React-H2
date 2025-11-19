import { useCart } from '../utiles/CartContext';

export default function CartButton(
    props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
    const { totalItems } = useCart();

    return (
        <button
            type="button"
            className="btn btn-outline-dark position-relative"
            {...props}
        >
            🛒 Carrito
            {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {totalItems}
                </span>
            )}
        </button>
    );
}
