import { addDataBtn, TABELA_CADASTROS } from './consts.js'
import {db} from '../back-end/firebase.js'


const graficoCidades = document.getElementById('graficoCidades');
const graficoHorariosDiasUteis = document.getElementById('graficoHorariosDiasUteis');
const graficoHorariosFeriadosFDS = document.getElementById('graficoHorariosFeriadosFDS');
const graficoEficiencia = document.getElementById('graficoEficiencia');
const graficoManutencao = document.getElementById('graficoManutencao');
const ctx = document.getElementById('myChart').getContext('2d');

const getBtn = document.getElementById('getBtn');
const testeBtn = document.getElementById('testeBtn');
const refreshBtn = document.getElementById('refreshBtn');

//Dados disponíveis para cidades: [nomes, quantidades], [nomes], [quantidades]
const dadosCidades = async () => {
    const cities = [];
    const cityCount = {};
    const contatos = [];
    const contatosNomes = [];
    const querySnapshot = await db.collection(TABELA_CADASTROS).get();
    querySnapshot.forEach((doc) => {
        const city = JSON.parse(doc.data().dadosPessoais).cidade;
        const contato = JSON.parse(doc.data().dadosPessoais).contato;
        const contatoNome = JSON.parse(doc.data().dadosPessoais).nome;
        cityCount[city] = (cityCount[city] || 0) + 1;
        contatos.push(contato);
        contatosNomes.push(contatoNome);
    });
    for (const city in cityCount) {
        cities.push([city, cityCount[city]]);
    }
    
    return {
        cities: cities,
        names: cities.map(city => city[0]),
        quantidades: cities.map(city => city[1]),
        listaDeContatos: contatos,
        listaDeContatosNomes: contatosNomes
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
//Dados disponíveis para horários em feriados e fim de semana: [pessoasEmCasa, quantidadeTotalDeMembros]
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

//Dados para eficiência
const dadosEficiencia = async () => {
    const nivelEficiencia = [];
    const nivelManutencao = [];
    const cityCount = {};
 
    const querySnapshot = await db.collection(TABELA_CADASTROS).get();
    querySnapshot.forEach((doc) => {
        const niveis = JSON.parse(doc.data().dadosEficiencia);
        console.log(niveis)
        switch (niveis.nivelEficiencia) {
            case 'A':
                nivelEficiencia.push([1, 0, 0, 0]);
                break;
            case 'B':
                nivelEficiencia.push([0, 1, 0, 0]);
                break;
            case 'C':
                nivelEficiencia.push([0, 0, 1, 0]);
                break;
            case 'D':
                nivelEficiencia.push([0, 0, 0, 1]);
                break;
            default:
                console.log('Nível de eficiência não encontrado')
                break;
        }
        switch (niveis.nivelManutencao) {
            case 'A':
                nivelManutencao.push([1, 0, 0, 0]);
                break;
            case 'B':
                nivelManutencao.push([0, 1, 0, 0]);
                break;
            case 'C':
                nivelManutencao.push([0, 0, 1, 0]);
                break;
            case 'D':
                nivelManutencao.push([0, 0, 0, 1]);
                break;
            default:
                console.log('Nível de Manutenção não encontrado')
                break;
        }

    });

    return {
        nivelEficiencia: nivelEficiencia,
        nivelManutencao: nivelManutencao
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
    const contatosNomes = (await dadosCidades()).listaDeContatosNomes
    new Chart(graficoHorariosDiasUteis, {
        type: 'bar',
        data: {
            labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
            datasets: (await dadosHorariosDiasUteis()).pessoasEmCasa.map((item, index)=>{
                const color = randomColor()
                console.log(contatosNomes[index])
                return {
                    label: contatosNomes[index] + " - Moradores",
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
                console.log(contatosNomes[index])
                return {
                    label: contatosNomes[index] + " - Moradores",
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

    //Nível de eficiência
    new Chart(graficoEficiencia, {
        type: 'bar',
        data: {
            labels: ['A', 'B', 'C', 'D'],
            datasets: (await dadosEficiencia()).nivelEficiencia.map((item, index)=>{
                const color = randomColor()
                return {
                    label: contatosNomes[index] + " - Moradores",
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
                text: 'Nível de Eficiência dos Equipamentos Domésticos'
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

    //Nível de Manutenção
    new Chart(graficoManutencao, {
        type: 'bar',
        data: {
            labels: ['A', 'B', 'C', 'D'],
            datasets: (await dadosEficiencia()).nivelManutencao.map((item, index)=>{
                const color = randomColor()
                return {
                    label: contatosNomes[index] + " - Moradores",
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
                text: 'Nível de Manutenção dos Equipamentos Domésticos'
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

    //Eletrodomésticos
    const ctx = document.getElementById('myChart').getContext('2d');
    // Mock data
    const data = {
        datasets: [
            {
                label: 'Eletrodoméstico 1',
                data: [
                    { x: 8, y: 'Morador 1', r: 10 },
                    { x: 10, y: 'Morador 2', r: 15 },
                    { x: 14, y: 'Morador 3', r: 20 }
                ],
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            },
            {
                label: 'Eletrodoméstico 2',
                data: [
                    { x: 9, y: 'Morador 1', r: 20 },
                    { x: 12, y: 'Morador 2', r: 10 },
                    { x: 18, y: 'Morador 3', r: 15 }
                ],
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            },
            {
                label: 'Eletrodoméstico 3',
                data: [
                    { x: 11, y: 'Morador 1', r: 30 },
                    { x: 16, y: 'Morador 2', r: 25 },
                    { x: 19, y: 'Morador 3', r: 10 }
                ],
                backgroundColor: 'rgba(75, 192, 192, 0.5)'
            }
        ]
    };

    // Define the scales for the x and y axes
    const options = {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                min: 0,
                max: 23,
                title: {
                    display: true,
                    text: 'Horas'
                },
                ticks: {
                    callback: function(value) {
                        return value + 'h';
                    }
                }
            },
            y: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Moradores'
                },
                labels: ['Morador 1', 'Morador 2', 'Morador 3']
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.dataset.label || '';
                        const x = context.raw.x + 'h';
                        const y = context.raw.y;
                        const r = context.raw.r;
                        return `${label}: (${x}, ${y}, Quantidade: ${r})`;
                    }
                }
            }
        }
    };

    // Create the chart
    const myChart = new Chart(ctx, {
        type: 'bubble',
        data: data,
        options: options
    });
})
testeBtn.addEventListener('click', async () => {
    //Por exemplo, quero pegar o retorno da função dadosCidades e fazer algo com ele, sem receber undefined
    dadosEficiencia()
 });