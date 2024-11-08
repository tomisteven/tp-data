import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Asegúrate de tener axios instalado
import { API_BASE_URL } from "../assets/config"; // Asegúrate de que esta ruta sea correcta
import styles from "./BillsViewer.module.css"; // Importar el módulo CSS

const BillsViewer = () => {
  const [gastos, setGastos] = useState([]);
  const [filteredGastos, setFilteredGastos] = useState([]);
  const [filterDescription, setFilterDescription] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/bills`);
        setGastos(response.data);
        setFilteredGastos(response.data);
      } catch (error) {
        console.error("Error al cargar los gastos:", error);
      }
    };

    fetchGastos();
  }, []);

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
      const response = await axios.get(`${API_BASE_URL}/bills/${id}`);
      console.log("Gasto encontrado:", response.data);
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
    <div className={styles.expensesViewerContainer}>
      <h2 className={styles.title}>Visor de Gastos</h2>

      {/* Filtros */}
      <div className={styles.filters}>
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
      <div className={styles.expensesList}>
        {filteredGastos.map((gasto) => (
          <div key={gasto.id} className={styles.expenseCard}>
            <p>
              <strong>Descripción:</strong> {gasto.descripcion}
            </p>
            <p>
              <strong>Monto:</strong> ${gasto.monto}
            </p>
            <p>
              <strong>Estado:</strong> {gasto.estado}
            </p>
            <p>
              <strong>Empleado:</strong> {gasto.nombre}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillsViewer;
