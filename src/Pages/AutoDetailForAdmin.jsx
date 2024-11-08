import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import styles from "./AutoDetailForAdmin.module.css"; // Cambia la importación
import { API_BASE_URL } from "../assets/config";

function AutoDetail() {
  const { id } = useParams();
  const [auto, setAuto] = useState(null);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [newMantenimiento, setNewMantenimiento] = useState({
    fecha: "",
    tipo_de_mantenimiento: "",
    descripcion: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/autos/${id}`)
      .then((response) => {
        setAuto(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los detalles del auto:", error);
      });

    axios
      .get(`${API_BASE_URL}/autos/${id}/mantenimientos`)
      .then((response) => {
        setMantenimientos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener el historial de mantenimiento:", error);
      });
  }, [id]);

  if (!auto) {
    return <p>Auto no encontrado</p>;
  }

  const handleAddMantenimiento = () => {
    const { fecha, tipo_de_mantenimiento, descripcion } = newMantenimiento;

    if (!fecha || !tipo_de_mantenimiento || !descripcion) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    const mantenimientoData = {
      auto_id: auto.id,
      ...newMantenimiento,
    };

    axios
      .post(`${API_BASE_URL}/autos/${id}/mantenimientos`, mantenimientoData)
      .then((response) => {
        setMantenimientos([...mantenimientos, response.data]);
        setNewMantenimiento({
          fecha: "",
          tipo_de_mantenimiento: "",
          descripcion: "",
        });
        setError("");
      })
      .catch((error) => {
        console.error("Error al agregar mantenimiento:", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "tipo_de_mantenimiento") {
      const regex = /^[A-Za-z\s]*$/;
      if (!regex.test(value)) {
        return;
      }
    }

    setNewMantenimiento((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className={styles.autoDetail}>
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
        <strong>Patente:</strong> {auto.nro_patente}
      </p>

      <h3>Historial de Mantenimiento</h3>
      {mantenimientos.length > 0 ? (
        <table className={styles.maintenanceTable}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo de Mantenimiento</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {mantenimientos.map((item, index) => (
              <tr key={index}>
                <td>{item.fecha}</td>
                <td>{item.tipo_de_mantenimiento}</td>
                <td>{item.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron registros de mantenimiento.</p>
      )}

      
    </div>
  );
}

export default AutoDetail;
