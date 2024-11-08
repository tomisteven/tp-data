import  { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
/* import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBan, faFloppyDisk} from '@fortawesome/free-solid-svg-icons'; */
import "./EditMechanic.css";
import { API_BASE_URL } from "../assets/config";
import Swal from 'sweetalert2';

function EditMechanic() {
  const { id } = useParams();
  const [mecanicoData, setMecanicoData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    correo_electronico: "",
    especialidad: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/mecanicos/${id}`)
      .then((response) => setMecanicoData(response.data))
      .catch((error) =>
        console.error("Error al cargar los datos del mecánico:", error)
      );
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMecanicoData({ ...mecanicoData, [name]: value });
  };

  const handleSave = () => {
    // Validaciones
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const phoneRegex = /^\d{8,10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const specialtyRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

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

    // Guardar cambios en el servidor
    axios
      .put(`${API_BASE_URL}/mecanicos/${id}`, mecanicoData)
      .then((response) => {
        console.log("Mecánico actualizado:", response.data);
        Swal.fire({
          title: '¡Actualización exitosa!',
          text: 'La información del mecanico se ha actualizado correctamente.',
          icon: 'success',
          confirmButtonText: '<i class="fas fa-check"></i> Aceptar',
          customClass: {
              confirmButton: 'swal-confirm-button'
          }}).then(() => {
            navigate('/gestion-mecanicos');
        });
      })
      .catch((error) =>
        console.error("Error al actualizar el mecánico:", error),
      Swal.fire({
        title: '¡Error!',
        text: 'No pudimos actualizar la informacion correctamente. Por favor, intentalo de nuevo mas tarde.',
        icon: 'error',
        confirmButtonText: '<i class="fas fa-check"></i> Aceptar',
        customClass: {
            confirmButton: 'swal-confirm-button'}
        }).then(() => {
          navigate('/gestion-mecanicos');
      })
      );
  };

  const handleBack = () => {
    navigate("/gestion-mecanicos");
  };

  return (
    <div className="edit-mechanic">
      <h2>Editar Mecánico</h2>
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
      <button onClick={handleSave} className="btn-submit-edit-mec">
        act1
      {/* <FontAwesomeIcon icon={faFloppyDisk} style={{color: "#ffffff",}} /> */}
      </button>
      <button onClick={handleBack} className="btn-cancelar-edit-mec">
        act2
      {/* <FontAwesomeIcon icon={faBan} style={{color: "#ffffff",}} /> */}
      </button>
    </div>
  );
}

export default EditMechanic;
