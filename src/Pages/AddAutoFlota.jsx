import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../assets/config';
import './AddAutoFlota.css'; // Crea un archivo CSS para estilos

function AddAutoFlota() {
  const { flotaId } = useParams();
  const [patente, setPatente] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAddAuto = async () => {
    if (patente === '') {
      setError('Por favor, ingresa la patente del auto.');
      return;
    }
    try {
      // Asegúrate de que el cuerpo de la solicitud tiene los datos correctos
      const requestBody = {
        patente: patente,
        flota_id: flotaId
      };
      console.log('Cuerpo de la solicitud:', requestBody); // Añadir log para verificar el cuerpo de la solicitud

      // Actualizar el flota_id del auto usando la patente
      await axios.put(`${API_BASE_URL}/autos/flota`, requestBody);

      alert('Auto agregado a la flota con éxito');
      navigate(`/admin-flotas`);
    } catch (error) {
      console.error('Error al agregar auto:', error.response ? error.response.data : error.message);
      setError('Error al agregar el auto a la flota: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleCancel = () => {
    navigate(`/admin-flotas`);
  };

  return (
    <div className="add-auto-flota-container">
      <h2>Agregar Auto a la Flota</h2>
      {error && <div className="error-banner">{error}</div>}
      <input
        type="text"
        placeholder="Patente del Auto"
        value={patente}
        onChange={(e) => setPatente(e.target.value)}
        className="auto-input"
      />
      <button className="add-auto-button" onClick={handleAddAuto}>Agregar Auto a la Flota</button>
      <button className="cancel-button" onClick={handleCancel}>Cancelar</button>
    </div>
  );
}

export default AddAutoFlota;
