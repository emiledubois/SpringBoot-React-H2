import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAdmin } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error cuando el usuario empieza a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log(' [Login] Iniciando login...');
    console.log(' [Login] Email:', formData.email);
    
    // Validaciones
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Email inválido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log(' [Login] Llamando a AuthContext.login()...');
      
      // Llamar al método login del contexto
      // Este método recibe (email, password) y retorna Promise<boolean>
      const success = await login(formData.email, formData.password);

      console.log(' [Login] Login completado, success:', success);

      if (success) {
        console.log(' [Login] Login exitoso, verificando rol...');
        
        // Esperar un poco para que el contexto se actualice
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Determinar ruta de redirección según rol
        const redirectTo = isAdmin() ? '/admin' : '/';
        
        console.log(' [Login] Es admin:', isAdmin());
        console.log('[Login] Redirigiendo a:', redirectTo);
        
        // Redirigir
        navigate(redirectTo, { replace: true });
        
        console.log(' [Login] Redirección ejecutada');
      } else {
        console.error(' [Login] Login falló');
        setError('Credenciales incorrectas');
      }

    } catch (err: any) {
      console.error(' [Login] Error en login:', err);
      
      setError(
        err.message || 
        'Error al iniciar sesión. Verifica tus credenciales.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-5">
              
              {/* Título */}
              <div className="text-center mb-4">
                <i className="bi bi-person-circle" style={{ fontSize: '4rem' }}></i>
                <h2 className="mt-3">Iniciar Sesión</h2>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              {/* Formulario */}
              <form onSubmit={handleSubmit}>
                
                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo Electrónico
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                {/* Botón Submit */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Ingresando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Ingresar
                    </>
                  )}
                </button>
              </form>

              {/* Link Registro */}
              <div className="text-center mt-3">
                <p className="text-muted mb-0">
                  ¿No tienes cuenta?{' '}
                  <Link to="/register" className="text-decoration-none">
                    Regístrate aquí
                  </Link>
                </p>
              </div>

              {/* Credenciales de prueba */}
              <div className="alert alert-info mt-4 mb-0" role="alert">
                <strong>Credenciales de prueba:</strong>
                <br />
                <small>
                  <strong>Admin:</strong> admin@capibara.cl / admin123
                  <br />
                  <strong>Usuario:</strong> usuario@capibara.cl / usuario123
                </small>
              </div>

              {/* Botón volver */}
              <div className="text-center mt-3">
                <Link to="/" className="btn btn-link text-decoration-none">
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver al inicio
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;