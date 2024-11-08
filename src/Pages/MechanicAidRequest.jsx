import React, { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MechanicAidRequest.css";
import { API_BASE_URL } from "../assets/config";
import { useNavigate } from "react-router-dom";

const MechanicAidRequest = () => {
  const [aidRequests, setAidRequests] = useState([]);
  const [tokenInputs, setTokenInputs] = useState({});
  const mapRefs = useRef({});
  const navigate = useNavigate();

  const fetchAidRequests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/solicitudes/pendientes`);
      const data = await response.json();
      setAidRequests(data);
    } catch (error) {
      console.error("Error al obtener solicitudes pendientes:", error);
    }
  };

  useEffect(() => {
    fetchAidRequests();
  }, []);

  const handleAcceptRequest = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas aceptar esta solicitud de ayuda?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setAidRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id_peticion === id
              ? { ...request, estado: "aceptado" }
              : request
          )
        );
        Swal.fire("¡Aceptado!", "La solicitud ha sido aceptada.", "success");
      }
    });
  };

  const handleTokenChange = (id, value) => {
    setTokenInputs((prevTokens) => ({
      ...prevTokens,
      [id]: value,
    }));
  };

  const handleSubmitToken = async (id) => {
    const token = tokenInputs[id];
    if (!token) {
      Swal.fire("Error", "Por favor, ingrese el token.", "error");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/solicitudes/resolver`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (response.ok) {
        setAidRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id_peticion === id
              ? { ...request, estado: "resuelto" }
              : request
          )
        );
        Swal.fire('¡Resuelto!', result.message, 'success').then(() => {
          // Redirigir a /forms-accidente después de que la alerta se cierre
          navigate("/forms-accidente"); 
        });
      } else {
        Swal.fire("Error", result.error, "error");
      }
    } catch (error) {
      console.error("Error al resolver la solicitud:", error);
      Swal.fire("Error", "Hubo un problema al resolver la solicitud.", "error");
    }
  };

  return (
    <div className="mechanic-aid-request-container">
      <h1>Solicitudes de Ayuda</h1>
      <div className="aid-requests-list">
        {aidRequests.map((request) => (
          <div className="aid-request-card" key={request.id_peticion}>
            <div className="card-info">
              <h2>Conductor: {request.id_conductor}</h2>
              <p>
                <strong>Patente:</strong> {request.patente_auto}
              </p>
              <p>
                <strong>Fecha y hora de solicitud:</strong>{" "}
                {new Date(request.fecha_solicitud).toLocaleString()}
              </p>
              <p>
                <strong>Descripción:</strong> {request.descripcion}
              </p>
            </div>
            {request.foto && (
              <div className="card-photo">
                <img
                  src={`data:image/jpeg;base64,${request.foto}`}
                  alt="Foto del problema"
                />
              </div>
            )}
            <div className="map-container">
              <div
                id={`map-${request.id_peticion}`}
                style={{ height: "200px", width: "100%" }}
                ref={(el) => {
                  if (el && !mapRefs.current[request.id_peticion]) {
                    mapRefs.current[request.id_peticion] = L.map(el).setView(
                      [request.latitud, request.longitud],
                      15
                    );
                    L.tileLayer(
                      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                      {
                        attribution: "&copy; OpenStreetMap contributors",
                      }
                    ).addTo(mapRefs.current[request.id_peticion]);
                    L.marker([request.latitud, request.longitud]).addTo(
                      mapRefs.current[request.id_peticion]
                    );
                  }
                }}
              ></div>
            </div>
            {request.estado === "aceptado" && (
              <div className="token-input-container">
                <input
                  type="text"
                  placeholder="Ingrese el token"
                  value={tokenInputs[request.id_peticion] || ""}
                  onChange={(e) =>
                    handleTokenChange(request.id_peticion, e.target.value)
                  }
                />
                <button onClick={() => handleSubmitToken(request.id_peticion)}>
                  Verificar Token
                </button>
              </div>
            )}
            <button
              className="accept-button"
              onClick={() => handleAcceptRequest(request.id_peticion)}
              disabled={
                request.estado === "aceptado" || request.estado === "resuelto"
              }
            >
              {request.estado === "resuelto"
                ? "Resuelto"
                : request.estado === "aceptado"
                ? "Token requerido"
                : "Aceptar"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MechanicAidRequest;
