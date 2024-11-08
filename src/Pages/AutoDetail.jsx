import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import styles from "./AutoDetail.module.css";
import { API_BASE_URL } from "../assets/config";

function AutoDetail() {
  const { id } = useParams();
  const [auto, setAuto] = useState(null);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [newMantenimiento, setNewMantenimiento] = useState({
    fecha: "",
    tipo_de_mantenimiento: "",
    descripcion: "",
    productos: [],
  });
  const [error, setError] = useState("");
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    // Obtener datos del auto
    axios.get(`${API_BASE_URL}/autos/${id}`)
      .then((response) => setAuto(response.data))
      .catch((error) => console.error("Error al obtener los detalles del auto:", error));

    // Obtener historial de mantenimiento
    axios.get(`${API_BASE_URL}/autos/${id}/mantenimientos`)
      .then((response) => setMantenimientos(response.data))
      .catch((error) => console.error("Error al obtener el historial de mantenimiento:", error));

    // Obtener todos los productos
    axios.get(`${API_BASE_URL}/productos`)
      .then((response) => setAllProducts(response.data))
      .catch((error) => console.error("Error al obtener la lista de productos:", error));
  }, [id]);

  if (!auto) {
    return <p>Auto no encontrado</p>;
  }

  const handleAddMantenimiento = () => {
    const { fecha, tipo_de_mantenimiento, descripcion, productos } = newMantenimiento;

    if (!fecha || !tipo_de_mantenimiento || !descripcion) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (productos.length === 0) {
      setError("Debe agregar al menos un producto.");
      return;
    }

    for (const producto of productos) {
      if (!producto.producto_id) {
        setError("Por favor, selecciona un producto en cada campo de producto.");
        return;
      }
      if (!producto.cantidad || producto.cantidad < 1) {
        setError("La cantidad de cada producto debe ser al menos 1.");
        return;
      }
    }

    const mantenimientoData = {
      auto_id: auto.id,
      ...newMantenimiento,
    };

    axios.post(`${API_BASE_URL}/autos/${id}/mantenimientos`, mantenimientoData)
      .then((response) => {
        setMantenimientos([...mantenimientos, response.data]);
        setNewMantenimiento({
          fecha: "",
          tipo_de_mantenimiento: "",
          descripcion: "",
          productos: [],
        });
        setError("");
        Swal.fire({
          title: '¡Carga exitosa!',
          text: 'La información del mantenimiento del auto se ha actualizado correctamente.',
          icon: 'success',
          confirmButtonText: '<i class="fas fa-check"></i> Aceptar',
          customClass: {
              confirmButton: 'swal-confirm-button'
          }
      }).then(() => {
          navigate('/busqueda-auto-mecanico');
      });
      })
      .catch((error) => console.error("Error al agregar mantenimiento:", error)); 
      Swal.fire({
        title: '¡Error!',
        text: 'No se pudo agregar al mantenimiento al sistema.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
    }).then(() => {
        navigate('/busqueda-auto-mecanico');
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "tipo_de_mantenimiento") {
      const regex = /^[A-Za-z\s]*$/;
      if (!regex.test(value)) {
        return;
      }
    }

    setNewMantenimiento((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...newMantenimiento.productos];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [name]: name === "cantidad" ? (value === "" ? "" : Math.max(1, Number(value))) : value,
    };
    setNewMantenimiento((prevState) => ({
      ...prevState,
      productos: updatedProducts,
    }));
  };

  const addProductField = () => {
    setNewMantenimiento((prevState) => ({
      ...prevState,
      productos: [
        ...prevState.productos,
        { producto_id: "", cantidad: "" },
      ],
    }));
  };

  const getAvailableProducts = () => {
    const selectedProductIds = newMantenimiento.productos.map(
      (producto) => producto.producto_id
    );
    return allProducts.filter(
      (product) => !selectedProductIds.includes(product.id)
    );
  };

  return (
    <div className={styles.autoDetail}>
      <h2>Detalles del Auto</h2>
      <h3>{auto.marca} {auto.modelo}</h3>
      <p><strong>Año:</strong> {auto.anio}</p>
      <p><strong>Kilometraje:</strong> {auto.kilometraje} km</p>
      <p><strong>Patente:</strong> {auto.nro_patente}</p>

      <h3>Historial de Mantenimiento</h3>
      {mantenimientos.length > 0 ? (
        <table className={styles.maintenanceTable}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo de Mantenimiento</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {mantenimientos.map((item, index) => (
              <tr key={index}>
                <td>{item.fecha}</td>
                <td>{item.tipo_de_mantenimiento}</td>
                <td>{item.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron registros de mantenimiento.</p>
      )}

      <h3>Agregar Mantenimiento</h3>
      {error && <p className={styles.error}>{error}</p>}
      <input
        type="date"
        name="fecha"
        value={newMantenimiento.fecha}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="tipo_de_mantenimiento"
        placeholder="Tipo de Mantenimiento"
        value={newMantenimiento.tipo_de_mantenimiento}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="descripcion"
        placeholder="Descripción"
        value={newMantenimiento.descripcion}
        onChange={handleInputChange}
      />

      <h4>Productos Utilizados</h4>
      {newMantenimiento.productos.map((producto, index) => (
        <div key={index} className={styles.productInput}>
          <select
            name="producto_id"
            value={producto.producto_id}
            onChange={(e) => handleProductChange(index, e)}
          >
            <option value="">Selecciona un producto</option>
            {getAvailableProducts().map((product) => (
              <option key={product.id} value={product.id}>
                {product.nombre}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="cantidad"
            min="1"
            value={producto.cantidad}
            placeholder="Cantidad"
            onChange={(e) => handleProductChange(index, e)}
          />
        </div>
      ))}
      <button type="button" onClick={addProductField}>Agregar Producto</button>

      <button onClick={handleAddMantenimiento}>Agregar Mantenimiento</button>

      <Link to="/busqueda-auto-mecanico" className={styles.backLink}>Volver</Link>
    </div>
  );
}

export default AutoDetail;
