// ====================
// RUTAS DE LEADS
// ====================
// Maneja la creación de leads desde landing pages y su gestión en el dashboard
import { Router } from "express";
import { z } from "zod";
import { Lead } from "../models/Lead.js";
import { Project } from "../models/Project.js";
import { requireAuth } from "../middlewares/auth.js";

export const leadsRouter = Router();

// ====================
// RUTA PÚBLICA: CREAR LEAD DESDE LANDING
// ====================
// Esquema de validación para leads que vienen de landing pages
const publicLeadSchema = z.object({
  projectId: z.string().min(1), // ID del proyecto al que pertenece
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(), // De dónde viene (landing, facebook, etc.)
});

// POST /api/leads - Crear un nuevo lead (ruta pública, no requiere autenticación)
leadsRouter.post("/", async (req, res) => {
  // Validar datos recibidos
  const parsed = publicLeadSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid body" });

  const { projectId, ...rest } = parsed.data;

  // Verificar que el proyecto exista
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: "Project not found" });

  // Crear el lead en la base de datos
  const lead = await Lead.create({
    projectId: project._id,
    name: rest.name,
    email: rest.email,
    phone: rest.phone || "",
    message: rest.message || "",
    source: rest.source || "landing",
  });

  // ====================
  // INTEGRACIÓN: NOTIFICAR WEBHOOK
  // ====================
  // Si el proyecto tiene configurado un webhook, enviar notificación
  if (project.webhookUrl) {
    try {
      await fetch(project.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "lead.created", data: lead }),
      });
    } catch {
      // Si falla el webhook, no afecta la creación del lead
    }
  }

  // Devolver confirmación de que el lead fue creado
  res.status(201).json({ ok: true, leadId: lead._id });
});

// ====================
// RUTAS PRIVADAS: GESTIÓN DE LEADS EN DASHBOARD
// ====================
// GET /api/leads - Listar leads (requiere autenticación)
leadsRouter.get("/", requireAuth, async (req, res) => {
  // Obtener parámetros opcionales de filtrado
  const { projectId, status } = req.query;

  // Construir filtro dinámico
  const filter = {};
  if (projectId) filter.projectId = projectId; // Filtrar por proyecto
  if (status) filter.status = status; // Filtrar por estado

  // Buscar leads con el filtro aplicado
  const items = await Lead.find(filter)
    .populate("projectId") // Incluir datos del proyecto relacionado
    .sort({ createdAt: -1 }) // Más recientes primero
    .limit(200); // Máximo 200 resultados

  res.json(items);
});

// Esquema para actualizar el estado de un lead
const statusSchema = z.object({ status: z.enum(["nuevo", "contactado", "cerrado"]) });

// PATCH /api/leads/:id/status - Actualizar el estado de un lead
leadsRouter.patch("/:id/status", requireAuth, async (req, res) => {
  // Validar el nuevo estado
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid body" });

  // Actualizar solo el campo status
  const updated = await Lead.findByIdAndUpdate(
    req.params.id,
    { status: parsed.data.status },
    { new: true } // Devolver el documento actualizado
  );

  if (!updated) return res.status(404).json({ message: "Not found" });

  res.json(updated);
});
