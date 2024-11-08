import React, { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import ReportsData from "../data/reportes.json";
import styles from "./ReportManagement.module.css"; // Importa el CSS como módulo

function ReportManagement() {
  const [reportType, setReportType] = useState("");
  const [reportTime, setReportTime] = useState("");
  const [reportes, setReportes] = useState([]);
  const [vehicleType, setVehicleType] = useState("");
  const [availability, setAvailability] = useState("");

  useEffect(() => {
    // Cargar los datos del archivo JSON y filtrar los habilitados
    setReportes(ReportsData);
  }, []);

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  const handleReportTimeChange = (e) => {
    setReportTime(e.target.value);
  };

  const handleVehicleTypeChange = (e) => {
    setVehicleType(e.target.value);
  };

  const handleAvailabilityChange = (e) => {
    setAvailability(e.target.value);
  };

  const filteredReportsMensual = reportes.filter(
    (report) => report.tipo === "mensual"
  );
  const filteredReportsSemanal = reportes.filter(
    (report) => report.tipo === "semanal"
  );

  // Filtra por tipo de vehiculo y/o disponibilidad
  const filterReportsVehicle = () => {
    return reportes.filter((report) => {
      return (
        (vehicleType ? report.vehiculo === vehicleType : true) &&
        (availability ? report.disponibilidad === availability : true)
      );
    });
  };

  const filterReportsAllVehicleAvailability = () => {
    return reportes.filter((report) => {
      return availability ? report.disponibilidad === availability : true;
    });
  };

  const filteredReportsAllVehicleAvailability =
    filterReportsAllVehicleAvailability();
  const filteredReports = filterReportsVehicle();

  return (
    <div className={styles["reportes-gerencia-container"]}>
      <Navbar />
      <h2>Reportes</h2>
      <div className={styles.selection}>
        <select
          id="reportType"
          value={reportType}
          onChange={handleReportTypeChange}
        >
          <option value="">--</option>
          <option value="gastos">Gastos</option>
          <option value="vehiculos">Vehículos</option>
        </select>
      </div>

      {/* filtros */}
      {reportType === "gastos" && (
        <div className={styles["filter-fields"]}>
          <select
            id="reportTime"
            value={reportTime}
            onChange={handleReportTimeChange}
          >
            <option value="">--</option>
            <option value="mensual">Reportes Mensuales</option>
            <option value="semanal">Reportes Semanales</option>
          </select>

          {reportTime === "mensual" &&
            filteredReportsMensual.map((report) => (
              <div className={styles["report-card"]} key={report.id}>
                <p>
                  <strong>ID:</strong> {report.id}
                </p>
                <p>
                  <strong>Fecha:</strong> {report.fecha}
                </p>
                <button className={styles["btn-download"]}>
                  <i
                    onClick={() => alert("Descargando PDF...")}
                    className="material-icons"
                  >
                    file_download
                  </i>
                </button>
              </div>
            ))}

          {reportTime === "semanal" &&
            filteredReportsSemanal.map((report) => (
              <div className={styles["report-card"]} key={report.id}>
                <p>
                  <strong>ID:</strong> {report.id}
                </p>
                <p>
                  <strong>Fecha:</strong> {report.fecha}
                </p>
                <button
                  onClick={() => alert("Descargando PDF...")}
                  className={styles["btn-download"]}
                >
                  <i className="material-icons">file_download</i>
                </button>
              </div>
            ))}
        </div>
      )}

      {/* filtros para los reportes de vehiculos */}
      {reportType === "vehiculos" && (
        <div className={styles["filter-fields"]}>
          <label>Por Tipo de Vehículo:</label>
          <select
            id="vehicleType"
            value={vehicleType}
            onChange={handleVehicleTypeChange}
          >
            <option value="">Selecciona una opción</option>
            <option value="Auto">Autos</option>
            <option value="Camione">Camiones</option>
            <option value="Micro">Micros</option>
            <option value="Camioneta">Camionetas</option>
            <option value="Moto">Motos</option>
            <option value="Todos">Todos</option>
          </select>

          <label>Por Disponibilidad:</label>
          <select
            id="availability"
            value={availability}
            onChange={handleAvailabilityChange}
          >
            <option value="">Selecciona una opción</option>
            <option value="Reservado">Reservados</option>
            <option value="No reservado">No reservados</option>
          </select>

          {vehicleType !== "" && availability !== "" && (
            <div className={styles["report-list"]}>
              {filteredReports.map((report) => (
                <div className={styles["report-card"]} key={report.id}>
                  <p>
                    <strong>ID:</strong> {report.id}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {report.fecha}
                  </p>
                  <p>
                    <strong>Vehículo:</strong> {report.vehiculo}
                  </p>
                  <p>
                    <strong>Disponibilidad:</strong> {report.disponibilidad}
                  </p>
                  <button
                    onClick={() => alert("Descargando PDF...")}
                    className={styles["btn-download"]}
                  >
                    <i className="material-icons">file_download</i>
                  </button>
                </div>
              ))}
            </div>
          )}

          {vehicleType === "Todos" && availability !== "" && (
            <div className={styles["report-list"]}>
              {filteredReportsAllVehicleAvailability.map((report) => (
                <div className={styles["report-card"]} key={report.id}>
                  <p>
                    <strong>ID:</strong> {report.id}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {report.fecha}
                  </p>
                  <p>
                    <strong>Vehículo:</strong> {report.vehiculo}
                  </p>
                  <p>
                    <strong>Disponibilidad:</strong> {report.disponibilidad}
                  </p>
                  <button
                    onClick={() => alert("Descargando PDF...")}
                    className={styles["btn-download"]}
                  >
                    <i className="material-icons">file_download</i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ReportManagement;
