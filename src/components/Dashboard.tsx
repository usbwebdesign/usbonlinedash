import React from "react";
import { useOutletContext } from "react-router-dom";
import Header from "./Header";
import LoginAverageCard from "./LoginAverageCard";
import styles from "./Dashboard.module.css";

interface LayoutContext {
  toggleSidebar: () => void;
}

const Dashboard: React.FC = () => {
  // Recibimos toggleSidebar desde el Layout
  const { toggleSidebar } = useOutletContext<LayoutContext>();

  // Datos de ejemplo estáticos; luego puedes reemplazarlos con props o context
  const stats = [
    { label: "Docentes Activos", value: 12 },
    { label: "Estudiantes Activos", value: 45 },
    { label: "Clases Activas", value: 8 },
  ];

  return (
    <div className={styles.dashboardWrapper}>
      {/* Header controla el toggle del Sidebar */}
      <Header toggleSidebar={toggleSidebar} />

      <main className={styles.dashboard}>
        <h2 className={styles.sectionTitle}>Resumen general</h2>

        <div className={styles.cards}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.card}>
              <p className={styles.cardLabel}>{stat.label}</p>
              <h3 className={styles.cardTitle}>{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className={styles.cards}>
          <LoginAverageCard average={13.14} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
