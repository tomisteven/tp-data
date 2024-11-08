import { useState } from "react";
import axios from "axios";
/* import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark,faCircleCheck} from '@fortawesome/free-solid-svg-icons'; */
import { API_BASE_URL } from "../assets/config";
import "./AddBills.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function MyBills() {
  const navigate = useNavigate();
  const [billsData, setBillsData] = useState({
    descripcion: "",
    monto: "",
    fecha: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillsData({ ...billsData, [name]: value });
  };

  const handleAddBills = () => {
    const billData = { ...billsData, estado: "pendiente" }; // Agregar estado por defecto
    axios
      .post(`${API_BASE_URL}/bills`, billData)
      .then((response) => {
        console.log("Gasto agregado:", response.data);
        Swal.fire({
          title: "¡Carga exitosa!",
          text: "El gasto se ha cargado correctamente.",
          icon: "success",
          confirmButtonText: '<i class="fas fa-check"></i> Aceptar',
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });
        navigate("/mis-gastos");
      })
      .catch((error) => {
        console.error("Error al agregar el gasto:", error);
        Swal.fire({
          title: "¡Error!",
          text: "No se pudo agregar el gasto al sistema.",
          icon: "error",
          confirmButtonText: "Aceptar",
        }).then(() => {
          navigate("/mis-gastos");
        });
      });
  };

  const handleReturnHome = () => {
    navigate("/mis-gastos");
  };

  return (
    <div className="add-bills-container">
      <h2>Agregar un nuevo Gasto</h2>
      <input
        type="text"
        name="descripcion"
        placeholder="Descripción"
        value={billsData.descripcion}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="monto"
        placeholder="1000.00$"
        value={billsData.monto}
        onChange={handleInputChange}
      />
      <input
        type="date"
        name="fecha"
        value={billsData.fecha}
        onChange={handleInputChange}
      />
      <button onClick={handleAddBills}>1</button>
      <button onClick={handleReturnHome} className="cancelar">
        2
      </button>
    </div>
  );
}

export default MyBills;
