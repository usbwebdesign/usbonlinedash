import React from "react";
import styles from "./StatsCards.module.css";

interface Stat {
  label: string;
  value: number | string;
}

interface StatsCardsProps {
  stats: Stat[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className={styles.cards}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.card}>
          <p className={styles.cardLabel}>{stat.label}</p>
          <h3 className={styles.cardTitle}>{stat.value}</h3>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
