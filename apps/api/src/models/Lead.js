// ====================
// MODELO DE LEAD
// ====================
// Un lead es un contacto potencial que llenó un formulario en una landing page
import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    // ID del proyecto al que pertenece este lead (relación con la tabla Project)
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // Referencia al modelo Project
      required: true,
    },
    // Datos del lead
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: "", trim: true },
    message: { type: String, default: "", trim: true },
    // De dónde vino el lead (landing, facebook, google, etc.)
    source: { type: String, default: "landing", trim: true },
    // Estado del seguimiento del lead
    status: {
      type: String,
      enum: ["nuevo", "contactado", "cerrado"],
      default: "nuevo",
    },
  },
  { timestamps: true }
);

export const Lead = mongoose.model("Lead", leadSchema);
