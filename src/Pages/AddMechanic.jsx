import  { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
/* import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faBan} from '@fortawesome/free-solid-svg-icons'; */
import "./AddMechanic.css";
import { API_BASE_URL } from "../assets/config"; // Configuración del URL de la API

function AddMechanic() {
  const [mecanicoData, setMecanicoData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    correo_electronico: "",
    especialidad: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMecanicoData({ ...mecanicoData, [name]: value });
  };

  const handleAddMechanic = () => {
    // Validaciones
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // Solo letras y espacios
    const phoneRegex = /^\d{8,10}$/; // Solo números de 8 o 10 dígitos
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validación de correo estándar
    const specialtyRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // Solo letras y espacios

    if (!nameRegex.test(mecanicoData.nombre)) {
      alert("El nombre solo puede contener letras y espacios.");
      return;
    }

    if (!nameRegex.test(mecanicoData.apellido)) {
      alert("El apellido solo puede contener letras y espacios.");
      return;
    }

    if (!phoneRegex.test(mecanicoData.telefono)) {
      alert("El teléfono debe contener entre 8 y 10 dígitos.");
      return;
    }

    if (!emailRegex.test(mecanicoData.correo_electronico)) {
      alert("El correo electrónico no es válido.");
      return;
    }

    if (!specialtyRegex.test(mecanicoData.especialidad)) {
      alert("La especialidad solo puede contener letras y espacios.");
      return;
    }

    // Enviar los datos del mecánico al servidor
    axios
      .post(`${API_BASE_URL}/mecanicos`, mecanicoData)
      .then((response) => {
        console.log("Mecánico agregado:", response.data);
        navigate("/gestion-mecanicos"); // Redirigir a la página principal después de agregar
      })
      .catch((error) => {
        console.error("Error al agregar mecánico:", error);
      });
  };

  const handleBack = () => {
    navigate("/gestion-mecanicos");
  };

  return (
    <div className="add-mecanico">
      <h2>Agregar Nuevo Mecánico</h2>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={mecanicoData.nombre}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="apellido"
        placeholder="Apellido"
        value={mecanicoData.apellido}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="telefono"
        placeholder="Teléfono"
        value={mecanicoData.telefono}
        onChange={handleInputChange}
      />
      <input
        type="email"
        name="correo_electronico"
        placeholder="Correo Electrónico"
        value={mecanicoData.correo_electronico}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="especialidad"
        placeholder="Especialidad"
        value={mecanicoData.especialidad}
        onChange={handleInputChange}
      />
      <button onClick={handleAddMechanic} className="btn-agregar">
      1    </button>
      <button onClick={handleBack} className="btn-cancelar-add-mec">
      2    </button>
    </div>
  );
}

export default AddMechanic;
