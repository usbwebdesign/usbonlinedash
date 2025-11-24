import React, { useEffect, useState } from "react";
import StatsCards from "../StatsCards";
import LoginAverageCard from "../LoginAverageCard";

const Inicio: React.FC = () => {
  const [teachersCount, setTeachersCount] = useState<number | null>(null);
  const [studentsCount, setStudentsCount] = useState<number | null>(null);
  const [organizationsCount, setOrganizationsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersRes, studentsRes, orgsRes] = await Promise.all([
          fetch("http://localhost:5000/api/docentes"),
          fetch("http://localhost:5000/api/students"),
          fetch("http://localhost:5000/api/active-classes"),
        ]);
        const [teachersData, studentsData, orgsData] = await Promise.all([
          teachersRes.json(),
          studentsRes.json(),
          orgsRes.json(),
        ]);

        setTeachersCount(
          (teachersData as any[]).filter(u => u.roles.includes("Teacher") && !u.archived).length
        );
        setStudentsCount((studentsData as any[]).filter(s => !s.archived).length);
        setOrganizationsCount((orgsData as any[]).filter(o => !o.archived).length);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { label: "Docentes Activos", value: loading ? "Cargando..." : teachersCount ?? "—" },
    { label: "Estudiantes Activos", value: loading ? "Cargando..." : studentsCount ?? "—" },
    { label: "Clases Activas", value: loading ? "Cargando..." : organizationsCount ?? "—" },
  ];

  return (
    <div>
      <StatsCards stats={stats} />
      <div style={{ marginTop: "2rem" }}>
        <LoginAverageCard average={13.14} />
      </div>
    </div>
  );
};

export default Inicio;
