import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./AutoAccidentRegister.css";

function AutoAccidentRegister() {
  const { id } = useParams();
  const [auto, setAuto] = useState({
    id: 1,
    marca: "Toyota",
    modelo: "Corolla",
    anio: 2020,
    kilometraje: 25000,
    nro_patente: "ABC-123",
  });
  const [accidentes, setAccidentes] = useState([]);
  const [nuevoAccidente, setNuevoAccidente] = useState({
    fecha: "",
    hora: "",
    ubicacion: "",
    nombre_usuario: "",
    stock_utilizado: "",
  });

  useEffect(() => {
    // Datos ficticios de accidentes
    const datosAccidentes = [
      {
        fecha: "2023-01-15",
        hora: "14:30",
        ubicacion: "Av. Libertador 1234",
        nombre_usuario: "Juan Pérez",
        stock_utilizado: "Ninguno",
      },
      {
        fecha: "2023-02-10",
        hora: "09:15",
        ubicacion: "Calle Falsa 567",
        nombre_usuario: "Ana Gómez",
        stock_utilizado: "Repuesto A",
      },
    ];
    setAccidentes(datosAccidentes);
  }, [id]);

  const handleAddAccidente = () => {
    const accidenteData = {
      auto_id: auto.id,
      ...nuevoAccidente,
    };

    // Agregar el nuevo accidente a la lista
    setAccidentes([...accidentes, accidenteData]);
    setNuevoAccidente({
      fecha: "",
      hora: "",
      ubicacion: "",
      nombre_usuario: "",
      stock_utilizado: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoAccidente((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="auto-detail">
      <h2>Detalles del Auto</h2>
      <h3>
        {auto.marca} {auto.modelo}
      </h3>
      <p>
        <strong>Año:</strong> {auto.anio}
      </p>
      <p>
        <strong>Kilometraje:</strong> {auto.kilometraje} km
      </p>
      <p>
        <strong>Pantente: </strong> {auto.nro_patente}
      </p>

      <h3>Historial de Accidentes</h3>
      {accidentes.length > 0 ? (
        <table className="maintenance-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Ubicación</th>
              <th>Nombre del Usuario</th>
              <th>Stock Utilizado</th>
            </tr>
          </thead>
          <tbody>
            {accidentes.map((item, index) => (
              <tr key={index}>
                <td>{item.fecha}</td>
                <td>{item.hora}</td>
                <td>{item.ubicacion}</td>
                <td>{item.nombre_usuario}</td>
                <td>{item.stock_utilizado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron registros de accidentes.</p>
      )}

     
      <Link to="/gestion-autos" className="back-link">
        Volver
      </Link>
    </div>
  );
}

export default AutoAccidentRegister;