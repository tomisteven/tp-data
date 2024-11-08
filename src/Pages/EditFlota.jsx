import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../assets/config';
import './EditFlota.css'; // Reuse or create a new CSS file for styling

function EditFlota() {
  const { id } = useParams();
  const [flotaName, setFlotaName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlota = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/flotas/${id}`);
        setFlotaName(response.data.nombre);
      } catch (error) {
        console.error('Error fetching fleet:', error);
        setError('Error al obtener la flota');
      }
    };
    fetchFlota();
  }, [id]);

  const handleSaveFlota = async () => {
    if (flotaName === '') {
      setError('Por favor, ingresa un nombre para la flota.');
      return;
    }
    try {
      await axios.put(`${API_BASE_URL}/flotas/${id}`, { nombre: flotaName });
      alert('Flota actualizada con éxito');
      navigate('/admin-flotas');
    } catch (error) {
      console.error('Error updating fleet:', error);
      setError('Error al actualizar la flota');
    }
  };

  return (
    <div className="edit-flota-container">
      <h2>Editar Flota</h2>
      {error && <div className="error-banner">{error}</div>}
      <input
        type="text"
        placeholder="Nombre de la Flota"
        value={flotaName}
        onChange={(e) => setFlotaName(e.target.value)}
        className="flota-input"
      />
      <button className="save-flota-button" onClick={handleSaveFlota}>
        Guardar Flota
      </button>
    </div>
  );
}

export default EditFlota;
