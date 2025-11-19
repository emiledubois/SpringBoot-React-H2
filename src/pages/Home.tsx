import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col-12 text-center mb-5">
          <h1 className="display-3 fw-bold">
            <i className="bi bi-shop text-primary"></i> Bienvenido a TechStore
          </h1>
          <p className="lead text-muted">
            Los mejores productos de tecnología al mejor precio
          </p>
          <Link 
            to="/productos" 
            className="btn btn-primary btn-lg mt-3" 
            data-testid="browse-products-btn"
          >
            <i className="bi bi-arrow-right-circle me-2"></i>
            Ver Productos
          </Link>
        </div>
      </div>

      <div className="row mt-5 g-4">
        <div className="col-12 col-md-4">
          <div className="card text-center h-100 shadow-sm">
            <div className="card-body">
              <i className="bi bi-truck text-primary display-4 mb-3"></i>
              <h5 className="card-title">Envío Gratis</h5>
              <p className="card-text text-muted">
                En compras superiores a $50.000
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card text-center h-100 shadow-sm">
            <div className="card-body">
              <i className="bi bi-shield-check text-success display-4 mb-3"></i>
              <h5 className="card-title">Compra Segura</h5>
              <p className="card-text text-muted">
                Protegemos tus datos personales
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card text-center h-100 shadow-sm">
            <div className="card-body">
              <i className="bi bi-arrow-repeat text-warning display-4 mb-3"></i>
              <h5 className="card-title">Devoluciones</h5>
              <p className="card-text text-muted">
                30 días para devoluciones sin costo
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12">
          <div className="card bg-primary text-white">
            <div className="card-body text-center py-5">
              <h3 className="mb-3">¿Necesitas ayuda?</h3>
              <p className="mb-3">
                Nuestro equipo está disponible para ayudarte con cualquier consulta
              </p>
              <button className="btn btn-light btn-lg">
                <i className="bi bi-chat-dots me-2"></i>
                Contactar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;