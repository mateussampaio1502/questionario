//Credenciais do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDsCfhADhGawXAKmijOYciQPUxHXHTui6g",
    authDomain: "formulario1502.firebaseapp.com",
    projectId: "formulario1502",
    storageBucket: "formulario1502.appspot.com",
    messagingSenderId: "585197050148",
    appId: "1:585197050148:web:c8aafa012b66bdd9353bb1"
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();