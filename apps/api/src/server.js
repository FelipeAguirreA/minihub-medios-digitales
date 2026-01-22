// ====================
// IMPORTACIONES
// ====================
// Express: Framework para crear el servidor web
import express from "express";
// CORS: Permite que el frontend (en otro puerto) haga peticiones a la API
import cors from "cors";
// Mongoose: Librería para conectarse y trabajar con MongoDB
import mongoose from "mongoose";
// Dotenv: Lee las variables de entorno del archivo .env
import dotenv from "dotenv";
// Rutas: Importamos los diferentes módulos de rutas
import { authRouter } from "./routes/auth.routes.js";
import { projectsRouter } from "./routes/projects.routes.js";
import { leadsRouter } from "./routes/leads.routes.js";

// Cargar variables de entorno (MONGO_URI, JWT_SECRET, etc.)
dotenv.config();

// Crear la aplicación de Express
const app = express();
// Middleware para que Express pueda leer JSON en las peticiones
app.use(express.json());


// ====================
// CONFIGURACIÓN DE CORS
// ====================
// Lista de orígenes permitidos (URLs desde donde pueden hacer peticiones a la API)
const allowedOrigins = [
  "http://localhost:5173", // dashboard (React con Vite)
  "http://localhost:8080", // landing con python
  "http://localhost:5500", // landing con Live Server
  "http://127.0.0.1:5500"
];

// Configurar CORS para permitir solo ciertas URLs
app.use(
  cors({
    origin: (origin, cb) => {
      // Si no hay origin (ej: Postman/Thunder Client), lo dejamos pasar
      if (!origin) return cb(null, true);
      // Si el origin está en la lista de permitidos, lo dejamos pasar
      if (allowedOrigins.includes(origin)) return cb(null, true);
// ====================
// RUTAS DE LA API
// ====================
// Ruta de salud: para verificar que el servidor está funcionando
app.get("/health", (req, res) => res.json({ ok: true }));

// Registrar rutas de autenticación (login, register)
app.use("/api/auth", authRouter);
// Registrar rutas de proyectos (crear, listar, editar, eliminar)
app.use("/api/projects", projectsRouter);
// Registrar rutas de leads (crear desde landing, listar en dashboard)
app.use("/api/leads", leadsRouter);

// ====================
// CONFIGURACIÓN DEL SERVIDOR
// ====================
// Usar el puerto desde variable de entorno o 4000 por defecto
const PORT = process.env.PORT || 4000;
// Obtener la URL de conexión a MongoDB desde las variables de entorno
const MONGO_URI = process.env.MONGO_URI;

// ====================
// INICIAR SERVIDOR
// ====================
// Conectar a MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Mongo connected");
    // Si la conexión es exitosa, iniciar el servidor Express
    app.listen(PORT, () =>
      console.log(`API running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    // Si hay error en la conexión, mostrar error y terminar
  console.error("Missing MONGO_URI env var");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Mongo connected");
    app.listen(PORT, () =>
      console.log(`API running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Mongo connection error:", err);
    process.exit(1);
  });
