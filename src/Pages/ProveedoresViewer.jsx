import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
/* import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash,faPenToSquare} from '@fortawesome/free-solid-svg-icons'; */
import "./ProveedoresViewer.css";
import { API_BASE_URL } from "../assets/config"; // Asegúrate de que esta ruta sea correcta
import Swal from 'sweetalert2';

const ProveedoresViewer = () => {
  const [proveedores, setProveedores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/proveedores/activos`); // Endpoint de la API para obtener los proveedores
        setProveedores(response.data);
      } catch (error) {
        console.error("Error al obtener los proveedores de la API:", error);
      }
    };
    fetchProveedores();
  }, []);

  const handleDelete = async (id) => {
    try {
      const confirmResult = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Eliminar este proveedor es una acción crítica.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar'
      });

      if (!confirmResult.isConfirmed) return;

      const ordersWarning = await Swal.fire({
        title: 'Advertencia',
        text: "Eliminar este proveedor inactivará las órdenes de compra asociadas a él. ¿Deseas continuar?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar'
      });

      if (!ordersWarning.isConfirmed) return;

      const motivoResult = await Swal.fire({
        title: 'Motivo de baja',
        input: 'radio',
        inputOptions: {
          'Incumplimiento en entregas': 'Incumplimiento en entregas',
          'Precios no competitivos': 'Precios no competitivos',
          'Problemas de calidad': 'Problemas de calidad',
          'Otro': 'Otro motivo'
        },
        inputValidator: (value) => {
          if (!value) {
            return 'Debes seleccionar un motivo para continuar';
          }
        },
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      });

      if (!motivoResult.isConfirmed) return;

      let motivoSeleccionado = motivoResult.value;

      if (motivoSeleccionado === 'Otro') {
        const customReason = await Swal.fire({
          title: 'Especifica el motivo',
          input: 'text',
          inputPlaceholder: 'Ingresa el motivo de baja',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          inputValidator: (value) => {
            if (!value) {
              return 'Debes ingresar un motivo para continuar';
            }
          }
        });

        if (!customReason.isConfirmed) return;
        motivoSeleccionado = customReason.value;
      }

      // Cambiamos el nombre del campo a 'razon_baja' en el cuerpo de la solicitud
      await axios.put(`${API_BASE_URL}/proveedores/${id}/inactivo`, { razon_baja: motivoSeleccionado });
      setProveedores((prevProveedores) =>
        prevProveedores.filter((proveedor) => proveedor.id_proveedor !== id)
      );

      Swal.fire('Proveedor eliminado', 'El proveedor ha sido dado de baja exitosamente.', 'success');

    } catch (error) {
      console.error("Error al cambiar el estado del proveedor:", error);
    }
  };


  // Función para redirigir a la página de edición de proveedores
  const handleEdit = (id) => {
    navigate(`/edit-proveedor/${id}`);
  };

  return (
    <div className="proveedores-viewer">
      <h2>Lista de Proveedores Activos</h2>
      <button
        className="add-button"
        onClick={() => navigate("/agregar-proveedor")}
      >
        +
      </button>
      <div className="proveedores-list">
        {proveedores.length === 0 ? (
          <p>No hay proveedores activos disponibles.</p>
        ) : (
          proveedores.map((proveedor) => (
            <div key={proveedor.id_proveedor} className="proveedor-card">
              <h3>{proveedor.nombre}</h3>
              <p>
                <strong>CUIT:</strong> {proveedor.cuil}
              </p>
              <p>
                <strong>Correo electrónico:</strong> {proveedor.email}
              </p>
              <p>
                <strong>Dirección:</strong> {proveedor.direccion}
              </p>
              <p>
                <strong>Teléfono:</strong> {proveedor.telefono}
              </p>
              <div className="action-buttons">
                <button
                  className="edit-button"
                  onClick={() => handleEdit(proveedor.id_proveedor)}
                >
                  1
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(proveedor.id_proveedor)}
                >
                  2
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProveedoresViewer;
