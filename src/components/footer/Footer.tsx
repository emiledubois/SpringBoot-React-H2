import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-auto py-4">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-4 mb-3">
            <h5>
              <i className="bi bi-shop me-2"></i>
              TechStore
            </h5>
            <p>Tu tienda de tecnología de confianza en Chile</p>
          </div>
          <div className="col-12 col-md-4 mb-3">
            <h5>Enlaces Rápidos</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-white text-decoration-none">
                  <i className="bi bi-house me-1"></i> Inicio
                </a>
              </li>
              <li>
                <a href="/productos" className="text-white text-decoration-none">
                  <i className="bi bi-grid me-1"></i> Productos
                </a>
              </li>
              <li>
                <a href="/carrito" className="text-white text-decoration-none">
                  <i className="bi bi-cart me-1"></i> Carrito
                </a>
              </li>
            </ul>
          </div>
          <div className="col-12 col-md-4 mb-3">
            <h5>Contacto</h5>
            <p className="mb-1">
              <i className="bi bi-envelope me-2"></i>
              info@techstore.cl
            </p>
            <p className="mb-1">
              <i className="bi bi-telephone me-2"></i>
              +56 9 1234 5678
            </p>
            <p className="mb-0">
              <i className="bi bi-geo-alt me-2"></i>
              Santiago, Chile
            </p>
          </div>
        </div>
        <hr className="bg-white" />
        <div className="text-center">
          <p className="mb-0">
            &copy; {currentYear} TechStore. Desarrollado por AG Mira - DSY1104
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;