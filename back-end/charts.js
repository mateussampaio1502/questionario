import { addDataBtn, TABELA_CADASTROS } from './consts.js'
import {db} from '../back-end/firebase.js'


const graficoCidades = document.getElementById('graficoCidades');
const graficoHorariosDiasUteis = document.getElementById('graficoHorariosDiasUteis');
const getBtn = document.getElementById('getBtn');
const testeBtn = document.getElementById('testeBtn');
const refreshBtn = document.getElementById('refreshBtn');

//Dados disponíveis para cidades: [nomes, quantidades], [nomes], [quantidades]
const dadosCidades = async () => {
    const cities = [];
    const cityCount = {};
    const querySnapshot = await db.collection(TABELA_CADASTROS).get();
    querySnapshot.forEach((doc) => {
        const city = JSON.parse(doc.data().dadosPessoais).cidade;
        cityCount[city] = (cityCount[city] || 0) + 1;
    });
    for (const city in cityCount) {
        cities.push([city, cityCount[city]]);
    }
    return {
        cities: cities,
        names: cities.map(city => city[0]),
        quantidades: cities.map(city => city[1])
    };
}
//Dados disponíveis para subgrupos: [nomes, quantidades], [nomes], [quantidades]
const dadosSubgrupos = async () => {
    const subgroups = [];
    const subgroupCount = {};
    const querySnapshot = await db.collection(TABELA_CADASTROS).get();
    querySnapshot.forEach((doc) => {
        const subgroup = JSON.parse(doc.data().dadosPessoais).subgrupo;
        subgroupCount[subgroup] = (subgroupCount[subgroup] || 0) + 1;
    });
    for (const subgroup in subgroupCount) {
        subgroups.push([subgroup, subgroupCount[subgroup]]);
    }
    return {
        subgroups: subgroups,
        types: subgroups.map(subgroup => subgroup[0]),
        quantidades: subgroups.map(subgroup => subgroup[1])
    };
}
//Só funciona para dados do tipo: {cidade: "", subgrupo: "solteiro_A", contato: "Lívio"}
const estatisticaDe = async (atributo) => {
    const datas = [];
    const count = {};
    const querySnapshot = await db.collection(TABELA_CADASTROS).get();
    querySnapshot.forEach((doc) => {
        const data = JSON.parse(doc.data().dadosPessoais)[atributo];
        count[data] = (count[data] || 0) + 1;
    });
    for (const data in count) {
        datas.push([data, count[data]]);
    }
    console.log(datas)
    return {
        datas: datas
    };
}


getBtn.addEventListener('click', dadosCidades);
refreshBtn.addEventListener('click', async () => {
    new Chart(graficoCidades, {
        type: 'bar',
        data: {
            labels: (await dadosCidades()).names,
            datasets: [{
                label: 'quantidades',
                data: (await dadosCidades()).quantidades,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    new Chart(graficoHorariosDiasUteis, {
        type: 'bar',
        data: {
            labels: ['January', 'February', 'March', 'April'],
            datasets: [{
                label: 'Dataset 1',
                data: [10, 20, 30, 40],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }, {
                label: 'Dataset 2',
                data: [20, 30, 40, 50],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true
                }
            }
        }
    });
})
testeBtn.addEventListener('click', async () => {
    //Por exemplo, quero pegar o retorno da função dadosCidades e fazer algo com ele, sem receber undefined
    const names = (await dadosSubgrupos())
     console.log(names)
 });