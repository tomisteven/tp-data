/*import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { login } from '../Services/authServices';
import { AuthContext } from '../Context/AuthContext';
import './Login.css';

function Login() {
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const { handleLogin } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      handleLogin();
      setAlertMessage('Bienvenido');
      setLoading(false);
    } catch (error) {
      setAlertMessage('Error al iniciar sesión: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            {...register('email', {
              required: 'El email es obligatorio',
              pattern: {
                value: `/^[a-zA-Z0-9.!#$%&'*+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/`,
                message: 'Ingrese un email válido',
              },
            })}
            placeholder="Ingrese su email"
          />
          {errors.email && <span className="error-message">{errors.email.message}</span>}
        </div>

        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 6,
                message: 'Debe tener al menos 6 caracteres',
              },
              maxLength: {
                value: 12,
                message: 'No puede tener más de 12 caracteres',
              },
            })}
            placeholder="Ingrese su contraseña"
          />
          {errors.password && <span className="error-message">{errors.password.message}</span>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Iniciar sesión'}
        </button>

        {alertMessage && <p className="alert-message">{alertMessage}</p>}
      </form>
    </div>
  );
}

export default Login;
*/
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { login } from "../Services/authServices";
import { AuthContext } from "../Context/AuthContext.jsx";

/* import { firestore } from "../firebase/credenciales";  */ // Importa Firestore
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      handleLogin();
      setAlertMessage("Bienvenido");
      setLoading(false);
      navigate("/");
    } catch (error) {
      setAlertMessage("Error al iniciar sesión: " + error.message);
      setLoading(false);
    }
  };

  const handleRestorePass = () => {
    navigate("/recuperar-contraseña");
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type="email"
            {...register("email", {
              required: "El email es obligatorio",
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: "Ingrese un email válido",
              },
            })}
            placeholder="Ingrese su email"
          />
          {errors.email && (
            <span className="error-message">{errors.email.message}</span>
          )}
        </div>

        <div>
          <input
            type="password"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 6,
                message: "Debe tener al menos 6 caracteres",
              },
            })}
            placeholder="Ingrese su contraseña"
          />
          {errors.password && (
            <span className="error-message">{errors.password.message}</span>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : <h4>Iniciar Sesion</h4>}
        </button>
        <p onClick={handleRestorePass} className="olvide-contraseña">
          Olvide mi contraseña
        </p>

        {alertMessage && <p className="alert-message">{alertMessage}</p>}
      </form>
    </div>
  );
}

export default Login;
