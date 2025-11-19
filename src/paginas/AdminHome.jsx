import React from 'react';
import AdminMenu from '../componentes/AdminMenu.jsx';

import '../estilos/Administrador/AdminHome.css'; 

function AdminHome() {
    return (
        <div className="AH-admin-dashboard-layout"> 
            <AdminMenu />
            <main className="AH-mainHome">
            <div className="AH-app">
                <h1>Bienvenido Administrador</h1> 
                <p>Usa el menú lateral para navegar a las secciones de Ventas e Inventario.</p>
                
                {/* Dashboard de ejemplo - Datos Ficticios */}
                <div className="AH-dashboard-metrics">
                    <div className="AH-metric-card">
                        <h2>Ventas del Mes</h2>
                        <p className="AH-value">$10.678.000</p>
                        <span className="AH-trend AH-trend-up">▲ 12% vs mes anterior</span>
                    </div>
                    <div className="AH-metric-card">
                        <h2>Inventario Total</h2>
                        <p className="AH-value">940 productos</p>
                        <span className="AH-trend AH-trend-down">▼ 5% en stock bajo</span>
                    </div>
                    <div className="AH-metric-card">
                        <h2>Nuevos Clientes</h2>
                        <p className="AH-value">121</p>
                        <span className="AH-trend AH-trend-up">▲ 8% vs semana anterior</span>
                    </div>
                </div>

                {/* Gráfico Placeholder */}
                <div className="AH-sales-chart-placeholder">
                    <h3>Resumen de Actividad Reciente</h3>
                    <p>Espacio para un gráfico de actividad de ventas, etc.</p>
                </div>
            </div>
            </main>
        </div>
    );
}

export default AdminHome;