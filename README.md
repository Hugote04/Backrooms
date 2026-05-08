# Lurking In The Shadows — Aplicación Web

Aplicación web complementaria para el videojuego de terror **Lurking In The Shadows**, desarrollado en Unity y ambientado en las Backrooms.

🌐 **Web:** https://backrooms-ecru.vercel.app  
🔧 **API:** https://backrooms-33o0.onrender.com

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 21 · TypeScript · Tailwind CSS v4 · GSAP 3 |
| Backend | Spring Boot 3.5 · Java 21 · Spring Security · JWT |
| Auth | Supabase Auth |
| Base de datos | H2 (dev) · PostgreSQL en Render (prod) |
| Hosting | Vercel (frontend) · Render (backend) |

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

- Registro e inicio de sesión (Supabase Auth) con aceptación de términos
- CRUD de reseñas: crear, listar y eliminar con validación JWT (**edición (PUT) pendiente de implementar**)
- CRUD completo de comentarios por reseña
- Página de descarga del juego (`/descarga`)
- Perfil de usuario (`/perfil`)
- Páginas legales: `/privacidad`, `/terminos`, `/cookies`, `/eula`
- Banner de cookies con persistencia en localStorage
- Validaciones en backend (Jakarta Validation) y frontend (Angular Reactive Forms)

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
├── backend/          Spring Boot API REST
│   ├── src/main/     Controladores, servicios, modelos, config JWT/CORS
│   ├── src/test/     Tests unitarios e integración (JUnit 5 + Mockito)
│   └── Dockerfile
├── frontend/         Angular 21 SPA
│   ├── src/app/      Componentes, páginas, servicios, secciones
│   ├── src/environments/
│   ├── vercel.json
│   └── Dockerfile
└── docker-compose.yml
```
