import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ViewFormsOperador.module.css";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE_URL } from "../assets/config";

const ViewFormsOperador = () => {
  const navigate = useNavigate();
  const [formStates, setFormStates] = useState([]);
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/informes/obtener-informes-misma-ubicacion`
        );
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
          console.log("ID del informe:", informeId);
  
          // 1. Obtener los productos del informe
          const productosResponse = await axios.get(
            `${API_BASE_URL}/informes/obtener-productos-informe/${informeId}`
          );
          const productos = productosResponse.data;
  
          // 2. Restar la cantidad de cada producto en la base de datos
          for (const producto of productos) {
            const { nombre, cantidad_utilizada } = producto;
            try {
              await axios.put(
                `${API_BASE_URL}/productos/${nombre}/restar-cantidad-nombre`,
                { cantidad: cantidad_utilizada }
              );
            } catch (error) {
              console.error(
                `Error al restar cantidad del producto ${nombre}:`,
                error
              );
              // Puedes mostrar un mensaje de error al usuario o manejar el error de otra forma
            }
          }
  
          // 3. Actualizar el estado del informe en la base de datos
          await axios.put(
            `${API_BASE_URL}/informes/${informeId}/confirmar`
          );
  
          const newFormStates = [...formStates];
          newFormStates[index].aprobado = true; // Marcar como aprobado
          setFormStates(newFormStates);
  
          Swal.fire({
            title: "Formulario confirmado",
            text: "El formulario ha sido confirmado exitosamente.",
            icon: "success",
            confirmButtonText: "Aceptar",
          }).then(() => {
            navigate("/verificar-formularios"); // Redirigir después de confirmar
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
        // Pedir al usuario que ingrese el motivo de la denegación
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
          // Si el usuario ingresó un motivo
          try {
            console.log("ID del informe:", formData[index].id_informe);
            // Actualizar el estado del informe en la base de datos
            await axios.put(
              `${API_BASE_URL}/informes/${formData[index].id_informe}/denegar`,
              { motivo } // Enviar el motivo en el cuerpo de la solicitud
            );

            const newFormStates = [...formStates];
            newFormStates[index].aprobado = false; // Marcar como denegado
            setFormStates(newFormStates);

            Swal.fire({
              title: "Formulario denegado",
              text: "El formulario ha sido denegado.",
              icon: "error",
              confirmButtonText: "Aceptar",
            }).then(() => {
              navigate("/verificar-formularios"); // Redirigir después de denegar
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

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Revisión de formularios</h2>
      {formData.map((form, index) => (
        <div key={index} className={styles.card}>
          <p>
            <strong>ID del Informe:</strong> {form.id_informe}
          </p>
          <p>
            <strong>Descripción:</strong> {form.descripcion}
          </p>
          <p>
            <strong>Taller:</strong> {form.taller ? "Sí" : "No"}
          </p>
          <p>
            <strong>Misma Ubicación:</strong>{" "}
            {form.misma_ubicacion ? "Sí" : "No"}
          </p>

          <h3>Productos utilizados:</h3>
          <table className={styles.productosTable}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
  {form.productosUtilizados.map((producto, pIndex) => (
    <tr key={pIndex}>
      <td>{producto.nombre}</td>
      <td>{producto.marca}</td>
      <td>{producto.modelo}</td>
      <td>{producto.cantidad_utilizada}</td>  {/* Cambia aquí */}
    </tr>
  ))}
</tbody>
          </table>

          {/* Mostrar estado del informe o botones */}
          <div className={styles.estadoContainer}>
            {form.aceptado === null ? (
              // Mostrar botones si aceptado es null
              <div className={styles.buttonContainer}>
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
            ) : (
              // Mostrar estado si aceptado no es null
              <>
                {/* Agrupa el estado y el motivo en un fragmento */}
                {form.aceptado ? (
                  <span className={styles.estadoAprobado}>Aceptado</span>
                ) : (
                  <>
                    {/* Agrupa el estado "Rechazado" y el motivo */}
                    <span className={styles.estadoRechazado}>Rechazado</span>
                    {form.motivo_rechazo && (
                      // Mostrar motivo si existe
                      <p className={styles.motivoRechazo}>
                        <strong>Motivo:</strong> {form.motivo_rechazo}
                      </p>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewFormsOperador;