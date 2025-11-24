import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Lun", logins: 10 },
  { day: "Mar", logins: 15 },
  { day: "Mié", logins: 8 },
  { day: "Jue", logins: 20 },
  { day: "Vie", logins: 18 },
  { day: "Sáb", logins: 12 },
  { day: "Dom", logins: 9 },
];

const LoginAverageChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2b43" />
        <XAxis dataKey="day" stroke="#e9e9e9ff" fontSize={16} />
        <YAxis stroke="#e8e8e8ff" fontSize={12} />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            color: "#060606ff",
          }}
        />
        <Line
          type="monotone"
          dataKey="logins"
          stroke="#ecb100ff"
          strokeWidth={2}
          dot={{ r: 3, strokeWidth: 1 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LoginAverageChart;
