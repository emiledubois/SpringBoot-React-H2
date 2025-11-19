import React from 'react';
import CartOffcanvas from './CartOffcanvas.tsx';
import CartButton from './CartButton.tsx';

import '../estilos/Tienda/header.css';
import '../estilos/Tienda/index.css';

function Header() {
<<<<<<< HEAD
  return (
    <header>
        <div className="logo-container">
            <a href="/Home"> 
                <img className="PaginaLogo" src="../public/img/2111125.png" alt="TechStore Logo" /> 
                <span className="site-name">TechStore</span>
            </a>
        </div>
        
        <nav className="main-nav">
            <ul>
                <li><a href="/Home">Home</a></li>
                <li><a href="/Productos">Productos</a></li>
                <li><a href="/Nosotros">Nosotros</a></li>
                <li><a href="/Contacto">Contacto</a></li>
            </ul>
        </nav>
        
        <div className="cart-container">
            <a href="/DetallesProducto"> 
                <span className="cart-text">🛒 Carrito</span>
                <span className="cart-count">0</span>
            </a>
        </div>
    </header>
  );
=======
    return (
        <header>
            <div className="logo-container">
                <a href="/Home">
                    <img className="PaginaLogo" src="../public/img/2111125.png" alt="TechStore Logo" />
                    <span className="site-name">TechStore</span>
                </a>
            </div>

            <nav className="main-nav">
                <ul>
                    <li><a href="/Home">Home</a></li>
                    <li><a href="/Productos">Productos</a></li>
                    <li><a href="/Nosotros">Nosotros</a></li>
                    <li><a href="/Contacto">Contacto</a></li>
                    <li><a href="/Blog">Blog</a></li>
                </ul>
            </nav>

            <div className="cart-container">
                <CartButton
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cartOffcanvas"
                />
            </div>

            <CartOffcanvas />
        </header>
    );
>>>>>>> b0b3575678c17c62f928a1b22ef6e112b4d495a7
}

export default Header;
