import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Asegúrate de importar SweetAlert2
import { useMediaQuery } from "react-responsive";
import usuariosData from "../data/usuarios.json";
import "./UsersManagement.css";

const UsersManagement = () => {
  const [numero, setNumero] = useState("");
  const [searchTermRol, setSearchTermRol] = useState("");
  const [searchTermMail, setSearchTermMail] = useState("");
  const [searchTermDNI, setSearchTermDNI] = useState("");
  const [FilteredUsers, setFilteredUsers] = useState("");
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [usuarios, setUsuarios] = useState([]);
  
  useEffect(() => {
    // Cargar los datos del archivo JSON
    setUsuarios(usuariosData.filter((usuario) => usuario.habilitado));
  }, []);

  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    apellido: "",
    dni: "",
    mail: "",
    rol: "",
    habilitado: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validar que el nombre solo contenga letras y espacios
    if (!/^[a-zA-Z\s]+$/.test(formData.nombre)) {
      newErrors.nombre = "El nombre solo puede contener letras y espacios.";
    }

    // Validar que el apellido solo contenga letras y espacios
    if (!/^[a-zA-Z\s]+$/.test(formData.apellido)) {
      newErrors.apellido = "El apellido solo puede contener letras y espacios.";
    }

    // Validar que el DNI solo contenga números
    if (!/^\d+$/.test(formData.dni)) {
      newErrors.dni = "El DNI solo puede contener números.";
    }

    // Validar que el email tenga un formato válido
    if (
      !/^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/.test(
        formData.mail
      )
    ) {
      newErrors.mail = "El formato del correo no es válido.";
    }

    setErrors(newErrors);

    // Si no hay errores, el formulario es válido
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Verificar si el DNI ya existe en otro usuario
      const dniExists = usuarios.some(
        (usuario) => usuario.dni === formData.dni && usuario.id !== formData.id
      );

      if (dniExists) {
        Swal.fire({
          title: "Error",
          text: "Ya existe un usuario con este DNI.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        return; // Detener el proceso si el DNI ya existe
      }

      if (isEditing) {
        setUsuarios(
          usuarios.map((usuario) =>
            usuario.id === formData.id ? formData : usuario
          )
        );
        setIsEditing(false);
        Swal.fire({
          title: "¡Éxito!",
          text: "La información del usuario ha sido actualizada correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      } else {
        setUsuarios([...usuarios, { ...formData, id: usuarios.length + 1 }]);
        setIsEditing(false);
        Swal.fire({
          title: "¡Éxito!",
          text: "El usuario ha sido cargado correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      }

      // Resetear el formulario después de enviar
      setFormData({
        id: "",
        nombre: "",
        apellido: "",
        dni: "",
        mail: "",
        rol: "",
        habilitado: true,
      });
    }
  };


  const handleEdit = (id) => {
    const usuario = usuarios.find((usuario) => usuario.id === id);
    setFormData(usuario);
    setIsEditing(true);
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción deshabilitará al usuario.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setUsuarios(
          usuarios.map((usuario) =>
            usuario.id === id ? { ...usuario, habilitado: false } : usuario
          )
        );
        Swal.fire(
          "¡Eliminado!",
          "El usuario ha sido deshabilitado.",
          "success"
        );
      }
    });
  };

  const handleCancel = () => {
    setFormData({
      id: "",
      nombre: "",
      apellido: "",
      dni: "",
      mail: "",
      rol: "",
      habilitado: true,
    });
    setIsEditing(false);
  };

  const filterUsuariosMail = (term) => {
    if (term === "") {
      setFilteredUsers(usuarios);
    } else {
      const filtered = usuarios.filter((usuario) =>
        usuario.mail.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTermMail(term);
    filterUsuariosMail(term);
  };

  const handleRestrictDNI = (event) => {
    // restricciones para ingresar otra cosa que no sea numeros en tiempo real
    const term = event.target.value;
    if (/^[1-9]\d{0,8}$/.test(term) || term === "") {
      setNumero(term);
      setErrors("");
    } else {
      setErrors("Debe contener exactamente 9 cifras y ser un número positivo");
    }
    setSearchTermDNI(term);
    filterUsuariosDNI(term);
  };
  const filterUsuariosDNI = (term) => {
    if (term === "") {
      setFilteredUsers(usuarios);
    } else {
      const filtered = usuarios.filter((usuario) => usuario.dni.includes(term));
      setFilteredUsers(filtered);
    }
  };

  useEffect(() => {
    let filtered = usuarios.filter(
      (usuario) => searchTermRol === "" || usuario.rol === searchTermRol
    );
    setFilteredUsers(filtered);
  }, [searchTermRol, usuarios]);

  return (
    <div className="users-management-container">
      <div className="filter-container">
        <h2 className="title">Gestión de Usuarios</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          {errors.nombre && <p className="error-message">{errors.nombre}</p>}

          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
          {errors.apellido && (
            <p className="error-message">{errors.apellido}</p>
          )}

          <input
            type="text"
            name="dni"
            placeholder="DNI"
            value={formData.dni}
            onChange={handleChange}
            required
          />
          {errors.dni && <p className="error-message">{errors.dni}</p>}

          <input
            type="text"
            name="mail"
            placeholder="Mail"
            value={formData.mail}
            onChange={handleChange}
            required
          />
          {errors.mail && <p className="error-message">{errors.mail}</p>}

          <select
            type="text"
            name="rol"
            placeholder="Rol"
            value={formData.rol}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="operador">Operador</option>
            <option value="administrador">Administrador</option>
            <option value="cliente">Cliente</option>
            <option value="gerencia">Gerencia</option>
            <option value="mecanico">Mecánico</option>
          </select>

          <button type="submit" className="add-button">
            {isEditing ? "Guardar" : "+"}
          </button>
          <button
            onClick={handleCancel}
            disabled={!isEditing}
            className="btn-cancelar-usuarios"
          >
            Cancelar
          </button>
        </form>
      </div>

      <div className="users-list">
        {FilteredUsers.length > 0 ? (
          FilteredUsers.map((usuario) => (
            <div key={usuario.id} className="user-card">
              <p>
                <strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}
              </p>
              <p>
                <strong>DNI:</strong> {usuario.dni}
              </p>
              <p>
                <strong>Mail:</strong> {usuario.mail}
              </p>
              <p>
                <strong>Rol:</strong> {usuario.rol}
              </p>

              <button
                onClick={() => handleEdit(usuario.id)}
                className="add-button"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(usuario.id)}
                className="edit-button"
              >
                Eliminar
              </button>
            </div>
          ))
        ) : (
          <p>No se encontraron usuarios</p>
        )}
      </div>

      <div className="filtros-usuarios">
        <label>Buscar por:</label>
        <input
          type="text"
          placeholder="Mail"
          className="search-user"
          value={searchTermMail}
          onChange={handleSearchChange}
        ></input>
        <input
          type="text"
          placeholder="DNI"
          value={numero}
          onChange={handleRestrictDNI}
        ></input>
        <label>Rol:</label>
        <select
          value={searchTermRol}
          onChange={(e) => setSearchTermRol(e.target.value)}
        >
          <option value="">--</option>
          <option value="Operador">Operador</option>
          <option value="Administrador">Administrador</option>
          <option value="Cliente">Cliente</option>
          <option value="Gerencia">Gerencia</option>
          <option value="Mecánico">Mecánico</option>
        </select>
      </div>
    </div>
  );
};

export default UsersManagement;
