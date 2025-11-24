import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import LogoutPopup from "./LogoutPopup";
import styles from "./Layout.module.css";
import { useAutoLogout } from "@/hooks/useAutoLogout";

// Importa tu panel de configuración
import Configuracion from "../components/sections/Configuracion";

const Layout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const user = { name: "Mike", surname: "Pacheco" };

  const [activeSection, setActiveSection] = useState("Inicio");

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const { sessionExpired, confirmLogout } = useAutoLogout(15); // 15 min

  return (
    <div className={styles.layout}>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        user={user}
        onSectionChange={handleSectionChange}
      />

      <div className={styles.main}>
        <main className={styles.content}>
          {activeSection === "Configuración" ? (
            <Configuracion />
          ) : (
            <Outlet context={{ toggleSidebar }} />
          )}
        </main>
      </div>

      {/* Popup de sesión expirada */}
      <LogoutPopup visible={sessionExpired} onConfirm={confirmLogout} />
    </div>
  );
};

export default Layout;
