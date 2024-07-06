import { addDataBtn, TABELA_CADASTROS } from './consts.js'
import {db} from '../back-end/firebase.js'


const graficoCidades = document.getElementById('graficoCidades');
const graficoHorariosDiasUteis = document.getElementById('graficoHorariosDiasUteis');
const graficoHorariosFeriadosFDS = document.getElementById('graficoHorariosFeriadosFDS');
const getBtn = document.getElementById('getBtn');
const testeBtn = document.getElementById('testeBtn');
const refreshBtn = document.getElementById('refreshBtn');

//Dados disponíveis para cidades: [nomes, quantidades], [nomes], [quantidades]
const dadosCidades = async () => {
    const cities = [];
    const cityCount = {};
    const contatos = [];
    const querySnapshot = await db.collection(TABELA_CADASTROS).get();
    querySnapshot.forEach((doc) => {
        const city = JSON.parse(doc.data().dadosPessoais).cidade;
        const contato = JSON.parse(doc.data().dadosPessoais).contato;
        cityCount[city] = (cityCount[city] || 0) + 1;
        contatos.push(contato);
    });
    for (const city in cityCount) {
        cities.push([city, cityCount[city]]);
    }
    return {
        cities: cities,
        names: cities.map(city => city[0]),
        quantidades: cities.map(city => city[1]),
        listaDeContatos: contatos
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
//Dados disponíveis para horários em dias úteis: [pessoasEmCasa, quantidadeTotalDeMembros]
const dadosHorariosDiasUteis = async () => {
    const querySnapshot = await db.collection(TABELA_CADASTROS).get();
    const totalHoras = 24;
    const pessoasEmCasa = Array(totalHoras).fill(0);
    let datasets = [];
    let quantidadeTotalDeMembros = 0;

    querySnapshot.forEach((doc) => {
        let dados = doc.data().horariosDiasUteis;
        dados = JSON.parse(dados)
        //console.log(dados)
        quantidadeTotalDeMembros++;
        for(let i = 0; i < dados.length; i++){
            for (let hora = 0; hora < totalHoras; hora++) {
                //console.log(dados)
                if (dados[i][hora]) {
                    pessoasEmCasa[hora]++;
                }
            }
        }
        datasets.push(dados);
    });
    const horarioSet = []
    for(let i in datasets){ //cada pesquisado
        const horariosDoPesquisado = []
        for(let j in datasets[i]){ //cada morador
            for(let k in datasets[i][j]){ //cada hora
                if(datasets[i][j][k]){
                    horariosDoPesquisado[k] = (horariosDoPesquisado[k] || 0)+ 1;
                } else{
                    horariosDoPesquisado[k] = (horariosDoPesquisado[k] || 0) + 0;
                }
               // console.log(datasets[i][j][k])
            }
            
        }
        horarioSet.push(horariosDoPesquisado)

    }
    console.log("precisa de algum identificador único para o morador", horarioSet)
    return {
        pessoasEmCasa: horarioSet,
        quantidadeTotalDeMembros: quantidadeTotalDeMembros
    };
}

const dadosHorariosFeriadosFDS= async () => {
    const querySnapshot = await db.collection(TABELA_CADASTROS).get();
    const totalHoras = 24;
    const pessoasEmCasa = Array(totalHoras).fill(0);
    let datasets = [];
    let quantidadeTotalDeMembros = 0;

    querySnapshot.forEach((doc) => {
        let dados = doc.data().horariosFeriadosFDS;
        dados = JSON.parse(dados)
        //console.log(dados)
        quantidadeTotalDeMembros++;
        for(let i = 0; i < dados.length; i++){
            for (let hora = 0; hora < totalHoras; hora++) {
                //console.log(dados)
                if (dados[i][hora]) {
                    pessoasEmCasa[hora]++;
                }
            }
        }
        datasets.push(dados);
    });
    const horarioSet = []
    for(let i in datasets){ //cada pesquisado
        const horariosDoPesquisado = []
        for(let j in datasets[i]){ //cada morador
            for(let k in datasets[i][j]){ //cada hora
                if(datasets[i][j][k]){
                    horariosDoPesquisado[k] = (horariosDoPesquisado[k] || 0)+ 1;
                } else{
                    horariosDoPesquisado[k] = (horariosDoPesquisado[k] || 0) + 0;
                }
               // console.log(datasets[i][j][k])
            }
            
        }
        horarioSet.push(horariosDoPesquisado)

    }
    return {
        pessoasEmCasa: horarioSet,
        quantidadeTotalDeMembros: quantidadeTotalDeMembros
    };
}

const randomColor = () => {
    const r = Math.floor(Math.random() * 156 + 100); // Parte vermelha
    const g = Math.floor(Math.random() * 156 + 100); // Verde
    const b = Math.floor(Math.random() * 156 + 100); // Azul

    return {
        backgroundColor: `rgba(${r}, ${g}, ${b}, ${0.6})`,
        borderColor: `rgba(${r}, ${g}, ${b}, ${1})`
    };
}


getBtn.addEventListener('click', dadosCidades);
refreshBtn.addEventListener('click', async () => {
    //Gráfico de cidades
    new Chart(graficoCidades, {
        type: 'bar',
        data: {
            labels: (await dadosCidades()).names,
            datasets: [{
                label: 'Quantidade de Pessoas',
                data: (await dadosCidades()).quantidades,
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Gráfico de cidades'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    //Gráfico de horários em dias úteis
    const contatos = (await dadosCidades()).listaDeContatos
    new Chart(graficoHorariosDiasUteis, {
        type: 'bar',
        data: {
            labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
            datasets: (await dadosHorariosDiasUteis()).pessoasEmCasa.map((item, index)=>{
                const color = randomColor()
                console.log(contatos[index])
                return {
                    label: contatos[index] + " - Moradores",
                    data: item,
                    backgroundColor: color.backgroundColor,
                    borderColor: color.borderColor,
                    borderWidth: 1
                }
            })
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Horários em casa durante Dias Úteis'
                }
            },
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

    //Gráfico de horários em feriados e fim de semana
    new Chart(graficoHorariosFeriadosFDS, {
        type: 'bar',
        data: {
            labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
            datasets: (await dadosHorariosFeriadosFDS()).pessoasEmCasa.map((item, index)=>{
                const color = randomColor()
                console.log(contatos[index])
                return {
                    label: contatos[index] + " - Moradores",
                    data: item,
                    backgroundColor: color.backgroundColor,
                    borderColor: color.borderColor,
                    borderWidth: 1
                }
            })
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Horários em casa Feriados/Fim de Semana'
                }
            },
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
    console.log('asd')
 });