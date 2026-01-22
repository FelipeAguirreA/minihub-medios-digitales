# MiniHub – Medios Digitales (MERN)

Proyecto fullstack tipo “agencia / integraciones” para gestionar **proyectos** y **leads**, con una landing pública y un dashboard privado.

El objetivo del proyecto es aprender y demostrar el uso del stack **MERN**, flujos de autenticación, consumo de API y comunicación frontend–backend.

---

## 🧱 Stack Tecnológico
- **Frontend Dashboard:** React + Vite
- **Backend API:** Node.js + Express
- **Base de Datos:** MongoDB
- **Autenticación:** JWT
- **Landing Pública:** HTML / CSS / JavaScript
- **Infra local:** Docker (MongoDB)

---

## ✨ Funcionalidades (MVP)
- Registro y login de usuarios (JWT)
- Creación y listado de proyectos
- Captura de leads desde landing pública
- Visualización de leads en dashboard
- Asociación de leads a proyectos
- Preparado para integraciones vía webhook (opcional)

---

## 📦 Requisitos Previos
- Node.js **v20 o superior**
- Docker Desktop
- Git
- Python (solo para levantar la landing con servidor simple)

---

## 🚀 Cómo levantar el proyecto (PASO A PASO)

### 1️⃣ Levantar MongoDB (Base de Datos)
Desde la **raíz del proyecto**:

```bash
docker compose up -d mongo 
```

Verificar que esté corriendo:

```bash
docker ps
```

Mongo queda disponible en:
```bash
mongodb://localhost:27017
```

### 2️⃣ Levantar Backend (API)
Ir a la carpeta del backend:
```bash
cd apps/api
npm install
npm run dev
```

Crear archivo de entorno:
```bash
apps/api/.env

env
PORT=4000
MONGO_URI=mongodb://localhost:27017/minihub
JWT_SECRET=super-secret-change-me
CORS_ORIGIN=http://localhost:5173
```

### 🔗 API disponible en:
```bash
Health check:
👉 http://localhost:4000/health
Auth:
👉 http://localhost:4000/api/auth
Projects:
👉 http://localhost:4000/api/projects
Leads:
👉 http://localhost:4000/api/leads
```
### 3️⃣ Levantar Dashboard (React)

Ir a la carpeta del dashboard:
```bash
cd apps/dashboard
npm install
npm run dev
```

Crear archivo de entorno:
```bash
apps/dashboard/.env

env
VITE_API_URL=http://localhost:4000
```

### 🔗 Dashboard disponible en:
http://localhost:5173

Desde aquí puedes:
```bash
Registrarte / loguearte
Crear proyectos
Ver proyectos
Ver leads
```

### 4️⃣ Levantar Landing Pública

Ir a la carpeta de la landing:
```bash
cd apps/web-landing
python -m http.server 8080
```

### 🔗 Landing disponible en:
http://localhost:8080

Desde la landing puedes:
```bash
Pegar un ProjectId
Enviar un lead público
Verlo reflejado en el dashboard
```
### 🔁 Flujo de uso (demo completa)
```bash
Entrar al dashboard → http://localhost:5173

Registrarse o iniciar sesión

Crear un proyecto y copiar su ProjectId

Entrar a la landing → http://localhost:8080

Pegar el ProjectId y enviar el formulario

Volver al dashboard → sección Leads

Ver el lead recibido
```
### 🧪 Testing rápido
API viva:
👉 http://localhost:4000/health
```bash
Dashboard conectado a API (sin errores CORS)

Lead enviado desde landing aparece en dashboard

### 🗂️ Estructura del proyecto

minihub-medios-digitales/
│
├── apps/
│   ├── api/           # Backend Express + Mongo
│   ├── dashboard/     # Frontend React (Vite)
│   └── web-landing/   # Landing HTML/CSS/JS
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

### 📌 Próximas mejoras
```bash
Logs de integraciones (webhooks)

Exportación CSV de leads

Roles de usuario (admin / editor)

Dockerización completa (API + Dashboard + Mongo)

Deploy en VPS
```

👤 Autor
Proyecto desarrollado con fines formativos y de portafolio.