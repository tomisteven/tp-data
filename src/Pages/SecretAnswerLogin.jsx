import React, { useState, useEffect } from "react";
import "./SecretAnswerLogin.css";
import Modal from "./RestorePassword.jsx";
import { useNavigate } from "react-router-dom";

function SecretPassword() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleVolver = () => {
    navigate("/");
  };

  const handleShowModal = () => {
    setIsDisabled(true);
    setShowModal(true);
  };

  return (
    <div className="secret-answer-container">
      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
            setIsDisabled(false);
          }}
        />
      )}
      <h2 className="secret-answer-title">Recuperar Contraseña</h2>
      <p className="secret-answer-text">
        En caso de olvidar su contraseña utilizaremos la respuesta secreta para
        validar su identidad
      </p>
      <br />
      <label className="secret-answer-label">Su mail:</label> <br />
      <input
        className="sa-input"
        type="mail"
        disabled={isDisabled}
      ></input>{" "}
      <br />
      <br />
      <label className="secret-answer-label">Pregunta de seguridad:</label>
      <select className="sa-select" disabled={isDisabled}>
        <option selected disabled>
          Elija su pregunta de seguridad
        </option>
        <option>
          ¿Cuál es el apellido de su profesor favorito del instituto?
        </option>
        <option>¿Cuál es el nombre y apellido de su abuelo paterno?</option>
        <option>¿Cuál es el nombre y apellido de su abuelo paterno?</option>
        <option>
          ¿Cuál era el nombre y apellido de su mejor amigo de la infancia?
        </option>
        <option>¿Cuál era el nombre de su maestro de primaria favorito?</option>
        <option>¿Cuál era el nombre de su primera mascota?</option>
        <option>Cuando era joven, ¿qué quería ser de mayor?</option>
      </select>
      <label className="secret-answer-label">Su respuesta:</label> <br />
      <input className="sa-input" type="text" disabled={isDisabled}></input>
      <br />
      <br />
      <div className="sa-buttons">
        <button
          className="btn-sa-continuar"
          onClick={handleShowModal}
          disabled={isDisabled}
        >
          Continuar
        </button>
        <button
          className="btn-sa-cancelar"
          onClick={handleVolver}
          disabled={isDisabled}
        >
          Volver
        </button>
      </div>
    </div>
  );
}

export default SecretPassword;
