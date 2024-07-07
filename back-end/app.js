
import { addDataBtn, TABELA_CADASTROS } from './consts.js'
import {db} from './firebase.js'


//Função para adicionar dados à tabela Cadastros
const addData = async () => {

    //Pega os dados dos campos do LocalStorage
    const dadosPessoais = localStorage.getItem('dadosPessoais')
    const dadosEficiencia = localStorage.getItem('dadosEficiencia')
    const horariosDiasUteis = localStorage.getItem('horariosDiasUteis')
    const horariosFeriadosFDS = localStorage.getItem('horariosFeriadosFDS')
    const dados_eletro = localStorage.getItem('dados_eletro')
    const dados_eletro_weekend = localStorage.getItem('dados_eletro_weekend')
    const dados_eletro_esp = localStorage.getItem('dados_eletro_esp')

    const contato = JSON.parse(dadosPessoais).contato;
     // Consulta para obter todos os documentos
     const querySnapshot = await db.collection(TABELA_CADASTROS).get();

     let docIdToUpdate = null;
 
     // Itera sobre os documentos para encontrar um com o mesmo contato
     querySnapshot.forEach((doc) => {
         const dadosPessoaisDoc = JSON.parse(doc.data().dadosPessoais);
         if (dadosPessoaisDoc.contato === contato) {
             docIdToUpdate = doc.id;
         }
     });
 
     if (docIdToUpdate) {
         // Se encontrar um documento com o mesmo contato, atualiza os dados
         await db.collection(TABELA_CADASTROS).doc(docIdToUpdate).update({
             dadosPessoais: dadosPessoais,
             dadosEficiencia: dadosEficiencia,
             horariosDiasUteis: horariosDiasUteis,
             horariosFeriadosFDS: horariosFeriadosFDS,
             dados_eletro: dados_eletro,
             dados_eletro_weekend: dados_eletro_weekend,
             dados_eletro_esp: dados_eletro_esp
         }).then(() => {
             console.log("Documento atualizado com sucesso!");
         }).catch((error) => {
             console.error("Erro ao atualizar documento: ", error);
         });
     } else {
         // Se não encontrar um documento com o mesmo contato, adiciona um novo
         await db.collection(TABELA_CADASTROS).add({
             dadosPessoais: dadosPessoais,
             dadosEficiencia: dadosEficiencia,
             horariosDiasUteis: horariosDiasUteis,
             horariosFeriadosFDS: horariosFeriadosFDS,
             dados_eletro: dados_eletro,
             dados_eletro_weekend: dados_eletro_weekend,
             dados_eletro_esp: dados_eletro_esp
         }).then(() => {
             console.log("Documento adicionado com sucesso!");
         }).catch((error) => {
             console.error("Erro ao adicionar documento: ", error);
         });
     }
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