import React from "react";
import styles from "./TopBar.module.css";
import Logo1 from "@/assets/logo1.png";
import Logo2 from "@/assets/logo2.png";

const TopBar: React.FC = () => {
  return (
    <div className={styles.topBar}>
      <img src={Logo1} alt="Logo 1" className={styles.logo} />
      <img src={Logo2} alt="Logo 2" className={styles.logo} />
    </div>
  );
};

export default TopBar;
