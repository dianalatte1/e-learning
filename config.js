import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBh5E6xYPwWqYdNjBC4-YPb2nlmWLTdyUY",
  authDomain: "biblioteca-digital-diego.firebaseapp.com",
  projectId: "biblioteca-digital-diego",
  storageBucket: "biblioteca-digital-diego.appspot.com",
  messagingSenderId: "460719636686",
  appId: "1:460719636686:web:f130dc77309ac7b243109f",
};
// Inicializando firebase
const app = initializeApp(firebaseConfig);
// accediendo a firestore
const db = getFirestore(app);

export default db;
