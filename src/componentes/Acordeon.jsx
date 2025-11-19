import Accordion from 'react-bootstrap/Accordion';
import '../estilos/Tienda/Nosotros.css';

function Acordeon() {
  return (
    <Accordion defaultActiveKey="">
      <Accordion.Item eventKey="0">
        <Accordion.Header><h2>Nuestra Misión</h2></Accordion.Header>
        <Accordion.Body>
            <p>En TechStore, nuestra misión es simple: Hacer que la tecnología de vanguardia sea accesible para todos. 
            Nos esforzamos por ofrecer productos electrónicos de la más alta calidad y un servicio al cliente excepcional 
            para empoderar a nuestros clientes en la era digital.
            Creemos en la innovación, la transparencia y la construcción de relaciones duraderas con cada persona que elige
            nuestros productos.</p>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header><h2>Nuestra Historia</h2></Accordion.Header>
        <Accordion.Body>
            <p>TechStore comenzó en 2025 como un pequeño proyecto de tres entusiastas de la tecnología. 
            Este es nuestro proyecto de fullstack para presentar durante este segundo semestre de 2025.</p>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default Acordeon;