import React, { useState } from 'react';
import Header from '../componentes/Header';
import Footer from '../componentes/Footer';

import '../estilos/Tienda/Contacto.css';
import '../estilos/Tienda/index.css';

import { validateForm } from '../utiles/validaciones.js';

function Contacto() {
    // ESTADO PARA LOS DATOS DEL FORMULARIO
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    // ESTADO PARA LOS ERRORES DE VALIDACIÓN
    const [errors, setErrors] = useState({});

    // HANDLER para actualizar el estado al escribir (reemplaza getElementById en input)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
        
        // Limpiar el error inmediatamente después de escribir algo
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: '',
            }));
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Ejecutamos la función de validación importada
        const { errors: newErrors, isValid } = validateForm(formData);

        // Si no es válido, actualizamos los errores y detenemos el envío
        if (!isValid) {
            setErrors(newErrors);
            console.log('Validación fallida.');
            return; // Detiene la función
        }
        
        // --- Lógica de envío exitosa ---
        alert('¡Formulario enviado con éxito!');
        setErrors({}); // Limpiar errores
        setFormData({ // Resetear el formulario
            name: '', email: '', phone: '', subject: '', message: '',
        });
        
        console.log('Datos a enviar:', formData);
    };
    
    return (
        <>
            <Header />
            
            <main className="contact-page">
                <section className="contact-section">
                    <h1>Contáctanos</h1>
                    <p>¿Tienes preguntas? Completa el formulario y te responderemos pronto.</p>
                    
                    {/* USAMOS LA FUNCIÓN DE ENVÍO Y CLASES JSX */}
                    <form id="contactForm" className="contact-form" onSubmit={handleSubmit} noValidate>
                        
                        <div className="form-group">
                            <label htmlFor="name">Nombre completo *</label> 
                            {/* BINDING: Conectamos el input al estado */}
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                value={formData.name} // Valor controlado
                                onChange={handleChange} // Handler de cambio
                                required 
                                autoComplete="name" 
                            />
                            {/* MOSTRAMOS EL ERROR DEL ESTADO */}
                            <span className="error-message" id="nameError">{errors.name}</span>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="email">Correo electrónico *</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={formData.email}
                                onChange={handleChange}
                                required 
                                autoComplete="email" 
                            />
                            <span className="error-message" id="emailError">{errors.email}</span>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="phone">Teléfono</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                name="phone" 
                                value={formData.phone}
                                onChange={handleChange}
                                autoComplete="tel" 
                            />
                            <span className="error-message" id="phoneError">{errors.phone}</span>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="subject">Asunto *</label>
                            <input 
                                type="text" 
                                id="subject" 
                                name="subject" 
                                value={formData.subject}
                                onChange={handleChange}
                                required 
                            />
                            <span className="error-message" id="subjectError">{errors.subject}</span>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="message">Mensaje *</label>
                            <textarea 
                                id="message" 
                                name="message" 
                                rows="5" 
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                            <span className="error-message" id="messageError">{errors.message}</span>
                        </div>
                        
                        <button type="submit" className="submit-btn">Enviar mensaje</button>
                    </form>
                </section>
                
                <section className="contact-info">
                    <h2>Información de contacto</h2>
                    <div className="info-item">
                        <i className="fa fa-map-marker"></i>
                        <p>Av. Libertador 1234, Santiago</p>
                    </div>
                    <div class="info-item">
                        <i class="fa fa-phone"></i>
                        <p>+56 9 1234 5678</p>
                    </div>
                    <div class="info-item">
                        <i class="fa fa-envelope"></i>
                        <p>info@techstore.cl</p>
                    </div>
                    <div class="info-item">
                        <i class="fa fa-clock-o"></i>
                        <p>Lun-Vie: 9:00-19:00</p>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default Contacto;