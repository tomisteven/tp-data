import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE_URL } from "../assets/config";
import "./ViewFormsSupervisor.css";

const ViewFormsOperador = () => {
  const navigate = useNavigate();
  const [formStates, setFormStates] = useState([]);
  const [formData, setFormData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/informes/obtener-informes-taller`);
        const informesConProductos = await Promise.all(
          response.data.map(async (informe) => {
            const productos = await fetchProductos(informe.id_informe);
            return { ...informe, productosUtilizados: productos };
          })
        );
        setFormData(informesConProductos);
        setFormStates(informesConProductos.map(() => ({ aprobado: null })));
      } catch (error) {
        console.error("Error al obtener los formularios:", error);
        setFormData([]);
        setFormStates([]);
      }
    };
    fetchForms();
  }, []);

  const handleConfirm = async (index) => {
    Swal.fire({
      title: "¿Estás seguro de que quieres confirmar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const informeId = formData[index].id_informe;
          const productosResponse = await axios.get(
            `${API_BASE_URL}/informes/obtener-productos-informe/${informeId}`
          );
          const productos = productosResponse.data;

          for (const producto of productos) {
            const { nombre, cantidad_utilizada } = producto;
            await axios.put(
              `${API_BASE_URL}/productos/${nombre}/restar-cantidad-nombre`,
              { cantidad: cantidad_utilizada }
            );
          }

          await axios.put(`${API_BASE_URL}/informes/${informeId}/confirmar`);

          const newFormStates = [...formStates];
          newFormStates[index].aprobado = true;
          setFormStates(newFormStates);

          Swal.fire({
            title: "Formulario confirmado",
            text: "El formulario ha sido confirmado exitosamente.",
            icon: "success",
            confirmButtonText: "Aceptar",
          }).then(() => {
            navigate("/verificar-formularios");
          });
        } catch (error) {
          console.error("Error al confirmar el formulario:", error);
          Swal.fire({
            title: "Error",
            text: "Hubo un error al confirmar el formulario.",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        }
      }
    });
  };

  const handleDeny = async (index) => {
    Swal.fire({
      title: "¿Estás seguro de que quieres rechazar este formulario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, rechazar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { value: motivo } = await Swal.fire({
          title: "Motivo de la denegación",
          input: "text",
          inputPlaceholder: "Ingrese el motivo de la denegación",
          showCancelButton: true,
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
          inputValidator: (value) => {
            if (!value) {
              return "Por favor, ingrese un motivo";
            }
          },
        });

        if (motivo) {
          try {
            await axios.put(
              `${API_BASE_URL}/informes/${formData[index].id_informe}/denegar`,
              { motivo }
            );

            const newFormStates = [...formStates];
            newFormStates[index].aprobado = false;
            setFormStates(newFormStates);

            Swal.fire({
              title: "Formulario denegado",
              text: "El formulario ha sido denegado.",
              icon: "error",
              confirmButtonText: "Aceptar",
            }).then(() => {
              navigate("/verificar-formularios");
            });
          } catch (error) {
            console.error("Error al denegar el formulario:", error);
            Swal.fire({
              title: "Error",
              text: "Hubo un error al denegar el formulario.",
              icon: "error",
              confirmButtonText: "Aceptar",
            });
          }
        }
      }
    });
  };

  const fetchProductos = async (idInforme) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/informes/obtener-productos-informe/${idInforme}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener los productos del informe:", error);
      return [];
    }
  };

  const openProductPopup = (products) => {
    setSelectedProducts(products);
    setShowPopup(true);
  };

  const closeProductPopup = () => {
    setShowPopup(false);
    setSelectedProducts([]);
  };

  return (
    <div className="container">
      <h2 className="title">Revisión de formularios</h2>
      {formData.map((form, index) => (
        <div key={index} className="card">
          <h3>Informe {form.id_informe}</h3> 
          <p>
            <strong>Mecanico:</strong> 
          </p>
          <p>
            <strong>Patente:</strong>{" "}
            
          </p>
          <p>
            <strong>Descripción:</strong> {form.descripcion}
          </p>

          <button onClick={() => openProductPopup(form.productosUtilizados)}>
            Ver productos utilizados
          </button>

          <div className="buttonContainer">
            <button
              onClick={() => handleConfirm(index)}
              disabled={formStates[index].aprobado !== null}
            >
              Confirmar
            </button>
            <button
              onClick={() => handleDeny(index)}
              disabled={formStates[index].aprobado !== null}
            >
              Denegar
            </button>
          </div>
        </div>
      ))}

      {showPopup && (
        <div className="popupOverlay">
          <div className="popupContent">
            <h3>Productos utilizados</h3>
            <table className="productosTable">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((producto, index) => (
                  <tr key={index}>
                    <td>{producto.nombre}</td>
                    <td>{producto.marca}</td>
                    <td>{producto.modelo}</td>
                    <td>{producto.cantidad_utilizada}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={closeProductPopup}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewFormsOperador;
