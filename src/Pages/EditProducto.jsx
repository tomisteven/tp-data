import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
/* import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faBan} from '@fortawesome/free-solid-svg-icons'; */
import "./EditProducto.css";
import { API_BASE_URL } from "../assets/config"; // Asegúrate de que esta ruta sea correcta
import Swal from "sweetalert2";

const EditProducto = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/productos/${id}`);
        if (response.data) {
          setProducto(response.data);
        }
      } catch (error) {
        console.error("Error al obtener el producto de la API:", error);
      }
    };
    fetchProducto();
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!producto.nombre) {
      newErrors.nombre = "El nombre es obligatorio.";
    }
    if (!producto.marca) {
      newErrors.marca = "La marca es obligatoria.";
    }
    if (!producto.modelo) {
      newErrors.modelo = "El modelo es obligatorio.";
    }
    if (!producto.categoria) {
      newErrors.categoria = "La categoría es obligatoria.";
    }
    if (!producto.cantidad || isNaN(producto.cantidad)) {
      newErrors.cantidad = "La cantidad debe ser un número.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
        console.log(producto);
        try {
            await axios.put(`${API_BASE_URL}/productos/modificar-producto/${id}`, {
                nombre: producto.nombre,
                marca: producto.marca,
                modelo: producto.modelo,
                categoria: producto.categoria,
                cantidad: producto.cantidad,
                activo: producto.activo, // Asegúrate de enviar el campo 'activo' también
            });
            console.log("Cambios guardados:", producto);
            Swal.fire({
                title: '¡Éxito!',
                text: 'Los datos del producto han sido actualizados correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            navigate("/productos"); // Redirect after saving
        } catch (error) {
            console.error("Error al guardar los cambios del producto:", error);
            Swal.fire({
                title: '¡Error!',
                text: 'No pudimos actualizar los datos de este producto. Por favor, intenta de nuevo mas tarde.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            navigate("/productos");
        }
    }
};


  const handleBack = () => {
    navigate("/productos");
  };

  if (!producto) {
    return <p>Producto no encontrado</p>;
  }

  return (
    <div className="edit-producto-container">
      <h2>Modificar Producto</h2>
      <form className="edit-producto-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            className="input-item"
            type="text"
            value={producto.nombre}
            onChange={(e) =>
              setProducto({ ...producto, nombre: e.target.value })
            }
            required
          />
          {errors.nombre && <span className="error">{errors.nombre}</span>}
        </div>
        <div className="form-group">
          <label>Marca:</label>
          <input
            className="input-item"
            type="text"
            value={producto.marca}
            onChange={(e) =>
              setProducto({ ...producto, marca: e.target.value })
            }
            required
          />
          {errors.marca && <span className="error">{errors.marca}</span>}
        </div>
        <div className="form-group">
          <label>Modelo:</label>
          <input
            className="input-item"
            type="text"
            value={producto.modelo}
            onChange={(e) =>
              setProducto({ ...producto, modelo: e.target.value })
            }
            required
          />
          {errors.modelo && <span className="error">{errors.modelo}</span>}
        </div>
        <div className="form-group">
          <label>Categoría:</label>
          {/* <input
            className="input-item"
            type="text"
            value={producto.categoria}
            onChange={(e) =>
              setProducto({ ...producto, categoria: e.target.value })
            }
            required
          /> */}
          <select
            className="input-item"
            value={producto.categoria}
            onChange={(e) =>
              setProducto({ ...producto, categoria: e.target.value })
            }
            required
          >
            <option value="">Selecciona una categoría</option>
            <option value="10">Aire acondicionado</option>
            <option value="Amortiguadores">Amortiguadores</option>
            <option value="Baterias">Baterías</option>
            <option value="Correas">Correas</option>
            <option value="Cristales">Cristales</option>
            <option value="Direccion">Dirección</option>
            <option value="Escape">Escape</option>
            <option value="Espejos">Espejos</option>
            <option value="Filtros">Filtros</option>
            <option value="Frenos">Frenos</option>
            <option value="Lubricantes">Lubricantes</option>
            <option value="Luces">Luces</option>
            <option value="Motores">Motores</option>
            <option value="Neumaticos">Neumáticos</option>
            <option value="Paragolpes">Paragolpes</option>
            <option value="Radiadores">Radiadores</option>
            <option value="Sistemas electricos">Sistemas eléctricos</option>
            <option value="Sensores">Sensores</option>
            <option value="Suspencion">Suspensión</option>
            <option value="Transmision">Transmisión</option>
          </select>
          {errors.categoria && (
            <span className="error">{errors.categoria}</span>
          )}
        </div>
        <div className="form-group">
          <label>Cantidad:</label>
          <input
            className="input-item"
            type="number"
            min="0"
            step="1"
            placeholder="Cantidad"
            value={producto.cantidad}
            onChange={(e) =>
              setProducto({ ...producto, cantidad: e.target.value })
            }
            required
          />
          {errors.cantidad && <span className="error">{errors.cantidad}</span>}
        </div>
        <button type="submit" className="submit-button">
          act1
         {/*  <FontAwesomeIcon icon={faFloppyDisk} style={{color: "#ffffff",}} /> */}
        </button>
      </form>
      <button className="btn-cancelar-edit-prod" onClick={handleBack}>
        act2
      {/* <FontAwesomeIcon icon={faBan} style={{color: "#ffffff",}} /> */}
      </button>
    </div>
  );
};

export default EditProducto;
