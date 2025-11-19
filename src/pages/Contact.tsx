import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col-12 text-center mb-5">
          <h1 className="display-4">
            <i className="bi bi-envelope me-2"></i>
            Contáctanos
          </h1>
          <p className="lead text-muted">
            Estamos aquí para ayudarte. Envíanos tu consulta.
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body p-4">
              <h3 className="mb-4">Envíanos un mensaje</h3>

              {submitted && (
                <div className="alert alert-success" role="alert">
                  <i className="bi bi-check-circle me-2"></i>
                  ¡Mensaje enviado exitosamente! Te responderemos pronto.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tu@email.com"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">Asunto</label>
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Mensaje</label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Cuéntanos más detalles..."
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  <i className="bi bi-send me-2"></i>
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body p-4">
              <h3 className="mb-4">Información de Contacto</h3>
              
              <div className="d-flex mb-3">
                <i className="bi bi-geo-alt-fill text-primary fs-4 me-3"></i>
                <div>
                  <h5>Dirección</h5>
                  <p className="text-muted mb-0">
                    Av. Providencia 123, Santiago<br />
                    Región Metropolitana, Chile
                  </p>
                </div>
              </div>

              <hr />

              <div className="d-flex mb-3">
                <i className="bi bi-telephone-fill text-success fs-4 me-3"></i>
                <div>
                  <h5>Teléfono</h5>
                  <p className="text-muted mb-0">+56 9 1234 5678</p>
                </div>
              </div>

              <hr />

              <div className="d-flex mb-3">
                <i className="bi bi-envelope-fill text-danger fs-4 me-3"></i>
                <div>
                  <h5>Email</h5>
                  <p className="text-muted mb-0">info@techstore.cl</p>
                </div>
              </div>

              <hr />

              <div className="d-flex">
                <i className="bi bi-clock-fill text-warning fs-4 me-3"></i>
                <div>
                  <h5>Horario de Atención</h5>
                  <p className="text-muted mb-0">
                    Lunes a Viernes: 9:00 - 18:00<br />
                    Sábado: 10:00 - 14:00
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body p-4 text-center">
              <h5 className="mb-3">Síguenos en Redes Sociales</h5>
              <div className="d-flex justify-content-center gap-3">
                <a href="#" className="btn btn-outline-primary btn-lg">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="btn btn-outline-info btn-lg">
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="btn btn-outline-danger btn-lg">
                  <i className="bi bi-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
