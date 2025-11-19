import React from 'react';
import Header from '../componentes/Header';
import Footer from '../componentes/Footer'; 

import '../estilos/Tienda/DetallesProducto.css'; 
import '../estilos/Tienda/index.css';

function DetallesProducto() {
    return (
        <>
            <Header />
            <main>
                <h1>Carrito de compras</h1>
                Informacion del carrito
            </main>
            <Footer />
        </>
    );
}
export default DetallesProducto;