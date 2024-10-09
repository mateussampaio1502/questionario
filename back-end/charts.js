import { addDataBtn, graficoDadosEletroMedia, graficoDadosEletroMediaInuteis, TABELA_CADASTROS } from './consts.js'
import {db} from '../back-end/firebase.js'
import {PotenciaMap} from './potenciaConfig.js'
import { graficoCidades,  
    graficoHorariosDiasUteis,
    graficoHorariosFeriadosFDS,
    graficoEficiencia,
    graficoManutencao,
    graficoDadosEletro,
    graficoDadosEletroFDS,
    getBtn,
    testeBtn,
    refreshBtn
} from './consts.js';



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
        quantidadeTotalDeMembros++;
        for(let i = 0; i < dados.length; i++){
            for (let hora = 0; hora < totalHoras; hora++) {
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
            }
            
        }
        horarioSet.push(horariosDoPesquisado)

    }
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
        quantidadeTotalDeMembros++;
        for(let i = 0; i < dados.length; i++){
            for (let hora = 0; hora < totalHoras; hora++) {
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
        console.log(doc.data().dadosEficiencia)
        const niveis = JSON.parse(doc.data().dadosEficiencia);
        
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
const dadosEletrodomesticos = async () => {
    const datasets = [];
    
    const querySnapshot = await db.collection(TABELA_CADASTROS).get();

    // Inicializa o array para armazenar a potência total de cada hora
    const arrayDeAcrescimo = (await dadosEletrodomesticosEspeciais()).diaUtil
    let contador = 0;
    querySnapshot.forEach((doc) => {
        const potenciaTotalPorHora = Array(24).fill(0);
        const dados_eletro = JSON.parse(doc.data().dados_eletro);

        // Itera sobre cada equipamento
        dados_eletro.forEach(equipamento => {
            const nomeEquipamento = equipamento.equipamento;
            const horas = equipamento.horas;
            const potenciaEquipamento = PotenciaMap[nomeEquipamento];

            // Adiciona a potência do equipamento para cada hora correspondente
            horas.forEach((ligado, hora) => {
                if (ligado) {
                    potenciaTotalPorHora[hora] += potenciaEquipamento;
                    
                }
                potenciaTotalPorHora[hora] = potenciaTotalPorHora[hora] + arrayDeAcrescimo[contador]
            });
        });
        datasets.push(potenciaTotalPorHora);
        contador++;
        console.log(datasets)
    });
    console.log(calculateAverages(datasets))
    return {
        datasets: datasets,
        AVGdatasets: calculateAverages(datasets)
    };
}

function calculateAverages(dataset) {
    let n_items = dataset.length;
    let sumArray = new Array(dataset[0].length).fill(0); // Inicializa a soma dos elementos em 0 com o tamanho correto

    // Soma os elementos correspondentes dos sub-arrays
    for (let i = 0; i < n_items; i++) {
        for (let j = 0; j < dataset[i].length; j++) {
            sumArray[j] += dataset[i][j];
        }
    }

    // Calcula a média dividindo pelo número de itens
    let avgArray = sumArray.map(sum => sum / n_items);

    return avgArray;
}

const dadosEletrodomesticosEspeciais = async () => {
    const datasetsDiaUtil = [];
    const datasetsFDS = [];
    const querySnapshot = await db.collection(TABELA_CADASTROS).get();


    querySnapshot.forEach((doc) => {
        const dados_eletro_esp = JSON.parse(doc.data().dados_eletro_esp);

        // Array para armazenar a potência total por hora para o documento atual
        let potenciaTotalPorHora = 0;
        let potenciaTotalPorHoraFDS = 0;
        dados_eletro_esp.forEach(equipamento => {
            const nomeEquipamento = equipamento.equipamento;
            const quantidade = parseInt(equipamento.quantidade);
            const tempo = parseInt(equipamento.tempo);
            const potenciaEquipamento = PotenciaMap[nomeEquipamento];

            // Calcula a potência média por hora para o equipamento nos dias de semana
            const potenciaMediaPorHora = (potenciaEquipamento * quantidade * tempo) / (5 * 24);
            potenciaTotalPorHora = potenciaTotalPorHora + potenciaMediaPorHora;
           
            // Calcula a potência média por hora para o equipamento nos FDS
            const potenciaMediaPorHoraFDS = (potenciaEquipamento * quantidade * tempo) / (2 * 24);
            potenciaTotalPorHoraFDS = potenciaTotalPorHoraFDS + potenciaMediaPorHora;
        });

        datasetsDiaUtil.push(potenciaTotalPorHora);
        datasetsFDS.push(potenciaTotalPorHoraFDS);
    });
    console.log("Array do dia util ", datasetsDiaUtil)
    return {
        diaUtil: datasetsDiaUtil,//contém a quantidade de potencia pra adicionar  por hora para cada documento nos dias uteis
        diaInutil:  datasetsFDS//contém a quantidade de potencia pra adicionar  por hora para cada documento no FDS
    };
};


const dadosEletrodomesticosFDS = async () => {
    const datasets = [];
    
    const querySnapshot = await db.collection(TABELA_CADASTROS).get();
    

    // Inicializa o array para armazenar a potência total de cada hora
    const arrayDeAcrescimo = (await dadosEletrodomesticosEspeciais()).diaInutil
    let contador = 0;
    querySnapshot.forEach((doc) => {
        const potenciaTotalPorHora = Array(24).fill(0);
        const dados_eletro_weekend = JSON.parse(doc.data().dados_eletro_weekend);

        // Itera sobre cada equipamento
        dados_eletro_weekend.forEach(equipamento => {
            const nomeEquipamento = equipamento.equipamento;
            const horas = equipamento.horas;
            const potenciaEquipamento = PotenciaMap[nomeEquipamento];

            // Adiciona a potência do equipamento para cada hora correspondente
            horas.forEach((ligado, hora) => {
                if (ligado) {
                    potenciaTotalPorHora[hora] = potenciaTotalPorHora[hora]  + potenciaEquipamento;
                }
                potenciaTotalPorHora[hora] = potenciaTotalPorHora[hora] + arrayDeAcrescimo[contador]
            });

        });
        datasets.push(potenciaTotalPorHora);
        contador++;
    });

    return {
        datasets: datasets,
        AVGdatasets: calculateAverages(datasets)
    };
}

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
            labels: ['A', 'B'],
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

    //Eletrodomésticos DIAS ÚTEIS
    new Chart(graficoDadosEletro, {
        type: 'line',
        data: {
            labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
            datasets: (await dadosEletrodomesticos()).datasets.map((item, index)=>{
                const color = randomColor()
                return {
                    label: contatosNomes[index] + " - Watts:",
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
                text: 'Curva de potência (P x t) para os eletrodomésticos nos dias úteis'
            }
        },
            scales: {
                x: {
                    stacked: false
                },
                y: {
                    stacked: false
                }
            }
        }
    });
    //Criando curva geral dias úteis
    new Chart(graficoDadosEletroMedia, {
        type: 'line',
        data: {
            labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
            datasets: [{
                label: 'Média Total',
                    data: (await dadosEletrodomesticos()).AVGdatasets,
                    backgroundColor: 'red',
                    borderColor: 'red',
                    borderWidth: 1
            }] 
        },
        options: {
            plugins: {
            title: {
                display: true,
                text: 'Curva de carga total'
            }
        },
            scales: {
                x: {
                    stacked: false
                },
                y: {
                    stacked: false
                }
            }
        }
    });
    //Eletrodomésticos N DIAS ÚTEIS
    new Chart(graficoDadosEletroFDS, {
        type: 'line',
        data: {
            labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
            datasets: (await dadosEletrodomesticosFDS()).datasets.map((item, index)=>{
                const color = randomColor()
                return {
                    label: contatosNomes[index] + " - Watts: ",
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
                text: 'Curva de potência (P x t) para os eletrodomésticos nos dias  NÃO úteis'
            }
        },
            scales: {
                x: {
                    stacked: false
                },
                y: {
                    stacked: false
                }
            }
        }
    });
    //curva geral dias não uteis
new Chart(graficoDadosEletroMediaInuteis, {
    type: 'line',
    data: {
        labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
        datasets: [{
            label: 'Média Total para dias não úteis',
                data: (await dadosEletrodomesticosFDS()).AVGdatasets,
                backgroundColor: 'red',
                borderColor: 'red',
                borderWidth: 1
        }] 
    },
    options: {
        plugins: {
        title: {
            display: true,
            text: 'Curva de carga total para os dias não úteis'
        }
    },
        scales: {
            x: {
                stacked: false
            },
            y: {
                stacked: false
            }
        }
    }
});
})
// testeBtn.addEventListener('click', async () => {
//     console.log('teste')
//     //Botão para executar funções de teste
//     // const teste = (await dadosEletrodomesticosEspeciais()).diaUtil
//  });