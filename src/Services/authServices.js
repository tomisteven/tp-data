import firebase from "../firebase/credenciales"

export const login = async (email,password) => {
    return firebase.auth().signInWithEmailAndPassword(email,password);
    };