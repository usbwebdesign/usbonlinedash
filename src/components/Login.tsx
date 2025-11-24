import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import styles from "./Login.module.css";
import TopBar from "./Topbar"; // <-- importamos nuestro TopBar

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    console.log("Usuario logueado:", data.user);
    navigate("/");
  };

  return (
    <div className={styles.page}>
      <TopBar />
      <div className={styles.container}>
        <h2 className={styles.login}>Iniciar Sesión</h2>
        <h3 className={styles.caption}>
          Accede a la gestión y administración centralizada de USBOnline
        </h3>

        <form onSubmit={handleLogin} className={styles.form}>
          <h3 className={styles.instruction}>Email</h3>
          <input
            type="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />

          <h3 className={styles.instruction}>Contraseña</h3>
          <div className={styles.passwordWrapper}>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {errorMsg && <p className={styles.error}>{errorMsg}</p>}

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
