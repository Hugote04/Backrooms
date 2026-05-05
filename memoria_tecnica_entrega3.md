# Memoria Técnica — Entrega 3
## Backrooms: Lurking In The Shadows — Aplicación Web

**Proyecto:** Desarrollo de Aplicaciones Web (DAW) — 2024/2025  
**Centro:** I.E.S. Rey Fernando VI  
**Fecha:** Abril 2026

---

## 1. Descripción del proyecto

Lurking In The Shadows es un videojuego de terror en primera persona ambientado en las Backrooms, desarrollado en Unity (proyecto DAM). Esta memoria cubre la aplicación web del proyecto DAW: una landing page con autenticación de usuarios, sistema de reseñas y descarga del juego.

Frontend en Angular 21. Backend API REST en Spring Boot 3. Autenticación y base de datos de producción en Supabase (PostgreSQL).

---

## 2. Stack técnico

**Frontend**
- Angular 21 (standalone components, Signals API, control flow `@if`/`@for`)
- TypeScript 5.9
- Tailwind CSS v4 (generado con `@tailwindcss/cli`, no con PostCSS de Angular)
- GSAP 3 + ScrollTrigger para animaciones de scroll
- Supabase JS v2 para autenticación
- WebGL/GLSL shader en el hero (canvas fullscreen)

**Backend**
- Spring Boot 3.5 / Java 21
- Spring Data JPA + Hibernate
- H2 in-memory (entorno de desarrollo/demo)
- Supabase PostgreSQL configurado en `application.yml` para producción
- Spring Security (CSRF desactivado en desarrollo, CORS para localhost:4200)

**Base de datos**
- Tablas en Supabase: `profiles`, `reviews`, `comments`, `review_likes`, `downloads`
- En desarrollo: H2 auto-genera el esquema desde las entidades JPA y carga datos de prueba desde `data.sql`

---

## 3. Arquitectura

```
Navegador (Angular 21)
    │
    ├── Supabase Auth JS  →  supabase.co  (autenticación)
    │
    └── HttpClient  →  Spring Boot :8080  →  H2 / PostgreSQL
```

El frontend llama a Supabase directamente para login y registro. Para reseñas y comentarios llama al backend Spring Boot, que gestiona la lógica de negocio y persiste en base de datos.

---

## 4. Funcionalidades implementadas

### Autenticación
- Registro con email, contraseña y nombre de usuario (opcional)
- Inicio de sesión con email y contraseña
- Cierre de sesión
- Estado de sesión reactivo con Signals (`auth.user()`)
- Rutas protegidas: el formulario de reseñas solo se muestra si hay sesión activa

### Reseñas (CRUD completo)
- Listar todas las reseñas — `GET /api/reviews`
- Crear reseña con puntuación (1-5 estrellas) y texto — `POST /api/reviews`
- Editar reseña propia — `PUT /api/reviews/{id}`
- Eliminar reseña propia — `DELETE /api/reviews/{id}`
- Estadísticas (total + media) — `GET /api/reviews/stats`

### Comentarios (CRUD completo)
- Listar comentarios de una reseña — `GET /api/comments?reviewId={id}`
- Crear comentario — `POST /api/comments`
- Eliminar comentario propio — `DELETE /api/comments/{id}`

### Interfaz
- Landing page con secciones: hero, características del juego, reseñas, FAQ, contacto y footer
- Página de login (`/login`)
- Página de registro (`/registro`)
- Navbar fija con scroll detection
- Footer con navegación, redes sociales y copyright

---

## 5. API REST

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/reviews` | Lista todas las reseñas | No |
| GET | `/api/reviews/stats` | Total y media de puntuación | No |
| POST | `/api/reviews` | Crear reseña | Sí |
| PUT | `/api/reviews/{id}` | Editar reseña propia | Sí |
| DELETE | `/api/reviews/{id}` | Eliminar reseña propia | Sí |
| GET | `/api/comments` | Comentarios de una reseña | No |
| POST | `/api/comments` | Crear comentario | Sí |
| DELETE | `/api/comments/{id}` | Eliminar comentario propio | Sí |

La verificación de propiedad se hace en el servicio: el `userId` del body/header se compara con el `userId` almacenado en la entidad.

---

## 6. Modelo de datos (web)

### Review
```
id          UUID (generado automáticamente)
userId      String
userName    String
rating      Integer (1-5)
text        String
createdAt   LocalDateTime
updatedAt   LocalDateTime
```

### Comment
```
id          UUID
reviewId    String (FK hacia reviews.id)
userId      String
userName    String
text        String
createdAt   LocalDateTime
```

---

## 7. Estructura del proyecto

```
backend/
├── src/main/java/com/backrooms/lurking/
│   ├── controller/     ReviewController, CommentController
│   ├── service/        ReviewService, CommentService
│   ├── model/          Review, Comment
│   ├── repository/     ReviewRepository, CommentRepository
│   ├── dto/            ReviewRequest, CommentRequest
│   ├── config/         SecurityConfig, CorsConfig
│   └── exception/      GlobalExceptionHandler
└── src/main/resources/
    ├── application.yml
    └── data.sql         (4 reseñas + 2 comentarios de prueba)

frontend/
└── src/app/
    ├── services/        AuthService, ReviewService
    ├── sections/        hero, features, reviews, faq, contact, footer
    ├── components/      navbar, footer, button
    └── pages/           login, registro
```

---

## 8. Cómo arrancar

```bash
# Backend (puerto 8080)
cd backend
./mvnw spring-boot:run

# Frontend (puerto 4200)
cd frontend
npm run tw:watch   # terminal 1 — regenera Tailwind al cambiar componentes
ng serve           # terminal 2
```

Abrir `http://localhost:4200`.

---

## 9. Capturas de pantalla

Las capturas siguientes corresponden a la aplicación corriendo localmente con `ng serve` + `./mvnw spring-boot:run`.

**Captura 1 — Hero / landing principal**  
WebGL shader de pasillo Backrooms, título "ENTRA EN LAS BACKROOMS", subtítulo con texto de terminal y botón de descarga.

**Captura 2 — Características del juego**  
Grid de 4 tarjetas: Jugabilidad Inmersiva, Descarga Segura, Multijugador, Actualizaciones Frecuentes. Iconos Lucide en contenedor con borde dorado.

**Captura 3 — Sistema de reseñas**  
Formulario de reseña con selector de estrellas interactivo. Lista de reseñas cargadas desde el backend (H2), cada una con emoji según puntuación, nombre de usuario, fecha y texto.

**Captura 4 — Login**  
Formulario centrado con campos email y contraseña sobre fondo oscuro con el logo del juego.

**Captura 5 — Registro**  
Formulario con nombre (opcional), email y contraseña.

---

## 10. Estado actual y próximos pasos

Funciona ahora mismo:
- CRUD completo de reseñas y comentarios vía API REST
- Autenticación con Supabase (login, registro, sesión persistente entre recargas)
- Frontend con tema visual completo: WebGL shader, animaciones GSAP, navbar, hero, reseñas, FAQ, contacto y footer
- Backend arranca con datos de prueba en H2 sin configuración adicional

Pendiente para entregas siguientes:
- Migrar de H2 a Supabase PostgreSQL (necesaria la contraseña del proyecto Supabase)
- Validación JWT en el backend — la clave de Supabase es ECC P-256, hay que adaptar el parser
- Chatbot con Gemini (`/chatbot`)
- Página de descarga con el build del juego (408 MB en Supabase Storage)
- Tests unitarios e integración (JUnit 5 + Angular TestBed)
- Dockerfile para despliegue en producción
