import React from 'react';
import AdminMenu from '../componentes/AdminMenu.jsx';

import '../estilos/Administrador/Inventario.css'; 

function AdminInventario() {
    // Datos de ejemplo para la tabla de inventario
    const products = [
        { id: 1, name: 'Laptop Pro X15', sku: 'LTP-PX15-GRY', stock: 15, price: 1200.00, status: 'Disponible' },
        { id: 2, name: 'Mouse Inalámbrico M5', sku: 'MOU-WM5-BLK', stock: 85, price: 25.50, status: 'Disponible' },
        { id: 3, name: 'Monitor LED 27p', sku: 'MON-L27-SLV', stock: 5, price: 350.00, status: 'Bajo Stock' },
        { id: 4, name: 'Teclado Mecánico K90', sku: 'TEC-M90-RGB', stock: 0, price: 99.99, status: 'Agotado' },
    ];

    return (
        <div className="AI-admin-dashboard-layout"> 
            <AdminMenu />
            
            <main className="AI-main">
                <div className="AI-app">
                    <h1>Inventario de Productos Electrónicos</h1> 

                    {/* Sección de Métricas de Inventario */}
                    <div className="AI-metrics-grid">
                        <div className="AI-metric-card">
                            <h2>Productos Totales</h2>
                            <p className="AI-metric-value">1,250</p>
                        </div>
                        <div className="AI-metric-card">
                            <h2>Stock Crítico</h2>
                            <p className="AI-metric-value AI-warning">12</p>
                        </div>
                        <div className="AI-metric-card">
                            <h2>Productos Agotados</h2>
                            <p className="AI-metric-value AI-critical">5</p>
                        </div>
                    </div>

                    {/* Barra de Control y Acciones */}
                    <div className="AI-control-bar">
                        <input type="search" placeholder="Buscar por nombre o SKU..." className="AI-search-input" />
                        <button className="AI-action-button AI-primary">+ Añadir Producto</button>
                        <button className="AI-action-button">Exportar CSV</button>
                    </div>

                    {/* Tabla de Inventario */}
                    <div className="AI-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre del Producto</th>
                                    <th>SKU</th>
                                    <th>Stock</th>
                                    <th>Precio</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.sku}</td>
                                        <td>
                                            <span className={`AI-stock-level ${product.stock < 10 ? 'AI-low-stock' : ''} ${product.stock === 0 ? 'AI-out-of-stock' : ''}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td>$ {product.price.toFixed(2)}</td>
                                        <td>
                                            <span className={`AI-status ${product.status === 'Bajo Stock' ? 'AI-status-low' : ''} ${product.status === 'Agotado' ? 'AI-status-out' : ''}`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="AI-edit-btn">Editar</button>
                                            <button className="AI-delete-btn">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminInventario;