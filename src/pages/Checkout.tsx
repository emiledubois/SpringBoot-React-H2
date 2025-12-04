import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import { CartItem } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  onClearCart: () => void;
}

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  zipCode: string;
  paymentMethod: 'credit' | 'debit' | 'transfer';
}

const Checkout: React.FC<CheckoutProps> = ({ cart, onClearCart }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: 'Metropolitana',
    zipCode: '',
    paymentMethod: 'credit'
  });

  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});

  const regions = [
    'Metropolitana', 'Valparaíso', 'Biobío', 'Araucanía', 'Los Lagos',
    'Maule', 'Antofagasta', 'Coquimbo', 'O\'Higgins', 'Ñuble',
    'Tarapacá', 'Los Ríos', 'Arica y Parinacota', 'Atacama', 'Aysén', 'Magallanes'
  ];

  const calculateTotal = (): number => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = (): number => {
    const total = calculateTotal();
    return total > 50000 ? 0 : 5000;
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es requerido';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es requerido';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    const phoneRegex = /^[0-9]{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Teléfono debe tener 9 dígitos';
    }

    if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';
    if (!formData.city.trim()) newErrors.city = 'La ciudad es requerida';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'El código postal es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name as keyof CheckoutFormData]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    // Verificar autenticación
    if (!isAuthenticated()) {
      alert('Debes iniciar sesión para realizar una compra');
      navigate('/login');
      return;
    }

    // Verificar que hay items en el carrito
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    try {
      setLoading(true);

      // Construir dirección completa
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.region}`;

      // Construir notas del pedido
      const notes = `
Nombre: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Teléfono: ${formData.phone}
Método de pago: ${formData.paymentMethod === 'credit' ? 'Tarjeta de Crédito' : 
                   formData.paymentMethod === 'debit' ? 'Tarjeta de Débito' : 'Transferencia'}
      `.trim();

      // Preparar items de la orden
      const orderItems = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      // Crear la orden en el backend
      console.log('Creando orden con items:', orderItems);
      
      const order = await orderService.createOrder({
        items: orderItems,
        shippingAddress: fullAddress,
        notes: notes
      });

      console.log('Orden creada exitosamente:', order);

      // Generar número de orden
      const generatedOrderNumber = `ORD-${order.id}-${Date.now()}`;
      setOrderNumber(generatedOrderNumber);
      
      // Vaciar carrito
      onClearCart();
      
      // Ir a pantalla de confirmación
      setStep('confirmation');

    } catch (error: any) {
      console.error('Error al crear orden:', error);
      
      let errorMessage = 'Error al procesar la orden. ';
      
      if (error.response?.status === 401) {
        errorMessage = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Datos de la orden inválidos.';
      } else if (error.message?.includes('Stock insuficiente')) {
        errorMessage = 'Algunos productos no tienen stock suficiente.';
      } else {
        errorMessage += 'Por favor verifica los datos e intenta nuevamente.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Si el carrito está vacío
  if (cart.length === 0 && step === 'form') {
    return (
      <div className="container mt-5 mb-5">
        <div className="alert alert-warning text-center">
          <h4>No hay productos en el carrito</h4>
          <p>Agrega productos antes de proceder al pago</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/productos')}
          >
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  // Pantalla de confirmación
  if (step === 'confirmation') {
    return (
      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg">
              <div className="card-body text-center p-5">
                <div className="mb-4">
                  <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
                </div>
                <h2 className="text-success mb-4">¡Compra Exitosa!</h2>
                <p className="lead mb-4">
                  Tu pedido ha sido procesado correctamente
                </p>
                
                <div className="alert alert-info">
                  <h5>Número de Orden</h5>
                  <h3 className="mb-0 fw-bold">{orderNumber}</h3>
                </div>

                <div className="mb-4">
                  <p className="mb-2">
                    <strong>Total pagado:</strong> {formatPrice(calculateTotal() + calculateShipping())}
                  </p>
                  <p className="mb-2">
                    <strong>Email de confirmación:</strong> {formData.email}
                  </p>
                  <p className="mb-0">
                    <strong>Dirección de envío:</strong> {formData.address}, {formData.city}
                  </p>
                </div>

                <hr />

                <p className="text-muted mb-4">
                  Recibirás un email con los detalles de tu pedido y el seguimiento del envío.
                </p>

                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate('/')}
                >
                  <i className="bi bi-house me-2"></i>
                  Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formulario de checkout
  return (
    <div className="container mt-4 mb-5">
      <div className="row mb-4">
        <div className="col-12">
          <h2>
            <i className="bi bi-credit-card me-2"></i>
            Finalizar Compra
          </h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/carrito">Carrito</a>
              </li>
              <li className="breadcrumb-item active">Checkout</li>
            </ol>
          </nav>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Formulario */}
          <div className="col-lg-8 mb-4">
            {/* Información Personal */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h4 className="mb-4">
                  <i className="bi bi-person me-2"></i>
                  Información Personal
                </h4>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="form-label">
                      Nombre <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Juan"
                      disabled={loading}
                    />
                    {errors.firstName && (
                      <div className="invalid-feedback">{errors.firstName}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="form-label">
                      Apellido <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Pérez"
                      disabled={loading}
                    />
                    {errors.lastName && (
                      <div className="invalid-feedback">{errors.lastName}</div>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                      data-testid="email-input"
                      disabled={loading}
                    />
                    {errors.email && (
                      <div className="invalid-feedback" data-testid="email-error">
                        {errors.email}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="phone" className="form-label">
                      Teléfono <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="912345678"
                      disabled={loading}
                    />
                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Dirección de Envío */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h4 className="mb-4">
                  <i className="bi bi-geo-alt me-2"></i>
                  Dirección de Envío
                </h4>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Dirección <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Av. Providencia 123, Depto 45"
                    disabled={loading}
                  />
                  {errors.address && (
                    <div className="invalid-feedback">{errors.address}</div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="city" className="form-label">
                      Ciudad <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Santiago"
                      disabled={loading}
                    />
                    {errors.city && (
                      <div className="invalid-feedback">{errors.city}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="region" className="form-label">
                      Región <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      disabled={loading}
                    >
                      {regions.map(region => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="zipCode" className="form-label">
                    Código Postal <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`}
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="7500000"
                    disabled={loading}
                  />
                  {errors.zipCode && (
                    <div className="invalid-feedback">{errors.zipCode}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Método de Pago */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h4 className="mb-4">
                  <i className="bi bi-wallet2 me-2"></i>
                  Método de Pago
                </h4>
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="credit"
                    value="credit"
                    checked={formData.paymentMethod === 'credit'}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <label className="form-check-label" htmlFor="credit">
                    <i className="bi bi-credit-card me-2"></i>
                    Tarjeta de Crédito
                  </label>
                </div>
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="debit"
                    value="debit"
                    checked={formData.paymentMethod === 'debit'}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <label className="form-check-label" htmlFor="debit">
                    <i className="bi bi-credit-card-2-front me-2"></i>
                    Tarjeta de Débito
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="transfer"
                    value="transfer"
                    checked={formData.paymentMethod === 'transfer'}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <label className="form-check-label" htmlFor="transfer">
                    <i className="bi bi-bank me-2"></i>
                    Transferencia Bancaria
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div className="col-lg-4">
            <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
              <div className="card-body">
                <h5 className="mb-4">
                  <i className="bi bi-receipt me-2"></i>
                  Resumen del Pedido
                </h5>

                <div className="mb-3">
                  {cart.map(item => (
                    <div key={item.id} className="d-flex justify-content-between mb-2">
                      <span className="text-muted">
                        {item.name} x{item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span>Envío:</span>
                  <span className={calculateShipping() === 0 ? 'text-success' : ''}>
                    {calculateShipping() === 0 ? 'GRATIS' : formatPrice(calculateShipping())}
                  </span>
                </div>

                {calculateTotal() < 50000 && (
                  <div className="alert alert-info small mb-3">
                    <i className="bi bi-info-circle me-1"></i>
                    Agrega {formatPrice(50000 - calculateTotal())} más para envío gratis
                  </div>
                )}

                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <strong className="fs-5">Total:</strong>
                  <strong className="fs-5 text-primary">
                    {formatPrice(calculateTotal() + calculateShipping())}
                  </strong>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-success w-100 btn-lg"
                  data-testid="submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-credit-card me-2"></i>
                      Confirmar Pago
                    </>
                  )}
                </button>

                <button 
                  type="button"
                  className="btn btn-outline-secondary w-100 mt-2"
                  onClick={() => navigate('/carrito')}
                  disabled={loading}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver al Carrito
                </button>

                <div className="mt-3 text-center">
                  <small className="text-muted">
                    <i className="bi bi-shield-check me-1"></i>
                    Pago 100% seguro
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;