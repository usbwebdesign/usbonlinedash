import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const PromedioConexiones = () => {
  const [data, setData] = useState<{ hora: number; total: number }[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/teacher-sessions")
      .then((res) => res.json())
      .then((sessions) => {
        const horas = Array.from({ length: 24 }, (_, i) => ({
          hora: i,
          total: 0,
        }));

        sessions.forEach((s: any) => {
          if (!s.inicio) return;
          const match = s.inicio.match(
            /(\d{1,2}):(\d{2})\s*(a\.m\.|p\.m\.)/i
          );
          if (match) {
            let hora = parseInt(match[1]);
            const periodo = match[3].toLowerCase();
            if (periodo === "p.m." && hora !== 12) hora += 12;
            if (periodo === "a.m." && hora === 12) hora = 0;
            horas[hora].total += 1;
          }
        });

        setData(horas);
      })
      .catch((err) => console.error("Error cargando sesiones:", err));
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "750px",
        margin: "2rem auto",
        backgroundColor: "#0f172a", // 🌑 Fondo negro azulado
        color: "#f9fafb", // Texto blanco
        borderRadius: "16px",
        padding: "1.5rem",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "1rem",
          fontSize: "1.25rem",
          color: "#f9fafb",
          fontWeight: "600",
        }}
      >
        Promedio de Conexiones de docentes por Hora
      </h2>

      <div style={{ width: "100%", height: "350px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="hora"
              tickFormatter={(h) => `${h}:00`}
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
              axisLine={{ stroke: "#334155" }}
            />
            <YAxis
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
              axisLine={{ stroke: "#334155" }}
              label={{
                value: "Docentes",
                angle: -90,
                position: "insideLeft",
                fill: "#cbd5e1",
                fontSize: 12,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(30, 41, 59, 0.9)",
                borderRadius: "8px",
                border: "1px solid #475569",
                color: "#f9fafb",
              }}
              labelFormatter={(h) => `Hora ${h}:00 Hrs`}
              formatter={(v) => [`${v} Docentes`, "Cantidad de Conexiones"]}
            />
            <Bar
            width={30}
              dataKey="total"
              fill="#27F2F5"
              radius={[6, 6, 0, 0]}
               barSize={80} // 👈 aumenta o reduce el grosor aquí
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PromedioConexiones;
