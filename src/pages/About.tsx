import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col-12 text-center mb-5">
          <h1 className="display-4">
            <i className="bi bi-people me-2"></i>
            Sobre Nosotros
          </h1>
          <p className="lead text-muted">
            Conoce más sobre TechStore y nuestro compromiso contigo
          </p>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-lg-6 mb-4">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470" 
            alt="TechStore" 
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-lg-6">
          <h2 className="mb-4">Nuestra Historia</h2>
          <p className="text-muted">
            TechStore nació en 2020 con la misión de acercar la tecnología a todos los chilenos. 
            Comenzamos como una pequeña tienda online y hoy somos uno de los principales 
            distribuidores de productos tecnológicos en Chile.
          </p>
          <p className="text-muted">
            Nos especializamos en ofrecer productos de calidad a precios competitivos, 
            con un servicio al cliente excepcional que nos ha permitido ganarnos la 
            confianza de miles de usuarios.
          </p>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-12">
          <h2 className="text-center mb-4">Nuestros Valores</h2>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 text-center shadow-sm">
            <div className="card-body">
              <i className="bi bi-check-circle text-success display-4 mb-3"></i>
              <h4>Calidad</h4>
              <p className="text-muted">
                Ofrecemos solo productos de marcas reconocidas y verificadas
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 text-center shadow-sm">
            <div className="card-body">
              <i className="bi bi-hand-thumbs-up text-primary display-4 mb-3"></i>
              <h4>Confianza</h4>
              <p className="text-muted">
                Tu satisfacción es nuestra prioridad número uno
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 text-center shadow-sm">
            <div className="card-body">
              <i className="bi bi-lightning text-warning display-4 mb-3"></i>
              <h4>Rapidez</h4>
              <p className="text-muted">
                Envíos rápidos y seguros a todo Chile
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card bg-primary text-white">
            <div className="card-body text-center py-5">
              <h2 className="mb-3">¿Listo para comprar con nosotros?</h2>
              <p className="mb-4">
                Únete a los miles de clientes satisfechos que confían en TechStore
              </p>
              <a href="/productos" className="btn btn-light btn-lg">
                <i className="bi bi-arrow-right-circle me-2"></i>
                Ver Productos
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
