import React from 'react';
import Header from '../componentes/Header';
import Footer from '../componentes/Footer'; 
import Acordeon from '../componentes/Acordeon'

import '../estilos/Tienda/Nosotros.css';
import '../estilos/Tienda/index.css';

function Nosotros() {
    return (
        <div className="nosotros-page">
            <Header />
            
            <main className="nosotros-main">
                
                <section className="nosotros-hero">
                    <h1>Acerca de 🌎 TechStore</h1>
                    <p className="subtitle">
                        Impulsando tu vida digital con la mejor tecnología.
                    </p>
                </section>

                <div className="nosotros-container">
                    
                    {/* Sección 1: Nuestra Misión */}
                    <section className="nosotros-mision">
                        <Acordeon />
                    </section>
                    
                    {/* Sección 3: Nuestro Equipo (Ejemplo de Cards) */}
                    <section className="nosotros-equipo">
                        <h2>Conoce a Nuestro Equipo</h2>
                        <div className="equipo-grid">
                            
                            <div className="miembro-card">
                                <img src="/img/team-member-1.jpg" alt="Foto Agustin" className="miembro-foto" />
                                <h4>Agustin Mira</h4>
                                <p className="miembro-cargo">Estudiante Lider de grupo</p>
                            </div>
                            
                            <div className="miembro-card">
                                <img src="/img/team-member-2.jpg" alt="Foto Rachell" className="miembro-foto" />
                                <h4>Rachell Chavarria</h4>
                                <p className="miembro-cargo"> Estudiante Programador</p>
                            </div>
                            
                            <div className="miembro-card">
                                <img src="/img/team-member-3.jpg" alt="Foto Rhudy" className="miembro-foto" />
                                <h4>Rhudy Brandenberg</h4>
                                <p className="miembro-cargo">Estudiante Programador</p>
                            </div>
                            
                        </div>
                    </section>

                </div>
            </main>
            
            <Footer />
        </div>
    );
}
export default Nosotros;