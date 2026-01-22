// ====================
// RUTAS DE AUTENTICACIÓN
// ====================
// Maneja el registro y login de usuarios
import { Router } from "express";
import bcrypt from "bcryptjs"; // Para encriptar contraseñas
import { z } from "zod"; // Para validar datos de entrada
import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";

export const authRouter = Router();

// ====================
// REGISTRO DE USUARIO
// ====================
// Definir el esquema de validación para registro
const registerSchema = z.object({
  name: z.string().min(2), // Nombre mínimo 2 caracteres
  email: z.string().email(), // Debe ser un email válido
  password: z.string().min(6), // Contraseña mínimo 6 caracteres
});

// POST /api/auth/register - Crear un nuevo usuario
authRouter.post("/register", async (req, res) => {
  // Validar que los datos recibidos cumplan con el esquema
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success)
    return res
      .status(400)
      .json({ message: "Invalid body", errors: parsed.error.issues });

  const { name, email, password } = parsed.data;

  // Verificar si ya existe un usuario con ese email
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already registered" });

  // Encriptar la contraseña (nunca guardar en texto plano)
  const passwordHash = await bcrypt.hash(password, 10);
  // Crear el usuario en la base de datos
  const user = await User.create({ name, email, passwordHash, role: "admin" });

  // Crear un token JWT para que el usuario quede autenticado
  const token = signToken({
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
  });

  // Devolver el token y los datos del usuario (sin la contraseña)
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// ====================
// LOGIN DE USUARIO
// ====================
// Esquema de validación para login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /api/auth/login - Iniciar sesión
authRouter.post("/login", async (req, res) => {
  // Validar datos recibidos
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid body" });

  const { email, password } = parsed.data;

  // Buscar usuario por email
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  // Verificar que la contraseña sea correcta
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  // Crear token JWT
  const token = signToken({
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
  });

  // Devolver token y datos del usuario
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});
