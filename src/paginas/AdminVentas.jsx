import React from 'react';
import AdminMenu from '../componentes/AdminMenu.jsx';

import '../estilos/Administrador/Ventas.css'; 

function AdminVentas() {
    return (
        <div className="AV-admin-dashboard-layout"> 
            <AdminMenu />
            
            <main className="AV-mainHome">
                <div className="AV-app">
                    <h1>📊 Dashboard de Ventas</h1> 

                    {/* Contenedor de las métricas principales */}
                    <div className="AV-metrics-grid">
                        <div className="AV-metric-card">
                            <h2>Ventas del Día</h2>
                            <p className="AV-metric-value">$ 1,250.00</p>
                            <span className="AV-metric-trend">↑ 12% vs ayer</span>
                        </div>
                        <div className="AV-metric-card">
                            <h2>Pedidos Pendientes</h2>
                            <p className="AV-metric-value">45</p>
                            <span className="AV-metric-trend">Nuevos: 5</span>
                        </div>
                        <div className="AV-metric-card">
                            <h2>Total Clientes</h2>
                            <p className="AV-metric-value">8,450</p>
                            <span className="AV-metric-trend">Clientes nuevos este mes</span>
                        </div>
                        <div className="AV-metric-card">
                            <h2>Productos Agotados</h2>
                            <p className="AV-metric-value AV-warning">3</p>
                            <span className="AV-metric-trend">¡Revisar inventario!</span>
                        </div>
                    </div>

                    {/* Sección de Acciones Rápidas */}
                    <div className="AV-actions-section">
                        <h2>Acciones Rápidas</h2>
                        <div className="AV-actions-buttons">
                            <button className="AV-action-button AV-primary">Crear Nueva Venta</button>
                            <button className="AV-action-button">Ver Reportes</button>
                            <button className="AV-action-button">Gestionar Devoluciones</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminVentas;