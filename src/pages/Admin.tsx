import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import productService from '../services/productService';

const Admin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    image: '',
    stock: 0,
    category: '',
    description: ''
  });

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, []);

  /**
   * Cargar todos los productos desde la API
   */
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
      alert('Error al cargar productos. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manejar cambios en los inputs del formulario
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    });
  };

  /**
   * Manejar submit del formulario (crear o editar)
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (editingProduct) {
        // Editar producto existente
        await productService.updateProduct(editingProduct.id, formData);
        alert('Producto actualizado exitosamente');
      } else {
        // Crear nuevo producto
        await productService.createProduct(formData);
        alert('Producto creado exitosamente');
      }
      
      // Recargar la lista de productos
      await loadProducts();
      
      // Resetear formulario
      resetForm();
      
    } catch (error: any) {
      console.error('Error guardando producto:', error);
      
      // Mostrar mensaje de error más específico
      if (error.response?.status === 403) {
        alert('No tienes permisos para realizar esta acción. Solo los administradores pueden modificar productos.');
      } else if (error.response?.status === 401) {
        alert('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
      } else {
        alert('Error al guardar producto. Verifica los datos e intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Preparar formulario para editar un producto
   */
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      category: product.category,
      description: product.description
    });
    setShowForm(true);
  };

  /**
   * Eliminar un producto
   */
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    try {
      setLoading(true);
      await productService.deleteProduct(id);
      alert('Producto eliminado exitosamente');
      
      // Recargar la lista de productos
      await loadProducts();
      
    } catch (error: any) {
      console.error('Error eliminando producto:', error);
      
      if (error.response?.status === 403) {
        alert('No tienes permisos para eliminar productos.');
      } else if (error.response?.status === 401) {
        alert('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
      } else {
        alert('Error al eliminar producto.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resetear el formulario a su estado inicial
   */
  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      image: '',
      stock: 0,
      category: '',
      description: ''
    });
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="container mt-4 mb-5">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h2>
            <i className="bi bi-gear me-2"></i>
            Panel de Administrador
          </h2>
          <p className="text-muted">Gestiona los productos de tu tienda</p>
        </div>
      </div>

      {/* Botón para mostrar/ocultar formulario */}
      <div className="row mb-4">
        <div className="col-12">
          <button 
            className="btn btn-primary"
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
            disabled={loading}
          >
            <i className={`bi ${showForm ? 'bi-x-circle' : 'bi-plus-circle'} me-2`}></i>
            {showForm ? 'Cancelar' : 'Agregar Producto'}
          </button>
        </div>
      </div>

      {/* Formulario de crear/editar producto */}
      {showForm && (
        <div className="row mb-4">
          <div className="col-lg-8">
            <div className="card shadow">
              <div className="card-body">
                <h4 className="mb-4">
                  {editingProduct ? (
                    <>
                      <i className="bi bi-pencil me-2"></i>
                      Editar Producto
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-circle me-2"></i>
                      Nuevo Producto
                    </>
                  )}
                </h4>
                
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nombre *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        placeholder="Ej: Capibara de Peluche"
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Precio (CLP) *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        disabled={loading}
                        placeholder="Ej: 15990"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Stock *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                        min="0"
                        disabled={loading}
                        placeholder="Ej: 50"
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Categoría *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        placeholder="Ej: Peluches"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">URL de Imagen *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    {formData.image && (
                      <div className="mt-2">
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          style={{ maxWidth: '200px', maxHeight: '200px' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Error+al+cargar';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      disabled={loading}
                      placeholder="Descripción detallada del producto..."
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-success"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          {editingProduct ? 'Actualizar' : 'Guardar'}
                        </>
                      )}
                    </button>
                    
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={resetForm}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de productos */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="mb-4">
                <i className="bi bi-box-seam me-2"></i>
                Lista de Productos
                <span className="badge bg-primary ms-2">{products.length}</span>
              </h4>
              
              {loading && products.length === 0 ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-2">Cargando productos...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="alert alert-info text-center">
                  <i className="bi bi-info-circle me-2"></i>
                  No hay productos registrados. ¡Agrega el primero!
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Categoría</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>
                            <img 
                              src={product.image} 
                              alt={product.name}
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50?text=N/A';
                              }}
                            />
                          </td>
                          <td>{product.name}</td>
                          <td>${product.price.toLocaleString('es-CL')}</td>
                          <td>
                            <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                              {product.stock} unidades
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-secondary">{product.category}</span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => handleEdit(product)}
                              disabled={loading}
                              title="Editar producto"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(product.id)}
                              disabled={loading}
                              title="Eliminar producto"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;