import  { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
/* import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons"; */
import "./AddOrden.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../assets/config";

const AddOrden = () => {
  const [proveedores, setProveedores] = useState([]);
  const [proveedoresMap, setProveedoresMap] = useState({});
  const [productos, setProductos] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState("");
  const [ordenProductos, setOrdenProductos] = useState([
    { producto: "", cantidad: "" },
  ]);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar proveedores activos
    const fetchProveedores = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/proveedores/activos`);
        const proveedoresActivos = response.data.filter(
          (proveedor) => proveedor.activo
        );
        setProveedores(proveedoresActivos);

        // Crear el objeto de mapeo
        const map = {};
        proveedoresActivos.forEach((proveedor) => {
          map[proveedor.nombre] = proveedor.id_proveedor;
        });
        setProveedoresMap(map);
      } catch (error) {
        console.error("Error al cargar proveedores:", error);
      }
    };
    fetchProveedores();
  }, []);

  const fetchProductosPorProveedor = async (proveedorId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/productos/productos-por-proovedor/${proveedorId}`
      );
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos del proveedor:", error);
      setProductos([]);
    }
  };

  const handleProveedorChange = (e) => {
    const proveedorNombre = e.target.value;
    setSelectedProveedor(proveedorNombre);
    const proveedorId = proveedoresMap[proveedorNombre];

    if (proveedorId) {
      fetchProductosPorProveedor(proveedorId);
    } else {
      setProductos([]);
    }
  };

  const handleProductoChange = (index, e) => {
    const newProductos = [...ordenProductos];
    newProductos[index].producto = e.target.value;
    setOrdenProductos(newProductos);
  };

  const handleCantidadChange = (index, cantidad) => {
    const newProductos = [...ordenProductos];
    newProductos[index].cantidad = cantidad;
    setOrdenProductos(newProductos);

    const newErrors = [...errors];
    newErrors[index] = cantidad < 0 ? " No puede ser negativo" : "";
    setErrors(newErrors);
  };

  const agregarFilaProducto = () => {
    setOrdenProductos([...ordenProductos, { producto: "", cantidad: "" }]);
    setErrors([...errors, ""]);
  };

  const handleAgregarOrden = async () => {
    if (!selectedProveedor) {
      Swal.fire("Error", "Por favor, selecciona un proveedor.", "error");
      return;
    }

    if (ordenProductos.some((item) => !item.producto || item.cantidad <= 0)) {
      Swal.fire(
        "Error",
        "Por favor, selecciona productos y cantidades válidas.",
        "error"
      );
      return;
    }

    // Verificar que el array productos no esté vacío
    if (!productos || productos.length === 0) {
      Swal.fire(
        "Error",
        "No hay productos disponibles para este proveedor.",
        "error"
      );
      return;
    }

    // Generar un total aleatorio entre 100 y 1000
    const totalInventado = Math.floor(Math.random() * 900) + 100;

    const nuevaOrden = {
      id_proveedor: proveedoresMap[selectedProveedor],
      fecha_creacion: new Date().toISOString().split("T")[0],
      total: totalInventado, // Asignar el total inventado
      estado: "creada", // Asegurarse de que el estado sea "creada"
      productos: ordenProductos.map((item) => ({
        id_producto: item.producto,
        cantidad: parseInt(item.cantidad),
      })),
    };

    try {
      // Ajustar la URL de la API si es necesario
      const response = await axios.post(
        `${API_BASE_URL}/ordenes_de_compra/crear-orden`,
        nuevaOrden
      );

      // Mostrar la respuesta de la API en la consola
      console.log("Respuesta de la API:", response);

      Swal.fire(
        "Orden agregada",
        "La orden de compra ha sido agregada con éxito.",
        "success"
      );
      navigate("/ordenes-de-compra");
    } catch (error) {
      // Mostrar el error completo en la consola
      console.error("Error al agregar la orden de compra:", error);

      // Mostrar un mensaje de error más informativo al usuario
      let errorMessage = "Hubo un problema al agregar la orden de compra.";
      if (error.response) {
        errorMessage += `\nCódigo de error: ${error.response.status}`;
        if (error.response.data && error.response.data.error) {
          errorMessage += `\nMensaje del servidor: ${error.response.data.error}`;
        }
      }
      Swal.fire("Error", errorMessage, "error");
    }
  };

  return (
    <div className="agregar-orden-container">
      <div className="agregar-orden-header">
        <h1>Agregar Nueva Orden de Compra</h1>
        <button className="add-order-btn" onClick={handleAgregarOrden}>
          act1
          {/* <FontAwesomeIcon icon={faCheck} style={{ color: "#ffffff" }} /> */}
        </button>
      </div>

      <div className="form-group">
        <select value={selectedProveedor} onChange={handleProveedorChange}>
          <option value="">Seleccionar proveedor</option>
          {proveedores.map((proveedor) => (
            <option key={proveedor.id} value={proveedor.nombre}>
              {proveedor.nombre}
            </option>
          ))}
        </select>
      </div>

      <h2>Productos</h2>
      <table className="productos-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {ordenProductos.map((item, index) => (
            <tr key={index}>
              <td>
                <select
                  value={item.producto}
                  onChange={(e) => handleProductoChange(index, e)}
                >
                  <option value="">Seleccionar producto</option>
                  {productos.map((producto) => (
                    <option key={producto.id_producto} value={producto.id_producto}>
                      {producto.nombre} - {producto.marca} - {producto.modelo} -
                      Cantidad: {producto.cantidad}
                    </option>
                  ))}
                </select>
                {errors[index] && !item.producto && (
                  <div className="error-message">
                    act2
                   {/*  <FontAwesomeIcon icon={faExclamationCircle} /> */}
                    <span>{errors[index]}</span>
                  </div>
                )}
              </td>
              <td>
                <input
                  type="number"
                  value={item.cantidad}
                  onChange={(e) => handleCantidadChange(index, e.target.value)}
                  placeholder="Cantidad"
                />
                {errors[index] && item.cantidad < 0 && (
                  <div className="error-message">
                    act3
                    {/* <FontAwesomeIcon icon={faExclamationCircle} /> */}
                    <span>{errors[index]}</span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-product-btn" onClick={agregarFilaProducto}>
        +
      </button>
    </div>
  );
};

export default AddOrden;