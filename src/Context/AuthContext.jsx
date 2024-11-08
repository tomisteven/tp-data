import React, { useState, useEffect } from "react";
import firebase from "../firebase/credenciales"; // Asegúrate de que la ruta sea correcta

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [login, setLogin] = useState(false);
  const [role, setRole] = useState(null); // Estado para almacenar el rol
  const [loading, setLoading] = useState(true); // Estado de carga para esperar la autenticación

  useEffect(() => {
    // Listener de Firebase para verificar el estado de autenticación
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setLogin(true);
        localStorage.setItem("user", JSON.stringify(user)); // Guarda el usuario en el localStorage
        console.log(user);

        const userDoc = await firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get();
        if (userDoc.exists) {
          setRole(userDoc.data().rol); // Establece el rol en el estado
          localStorage.setItem("userData", userDoc.data().rol); // Guarda el rol en el localStorage
        }
      } else {
        setLogin(false);

        setRole(null);
      }
      setLoading(false); // Deja de mostrar el estado de carga
    });

    // Listener para desloguear al cerrar la ventana
    const handleBeforeUnload = async () => {
      await firebase.auth().signOut(); // Llama a Firebase para cerrar sesión
      setLogin(false);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      unsubscribe(); // Limpia el listener de Firebase
      window.removeEventListener("beforeunload", handleBeforeUnload); // Limpia el listener de cierre de ventana
    };
  }, []);

  const handleLogin = async () => {
    setLogin(true);
  };

  const handleLogout = async () => {
    await firebase.auth().signOut();
    setLogin(false);
    localStorage.removeItem("user"); // Elimina el usuario del localStorage
    localStorage.removeItem("role"); // Elimina el rol del localStorage
    setRole(null); // Resetea el rol al cerrar sesión
    window.location.reload(); // Recarga la página
  };

  if (loading) {
    return <div>Loading...</div>; // Muestra un mensaje o loader mientras se verifica la autenticación
  }

  return (
    <AuthContext.Provider value={{ login, role, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
