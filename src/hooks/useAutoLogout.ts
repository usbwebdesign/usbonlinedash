// src/hooks/useAutoLogout.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export function useAutoLogout(timeoutMinutes = 15) {
  const navigate = useNavigate();
  const [sessionExpired, setSessionExpired] = useState(() => {
    // Revisa si ya había expirado antes (página refrescada)
    return sessionStorage.getItem("sessionExpired") === "true";
  });

  useEffect(() => {
    if (sessionExpired) return; // si ya expiró, no iniciamos timer

    let timer: number;

    const resetTimer = () => {
      clearTimeout(timer);

      timer = window.setTimeout(() => {
        setSessionExpired(true);
        sessionStorage.setItem("sessionExpired", "true"); // persistimos estado
      }, timeoutMinutes * 60 * 1000);
    };

    const events = ["click", "mousemove", "keydown", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    resetTimer(); // inicia el timer

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [timeoutMinutes, sessionExpired]);

  const confirmLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem("sessionExpired"); // reseteamos estado
    navigate("/login");
  };

  return { sessionExpired, confirmLogout };
}
