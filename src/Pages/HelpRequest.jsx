import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './HelpRequest.css';
import axios from 'axios';
import { API_BASE_URL } from '../assets/config';

const HelpRequest = () => {
  const [showDescriptionField, setShowDescriptionField] = useState(false);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [patente, setPatente] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [latitud, setLatitud] = useState(null);
  const [longitud, setLongitud] = useState(null);
  const navigate = useNavigate();

  const patenteRegex = /^([a-zA-Z]{3}\d{3}|[a-zA-Z]{2}\d{3}[a-zA-Z]{2})$/;

  useEffect(() => {
    // Al cargar el componente, recuperar el token "pendiente" del almacenamiento local
    const storedToken = localStorage.getItem("pendingToken");
    if (storedToken) {
      setToken(storedToken);
      setShowToken(true);
    }
  }, []);

  const generateToken = () => {
    const newToken = Math.floor(100000 + Math.random() * 900000).toString();
    setToken(newToken);
  };

  const handleHelpRequest = () => {
    if (!patenteRegex.test(patente)) {
      setError('Formato de patente incorrecto');
      return;
    }
    setError('');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitud(position.coords.latitude);
          setLongitud(position.coords.longitude);

          Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Deseas pedir servicio de acarreo?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              generateToken();
              setShowDescriptionField(true);
            }
          });
        },
        (error) => {
          console.error('Error obteniendo la ubicación', error);
          Swal.fire('Error', 'No se pudo obtener la ubicación', 'error');
        }
      );
    } else {
      Swal.fire('Error', 'La geolocalización no es soportada en este navegador', 'error');
    }
  };

  const handleSendDescription = () => {
    Swal.fire({
      title: '¿Deseas enviar una foto?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, enviar foto',
      cancelButtonText: 'No, continuar sin foto'
    }).then((result) => {
      if (result.isConfirmed) {
        setShowDescriptionField(false);
        document.getElementById('photoInput').click();
      } else {
        setShowDescriptionField(false);
        setShowToken(true);
        sendHelpRequest();
      }
    });
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendPhoto = () => {
    setShowToken(true);
    sendHelpRequest();
    setPhoto(null);
    Swal.fire('Enviado', 'Tu foto ha sido enviada con éxito', 'success');
  };

  const sendHelpRequest = async () => {
    const requestData = {
      id_conductor: 1,
      id_mecanico: 1,
      patente_auto: patente,
      token: token,
      descripcion: description || "",
      foto: photo || "",
      latitud: latitud,
      longitud: longitud,
      estado: 'pendiente',
      fecha_solicitud: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/solicitudes`, requestData);
      console.log('Datos enviados a la base de datos:', response.data);
      console.log('Token enviado:', token);
      console.log('Respuesta del servidor:', response.data);

      // Almacenar el token "pendiente" en el localStorage
      if (token) {
        localStorage.setItem("pendingToken", token);
        setShowToken(true);
      } else {
        Swal.fire('Error', 'No se pudo generar el token', 'error');
      }
    } catch (err) {
      console.error('Error al enviar la solicitud:', err);
      Swal.fire('Error', 'No se pudo enviar la solicitud. Revisa la consola para más detalles.', 'error');
    }
  };

  const resetHelpRequest = () => {
    setShowDescriptionField(false);
    setPatente('');
    setDescription('');
    setPhoto(null);
    setError('');
    setToken('');
    setShowToken(false);
    setLatitud(null);
    setLongitud(null);

    // Eliminar el token del localStorage al finalizar
    localStorage.removeItem("pendingToken");
  };

  return (
    <div className='help-request-container'>
      {!showToken && !showDescriptionField && !photo && (
        <div className="text-field-container">
          <label htmlFor="patente">Ingrese la patente del vehículo:</label>
          <input
            type="text"
            id="patente"
            className="help-text-field"
            value={patente}
            onChange={(e) => setPatente(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          <button className='help-button' onClick={handleHelpRequest}>
            Pedir por servicio de acarreo
          </button>
        </div>
      )}

      {showDescriptionField && !photo && (
        <div className='text-field-container'>
          <label htmlFor="description">Descripción del problema:</label>
          <textarea
            id="description"
            className="help-text-field"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className='send-button' onClick={handleSendDescription}>
            Enviar
          </button>
        </div>
      )}

      {photo && (
        <div className='photo-preview'>
          <h3>Foto seleccionada:</h3>
          <img src={photo} alt="Selected" style={{ width: '100%', maxHeight: '300px' }} />
          <button className='send-button' onClick={handleSendPhoto}>
            Enviar foto
          </button>
        </div>
      )}

      {showToken && (
        <div className='token-display'>
          <h3>Tu token generado:</h3>
          <p>{token}</p>
          <button className='finish-button' onClick={resetHelpRequest}>
            Finalizar
          </button>
        </div>
      )}

      <input
        type="file"
        id="photoInput"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handlePhotoUpload}
      />
    </div>
  );
};

export default HelpRequest;
