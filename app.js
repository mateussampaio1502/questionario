
const firebaseConfig = {
    apiKey: "AIzaSyDsCfhADhGawXAKmijOYciQPUxHXHTui6g",
    authDomain: "formulario1502.firebaseapp.com",
    projectId: "formulario1502",
    storageBucket: "formulario1502.appspot.com",
    messagingSenderId: "585197050148",
    appId: "1:585197050148:web:c8aafa012b66bdd9353bb1"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const getData = () => {
    const dados = []
    db.collection("moradores").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            dados.push({
                id: doc.id,
                nome: doc.data().nome,
                salario: doc.data().salario,
            })
        });
        console.log(dados)
    });
}

const addData = (nome, salario) => {
    db.collection("moradores").add({
        nome,
        salario,
    })
        .then((docRef) => {
            //console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            //console.error("Error adding document: ", error);
        });
}

addData('jose', 2400)
getData()