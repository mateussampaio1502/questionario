
import { addDataBtn, TABELA_CADASTROS } from './consts.js'
import {db} from './firebase.js'


//Função para adicionar dados à tabela Cadastros
const addData = () => {

    //Pega os dados dos campos do LocalStorage
    const dadosPessoais = localStorage.getItem('dadosPessoais')
    const dadosEficiencia = localStorage.getItem('dadosPessoais')
    const horariosDiasUteis = localStorage.getItem('horariosDiasUteis')
    const horariosFeriadosFDS = localStorage.getItem('horariosFeriadosFDS')
    const dados_eletro = localStorage.getItem('dados_eletro')
    const dados_eletro_weekend = localStorage.getItem('dados_eletro_weekend')
    const dados_eletro_esp = localStorage.getItem('dados_eletro_esp')

    //Adiciona os dados à tabela no Firestore
    db.collection(TABELA_CADASTROS).add({
        dadosPessoais: dadosPessoais,
        dadosEficiencia: dadosEficiencia,
        horariosDiasUteis: horariosDiasUteis,
        horariosFeriadosFDS: horariosFeriadosFDS,
        dados_eletro: dados_eletro,
        dados_eletro_weekend: dados_eletro_weekend,
        dados_eletro_esp: dados_eletro_esp

    })
        .then((docRef) => {
            alert('Dados adicionados com sucesso!')
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            alert('Ocorreu um erro ao adicionar os dados. Por favor, tente novamente.')
            console.error("Error adding document: ", error);
        });
}

//Listenners
addDataBtn.addEventListener('click', addData)























// const getData = () => {
//     const dados = []
//     db.collection("moradores").get().then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//             dados.push({
//                 id: doc.id,
//                 nome: doc.data().nome,
//                 salario: doc.data().salario,
//             })
//         });
//         console.log(dados)
//     });
// }
// addData('jose', 2400)
// getData()