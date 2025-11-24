import React, { useRef, useEffect, useState } from "react";
import styles from "./Header.module.css";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [bellFill, setBellFill] = useState(true);

  const popupRef = useRef<HTMLDivElement | null>(null);
  const bellRef = useRef<SVGSVGElement | null>(null);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
    setBellFill(!bellFill);
  };

  // Cierra popup si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popupRef.current &&
        !popupRef.current.contains(target) &&
        bellRef.current &&
        !bellRef.current.contains(target)
      ) {
        setIsPopupOpen(false);
        setBellFill(true); // regresa fill
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <button
        className={styles.hamburger}
        onClick={toggleSidebar}
        aria-label="Abrir menú"
      >
        ☰
      </button>

      <h1>Bienvenido Mike</h1>

      <div className={styles.rightSection}>
        <svg
          ref={bellRef}
          onClick={togglePopup}
          className={styles.bellIcon}
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill={bellFill ? "#ffffff" : "none"}
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ cursor: "pointer" }}
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {isPopupOpen && (
          <div className={styles.popup} ref={popupRef}>
            <h3 className={styles.popupTitle}>Notificaciones</h3>
            <p className={styles.noNotifications}>
              No tienes notificaciones nuevas.
            </p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
