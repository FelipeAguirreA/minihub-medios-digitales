// ====================
// UTILIDADES PARA JWT (JSON Web Tokens)
// ====================
// JWT se usa para crear tokens de autenticación que identifican al usuario
import jwt from "jsonwebtoken";

// Función para crear (firmar) un token nuevo
// Recibe datos del usuario (payload) y genera un token que expira en 7 días
export function signToken(payload) {
  // Obtener la clave secreta desde variables de entorno
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET");
  // Crear token que expira en 7 días
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

// Función para verificar si un token es válido
// Si el token es válido, devuelve los datos (payload) que contiene
// Si es inválido o expiró, lanza un error
export function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET");
  return jwt.verify(token, secret);
}
