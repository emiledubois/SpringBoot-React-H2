import React from 'react';
import Header from '../componentes/Header';
import Footer from '../componentes/Footer'; 

import '../estilos/Tienda/Nosotros.css'; 
import '../estilos/Tienda/index.css';

function Blog() {
    return (
        <>
            <Header />
            <main>
                <h1>Página de Blog</h1>
                Informacion del blog
            </main>
            <Footer />
        </>
    );
}
export default Blog;