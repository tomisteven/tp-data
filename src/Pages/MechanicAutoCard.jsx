import React from "react";
import { useNavigate } from "react-router-dom";
import "./MechanicAutoCard.css";
import { FaBell } from "react-icons/fa"; // Icono de notificación de Font Awesome

const MechanicAutoCard = ({ auto }) => {
  const navigate = useNavigate();

  const handleAccidents = () => {
    navigate(`/autos-accidentes/${auto.id}`); 
  };

  const handleMaintenance = () => {
    navigate(`/autos/${auto.id}`); // Navega a la página de detalles del auto
  };

  // Verifica si el kilometraje es múltiplo de 10,000
  const requiereMantenimiento = auto.kilometraje % 10000 === 0;

  return (
    <div className="auto-card">
      <h3>
        {auto.marca} {auto.modelo}
        {requiereMantenimiento && (
          <span className="maintenance-icon">
            <FaBell className="bell-icon" />
            <span className="maintenance-tooltip">Se recomienda mantenimiento</span>
          </span>
        )}
      </h3>
      <p><strong>Año:</strong> {auto.anio}</p>
      <p><strong>Kilometraje:</strong> {auto.kilometraje} km</p>
      <p><strong>Patente:</strong> {auto.nro_patente}</p>
      <button onClick={handleAccidents} className="details-button">Administrar accidentes</button>
      <button onClick={handleMaintenance} className="details-button">Agregar mantenimiento</button>
    </div>
  );
};

export default MechanicAutoCard;
