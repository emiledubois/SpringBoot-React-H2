Tienda Online Fullstack


Sistema fullstack completo de tienda online desarrollado con React + TypeScript (Frontend) y Spring Boot (Backend), con autenticación JWT, gestión de roles y API REST documentada con Swagger.

---

## Características

### Backend (Spring Boot)
- API REST completa con endpoints CRUD
- Autenticación y autorización con JWT
- Sistema de roles (ADMIN y USER)
- Documentación automática con Swagger/OpenAPI
- Base de datos H2 (en memoria) para desarrollo
- Spring Security configurado
- CORS habilitado para integración con frontend

### Frontend (React + TypeScript)
- Interfaz moderna con Bootstrap 5
- Autenticación completa (Login/Registro)
- Gestión de sesiones con JWT
- Rutas protegidas por roles
- Carrito de compras funcional
- Catálogo de productos dinámico
- Panel de administración (solo ADMIN)

---

## Tecnologías Utilizadas

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- Spring Security
- JWT (io.jsonwebtoken)
- Swagger/SpringDoc OpenAPI 2.3.0
- H2 Database
- Lombok
- Maven

### Frontend
- React 18
- TypeScript
- Vite
- React Router v6
- Axios
- Bootstrap 5
- Context API

---

## Requisitos Previos

- Java 17 o superior
- Node.js 16 o superior
- npm o yarn
- Maven 3.6 o superior (opcional, el proyecto incluye Maven Wrapper)

---

## Credenciales de Prueba

### Administrador
- **Email:** `admin@capibara.cl`
- **Contraseña:** `admin123`
- **Roles:** ADMIN, USER

### Usuario Normal
- **Email:** `usuario@capibara.cl`
- **Contraseña:** `usuario123`
- **Roles:** USER

---

## Documentación de API (Swagger)

**http://localhost:8080/swagger-ui.html**

### Endpoints Principales

#### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

#### Productos
- `GET /api/products` - Listar todos los productos
- `GET /api/products/{id}` - Obtener producto por ID
- `POST /api/products` - Crear producto (ADMIN)
- `PUT /api/products/{id}` - Actualizar producto (ADMIN)
- `DELETE /api/products/{id}` - Eliminar producto (ADMIN)

#### Órdenes
- `GET /api/orders/my-orders` - Mis órdenes (USER)
- `POST /api/orders` - Crear orden (USER)
- `GET /api/orders` - Listar todas las órdenes (ADMIN)

---

## Estructura del Proyecto

```
SpringBoot-React-H2/
├── backend/                  # Backend Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/capibara/
│   │   │   │   ├── config/          # Configuraciones
│   │   │   │   ├── controllers/     # REST Controllers
│   │   │   │   ├── models/          # Entidades JPA
│   │   │   │   ├── repositories/    # Repositorios JPA
│   │   │   │   ├── services/        # Lógica de negocio
│   │   │   │   ├── security/        # JWT y seguridad
│   │   │   │   └── dto/             # DTOs
│   │   │   └── resources/
│   │   │       └── application.properties
│   └── pom.xml
│
├── src/                      # Frontend React
│   ├── components/
│   ├── pages/
│   ├── services/            # Servicios API
│   ├── context/
│   └── types/
│
└── package.json
```


