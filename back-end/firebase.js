// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDsCfhADhGawXAKmijOYciQPUxHXHTui6g",
  authDomain: "formulario1502.firebaseapp.com",
  projectId: "formulario1502",
  storageBucket: "formulario1502.appspot.com",
  messagingSenderId: "585197050148",
  appId: "1:585197050148:web:c8aafa012b66bdd9353bb1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();