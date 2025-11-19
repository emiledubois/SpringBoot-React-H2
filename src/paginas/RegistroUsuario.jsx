import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { comunasPorRegion, regions } from '../utiles/comunas.js'; 
import { validateRegistration } from '../utiles/validaciones.js'; 

import '../estilos/Tienda/RegistroUsuario.css';

function RegistroUsuario() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: '', email: '', password: '', phone: '',
        region: '', comuna: '', otraComuna: '' 
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'region') {
            setFormData(prevData => ({
                ...prevData,
                region: value,
                comuna: '', 
                otraComuna: ''
            }));
        } else {
            setFormData(prevData => ({ ...prevData, [name]: value }));
        }

        if (errors[name]) setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        const { errors: newErrors, isValid } = validateRegistration(formData, users);

        if (!isValid) {
            setErrors(newErrors);
            setMessage('');
            return;
        }

        const finalComuna = formData.comuna === 'Otra' ? formData.otraComuna : formData.comuna;
        
        const newUser = {
            id: Date.now(),
            fullname: formData.fullname,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            region: formData.region,
            comuna: finalComuna 
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        setMessage('<span class="success">¡Registro exitoso! Ya puedes iniciar sesión.</span>');
        setFormData({ fullname: '', email: '', password: '', phone: '', region: '', comuna: '', otraComuna: '' });
        setErrors({});

    };

    return (
        <main className="RU-cardRegistroUsuario" role="main" aria-labelledby="title">
            <Link className="RU-botonRU-home" to="/Home">🏠 Home</Link>
            <div id="RegistroUsuario">
                <h1 id="titleRU">Registro de usuario</h1>

                <form id="regForm" onSubmit={handleSubmit} noValidate>
                    <div className="RU-field-wrap">
                        <label htmlFor="fullname">Nombre completo</label>
                        <input id="fullname" name="fullname" type="text" placeholder="Ej: María Pérez" required 
                               value={formData.fullname} onChange={handleChange} />
                        <div className="RU-error" style={{display: errors.fullname ? 'block' : 'none'}}>{errors.fullname}</div>
                    </div>

                    <div className="RU-field-wrap">
                        <label htmlFor="email">Correo electrónico</label>
                        <input id="email" name="email" type="email" placeholder="tu@correo.com" required 
                               value={formData.email} onChange={handleChange} />
                        <div className="RU-error" style={{display: errors.email ? 'block' : 'none'}}>{errors.email}</div>
                    </div>
                    
                    <div className="RU-field-wrap">
                        <label htmlFor="password">Contraseña</label>
                        <input id="password" name="password" type="password" placeholder="Mínimo 8 dígitos" required 
                               value={formData.password} onChange={handleChange} />
                        <div className="RU-error" style={{display: errors.password ? 'block' : 'none'}}>{errors.password}</div>
                    </div>
                    
                    <div className="RU-field-wrap">
                        <label htmlFor="phone">Teléfono (Opcional)</label>
                        <input id="phone" name="phone" type="tel" placeholder="9 1234 5678" 
                               value={formData.phone} onChange={handleChange} />
                        <div className="RU-error" style={{display: errors.phone ? 'block' : 'none'}}>{errors.phone}</div>
                    </div>
                    
                    <div className="RU-field-wrap">
                        <label htmlFor="region">Región</label>
                        <select id="region" name="region" required value={formData.region} onChange={handleChange}>
                            <option value="">-- Selecciona región --</option>
                            {regions.map(regionName => (
                                <option key={regionName} value={regionName}>{regionName}</option>
                            ))}
                        </select>
                        <div className="RU-error" style={{display: errors.region ? 'block' : 'none'}}>{errors.region}</div>
                    </div>
                    
                    <div className="RU-field-wrap">
                        <label htmlFor="comuna">Comuna</label>
                        <select id="comuna" name="comuna" required value={formData.comuna} onChange={handleChange}
                            disabled={!formData.region} 
                        >
                            <option value="">-- Selecciona comuna --</option>
                            {formData.region && comunasPorRegion[formData.region] && 
                                comunasPorRegion[formData.region].map(comunaName => (
                                    <option key={comunaName} value={comunaName}>{comunaName}</option>
                                ))
                            }
                            {formData.region && <option value="Otra">Otra (Especifique)</option>}
                        </select>
                        <div className="RU-error" style={{display: errors.comuna ? 'block' : 'none'}}>{errors.comuna}</div>
                    </div>

                    {formData.comuna === 'Otra' && (
                        <div className="RU-field-wrap">
                            <label htmlFor="otraComuna">Escribe tu comuna</label>
                            <input id="otraComuna" name="otraComuna" type="text" placeholder="Escribe tu comuna" 
                                   value={formData.otraComuna} onChange={handleChange} />
                        </div>
                    )}
                    
                    <div style={{display:'flex', gap:'12px', alignItems:'center', marginTop:'8px'}}>
                        <button type="submit" className="RU-btn">Registrar</button>
                        <div id="msg" dangerouslySetInnerHTML={{ __html: message }}></div>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default RegistroUsuario;