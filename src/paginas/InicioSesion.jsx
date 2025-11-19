import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { validateLogin } from '../utiles/validaciones.js';
import '../estilos/Tienda/InicioSesion.css';

function InicioSesion() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        if (errors[name]) setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        setMessage('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { errors: validationErrors, isValid } = validateLogin(formData);

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');

        const user = users.find(u =>
            u.email.toLowerCase() === formData.email.toLowerCase() && u.password === formData.password
        );

        if (user) {
            setMessage(`<p class="success">✅ Inicio de sesión exitoso. Bienvenido, ${user.fullname}.</p>`);

            setTimeout(() => {
                navigate('/AdminHome');
            }, 1000);

        } else {
            setMessage('<p class="error">❌ Correo o contraseña incorrectos.</p>');
        }
    };

    return (
        <main className="IS-cardInicioSesion">
            <Link className="IS-botonIS-home" to="/Home">🏠 Home</Link>
            <div className="IS-Logo">
                <img className="IS-PaginaLogo" src="/public/img/2111125.png" alt="Logo" />
            </div>
            <h2>Iniciar Sesión</h2>
            <form id="loginForm" onSubmit={handleSubmit} noValidate>

                <div className="IS-field">
                    <label htmlFor="email">Correo electrónico</label>
                    <input type="email" id="IS-email" name="email" required placeholder="tu@correo.com"
                        value={formData.email} onChange={handleChange} />
                    {errors.email && <div className="IS-error">{errors.email}</div>}
                </div>

                <div className="IS-field">
                    <label htmlFor="password">Contraseña</label>
                    <input type="password" id="IS-password" name="password" required placeholder="Ingresa tu contraseña"
                        value={formData.password} onChange={handleChange} />
                    {errors.password && <div className="IS-error">{errors.password}</div>}
                </div>

                <button type="submit">Entrar</button>
                <div id="IS-message" dangerouslySetInnerHTML={{ __html: message }}></div>
            </form>
        </main>
    );
}

export default InicioSesion;