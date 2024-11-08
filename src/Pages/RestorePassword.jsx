import React from "react";
import "./RestorePassword.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function RestorePassword({ onClose }) {
  const navigate = useNavigate();

  const handleSubmit = () => {
    Swal.fire({
      title: "¡Éxito!",
      text: "Contraseña restablecida correctamente",
      icon: "success",
      confirmButtonText: "Aceptar",
      customClass: {
        container: "my-swal",
      },
    });
    navigate("/");
  };

  return (
    <div className="restore-password-container">
      <h2 className="restore-password-title">Crear nueva contraseña</h2>
      <br />
      <label className="restore-password-label">Nueva contraseña:</label> <br />
      <input className="rp-input" type="password"></input> <br />
      <br />
      <label className="restore-password-label">Repetir contraseña</label>{" "}
      <br />
      <input className="rp-input" type="password"></input>
      <br />
      <br />
      <div className="sa-buttons">
        <button className="btn-rp-continuar" onClick={handleSubmit}>
          Continuar
        </button>
        <button className="btn-rp-cancelar" onClick={onClose}>
          Volver
        </button>
      </div>
    </div>
  );
}

export default RestorePassword;
