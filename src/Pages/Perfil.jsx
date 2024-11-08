import React from "react";
import "./Perfil.css";

function Perfil() {
  return (
    <div className="perfil-container">
      <h1 className="tittle-perfil">Mi perfil</h1>

      <div className="datos-personales-container">
        <h2 className="mis-datos-h2">Mis datos personales</h2>
        <label className="mis-datos-label">Nombre:</label>
        <br />
        <input className="mis-datos-input" type="text"></input>
        <br />
        <label className="mis-datos-label">DNI:</label>
        <br />
        <input className="mis-datos-input" type="text"></input>
        <br />
        <label className="mis-datos-label">Telefono:</label>
        <br />
        <input className="mis-datos-input" type="text"></input>
        <br />
        <label className="mis-datos-label">Mail:</label>
        <br />
        <input className="mis-datos-input" type="mail"></input>
      </div>
    </div>
  );
}

export default Perfil;
