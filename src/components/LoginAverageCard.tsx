import React from "react";
import LoginAverageChart from "./LoginAverageChart";
import styles from "./LoginAverageCard.module.css";

interface LoginAverageCardProps {
  title?: string;
  average?: number;
}

const LoginAverageCard: React.FC<LoginAverageCardProps> = ({
  title = "Promedio de Logins",
  average = 0,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <span className={styles.average}>{average.toFixed(2)}</span>
      </div>
      <div className={styles.chartContainer}>
        <LoginAverageChart />
      </div>
    </div>
  );
};

export default LoginAverageCard;
