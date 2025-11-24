import React from "react";
import styles from "./Configuracion.module.css";

const Configuracion: React.FC = () => {
  return (
    <div className={styles.configWrapper}>
      <h2>Configuración</h2>
      <p>Aquí puedes probar tus opciones de configuración del dashboard.</p>
      <div className={styles.testBox}>
        <p>Este contenido reemplaza a Inicio cuando se selecciona Configuración.</p>
      </div>
    </div>
  );
};

export default Configuracion;
