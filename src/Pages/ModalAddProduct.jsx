import { useState, useEffect } from "react";
import axios from "axios";
import "./ModalAddProduct.css";

import { API_BASE_URL } from "../assets/config";
import Swal from "sweetalert2";

function ModalAddProduct( onClose ) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    marca: "",
    modelo: "",
    categoria: "",
    cantidad: "",
    cantidad_minima: "", // Nuevo campo en el estado
    activo: true,
  });
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedModelo, setSelectedModelo] = useState("");
  const marcas = ["Mercedez Benz", "Volkswagen", "Renault", "Iveco"];
  const modelos = {
    "Mercedez Benz": ["Actros", "Arocs", "Atego", "Econic"],
    Volkswagen: ["Delivery", "Constellation", "Meteor"],
    Renault: ["Master", "Trafic", "D-Truck", "Midlum"],
    Iveco: ["Stralis", "Trakker", "Eurocargo"],
  };
  const handleMarcaChange = (e) => {
    setSelectedMarca(e.target.value);
    setSelectedModelo("");
    const { value } = e.target;
    setFormData({ ...formData, marca: value });
  }; // Resetear el modelo seleccionado cuando cambia la marca };
  const handleModeloChange = (e) => {
    setSelectedModelo(e.target.value);
    const { value } = e.target;
    setFormData({ ...formData, modelo: value });
  };
  const handleCantidadChange = (e) => {
    const { name, value } = e.target;
    if (value >= 0 || value === "") {
      setFormData({ ...formData, [name]: parseInt(value, 10) || "" });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/productos`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    fetchProducts();
  }, []);

  const categoriaMap = {
    "Aire acondicionado": 41,
    Amortiguadores: 44,
    Baterias: 48,
    Correas: 46,
    Cristales: 52,
    Direccion: 50,
    Escape: 47,
    Espejos: 54,
    Filtros: 60,
    Frenos: 45,
    Lubricantes: 49,
    Luces: 55,
    Motores: 56,
    Neumaticos: 58,
    Paragolpes: 53,
    Radiadores: 57,
    "Sistemas electricos": 42,
    Sensores: 43,
    Suspencion: 51,
    Transmision: 59,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (!value.trim()) {
      setError(`El campo ${name} es obligatorio.`);
    } else {
      setError("");
    }
  };

  const validateForm = () => {
    if (!formData.nombre.trim())
      return setError("El nombre del producto es obligatorio.");
    if (!formData.marca.trim()) return setError("La marca es obligatoria.");
    if (!formData.modelo.trim()) return setError("El modelo es obligatorio.");
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.modelo))
      return setError("El modelo solo puede contener letras.");
    if (
      !formData.categoria ||
      formData.categoria === "Selecciona una categoría"
    )
      return setError("La categoría es obligatoria.");
    // Validación para cantidad mínima
    if (formData.cantidad_minima <= 0)
      return setError("La cantidad mínima debe ser mayor que 0.");
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Verificación si ya existe un producto con la misma marca y modelo
    const exists = products.some(
      (product) =>
        product.marca === formData.marca && product.modelo === formData.modelo
    );

    if (exists) {
      Swal.fire({
        title: "Producto duplicado",
        text: "Ya existe un producto con la misma marca y modelo.",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    try {
      const formDataWithCategoryID = {
        ...formData,
        categoria: categoriaMap[formData.categoria],
      };
      await axios.post(
        `${API_BASE_URL}/productos/agregar-producto`,
        formDataWithCategoryID
      );
      Swal.fire({
        title: "¡Éxito!",
        text: "Se agrego el nuevo producto correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
        customClass: {
          container: "my-swal",
        },
      }).then(() => {
        onClose();
      });
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      Swal.fire({
        title: "¡Error!",
        text: "No se pudo agregar el producto al sistema.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div id="modal-container">
      <div id="form-product">
        <h2 id="tittle">Agregar Producto</h2>
        <input
          className="input-producto"
          name="nombre"
          placeholder="Producto"
          value={formData.nombre}
          disabled={isDisabled}
          onChange={handleInputChange}
          required
        />

        <select
          name="marca"
          value={selectedMarca}
          onChange={handleMarcaChange}
          className="input-producto"
        >
          {" "}
          <option value="" disabled>
            {" "}
            Seleccione la marca del vehículo{" "}
          </option>{" "}
          {marcas.map((marca) => (
            <option key={marca} value={marca}>
              {" "}
              {marca}{" "}
            </option>
          ))}{" "}
        </select>

        <select
          name="modelo"
          value={selectedModelo}
          onChange={handleModeloChange}
          className="input-producto"
          required
        >
          <option value="" disabled>
            Selecciona un modelo
          </option>{" "}
          {selectedMarca &&
            modelos[selectedMarca].map((modelo) => (
              <option key={modelo} value={modelo}>
                {modelo}
              </option>
            ))}
        </select>

        <select
          id="modal-select-categoria"
          name="categoria"
          value={formData.categoria}
          disabled={isDisabled}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecciona una categoría</option>
          {Object.keys(categoriaMap).map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="input-producto"
          name="cantidad"
          placeholder="Cantidad"
          value={formData.cantidad}
          disabled={isDisabled}
          onChange={handleCantidadChange}
        />

        <input
          type="text"
          className="input-producto"
          name="cantidad_minima"
          placeholder="Cantidad mínima"
          value={formData.cantidad_minima}
          disabled={isDisabled}
          onChange={handleCantidadChange}
        />

        {error && <span className="error-message">{error}</span>}
        <button
          id="btn-add-producto"
          disabled={isDisabled}
          onClick={handleSubmit}
        >
          +
        </button>
        <button disabled={isDisabled} onClick={onClose} id="btn-close-modal">
          1
        </button>
      </div>
    </div>
  );
}

export default ModalAddProduct;
