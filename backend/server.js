import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import Bottleneck from "bottleneck";

dotenv.config();

/* =========================
   CONFIGURACIÓN BASE
========================= */

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const NEO_API = "https://usbmexicoonline.neolms.com/api/v3";

if (!process.env.NEO_API_KEY) {
  console.error("❌ NEO_API_KEY no definida");
}

/* =========================
   RATE LIMIT (NEO)
========================= */

const limiter = new Bottleneck({
  minTime: 350,
  maxConcurrent: 1,
});

const axiosLimited = (config) =>
  limiter.schedule(() =>
    axios({
      ...config,
      headers: {
        "x-api-key": process.env.NEO_API_KEY,
        Accept: "application/json",
        ...(config.headers || {}),
      },
    })
  );

/* =========================
   CACHE SIMPLE
========================= */

let cacheSesionesEstudiantes = null;
let cacheSesionesEstudiantesTimestamp = 0;

let cacheSesionesDocentes = null;
let cacheSesionesDocentesTimestamp = 0;

const CACHE_TTL = 5 * 60 * 1000;

/* =========================
   HELPERS
========================= */

const formatoFecha = (fecha) =>
  fecha.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const formatoHora = (fecha) =>
  fecha.toLocaleTimeString("es-MX", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

function calcularDuracion(inicio, fin) {
  if (!fin) return "En curso";
  const duracionMin = Math.floor((fin - inicio) / 60000);
  const h = Math.floor(duracionMin / 60);
  const m = duracionMin % 60;
  let txt = "";
  if (h > 0) txt += `${h} hora${h > 1 ? "s" : ""}`;
  if (m > 0) txt += `${h > 0 ? " y " : ""}${m} minuto${m > 1 ? "s" : ""}`;
  return txt || "0 minutos";
}

/* =========================
   RUTAS BÁSICAS
========================= */

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/api/users", async (_, res) => {
  try {
    const r = await axiosLimited({ method: "GET", url: `${NEO_API}/users?$limit=100` });
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/students", async (_, res) => {
  try {
    const r = await axiosLimited({
      method: "GET",
      url: `${NEO_API}/users?$filter={"roles":"Student"}&$limit=100`,
    });
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/students/:id", async (req, res) => {
  try {
    const r = await axiosLimited({
      method: "GET",
      url: `${NEO_API}/users/${req.params.id}`,
    });
    res.json(r.data);
  } catch {
    res.status(404).json({ error: "Estudiante no encontrado" });
  }
});

app.get("/api/docentes", async (_, res) => {
  try {
    const r = await axiosLimited({
      method: "GET",
      url: `${NEO_API}/users?$filter={"roles":"Teacher"}&$limit=100`,
    });
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/groups", async (_, res) => {
  try {
    const r = await axiosLimited({ method: "GET", url: `${NEO_API}/groups` });
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/active-classes", async (_, res) => {
  try {
    const r = await axiosLimited({
      method: "GET",
      url: `${NEO_API}/classes?$filter={"archived":false}&$limit=100`,
    });
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* =========================
   SESIONES ESTUDIANTES
========================= */

app.get("/api/student-sessions", async (_, res) => {
  const now = Date.now();
  if (cacheSesionesEstudiantes && now - cacheSesionesEstudiantesTimestamp < CACHE_TTL) {
    return res.json(cacheSesionesEstudiantes);
  }

  try {
    const users = await axiosLimited({
      method: "GET",
      url: `${NEO_API}/users?$filter={"roles":"Student"}&$limit=100`,
    });

    const resultados = [];

    for (const u of users.data) {
      const s = await axiosLimited({
        method: "GET",
        url: `${NEO_API}/users/${u.id}/sessions`,
      });

      if (!s.data.length) {
        resultados.push({
          id: u.id,
          nombre: `${u.first_name} ${u.last_name}`,
          inicio: null,
          fin: null,
          duracion: "Sin sesión registrada",
        });
        continue;
      }

      const ultima = s.data[s.data.length - 1];
      const inicio = new Date(ultima.login_at);
      const fin = ultima.logout_at ? new Date(ultima.logout_at) : null;

      resultados.push({
        id: u.id,
        nombre: `${u.first_name} ${u.last_name}`,
        inicio: `${formatoFecha(inicio)} ${formatoHora(inicio)}`,
        fin: fin ? `${formatoFecha(fin)} ${formatoHora(fin)}` : "Sesión activa",
        duracion: calcularDuracion(inicio, fin),
      });
    }

    cacheSesionesEstudiantes = resultados;
    cacheSesionesEstudiantesTimestamp = Date.now();
    res.json(resultados);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* =========================
   SESIONES POR USUARIO
========================= */

app.get("/api/users/:id/sessions", async (req, res) => {
  try {
    const s = await axiosLimited({
      method: "GET",
      url: `${NEO_API}/users/${req.params.id}/sessions`,
    });

    if (!s.data.length) {
      return res.json({ total_sesiones: 0, ultima_sesion: null });
    }

    const ultima = s.data[s.data.length - 1];
    const inicio = new Date(ultima.login_at);
    const fin = ultima.logout_at ? new Date(ultima.logout_at) : null;

    res.json({
      total_sesiones: s.data.length,
      ultima_sesion: {
        inicio: `${formatoFecha(inicio)} ${formatoHora(inicio)}`,
        fin: fin ? `${formatoFecha(fin)} ${formatoHora(fin)}` : "Sesión activa",
        duracion: calcularDuracion(inicio, fin),
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* =========================
   CLASES ACTIVAS
========================= */

app.get("/api/users/:id/active-classes", async (req, res) => {
  try {
    const classes = await axiosLimited({
      method: "GET",
      url: `${NEO_API}/users/${req.params.id}/class_students?$include=class`,
    });

    const active = classes.data
      .filter((c) => c.class && !c.class.archived)
      .map((c) => ({ class_id: c.class.id, class_name: c.class.name }));

    res.json({
      student_id: req.params.id,
      active_classes_count: active.length,
      active_classes: active,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* =========================
   ASSIGNMENTS
========================= */

app.get("/api/classes/:idClase/assignments", async (req, res) => {
  try {
    const r = await axiosLimited({
      method: "GET",
      url: `${NEO_API}/classes/${req.params.idClase}/assignments`,
    });
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/assignment-grades/:id", async (req, res) => {
  try {
    const r = await axiosLimited({
      method: "GET",
      url: `${NEO_API}/users/${req.params.id}/assignment_grades`,
    });

    res.json({
      totalTareas: r.data.length,
      tareasCompletadas: r.data.filter((t) => !t.missing).length,
      tareasFaltantes: r.data.filter((t) => t.missing).length,
      detalles: r.data,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(`🚀 Server listo en puerto ${PORT}`);
});
