import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBaNPzsPv3_U2oyC_DUdXqwax9nz1lurP8",
    authDomain: "serviceswitch-9a265.firebaseapp.com",
    projectId: "serviceswitch-9a265",
    storageBucket: "serviceswitch-9a265.appspot.com",
    messagingSenderId: "742555980154",
    appId: "1:742555980154:web:6c95fedc4a86e7c696c6c3",
    measurementId: "G-M9B2NWSSQQ",
  };
  
  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };