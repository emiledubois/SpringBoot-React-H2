import Button from 'react-bootstrap/Button';
import { href } from 'react-router-dom';

function botonInicioSesion() {
  return (
    <>
       {/* Incorporar función -> inicio sesion */}
       <Button 
        variant="success" 
        className="container-home-btn"
       href='/InicioSesion'>Link</Button>
       {/* crear botón base - vincular href en home */}
    </>
  );
}

export default botonInicioSesion;

