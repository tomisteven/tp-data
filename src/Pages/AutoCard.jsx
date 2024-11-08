import { useNavigate } from "react-router-dom";
import "./AutoCard.css";
import { API_BASE_URL } from "../assets/config";
import Swal from "sweetalert2"; // Importa SweetAlert2
import axios from "axios";

const AutoCard = (auto) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/autos/${auto.id}`); // Navega a la página de detalles del auto
  };

  const handleEditCar = () => {
    navigate(`/edit-car/${auto.id}`); // Navega a la página de edición del auto
  };

  const handleDeleteCar = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_BASE_URL}/autos/eliminar_auto/${auto.nro_patente}`)
          .then(() => {
            Swal.fire("¡Eliminado!", "El auto ha sido eliminado.", "success");
            console.log("Auto eliminado");
          })
          .catch((error) => {
            Swal.fire(
              "Error",
              "Hubo un problema al eliminar el auto.",
              "error"
            );
            console.error("Error al eliminar el auto:", error);
          });
      }
    });
  };

  return (
    <div className="auto-card">
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
      <div className="auto-card__buttons">
        <button onClick={handleEditCar} className="edit-button">
          1
        </button>
        <button onClick={handleDeleteCar} className="delete-button">
          2
        </button>
      </div>
    </div>
  );
};

export default AutoCard;
