import React from "react";
import "./ModalExitoAddProduct.css";

function ModalAddProduct({ onClose }) {
  return (
    <div className="modal-exito">
      <h2 id="tittle-prod-exitoso">El producto se agregó exitosamente</h2>
      <div>
        <i className="material-icons" id="icon-check">
          check_circle
        </i>
      </div>
      <button onClick={onClose}>Aceptar</button>
    </div>
  );
}

export default ModalAddProduct;
