import React from 'react';

import '../estilos/Tienda/footer.css';
import '../estilos/Tienda/index.css';

function Footer() {
    return (
        <footer>
            <div className="container">
                <div className="footer-content">

                    <div className="footer-section">
                        <h3>TechStore</h3>
                        <p>Tu tienda de confianza para tecnología de última generación.</p>
                        <div className="redes-sociales">
                            <a href="#" aria-label="Facebook">📘</a>
                            <a href="#" aria-label="Instagram">📷</a>
                            <a href="#" aria-label="Twitter">🐦</a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4>Enlaces Rápidos</h4>
                        <ul>
                            <li><a href="/Home">Home</a></li>
                            <li><a href="/Productos">Productos</a></li>
                            <li><a href="/Nosotros">Nosotros</a></li>
                            <li><a href="/Contacto">Contacto</a></li>
                            <li><a href="/Blog">Blog</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Información</h4>
                        <ul>
                            <li><a href="#politicas">Políticas de Privacidad</a></li>
                            <li><a href="#terminos">Términos y Condiciones</a></li>
                            <li><a href="#envios">Información de Envíos</a></li>
                            <li><a href="#devoluciones">Devoluciones</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Contacto</h4>
                        <p>📍 Av. Libertador 1234, Santiago</p>
                        <p>📞 +56 9 1234 5678</p>
                        <p>✉️ info@techstore.cl</p>
                        <p>🕒 Lun-Vie: 9:00-19:00</p>
                    </div>
                </div>
<<<<<<< HEAD
                
                <div className="footer-section">
                    <h4>Enlaces Rápidos</h4>
                    <ul>
                        <li><a href="/Home">Home</a></li>
                        <li><a href="/Productos">Productos</a></li>
                        <li><a href="/Nosotros">Nosotros</a></li>
                        <li><a href="/Contacto">Contacto</a></li>
                    </ul>
                </div>
=======
>>>>>>> b0b3575678c17c62f928a1b22ef6e112b4d495a7

                <div className="footer-bottom">
                    <p>&copy; 2024 TechStore. Todos los derechos reservados.</p>
                    <p>Desarrollado por [Nombre del Equipo] - DSY1104</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;