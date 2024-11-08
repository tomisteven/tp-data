import React, { useState, useEffect } from "react";
import RutesCard from "./RoutesCard";
import "./RoutesVerify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import { API_BASE_URL } from "../assets/config";
import Swal from "sweetalert2"; // Importa SweetAlert2

function RutesVerify() {
  const [allRutas, setAllRutas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/ver-rutas`)
      .then((response) => setAllRutas(response.data))
      .catch((error) => console.error("Error al obtener rutas:", error));
  }, []);

  const handleApprove = (idRuta) => {
    axios
      .post(`${API_BASE_URL}/aprobar-ruta`, { id_ruta: idRuta })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Ruta aprobada",
          text: "La ruta ha sido aprobada exitosamente.",
        });

        // Actualiza el estado local para reflejar el cambio
        setAllRutas((prevRutas) =>
          prevRutas.map((ruta) =>
            ruta.id_ruta === idRuta ? { ...ruta, estado: "aprobada" } : ruta
          )
        );
      })
      .catch((error) => {
        console.error("Error al aprobar ruta:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al aprobar la ruta.",
        });
      });
  };

  const handleReject = (idRuta) => {
    axios
      .post(`${API_BASE_URL}/rechazar-ruta`, { id_ruta: idRuta })
      .then(() => {
        Swal.fire({
          icon: "warning",
          title: "Ruta rechazada",
          text: "La ruta ha sido rechazada.",
        });

        // Actualiza el estado local para reflejar el cambio
        setAllRutas((prevRutas) =>
          prevRutas.map((ruta) =>
            ruta.id_ruta === idRuta ? { ...ruta, estado: "rechazada" } : ruta
          )
        );
      })
      .catch((error) => {
        console.error("Error al rechazar ruta:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al rechazar la ruta.",
        });
      });
  };

  return (
    <div className="routes-verify-container" id="routes-verify-container">
      <Navbar />
      <h2>RUTAS</h2>

      <div className="routes-card-list" id="routes-card-list">
        {allRutas.length > 0 ? (
          allRutas.map((ruta) => (
            <RutesCard
              key={ruta.id_ruta}
              ruta={ruta}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        ) : (
          <p>No se encontraron rutas.</p>
        )}
      </div>
    </div>
  );
}

export default RutesVerify;
