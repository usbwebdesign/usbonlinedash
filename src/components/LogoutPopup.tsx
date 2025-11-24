// src/components/LogoutPopup.tsx
import type { FC } from "react";
import styles from "./LogoutPopup.module.css";
import { CircleAlert } from "lucide-react";

interface LogoutPopupProps {
  visible: boolean;
  onConfirm: () => void;
}

const LogoutPopup: FC<LogoutPopupProps> = ({ visible, onConfirm }) => {
  if (!visible) return null;

  return (
    <div className={styles.sessionModal}>
      <div className={styles.modalContent}>
        <CircleAlert size={58} color="#fff" style={{ marginBottom: "1.4rem" }} />
        <h2>Sesión expirada</h2>
        <p>Tu sesión ha expirado. Inicia sesión nuevamente.</p>
        <button onClick={onConfirm}>Aceptar</button>
      </div>
    </div>
  );
};

export default LogoutPopup;
