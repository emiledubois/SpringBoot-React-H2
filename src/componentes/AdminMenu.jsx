import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importar useLocation

import '../estilos/Administrador/AdminMenu.css';

function AdminMenu() {
    const location = useLocation();

    const getAriaCurrent = (path) => {
        return location.pathname === path ? 'page' : '';
    };

    return (
        // Sidebar izquierda
        <aside className="AM-sidebar" id="sidebar">
            <div className="AM-brand">
                <div className="AM-dot" aria-hidden="true"></div>
                <Link to="/AdminHome"><span>🌎 TechStore</span></Link>
            </div>

            <div className="AM-search">
                <label className="AM-sr-only" htmlFor="q">Buscar</label>
                <input id="q" type="search" placeholder="Buscar..." />
            </div>

            <nav className="AM-nav">
                {/* Aplicar getAriaCurrent a cada Link */}
                <Link
                    to="/AdminHome"
                    aria-current={getAriaCurrent('/AdminHome')}
                >
                    🏠 <span>Bienvenido</span>
                </Link>
                <Link
                    to="/AdminVentas"
                    aria-current={getAriaCurrent('/AdminVentas')}
                >
                    🛒 <span>Ventas</span>
                </Link>
                <Link
                    to="/AdminInventario"
                    aria-current={getAriaCurrent('/Inventario')}
                >
                    📈 <span>Inventario</span>
                </Link>
            </nav>

            <div className="AM-sep"></div>

            <div className="AM-nav">
                <Link to="/#">⚙️ <span>Configuración</span></Link>
                <Link to="/#">❓ <span>Ayuda</span></Link>
                {/* "Cerrar sesión" redirige a la página pública de inicio (/) */}
                <Link to="/Home">🔒 <span>Cerrar sesión</span></Link>
            </div>
        </aside>
    );
}

export default AdminMenu;