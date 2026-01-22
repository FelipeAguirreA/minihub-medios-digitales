// ====================
// RUTAS DE PROYECTOS
// ====================
// Permite crear, listar, editar y eliminar proyectos (campañas de marketing)
import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middlewares/auth.js";
import { Project } from "../models/Project.js";

export const projectsRouter = Router();
// Todas las rutas de proyectos requieren autenticación
projectsRouter.use(requireAuth);

// GET /api/projects - Listar todos los proyectos
projectsRouter.get("/", async (req, res) => {
  // Obtener todos los proyectos ordenados por fecha de creación (más recientes primero)
  const items = await Project.find().sort({ createdAt: -1 });
  res.json(items);
});

// Esquema de validación para crear/editar proyectos
const schema = z.object({
  name: z.string().min(2), // Nombre mínimo 2 caracteres
  status: z.enum(["nuevo", "en_progreso", "pausado", "cerrado"]).optional(),
  webhookUrl: z.string().url().optional().or(z.literal("")), // URL válida o vacía
});

// POST /api/projects - Crear un nuevo proyecto
projectsRouter.post("/", async (req, res) => {
  // Validar datos recibidos
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid body" });

  // Crear proyecto en la base de datos
  const created = await Project.create(parsed.data);
  res.status(201).json(created);
});

// PUT /api/projects/:id - Actualizar un proyecto existente
projectsRouter.put("/:id", async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid body" });

  // Buscar y actualizar el proyecto, devolver el documento actualizado
  const updated = await Project.findByIdAndUpdate(req.params.id, parsed.data, {
    new: true, // Devolver el documento actualizado
  });
  if (!updated) return res.status(404).json({ message: "Not found" });

  res.json(updated);
});

// DELETE /api/projects/:id - Eliminar un proyecto
projectsRouter.delete("/:id", async (req, res) => {
  const deleted = await Project.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.status(204).send(); // 204 = No Content (eliminado exitosamente)
});
