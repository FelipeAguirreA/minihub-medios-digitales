// ====================
// MODELO DE PROYECTO
// ====================
// Un proyecto es una campaña o sitio web que puede recibir leads
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    // Nombre del proyecto
    name: { type: String, required: true, trim: true },
    // Estado del proyecto (en qué fase está)
    status: {
      type: String,
      enum: ["nuevo", "en_progreso", "pausado", "cerrado"],
      default: "nuevo",
    },
    // URL del webhook: si se configura, se notificará automáticamente cuando llegue un lead
    webhookUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
