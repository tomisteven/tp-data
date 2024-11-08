import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code"; // Biblioteca para generar QR
import { toPng } from "html-to-image"; // Para convertir a imagen y descargar
import "./AddAuto.css";
import { API_BASE_URL } from "../assets/config";
import Swal from "sweetalert2";

function AddAuto() {
  const [autoData, setAutoData] = useState({
    marca: "",
    modelo: "",
    anio: "",
    kilometraje: "",
    nro_patente: "",
    nro_flota: "",
  });
  const [qrCodeValue, setQrCodeValue] = useState("");
  const qrRef = useRef(null); // Usado para referenciar el QRCode
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(35), (val, index) => currentYear - index);
  const marcas = ["Mercedez Benz", "Volkswagen", "Renault", "Iveco"];
  const modelos = {
    "Mercedez Benz": ["Actros", "Arocs", "Atego", "Econic"],
    Volkswagen: ["Delivery", "Constellation", "Meteor"],
    Renault: ["Master", "Trafic", "D-Truck", "Midlum"],
    Iveco: ["Stralis", "Trakker", "Eurocargo"],
  };
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedModelo, setSelectedModelo] = useState("");
  const handleMarcaChange = (e) => {
    setSelectedMarca(e.target.value);
    setSelectedModelo("");
    const { value } = e.target;
    setAutoData({ ...autoData, marca: value });
  }; // Resetear el modelo seleccionado cuando cambia la marca };
  const handleModeloChange = (e) => {
    setSelectedModelo(e.target.value);
    const { value } = e.target;
    setAutoData({ ...autoData, modelo: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAutoData({ ...autoData, [name]: value });
  };
  const handleKilometerChange = (e) => {
    const { value } = e.target;
    if (value >= 0 || value === "") {
      setAutoData({ ...autoData, kilometraje: value });
    }
  };

  const handleAddAuto = async () => {
    // Validaciones
    const marcaRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const modeloRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;
    const patenteRegex = /^([a-zA-Z]{3}\d{3}|[a-zA-Z]{2}\d{3}[a-zA-Z]{2})$/;

    if (!marcaRegex.test(autoData.marca)) {
        alert("La marca solo puede contener letras y espacios.");
        return;
    }
    if (!modeloRegex.test(autoData.modelo)) {
        alert("El modelo solo puede contener letras, números y espacios.");
        return;
    }
    if (!patenteRegex.test(autoData.nro_patente)) {
        alert("El número de patente debe seguir el formato ABC123 o AB123CD.");
        return;
    }

    try {
        // Verificar si el auto ya existe
        const response = await axios.get(`${API_BASE_URL}/autos/nro_patente/${autoData.nro_patente}`);
        const autoExistente = response.data;

        if (autoExistente) { 
            await Swal.fire({
                title: 'Patente existente',
                text: 'Ya existe un vehículo con esta patente.',
                icon: 'info',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        // Si la patente no existe, proceder a agregar el auto
        const postResponse = await axios.post(`${API_BASE_URL}/autos`, {
            ...autoData,
            codigo_qr: ""
        });

        const autoId = postResponse.data.id;
        const qrUrl = `${API_BASE_URL}/autos/${autoId}`;
        setQrCodeValue(qrUrl);

        Swal.fire({
            title: "¡Carga exitosa!",
            text: "La información del auto se ha cargado correctamente.",
            icon: "success",
            confirmButtonText: '<i class="fas fa-check"></i> Aceptar',
            customClass: {
                confirmButton: "swal-confirm-button",
            },
        });

    } catch (error) {
        console.error("Error al agregar auto:", error);
        Swal.fire({
            title: "¡Error!",
            text: "No se pudo agregar el auto al sistema.",
            icon: "error",
            confirmButtonText: "Aceptar",
        }).then(() => {
            navigate("/gestion-autos");
        });
    }
};


  const handleVolver = () => {
    navigate("../gestion-autos");
  };

  const handleDownloadQR = () => {
    if (qrRef.current) {
      toPng(qrRef.current)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `${autoData.nro_patente}-qr-code.png`;
          link.click();
        })
        .catch((error) => {
          console.error("Error al generar la imagen QR:", error);
        });
    }
  };

  return (
    <div className="add-auto">
      <h2>Agregar Nuevo Auto</h2>
      <select name="marca" value={selectedMarca} onChange={handleMarcaChange}>
        {" "}
        <option value="" disabled>
          {" "}
          Seleccione la marca del vehículo{" "}
        </option>{" "}
        {marcas.map((marca) => (
          <option key={marca} value={marca}>
            {" "}
            {marca}{" "}
          </option>
        ))}{" "}
      </select>

      <select
        name="modelo"
        value={selectedModelo}
        onChange={handleModeloChange}
        required
      >
        <option value="" disabled>
          Selecciona un modelo
        </option>{" "}
        {selectedMarca &&
          modelos[selectedMarca].map((modelo) => (
            <option key={modelo} value={modelo}>
              {modelo}
            </option>
          ))}
      </select>

      <select name="anio" defaultValue="" onChange={handleInputChange}>
        {" "}
        <option value="" disabled>
          {" "}
          Selecciona el año del modelo{" "}
        </option>{" "}
        {years.map((year) => (
          <option key={year} value={year}>
            {" "}
            {year}{" "}
          </option>
        ))}{" "}
      </select>

      <input
        type="text"
        name="kilometraje"
        placeholder="Kilometraje"
        value={autoData.kilometraje}
        onChange={handleKilometerChange}
      />

      <input
        type="text"
        name="nro_patente"
        placeholder="Número de Patente"
        value={autoData.nro_patente}
        onChange={handleInputChange}
      />

      <button onClick={handleAddAuto} className="btn-add-auto">
        Agregar Auto
      </button>
      <button onClick={handleVolver} className="btn-back-add-auto">
        Volver
      </button>

      {/* Generar el código QR basado en la URL del auto */}
      {qrCodeValue && (
        <div>
          <div ref={qrRef}>
            <QRCode
              value={qrCodeValue}
              size={256} // Ajusta el tamaño del QR
              bgColor="white" // Fondo blanco alrededor del QR
              fgColor="black" // Color del QR
              level="H" // Nivel de corrección de errores
            />
          </div>
          <button onClick={handleDownloadQR}>Descargar QR como imagen</button>
        </div>
      )}
    </div>
  );
}

export default AddAuto;
