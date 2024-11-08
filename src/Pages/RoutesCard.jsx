// RutesCard.js
import React from "react";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./RoutesCard.css";

function RutesCard({ ruta, onApprove, onReject }) {
  const { nombre, distancia_total_km, trazado, conductor, dni_conductor, estado, fecha_creacion } = ruta;

  // Convierte el trazado en un formato que Polyline pueda entender
  const polylineCoords = trazado.map((coord) => [coord.lat, coord.lng]);

  // Asignar el primer y último punto del trazado para los marcadores
  const puntoA = polylineCoords[0];
  const puntoB = polylineCoords[polylineCoords.length - 1];

  return (
    <div className="route-card">
      <h3>{nombre}</h3>
      <p><strong>Distancia:</strong> {distancia_total_km} km</p>
      <p><strong>Conductor:</strong> {conductor} - <strong>DNI:</strong> {dni_conductor}</p>
      <p><strong>Estado:</strong> {estado}</p>
      <p><strong>Fecha de creación:</strong> {new Date(fecha_creacion).toLocaleString()}</p>

      <MapContainer center={puntoA} zoom={13} style={{ height: "200px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Polyline positions={polylineCoords} color="blue" />
        <Marker position={puntoA}></Marker>
        <Marker position={puntoB}></Marker>
      </MapContainer>

      {/* Mostrar los botones solo si el estado es "pendiente" */}
      {estado === "pendiente" && (
        <div className="action-buttons">
          <button onClick={() => onApprove(ruta.id_ruta)} className="approve-button">Aprobar</button>
          <button onClick={() => onReject(ruta.id_ruta)} className="reject-button">Rechazar</button>
        </div>
      )}
    </div>
  );
}

export default RutesCard;
