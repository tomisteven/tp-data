import React, { useState } from "react";
import Navbar from "../components/NavBar";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { API_BASE_URL } from '../assets/config'; // Ajusta la ruta si es necesario
import "./Reports.css";

function Reports() {
    const [reportType, setReportType] = useState("");
    const [availability, setAvailability] = useState(""); 
    const [fechaDesde, setFechaDesde] = useState(""); 
    const [fechaHasta, setFechaHasta] = useState(""); 
    const [mechanicSpecialty, setMechanicSpecialty] = useState(""); // Asegúrate de inicializarlo
    const [filtersCompleted, setFiltersCompleted] = useState(false);

    const handleReportTypeChange = (e) => {
        setReportType(e.target.value);
        setFiltersCompleted(false);
    };

    const checkFiltersCompleted = () => {
        setFiltersCompleted(true);
    };

    // Funciones para generar reportes...
    // (incluye aquí tus funciones para generar reportes de gastos, vehículos y conductores)

    const handleGenerarReporte = () => {
        if (reportType === "gastos") {
            generarReporteGastosPDF();
        } else if (reportType === "vehiculos") {
            generarReporteVehiculosPDF();
        } else if (reportType === "conductor") {
            generarReporteConductoresPDF();
        } else if (reportType === "stock") {
            generarReporteStockPDF(); // Asegúrate de implementar esta función
        } else {
            alert("Generación de reportes para " + reportType + " aún no está implementada.");
        }
    };

    return (
        <div className="reportes-container">
            <Navbar />
            <h2 className="title">Reportes</h2>

            <div className="filter-section">
                <label htmlFor="reportType">Generar reporte de:</label>
                <select
                    id="reportType"
                    value={reportType}
                    onChange={handleReportTypeChange}
                >
                    <option value="">Selecciona una opción</option>
                    <option value="vehiculos">Vehículos</option>
                    <option value="conductor">Conductores</option>
                    <option value="mecanico">Mecánicos</option>
                    <option value="gastos">Gastos</option>
                    <option value="stock">Stock</option>
                </select>
            </div>

            {/* Filtros para vehículos */}
            {reportType === "vehiculos" && (
                <div className="filter-fields">
                    <label>Filtrar por disponibilidad:</label>
                    <select
                        id="disponibilidad"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                    >
                        <option value="">Selecciona una opción</option>
                        <option value="reservados">Reservados</option>
                        <option value="no reservados">No reservados</option>
                        <option value="indistinto">Indistinto</option>
                    </select>

                    <label>Desde:</label>
                    <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} onBlur={checkFiltersCompleted} />
                    <label>Hasta:</label>
                    <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} onBlur={checkFiltersCompleted} />
                </div>
            )}

            {reportType === "mecanico" && (
                <div className="filter-fields">
                    <label>Filtrar por especialidad del mecánico:</label>
                    <select
                        id="mecanicoType"
                        value={mechanicSpecialty}
                        onChange={(e) => { setMechanicSpecialty(e.target.value); checkFiltersCompleted(); }}
                    >
                        <option value="">Selecciona una opción</option>
                        <option value="electromecanica">Electromecánica</option>
                        <option value="frenos">Frenos</option>
                        <option value="mecanica general">Mecánica general</option>
                        <option value="suspension">Suspensión</option>
                        <option value="transmision">Transmisión</option>
                        <option value="gas">Gas</option>
                        <option value="cambio de correa">Cambio de correa</option>
                        <option value="todos">Todos</option>
                    </select>
                </div>
            )}

            {reportType === "gastos" && (
                <div className="filter-fields">
                    <label>Filtrar por fecha:</label>
                    <input type="date" onChange={checkFiltersCompleted} />
                    <input type="date" onChange={checkFiltersCompleted} />
                </div>
            )}

            {reportType === "stock" && (
                <div className="filter-fields">
                    <label>Filtrar por categoría de stock:</label>
                    <input type="text" placeholder="Ingrese la categoría" onChange={checkFiltersCompleted} />
                </div>
            )}

            {/* Botón para generar reporte PDF */}
            {filtersCompleted && (
                <div className="generate-report">
                    <button onClick={handleGenerarReporte}>Generar Reporte PDF</button>
                </div>
            )}
        </div>
    );
}

export default Reports;
