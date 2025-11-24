import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  user?: { name: string; surname: string };
  onSectionChange: (section: string) => void; // callback para sección activa
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  user,
  onSectionChange,
}) => {
  const [activeLink, setActiveLink] = useState("Inicio");
  const navigate = useNavigate();

  const fullName = user ? `${user.name} ${user.surname}` : "Usuario Invitado";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fullName
  )}&background=1a1f2e&color=fff`;

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
    onSectionChange(link);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.active : ""}`}
        onClick={toggleSidebar}
      >
        <div className={styles.header}>
          <p className={styles.logo}>USB Online</p>
          <nav className={styles.nav}>
            {["Inicio", "Gestión Académica", "Administración", "Reportes"].map(
              (link) => (
                <a
                  key={link}
                  href="#"
                  className={activeLink === link ? styles.activeLink : ""}
                  onClick={() => handleLinkClick(link)}
                >
                  {link}
                </a>
              )
            )}
          </nav>
        </div>

        <div className={styles.footer}>
          <img src={avatarUrl} alt={fullName} className={styles.avatar} />
          <div className={styles.userInfo}>
            <p className={styles.userName}>{fullName}</p>
            <div className={styles.buttons}>
              {/* Botón Configuración en el footer */}
              <button
                className={styles.settingsBtn}
                onClick={() => handleLinkClick("Configuración")}
              >
                Configuración
              </button>

              <button className={styles.settingsBtn} onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </aside>

      {isOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
