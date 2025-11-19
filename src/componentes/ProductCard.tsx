import { useCart } from '../utiles/CartContext';

type Props = {
    product: {
        id: string | number;
        title: string;
        price: number;
        image?: string;
    };
};

export default function ProductCard({ product }: Props) {
    const { addToCart } = useCart();

    // Función que maneja el click en "Agregar"
    const handleAddToCart = () => {
        // Agregar producto al carrito
        addToCart(product, 1);
    };

    return (
        <div className="card h-100 shadow-sm">
            {product.image && (
                <img
                    src={product.image}
                    className="card-img-top object-fit-cover"
                    alt={product.title}
                    style={{ height: 180 }}
                />
            )}
            <div className="card-body d-flex flex-column">
                <h6 className="card-title mb-2">{product.title}</h6>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="fw-bold">${product.price.toLocaleString('es-CL')}</span>
                    <button
                        className="btn btn-dark btn-sm"
                        onClick={handleAddToCart}
                    >
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    );
}
