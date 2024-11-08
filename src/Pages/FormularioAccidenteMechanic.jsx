import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FormularioAccidenteMechanic.css";
/* import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; */
/* import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"; */
import axios from "axios";
import { API_BASE_URL } from "../assets/config";

const FormularioAccidenteMechanic = () => {
  const navigate = useNavigate();
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [error, setError] = useState("");
  const [productos, setProductos] = useState([]);
  const [productosUtilizados, setProductosUtilizados] = useState([
    { producto: "", cantidad: "" },
  ]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/productos`);
        setProductos(response.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setProductos([]);
      }
    };
    fetchProductos();
  }, []);

  const handleProductoChange = (index, e) => {
    const newProductos = [...productosUtilizados];
    newProductos[index].producto = parseInt(e.target.value, 10); // Convertir a número
    setProductosUtilizados(newProductos);
  };

  const handleCantidadChange = (index, cantidad) => {
    const newProductos = [...productosUtilizados];
    newProductos[index].cantidad = parseInt(cantidad, 10); // Convertir a número
    setProductosUtilizados(newProductos);

    const newErrors = [...errors];
    newErrors[index] = cantidad < 0 ? " No puede ser negativo" : "";
    setErrors(newErrors);
  };

  const agregarFilaProducto = () => {
    setProductosUtilizados([
      ...productosUtilizados,
      { producto: "", cantidad: "" },
    ]);
    setErrors([...errors, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!descripcion) {
      setError("La descripción no puede estar vacía.");
      return;
    }

    if (
      productosUtilizados.some(
        (item) => !item.producto || item.cantidad <= 0
      )
    ) {
      setError("Debes seleccionar al menos un producto con una cantidad válida.");
      return;
    }

    if (!ubicacion) {
      setError("Debes seleccionar una ubicación (taller o misma ubicación).");
      return;
    }

    setError("");

    if (window.confirm("¿Estás seguro de que quieres finalizar con el formulario?")) {
      try {
        // 1. Crear el informe
        const informeData = {
          descripcion,
          taller: ubicacion === 'taller',
          mismaUbicacion: ubicacion === 'misma_ubicacion',
        };

        const informeResponse = await axios.post(`${API_BASE_URL}/informes/crear-informe`, informeData);
        const informeId = informeResponse.data.id_informe;

        // 2. Agregar productos al informe (ciclo for en el frontend)
        for (const producto of productosUtilizados) {
          const productoData = {
            id_producto: producto.producto,
            cantidad: producto.cantidad,
          };

          await axios.post(`${API_BASE_URL}/informes/${informeId}/agregar-producto`, productoData);
        }

        // Redirigir al usuario
        navigate('/busqueda-auto-mecanico');
      } catch (error) {
        console.error("Error al guardar el informe:", error);
        setError("Hubo un error al guardar el informe.");
      }
    }
  };

  return (
    <form className='formulario-accidente' onSubmit={handleSubmit}>
      <label>Descripción del problema:</label>
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        rows='4'
        required
      />

      {error && <div className='error-alert'>{error}</div>}

      <h2>Productos utilizados</h2>
      <table className='productos-table'>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {productosUtilizados.map((item, index) => (
            <tr key={index}>
              <td>
                <select
                  value={item.producto}
                  onChange={(e) => handleProductoChange(index, e)}
                >
                  <option value=''>Seleccionar producto</option>
                  {productos.map((producto) => (
                    <option key={producto.id_producto} value={producto.id_producto}>
                      {producto.nombre} - {producto.marca} - {producto.modelo} -
                      Cantidad: {producto.cantidad}
                    </option>
                  ))}
                </select>
                {errors[index] && !item.producto && (
                  <div className='error-message'>
                    {/* <FontAwesomeIcon icon={faExclamationCircle} /> */}
                    <span>{errors[index]}</span>
                  </div>
                )}
              </td>
              <td>
                <input
                  type='number'
                  value={item.cantidad}
                  onChange={(e) => handleCantidadChange(index, e.target.value)}
                  placeholder='Cantidad'
                />
                {errors[index] && item.cantidad < 0 && (
                  <div className='error-message'>
                   {/*  <FontAwesomeIcon icon={faExclamationCircle} /> */}
                    <span>{errors[index]}</span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className='add-product-btn' onClick={agregarFilaProducto}>
        +
      </button>

      <div className='ubicacion-opciones'>
        <label>
          <input
            type='radio'
            name='ubicacion'
            value='taller'
            checked={ubicacion === "taller"}
            onChange={() => setUbicacion("taller")}
          />
          Taller
        </label>
        <label>
          <input
            type='radio'
            name='ubicacion'
            value='misma_ubicacion'
            checked={ubicacion === "misma_ubicacion"}
            onChange={() => setUbicacion("misma_ubicacion")}
          />
          Misma Ubicación
        </label>
      </div>

      <button type='submit'>Enviar</button>
    </form>
  );
};

export default FormularioAccidenteMechanic;