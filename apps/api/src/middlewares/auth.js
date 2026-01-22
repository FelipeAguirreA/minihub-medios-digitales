// ====================
// MIDDLEWARE DE AUTENTICACIÓN
// ====================
// Este middleware protege rutas para que solo usuarios autenticados puedan acceder
import { verifyToken } from "../utils/jwt.js";

// Función que verifica si el usuario tiene un token válido
export function requireAuth(req, res, next) {
  // Obtener el header "Authorization" de la petición
  const header = req.headers.authorization || "";
  // El formato esperado es: "Bearer TOKEN_AQUI"
  const [type, token] = header.split(" ");

  // Si no es tipo Bearer o no hay token, rechazar
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verificar que el token sea válido
    const decoded = verifyToken(token);
    // Guardar los datos del usuario en req.user para usarlos en las rutas
    req.user = decoded;
    // Continuar con la siguiente función (la ruta)
    next();
  } catch {
    // Si el token es inválido o expiró, rechazar
    return res.status(401).json({ message: "Invalid token" });
  }
}
