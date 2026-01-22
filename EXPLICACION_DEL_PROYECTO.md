# 📚 Explicación del Proyecto MiniHub Medios Digitales

## 🎯 ¿Qué hace este proyecto?

**MiniHub** es un sistema para capturar y gestionar leads (contactos potenciales) de campañas de marketing digital. Está compuesto por:

1. **API Backend** (Node.js + Express + MongoDB)
2. **Dashboard Web** (React)
3. **Landing Pages** (HTML estático)

---

## 🔄 Flujo Completo del Sistema

```
┌─────────────────┐
│  Usuario Web    │
│  (Visitante)    │
└────────┬────────┘
         │
         │ 1. Visita la landing page
         ↓
┌─────────────────────────┐
│   Landing Page          │
│   (HTML + JavaScript)   │
└────────┬────────────────┘
         │
         │ 2. Llena el formulario
         │    (nombre, email, teléfono)
         ↓
┌─────────────────────────┐
│   API Backend           │
│   POST /api/leads       │
│                         │
│   • Valida datos        │
│   • Guarda en MongoDB   │
│   • Notifica webhook    │
└────────┬────────────────┘
         │
         │ 3. Lead guardado
         ↓
┌─────────────────────────┐
│   Base de Datos         │
│   MongoDB               │
│                         │
│   • Users               │
│   • Projects            │
│   • Leads               │
└────────┬────────────────┘
         │
         │ 4. Admin consulta
         ↓
┌─────────────────────────┐
│   Dashboard             │
│   (React)               │
│                         │
│   • Login/Registro      │
│   • Ver proyectos       │
│   • Ver leads           │
│   • Cambiar estados     │
└─────────────────────────┘
```

---

## 📂 Estructura del Código

### **1. Backend API** (`apps/api/`)

#### 🔧 **server.js** - Servidor Principal
- Configura Express
- Conecta a MongoDB
- Define las rutas principales
- Configura CORS (quién puede acceder a la API)

#### 🔐 **Autenticación**

**`utils/jwt.js`**
- `signToken()`: Crea tokens de autenticación (válidos por 7 días)
- `verifyToken()`: Verifica si un token es válido

**`middlewares/auth.js`**
- `requireAuth()`: Protege rutas para que solo usuarios autenticados puedan acceder
- Verifica que el header tenga formato: `Authorization: Bearer TOKEN`

#### 💾 **Modelos de Datos**

**`models/User.js`**
```javascript
{
  name: "Felipe",
  email: "felipe@test.com",
  passwordHash: "$2a$10$...", // Contraseña encriptada
  role: "admin",
  createdAt: "2024-01-20T...",
  updatedAt: "2024-01-20T..."
}
```

**`models/Project.js`**
```javascript
{
  name: "Campaña Facebook 2024",
  status: "en_progreso", // nuevo | en_progreso | pausado | cerrado
  webhookUrl: "https://hooks.zapier.com/...",
  createdAt: "2024-01-20T...",
  updatedAt: "2024-01-20T..."
}
```

**`models/Lead.js`**
```javascript
{
  projectId: "507f1f77bcf86cd799439011", // Referencia al proyecto
  name: "Juan Pérez",
  email: "juan@example.com",
  phone: "+34 666 555 444",
  message: "Quiero más información",
  source: "landing", // landing | facebook | google
  status: "nuevo", // nuevo | contactado | cerrado
  createdAt: "2024-01-20T...",
  updatedAt: "2024-01-20T..."
}
```

#### 🛣️ **Rutas de la API**

**`routes/auth.routes.js`** - Autenticación
```
POST /api/auth/register
  ↳ Crea un nuevo usuario
  ↳ Devuelve token JWT

POST /api/auth/login
  ↳ Verifica credenciales
  ↳ Devuelve token JWT
```

**`routes/projects.routes.js`** - Proyectos (requieren autenticación)
```
GET    /api/projects      → Lista todos los proyectos
POST   /api/projects      → Crea nuevo proyecto
PUT    /api/projects/:id  → Actualiza proyecto
DELETE /api/projects/:id  → Elimina proyecto
```

**`routes/leads.routes.js`** - Leads
```
POST  /api/leads           → Crea lead (público, desde landing)
GET   /api/leads           → Lista leads (requiere autenticación)
PATCH /api/leads/:id/status → Actualiza estado (requiere autenticación)
```

---

### **2. Dashboard Frontend** (`apps/dashboard/`)

#### ⚛️ **main.jsx** - Punto de Entrada
- Inicializa React
- Renderiza el componente `<App />`

#### 📱 **App.jsx** - Aplicación Principal

**Función auxiliar `apiFetch()`**
```javascript
// Simplifica las llamadas a la API
apiFetch("/api/projects", { 
  method: "POST", 
  body: { name: "Nuevo Proyecto" }, 
  token: "eyJhbGc..." 
})
```

**Componente `App`**
- Maneja el estado de autenticación (token)
- Alterna entre vista de Login y Proyectos
- Guarda el token en `localStorage`

**Componente `Login`**
- Formulario de registro/login
- Alterna entre ambos modos
- Al completar, guarda el token

**Componente `Projects`**
- Lista todos los proyectos
- Permite crear nuevos proyectos
- Muestra el ID de cada proyecto (para usar en landing pages)

---

## 🔐 Sistema de Autenticación (JWT)

### ¿Cómo funciona?

1. **Usuario se registra/inicia sesión**
   ```
   POST /api/auth/register
   { "name": "Felipe", "email": "felipe@test.com", "password": "123456" }
   ```

2. **API devuelve un token**
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": "507f1f77bcf86cd799439011",
       "name": "Felipe",
       "email": "felipe@test.com",
       "role": "admin"
     }
   }
   ```

3. **Frontend guarda el token**
   ```javascript
   localStorage.setItem("token", token)
   ```

4. **Para cada petición protegida, envía el token**
   ```javascript
   fetch("/api/projects", {
     headers: {
       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
   })
   ```

5. **Middleware verifica el token**
   - Si es válido → permite acceso
   - Si es inválido o expiró → rechaza con 401

---

## 🌐 Integración con Landing Pages

### Cómo enviar un lead desde una landing page:

```javascript
// Ejemplo de código para una landing page
const formulario = document.getElementById('contact-form');

formulario.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const lead = {
    projectId: "507f1f77bcf86cd799439011", // ID del proyecto (desde dashboard)
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    message: document.getElementById('message').value,
    source: "landing"
  };
  
  try {
    const response = await fetch("http://localhost:4000/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead)
    });
    
    if (response.ok) {
      alert("¡Gracias por contactarnos!");
    }
  } catch (error) {
    alert("Error al enviar el formulario");
  }
});
```

---

## 🔔 Sistema de Webhooks

Cuando un lead es creado, si el proyecto tiene configurado un `webhookUrl`, la API automáticamente envía una notificación:

```javascript
// Esto sucede automáticamente en el backend
if (project.webhookUrl) {
  fetch(project.webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: "lead.created",
      data: {
        name: "Juan Pérez",
        email: "juan@example.com",
        phone: "+34 666 555 444",
        message: "Quiero más información"
      }
    })
  });
}
```

**Usos comunes:**
- Enviar notificaciones a Slack
- Crear contactos en un CRM (Zapier, Make.com)
- Enviar emails automáticos
- Integraciones con herramientas de marketing

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Configurar Variables de Entorno

Crear archivo `.env` en `apps/api/`:
```env
MONGO_URI=mongodb://localhost:27017/minihub
JWT_SECRET=tu_clave_secreta_super_segura_123
PORT=4000
```

### 2. Instalar Dependencias

```bash
# Backend
cd apps/api
npm install

# Dashboard
cd apps/dashboard
npm install
```

### 3. Iniciar los Servicios

```bash
# Terminal 1: Backend
cd apps/api
npm run dev

# Terminal 2: Dashboard
cd apps/dashboard
npm run dev
```

### 4. Acceder a la Aplicación

- **API**: http://localhost:4000
- **Dashboard**: http://localhost:5173

---

## 📊 Casos de Uso

### **Caso 1: Agencia de Marketing Digital**
- Crean un proyecto por cada cliente
- Cada landing page envía leads al proyecto correspondiente
- El equipo ve todos los leads en el dashboard
- Marcan leads como "contactado" o "cerrado"

### **Caso 2: Empresa con Múltiples Campañas**
- Proyecto 1: Campaña Facebook Ads
- Proyecto 2: Campaña Google Ads
- Proyecto 3: Landing de Webinar
- Cada uno recibe leads independientes
- Dashboard unificado para ver todo

### **Caso 3: Automatización con Zapier**
1. Lead llena formulario → API crea lead
2. API notifica webhook de Zapier
3. Zapier envía email al equipo de ventas
4. Zapier crea contacto en CRM

---

## 🔧 Tecnologías Utilizadas

### Backend
- **Node.js**: Runtime de JavaScript
- **Express**: Framework web
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **bcryptjs**: Encriptación de contraseñas
- **jsonwebtoken**: Autenticación JWT
- **zod**: Validación de datos
- **cors**: Política de seguridad CORS

### Frontend
- **React**: Librería de UI
- **Vite**: Build tool y dev server
- **Fetch API**: Peticiones HTTP

---

## 🎓 Conceptos Clave Explicados

### **¿Qué es un JWT?**
JSON Web Token: un token encriptado que contiene información del usuario. Es como un "pase VIP" que demuestra que estás autenticado.

### **¿Qué es CORS?**
Cross-Origin Resource Sharing: política de seguridad que controla qué dominios pueden hacer peticiones a tu API.

### **¿Qué es un middleware?**
Función que se ejecuta antes de llegar a la ruta final. Ejemplo: verificar autenticación antes de permitir acceso.

### **¿Qué es populate en Mongoose?**
Traer datos relacionados automáticamente. Ejemplo: cuando obtienes un lead, también traer la información del proyecto.

### **¿Qué es un webhook?**
URL a la que se envía una notificación automática cuando ocurre un evento (como crear un lead).

---

## 🎯 Próximos Pasos para Mejorar

1. **Dashboard más completo**
   - Vista de leads con filtros
   - Estadísticas y gráficas
   - Editar/eliminar leads

2. **Validaciones**
   - Evitar emails duplicados en leads
   - Validar formato de teléfono

3. **Seguridad**
   - Rate limiting (limitar peticiones)
   - Validación más estricta de datos

4. **Funcionalidades**
   - Exportar leads a CSV
   - Asignar leads a usuarios
   - Sistema de notificaciones

5. **Deployment**
   - Subir API a Railway/Render
   - Subir Dashboard a Vercel/Netlify
   - MongoDB Atlas para base de datos en la nube

---

## 📝 Resumen del Flujo de Datos

```
Landing Page
    ↓ (POST)
API recibe lead
    ↓ (valida con zod)
Guarda en MongoDB
    ↓ (si hay webhook)
Notifica servicio externo
    ↓
Dashboard consulta leads
    ↓ (requiere JWT)
API verifica token
    ↓ (token válido)
Devuelve leads al Dashboard
```

---

