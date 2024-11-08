import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Asegúrate de tener axios instalado
import { API_BASE_URL } from "../assets/config"; // Asegúrate de que esta ruta sea correcta
import "./BillsManagement.css";

const BillsManagement = () => {
  const [gastos, setGastos] = useState([]);
  const [filteredGastos, setFilteredGastos] = useState([]);
  const [filterDescription, setFilterDescription] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar los datos de la API
    const fetchGastos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/bills`); // Cambia esto a tu endpoint
        setGastos(response.data);
        setFilteredGastos(response.data);
      } catch (error) {
        console.error("Error al cargar los gastos:", error);
      }
    };

    fetchGastos();
  }, []);

  // Filtrar gastos por descripción y estado
  useEffect(() => {
    let filtered = gastos.filter(
      (gasto) =>
        gasto.descripcion
          .toLowerCase()
          .includes(filterDescription.toLowerCase()) &&
        (filterEstado === "" || gasto.estado === filterEstado)
    );
    setFilteredGastos(filtered);
  }, [filterDescription, filterEstado, gastos]);

  const handleMarkAsPaid = async (id) => {
    try {
      // Primero, verifica si el gasto existe
      const response = await axios.get(`${API_BASE_URL}/bills/${id}`);
      console.log("Gasto encontrado:", response.data);

      // Si existe, actualiza el estado
      await axios.patch(`${API_BASE_URL}/bills/${id}`, { estado: "pagado" });
      setGastos(
        gastos.map((gasto) =>
          gasto.id === id ? { ...gasto, estado: "pagado" } : gasto
        )
      );
    } catch (error) {
      console.error("Error al marcar el gasto como pagado:", error);
    }
  };

  return (
    <div className="expenses-management-container">
      <h2 className="title">Gestión de Gastos</h2>

      {/* Filtros */}
      <div className="filters">
        <input
          type="text"
          placeholder="Filtrar por descripción"
          value={filterDescription}
          onChange={(e) => setFilterDescription(e.target.value)}
        />
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="pagado">Pagado</option>
        </select>
      </div>

      {/* Lista de gastos */}
      <div className="expenses-list">
        {filteredGastos.map((gasto) => (
          <div key={gasto.id} className="expense-card">
            <p>
              <strong>Descripción:</strong> {gasto.descripcion}
            </p>
            <p>
              <strong>Monto:</strong> ${gasto.monto}
            </p>
            <p>
              <strong>Estado:</strong> {gasto.estado}
            </p>

            {/* Botón "Marcar como pago", deshabilitado si ya está pagado */}
            
            <button
              onClick={() => handleMarkAsPaid(gasto.id)}
              disabled={gasto.estado === "pagado"}
              className="mark-paid-button"
            >
              Marcar como Pago
            </button>

            {/* Botón "Pagar", deshabilitado si ya está pagado */}
            <button
              // onClick={() => handlePay(gasto.id)}
              disabled={gasto.estado === "pagado"}
              className="pay-button"
            >
              Pagar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillsManagement;
