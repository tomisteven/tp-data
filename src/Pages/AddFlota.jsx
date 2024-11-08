import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../assets/config";
/* import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk} from '@fortawesome/free-solid-svg-icons'; */
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "./AddFlota.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AddFlota() {
  const [flotaName, setFlotaName] = useState("");
  const [flotas, setFlotas] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlotas = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/flotas`); // Ensure this endpoint returns active fleets only
        const flotasConAutos = await Promise.all(
          response.data.map(async (flota) => {
            const autoResponse = await axios.get(
              `${API_BASE_URL}/flotas/${flota.id}/autos`
            );
            return { ...flota, autos: autoResponse.data };
          })
        );
        setFlotas(flotasConAutos);
      } catch (error) {
        console.error("Error al obtener flotas:", error);
        alert(
          `Error al obtener flotas: ${
            error.response?.data?.error || error.message
          }`
        );
      }
    };
    fetchFlotas();
  }, []);

  const handleSaveFlota = async () => {
    if (flotaName === "") {
      setError("Por favor, ingresa un nombre para la flota.");
      return;
    }

    // Verificar si ya existe una flota con el mismo nombre
    const flotaExiste = flotas.some(
      (flota) => flota.nombre.toLowerCase() === flotaName.toLowerCase()
    );

    if (flotaExiste) {
      Swal.fire({
        title: "Nombre en uso",
        text: "Ya existe una flota con este nombre. Por favor, elige otro nombre.",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    // Si el nombre es único, proceder con la creación
    try {
      const flotaData = { nombre: flotaName };
      const response = await axios.post(
        `${API_BASE_URL}/flotas-crear`,
        flotaData
      );
      Swal.fire({
        title: "¡Éxito!",
        text: "La flota se ha creado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      setFlotaName("");
      setError("");
      const autoResponse = await axios.get(
        `${API_BASE_URL}/flotas/${response.data.id}/autos`
      );
      const nuevaFlotaConAutos = { ...response.data, autos: autoResponse.data };
      setFlotas([...flotas, nuevaFlotaConAutos]);
    } catch (error) {
      console.error("Error al guardar flota:", error);
      Swal.fire({
        title: "¡Error!",
        text: "No pudimos crear la flota correctamente. Por favor, intenta de nuevo más tarde.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleEditFlota = (id) => {
    navigate(`/admin-flotas/edit/${id}`);
  };

  const handleDeleteFlota = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/flotas/${id}`);
        setFlotas(flotas.filter((flota) => flota.id !== id));
        Swal.fire({
          title: "Eliminado",
          text: "La flota ha sido eliminada correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      } catch (error) {
        console.error("Error al eliminar flota:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al eliminar la flota.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    }
  };

  const handleDeleteAuto = async (flotaId, autoId) => {
    try {
      await axios.put(`${API_BASE_URL}/flotas/${flotaId}/autos/${autoId}`);
      setFlotas(
        flotas.map((flota) =>
          flota.id === flotaId
            ? {
                ...flota,
                autos: flota.autos.filter((auto) => auto.id !== autoId),
              }
            : flota
        )
      );
      navigate("/admin-flotas");
    } catch (error) {
      console.error("Error al eliminar auto:", error);
      alert(
        `Error al eliminar el auto: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  const handleAddAuto = (flotaId) => {
    navigate(`/admin-flotas/${flotaId}/add-auto`);
  };
  return (
    <div className="add-flota-container">
      <div className="input-container">
        <h2>Administración de Flotas</h2>
        <div className="crear-flota-container">
          <h3 className="h3">Crear Flota</h3>
          {error && <div className="error-banner">{error}</div>}
          <input
            type="text"
            placeholder="Nombre de la Flota"
            value={flotaName}
            onChange={(e) => setFlotaName(e.target.value)}
            className="flota-input"
          />
          <button className="save-flota-button" onClick={handleSaveFlota}>
            1
            {/* <FontAwesomeIcon icon={faFloppyDisk} style={{color: "#ffffff",}} /> */}
          </button>
        </div>
      </div>
      <h2 className="flotas-header">Flotas</h2>
      <div className="flotas-tables">
        {flotas.map((flota, index) => (
          <div key={index} className="flota-table-container">
            <div className="flota-header">
              <h3>{flota.nombre}</h3>
              <div className="flota-actions">
                <button
                  className="edit-flota-button"
                  onClick={() => handleEditFlota(flota.id)}
                >
                  <FaEdit />
                </button>
                <button
                  className="delete-flota-button"
                  onClick={() => handleDeleteFlota(flota.id)}
                >
                  <FaTrash />
                </button>
                <button
                  className="add-flota-button"
                  onClick={() => handleAddAuto(flota.id)}
                >
                  <FaPlus color="green" />
                </button>
              </div>
            </div>
            <table className="flota-table">
              <thead>
                <tr>
                  <th>Patente</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Año</th>
                  <th>Kilometraje</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {flota.autos?.map((auto) => (
                  <tr key={auto.id}>
                    <td>{auto.nro_patente}</td>
                    <td>{auto.marca}</td>
                    <td>{auto.modelo}</td>
                    <td>{auto.anio}</td>
                    <td>{auto.kilometraje}</td>
                    <td>
                      <button
                        className="delete-flota-button"
                        onClick={() => handleDeleteAuto(flota.id, auto.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddFlota;
