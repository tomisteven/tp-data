import React, { useState, useEffect } from "react";
import conductoresData from "../data/conductores.json";
import "./DriversManagement.css"; // Importa el CSS específico para este componente
import { API_BASE_URL } from "../assets/config";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import Swal from 'sweetalert2'; 

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
});

L.Marker.prototype.options.icon = DefaultIcon;

const DriversManagement = () => {
  const [conductores, setConductores] = useState([]);
  const [ubicaciones, setUbicaciones] = useState({});

  useEffect(() => {
    setConductores(conductoresData.filter((conductor) => conductor.habilitado));
  }, []);

  const fetchUbicacion = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ubicacion-conductor`);
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error al obtener la ubicación: ${errorMessage}`);
      }
      const data = await response.json();
      setUbicaciones((prev) => ({ ...prev, [id]: data }));
    } catch (error) {
      console.error("Error al obtener la ubicación:", error);
    }
  };

  useEffect(() => {
    conductores.forEach((conductor) => fetchUbicacion(conductor.id));
  }, [conductores]);

  return (
    <div className="drivers-management-container">
      <h2 className="title">Últimas Ubicaciones de Conductores</h2>
      <div className="drivers-list">
        {conductores
          .filter((conductor) => conductor.habilitado)
          .map((conductor) => (
            ubicaciones[conductor.id] && (
              <div key={conductor.id} className="drivers-card" id="drivers-card">
                <p>
                  <strong>Nombre:</strong> {conductor.nombre} {conductor.apellido}
                </p>
                <p>
                  <strong>DNI:</strong> {conductor.dni}
                </p>
                <p>
                  <strong>Teléfono:</strong> {conductor.numeroTelefono}
                </p>

                <p>
                  <strong>Última Ubicación:</strong>
                </p>
                <p>Latitud: {ubicaciones[conductor.id].latitud}</p>
                <p>Longitud: {ubicaciones[conductor.id].longitud}</p>

                <MapContainer
                  center={[
                    ubicaciones[conductor.id].latitud,
                    ubicaciones[conductor.id].longitud,
                  ]}
                  zoom={13}
                  style={{ height: "200px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                  />
                  <Marker
                    position={[
                      ubicaciones[conductor.id].latitud,
                      ubicaciones[conductor.id].longitud,
                    ]}
                  >
                    <Popup>Ubicación actual del conductor</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )
          ))}
      </div>
    </div>
  );
};

export default DriversManagement;
