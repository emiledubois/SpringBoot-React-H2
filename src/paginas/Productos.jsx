import React from 'react';
import ProductCard from '../componentes/ProductCard.tsx';
import Header from '../componentes/Header';
import Footer from '../componentes/Footer';

import '../estilos/Tienda/Productos.css';
import '../estilos/Tienda/index.css';

function Productos() {
    return (
        <div className="body-productos">
            <Header />

            <main>
                <main className="container py-4">
                    <h1 className="mb-3">Productos</h1>
                    {(() => {
                        const DEMO = [
                            { id: 1, title: 'Teclado Mecánico RGB', price: 39990, image: '/img/Teclado RGB.jpg' },
                            { id: 3, title: 'Auriculares Inalámbricos', price: 49990, image: '/img/audifonos.jpg' },
                            { id: 4, title: 'Monitor 27\" 144Hz', price: 189990, image: '/img/monitor.jpg' },
                            { id: 5, title: 'Silla Ergonométrica', price: 129990, image: '/img/silla.jpg' },
                            { id: 6, title: 'Hub USB-C 6 en 1', price: 24990, image: '/img/USB.avif' },
                            { id: 7, title: 'Webcam Full HD', price: 34990, image: '/img/web.jpg' },
                            { id: 8, title: 'Alfombrilla XL', price: 14990, image: '/img/alfom.jpg' },
                        ];

                        return (
                            <div className="row g-3">
                                {DEMO.map(p => (
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={p.id}>
                                        <ProductCard product={p} />
                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                </main>

            </main>

            <Footer />
        </div>
    );
}

export default Productos;