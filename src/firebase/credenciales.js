import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAT46YMFdnih93tRT4wAMLioQW1c6nzS4w",
  authDomain: "radiador-spring.firebaseapp.com",
  projectId: "radiador-spring",
  storageBucket: "radiador-spring.appspot.com",
  messagingSenderId: "603097047075",
  appId: "1:603097047075:web:901f74b59b1bc4b5151196",
  measurementId: "G-BL4X15QJQF"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Exportar los servicios `auth` y `firestore`
export const auth = firebase.auth();
export const firestore = firebase.firestore();

export default firebase;