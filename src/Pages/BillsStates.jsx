import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import axios from "axios"; // Asegúrate de haber instalado axios
import { API_BASE_URL } from "../assets/config"; // Asegúrate de que esta ruta sea correcta
import "./BillsStates.css";

function BillsStates() {
  const [gastos, setGastos] = useState([]);
  const [sortBy, setSortBy] = useState("fecha");
  const [sortedExpenses, setSortedExpenses] = useState([]);

  useEffect(() => {
    // Llamar a la API para obtener la lista de gastos
    const fetchGastos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/bills`); // Endpoint de la API para obtener los gastos
        setGastos(response.data); // Actualizar el estado con los datos obtenidos de la API
      } catch (error) {
        console.error("Error al obtener los gastos de la API:", error);
      }
    };

    fetchGastos(); // Ejecutar la función para obtener los gastos
  }, []);

  // Ordena los gastos por fecha y monto de forma ascendente
  useEffect(() => {
    const sorted = [...gastos].sort((a, b) => {
      if (sortBy === "date") {
        return new Date(a.fecha) - new Date(b.fecha);
      } else if (sortBy === "amount") {
        return a.monto - b.monto;
      } else return 0; // Cambiado a 0 para evitar errores
    });
    setSortedExpenses(sorted);
  }, [sortBy, gastos]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div id="body-gastos">
      <Navbar />
      <div className="bills-states-container">
        <h1 id="listaGastos">Lista de Gastos</h1>
        <div className="bills-list"> {/* Cambiado ul a div con clase bills-list */}
          {sortedExpenses.map((gasto, index) => (
            <div key={index} className="gasto-item">
              <strong>Descripción:</strong> {gasto.descripcion} <br />
              <strong>Monto:</strong> ${gasto.monto} <br />
              <strong>Fecha:</strong> {gasto.fecha} <br />
              <strong>Estado:</strong> {gasto.estado}
              <br />
            </div>
          ))}
        </div>
      </div>

      <div id="selectors">
        <h2>Ordenar por:</h2>
        <label>Seleccionar:</label>
        <select id="sortBy" value={sortBy} onChange={handleSortChange}>
          <option value="">--</option>
          <option value="date">Fecha</option>
          <option value="amount">Monto</option>
        </select>

        <h2>Ver:</h2>
        <label>Seleccionar:</label>
        <select id="sortBy">
          <option>--</option>
          <option>Fecha</option>
          <option>Monto</option>
        </select>
      </div>
    </div>
  );
}

export default BillsStates;
