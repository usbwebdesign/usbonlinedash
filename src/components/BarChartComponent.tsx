import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BarChartProps {
  teachers: number;
  students: number;
  organizations: number;
}

const BarChartComponent: React.FC<BarChartProps> = ({
  teachers,
  students,
  organizations,
}) => {
  const data = [
    { name: "Docentes", value: teachers },
    { name: "Estudiantes", value: students },
    { name: "Organizaciones", value: organizations },
  ];

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="name"
            stroke="#aaa"
            tick={{ fill: "#ccc" }}
            axisLine={{ stroke: "#444" }}
          />
          <YAxis stroke="#aaa" tick={{ fill: "#ccc" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(20, 30, 50, 0.9)",
              border: "none",
              color: "#fff",
            }}
          />
          <Bar dataKey="value" fill="#4c9aff" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
