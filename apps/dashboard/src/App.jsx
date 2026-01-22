// ====================
// DASHBOARD DE MINIHUB
// ====================
// Aplicación React para administrar proyectos y leads
import { useEffect, useState } from "react";

// Obtener la URL de la API desde las variables de entorno
const API = import.meta.env.VITE_API_URL;

// ====================
// FUNCIÓN AUXILIAR PARA HACER PETICIONES A LA API
// ====================
// Esta función simplifica las llamadas fetch a la API
function apiFetch(path, { method = "GET", body, token } = {}) {
  return fetch(`${API}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      // Si hay token, agregarlo al header Authorization
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    // Convertir el body a JSON si existe
    body: body ? JSON.stringify(body) : undefined
  }).then(async (res) => {
    // Intentar parsear la respuesta como JSON
    const data = await res.json().catch(() => ({}));
    // Si la respuesta no es exitosa (status 200-299), lanzar error
    if (!res.ok) throw new Error(data.message || "API error");
    return data;
  });
}

// ====================
// COMPONENTE PRINCIPAL DE LA APLICACIÓN
// ====================
export default function App() {
  // Estado: token de autenticación (guardado en localStorage)
  const [token, setToken] = useState(localStorage.getItem("token"));
  // Estado: vista actual ("login" o "projects")
  const [view, setView] = useState(token ? "projects" : "login");

  // Efecto: sincronizar token con localStorage y cambiar vista
  useEffect(() => {
    if (token) {
      // Si hay token, guardarlo y mostrar vista de proyectos
      localStorage.setItem("token", token);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setView("projects");
    } else {
      // Si no hay token, borrarlo y mostrar vista de login
      localStorage.removeItem("token");
      setView("login");
    }
  }, [token]);

  return (
    <div style={{ fontFamily: "system-ui", padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2>MiniHub Dashboard</h2>

      {/* Navegación (solo visible si hay token) */}
      {token && (
        <div style={{ marginBottom: 16 }}>
          <button onClick={() => setView("projects")}>Projects</button>{" "}
          <button onClick={() => setToken(null)}>Logout</button>
        </div>
      )}

      {/* Renderizar el componente según la vista actual */}
      {view === "login" && <Login onLogin={setToken} />}
      {view === "projects" && <Projects token={token} />}
    </div>
  );
}

// ====================
// COMPONENTE DE LOGIN/REGISTRO
// ====================
function Login({ onLogin }) {
  // Estado: alternar entre registro y login
  const [isRegister, setIsRegister] = useState(true);
  // Estados del formulario (con valores por defecto para desarrollo)
  const [name, setName] = useState("Felipe");
  const [email, setEmail] = useState("felipe@test.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  // Función para enviar el formulario
  async function submit(e) {
    e.preventDefault(); // Evitar que la página se recargue
    setError("");

    try {
      // Llamar a la API de registro o login según el modo
      const data = await apiFetch(
        isRegister ? "/api/auth/register" : "/api/auth/login",
        {
          method: "POST",
          body: isRegister ? { name, email, password } : { email, password }
        }
      );
      // Si es exitoso, guardar el token (esto actualizará el componente App)
      onLogin(data.token);
    } catch (err) {
      // Si hay error, mostrarlo
      setError(err.message);
    }
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
      <h3>{isRegister ? "Registro" : "Login"}</h3>

      <form onSubmit={submit}>
        {/* Campo de nombre (solo en modo registro) */}
        {isRegister && (
          <input
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <br />

        {/* Campo de email */}
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />

        {/* Campo de contraseña */}
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />

        <button type="submit">
          {isRegister ? "Registrarse" : "Entrar"}
        </button>
      </form>

      {/* Mostrar error si existe */}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {/* Botón para cambiar entre Login y Registro */}
      <button onClick={() => setIsRegister(!isRegister)}>
        Cambiar a {isRegister ? "Login" : "Registro"}
      </button>
    </div>
  );
}

// ====================
// COMPONENTE DE GESTIÓN DE PROYECTOS
// ====================
function Projects({ token }) {
  // Estado: lista de proyectos
  const [projects, setProjects] = useState([]);
  // Estado: nombre del nuevo proyecto a crear
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // Función para cargar la lista de proyectos desde la API
  async function load() {
    try {
      const data = await apiFetch("/api/projects", { token });
      setProjects(data);
    } catch (err) {
      setError(err.message);
    }
  }

  // Función para crear un nuevo proyecto
  async function create() {
    if (!name) return; // No hacer nada si el campo está vacío
    try {
      await apiFetch("/api/projects", {
        method: "POST",
        body: { name },
        token
      });
      setName(""); // Limpiar el campo
      load(); // Recargar la lista
    } catch (err) {
      setError(err.message);
    }
  }

  // Efecto: cargar proyectos al montar el componente
  useEffect(() => {
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h3>Projects</h3>

      {/* Formulario para crear nuevo proyecto */}
      <input
        placeholder="Nombre del proyecto"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={create}>Crear</button>

      {/* Mostrar error si existe */}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {/* Lista de proyectos */}
      <ul>
        {projects.map((p) => (
          <li key={p._id}>
            {p.name} — <code>{p._id}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}
