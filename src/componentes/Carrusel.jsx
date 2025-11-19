import Carousel from 'react-bootstrap/Carousel';

// Array de datos para el Carrusel
const carruselData = [
    {
        imageSrc: "img/TecladoRKRoyalKludgeR65chilegatillos.cl.webp",
        altText: "Teclado mecánico RGB",
        title: "Oferta Exclusiva: Teclado Mecánico",
        text: "Descubre la precisión y la respuesta táctil del nuevo Royal Kludge R65. ¡Edición limitada!"
    },
    {
        imageSrc: "img/large03.avif",
        altText: "Monitor LG 24' Full HD 1920x1080 IPS Led, 5ms, HDMI, VGA AMD FreeSync - 24MK430H-B.AWH",
        title: "Monitor LG 24'Full HD 1920x1080 IPS Led",
        text: "Alta definición con color preciso la resolución 1080p Full HD con IPS."
    },
    {
        imageSrc: "img/DZ-1.avif",
        altText: "Monitor LG 27” - IPS (1920x1080p, 250 cd/m², 1000:1, NTSC 72%)",
        title: "Monitor LG 27'",
        text: "Diseño virtualmente sin bordes para una experiencia de uso, más inmersiva y fluida en configuraciones multimonitor."
    }
];

function CarruselHome() {
    const imageStyle = {
        height: '400px', 
        objectFit: 'contain', 
        margin: '0 0 100px 0'
    };

    return (
        <Carousel data-bs-theme="dark">
            {/* Usamos map() para renderizar cada item del array */}
            {carruselData.map((slide, index) => (
                <Carousel.Item key={index}>
                    <img
                        className="d-block w-100 carrusel-img"
                        style={imageStyle}
                        src={slide.imageSrc}
                        alt={slide.altText}
                    />
                    <Carousel.Caption>
                        <h5>{slide.title}</h5>
                        <p>{slide.text}</p>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default CarruselHome;