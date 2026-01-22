// ====================
// MODELO DE USUARIO
// ====================
// Define cómo se ve un usuario en la base de datos MongoDB
import mongoose from "mongoose";

// Esquema del usuario: define los campos y sus reglas
const userSchema = new mongoose.Schema(
  {
    // Nombre del usuario
    name: { type: String, required: true, trim: true },
    // Email (debe ser único, en minúsculas)
    email: {
      type: String,
      required: true,
      unique: true, // No puede haber dos usuarios con el mismo email
      lowercase: true, // Convertir a minúsculas automáticamente
      trim: true, // Quitar espacios al inicio y final
    },
    // Contraseña encriptada (nunca guardamos la contraseña en texto plano)
    passwordHash: { type: String, required: true },
    // Rol del usuario: admin o editor
    role: { type: String, enum: ["admin", "editor"], default: "admin" },
  },
  // timestamps: true agrega automáticamente createdAt y updatedAt
  { timestamps: true }
);

// Exportar el modelo para usarlo en otras partes del código
export const User = mongoose.model("User", userSchema);
