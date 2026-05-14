# Lurking In The Shadows — Aplicación Web

Aplicación web complementaria para el videojuego de terror **Lurking In The Shadows**, desarrollado en Unity y ambientado en las Backrooms.

🌐 **Web:** https://backrooms-ecru.vercel.app  
🔧 **API:** https://backrooms-33o0.onrender.com  
🎮 **Descarga:** https://backrooms-ecru.vercel.app/descarga

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 21 · TypeScript · Tailwind CSS v4 · GSAP 3 |
| Backend | Spring Boot 3.5 · Java 21 · Spring Security · JWT |
| Auth | Supabase Auth |
| Base de datos | H2 (dev) · PostgreSQL en Render (prod) |
| Hosting | Vercel (frontend) · Render (backend) |
| Email de contacto | Formspree |

---

## Requisitos locales

- **JDK 21**
- **Node.js 20+** y npm

---

## Arrancar en local

### 1. Backend (puerto 8080)
```bash
cd backend
./mvnw spring-boot:run
```
Arranca con H2 en memoria y datos de prueba. No necesita variables de entorno.

### 2. Frontend (puerto 4200)

En una terminal, compilar Tailwind en modo watch:
```bash
cd frontend
npm install
npm run tw:watch
```

En otra terminal, arrancar Angular:
```bash
cd frontend
ng serve
```

Abre **http://localhost:4200**

---

## Funcionalidades

### Autenticación
- Registro e inicio de sesión con Supabase Auth
- Verificación de email con redirección al origen correcto (`emailRedirectTo: window.location.origin`)
- Aceptación de términos obligatoria en el registro

### Reseñas y comentarios
- CRUD de reseñas con validación JWT
- CRUD completo de comentarios por reseña

### Leaderboard
- Ranking global de jugadores ordenado por menor tiempo de partida
- Pestañas por nivel: **Level 0 — Los Pasillos**, **Level 1**, **Level 2** y **Level 4 — Las Oficinas**
- Normalización automática de nombres de nivel en el frontend (`NIVEL_MAP` en `ScoreService`) para unificar variantes históricas en la base de datos
- Las puntuaciones se envían directamente desde el videojuego Unity al endpoint `POST /api/scores` con el JWT del jugador

### Formulario de contacto
- Formulario funcional integrado con **Formspree** (`https://formspree.io/f/mvzljpnl`)
- Campos: nombre, email, asunto y mensaje con validación reactiva
- Estados visuales: cargando → enviado con éxito / error con opción de reintentar

### Otras páginas
- Página de descarga del juego con links a Windows, macOS y Android (`/descarga`)
- Perfil de usuario (`/perfil`)
- Páginas legales: `/privacidad`, `/terminos`, `/cookies`, `/eula`
- Banner de cookies con persistencia en localStorage
- Demo web del juego (`/demo`)

---

## API REST

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `GET` | `/api/reviews` | — | Listar todas las reseñas |
| `POST` | `/api/reviews` | JWT | Crear reseña |
| `DELETE` | `/api/reviews/{id}` | JWT | Eliminar reseña propia |
| `GET` | `/api/reviews/{id}/comments` | — | Comentarios de una reseña |
| `POST` | `/api/reviews/{id}/comments` | JWT | Añadir comentario |
| `DELETE` | `/api/comments/{id}` | JWT | Eliminar comentario |
| `GET` | `/api/scores/leaderboard` | — | Ranking global por tiempo |
| `POST` | `/api/scores` | JWT | Guardar puntuación desde el juego |
| `DELETE` | `/api/scores/{id}` | Admin | Eliminar entrada (cabecera `X-Admin-Key`) |
| `PATCH` | `/api/scores/{id}/nivel` | Admin | Corregir nombre de nivel |
| `GET` | `/api/users/me` | JWT | Perfil del usuario autenticado |

---

## Despliegue

### Docker (local)
```bash
docker-compose up --build
```

### Producción
- **Frontend → Vercel:** importar repo, root `frontend`, build command y output directory configurados en `vercel.json`
- **Backend → Render:** Web Service con Dockerfile, root `backend`, perfil `prod` activo

---

## Estructura

```
├── backend/                   Spring Boot API REST
│   ├── src/main/
│   │   ├── controller/        Reviews, Comments, Scores, UserProfile, Download
│   │   ├── service/           Lógica de negocio
│   │   ├── model/             Review, Comment, Score, UserProfile
│   │   ├── repository/        Repositorios JPA
│   │   └── config/            JWT filter, CORS, Security, DataSeeder
│   ├── src/test/              Tests unitarios e integración (JUnit 5 + Mockito)
│   └── Dockerfile
├── frontend/                  Angular 21 SPA
│   ├── src/app/
│   │   ├── pages/             landing, login, registro, perfil, leaderboard,
│   │   │                      descarga, demo, legal
│   │   ├── sections/          hero, features, reviews, leaderboard, contact, faq
│   │   ├── services/          auth, supabase, review, comment, score
│   │   ├── components/        navbar, footer, cookie-banner
│   │   └── ui/                button, input, textarea, card, accordion
│   ├── src/environments/
│   ├── vercel.json
│   └── Dockerfile
└── docker-compose.yml
```
