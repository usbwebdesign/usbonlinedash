import React from "react";

interface SessionPopupProps {
  setSessionExpired: React.Dispatch<React.SetStateAction<boolean>>;
}

const SessionPopup: React.FC<SessionPopupProps> = ({ setSessionExpired }) => {
  return (
    <div className="session-popup">
      <p>Tu sesión expiró. Debes iniciar sesión nuevamente.</p>
      <button onClick={() => setSessionExpired(false)}>
        Entendido
      </button>
    </div>
  );
};

export default SessionPopup;
