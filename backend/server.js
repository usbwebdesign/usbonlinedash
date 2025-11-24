import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🌐 Ruta 1: Obtener todos los usuarios
app.get("/api/users", async (req, res) => {
  try {
    const response = await axios.get("https://usbmexicoonline.neolms.com/api/v3/users?$limit=100", {
      headers: {
        "x-api-key": process.env.NEO_API_KEY, // 👈 este es el correcto según la doc
        "Accept": "application/json",
      },
    });

    res.json(response.data);

  } catch (error) {
    console.error("❌ Error en la API:", error.message);

    if (error.response) {
      console.log("🔎 Código:", error.response.status);
      console.log("📄 Respuesta completa:", error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      console.log("⚠️ No hubo respuesta del servidor NeoLMS");
      res.status(500).json({ error: "Sin respuesta del servidor NeoLMS" });
    } else {
      console.log("💥 Error en la configuración:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
});


// 🌐 Ruta 2: Obtener todos los estudiantes
app.get("/api/students", async (req, res) => {
  try {
    const response = await axios.get("https://usbmexicoonline.neolms.com/api/v3/users?$filter={\"roles\":\"Student\"}&$limit=100", {
      headers: {
        "x-api-key": process.env.NEO_API_KEY,
        "Accept": "application/json",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error en la API (Students):", error.message);

    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// 🌐 Ruta 3: Obtener todos los docentes
app.get("/api/docentes", async (req, res) => {
  try {
    const response = await axios.get("https://usbmexicoonline.neolms.com/api/v3/users?$filter={\"roles\":\"Teacher\"}&$limit=100", {
      headers: {
        "x-api-key": process.env.NEO_API_KEY,
        "Accept": "application/json",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error en la API (Docentes):", error.message);

    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});



// 🌐 Ruta 4: Obtener todas las clases activas
app.get("/api/active-classes", async (req, res) => {
  try {
    const response = await axios.get("https://usbmexicoonline.neolms.com/api/v3/classes?$filter={\"archived\":false}&$limit=100", {
      headers: {
        "x-api-key": process.env.NEO_API_KEY,
        "Accept": "application/json",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error en la API (classes):", error.message);

    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// 🌐 Ruta 5: Obtener todos los grupos
app.get("/api/groups", async (req, res) => {
  try {
    const response = await axios.get("https://usbmexicoonline.neolms.com/api/v3/groups", {
      headers: {
        "x-api-key": process.env.NEO_API_KEY,
        "Accept": "application/json",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error en la API (Gropus):", error.message);

    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});


//OBTENER LAS SESIONES DE LOS ESTUDIANTES

app.get("/api/student-sessions", async (req, res) => {
  try {
    // 1️⃣ Obtener lista de estudiantes
    const usersResponse = await axios.get(
      `https://usbmexicoonline.neolms.com/api/v3/users?$filter={"roles":"Student"}&$limit=100`,
      {
        headers: {
          "x-api-key": process.env.NEO_API_KEY,
          "Accept": "application/json",
        },
      }
    );

    const estudiantes = usersResponse.data;
    const resultados = [];

    // 2️⃣ Recorrer los estudiantes uno por uno
    for (let i = 0; i < estudiantes.length; i++) {
      const est = estudiantes[i];

      // 3️⃣ Obtener las sesiones de ese estudiante
      const sesionesResponse = await axios.get(
        `https://usbmexicoonline.neolms.com/api/v3/users/${est.id}/sessions`,
        {
          headers: {
            "x-api-key": process.env.NEO_API_KEY,
            "Accept": "application/json",
          },
        }
      );

      const sesiones = sesionesResponse.data;

      // 💬 4️⃣ Si tiene sesiones, mostramos la última formateada
      if (sesiones.length > 0) {
        const ultima = sesiones[sesiones.length - 1];

        // ✅ Convertimos las fechas a objetos Date
        const inicio = new Date(ultima.login_at);
        const fin = new Date(ultima.logout_at);

        // ✅ Formateamos fecha y hora en español (ej: 11/08/2025, 4:00 p. m.)
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

        // ✅ Calculamos duración en milisegundos → horas/minutos
        const duracionMs = fin - inicio;
        const duracionMin = Math.floor(duracionMs / 60000);
        const horas = Math.floor(duracionMin / 60);
        const minutos = duracionMin % 60;

        let textoDuracion = "";
        if (horas > 0) textoDuracion += `${horas} hora${horas > 1 ? "s" : ""}`;
        if (minutos > 0)
          textoDuracion += `${horas > 0 ? " y " : ""}${minutos} minuto${
            minutos > 1 ? "s" : ""
          }`;

        // 🖨️ Mostrar en consola
        console.log(`🧑 ${est.name}`);
        console.log(
          `🕓 Inicio sesión: ${formatoFecha(inicio)}, Hora: ${formatoHora(
            inicio
          )}`
        );
        console.log(
          `🏁 Fin de la sesión: ${formatoFecha(fin)}, Hora: ${formatoHora(fin)}`
        );
        console.log(`⏱️ Duración de la sesión: ${textoDuracion}`);
        console.log("------------------------------------------------------");

        // Guardar también en el arreglo para el front
        resultados.push({
           nombre: `${est.first_name} ${est.last_name}`, // ✅ CORRECTO
          id: est.id,
          inicio: formatoFecha(inicio) + " " + formatoHora(inicio),
          fin: formatoFecha(fin) + " " + formatoHora(fin),
          duracion: textoDuracion,
        });
      } else {
        console.log(`🧑 ${est.name} nunca ha iniciado sesión.`);
        console.log("------------------------------------------------------");

        resultados.push({
           nombre: `${est.first_name} ${est.last_name}`, // ✅ CORRECTO
          id: est.id,
          inicio: null,
          fin: null,
          duracion: "Sin sesión registrada",
        });
      }
    }

    // 5️⃣ Enviar todos los resultados
    res.json(resultados);
  } catch (error) {
    console.error("Error al obtener sesiones:", error);
    res.status(500).json({ error: "Error al obtener sesiones de estudiantes" });
  }
});






//Iniciar el servidor
const PORT = 5000;
console.log("🔑 API KEY (desde .env):", process.env.NEO_API_KEY);

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
