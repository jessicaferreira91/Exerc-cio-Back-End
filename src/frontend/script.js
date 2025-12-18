const API_URL = 'http://localhost:3000'; // URL da API para a gestão dos usuários

async function adicionarPokemon(){
    // promise / promessa
    // uma promessa de que a função vai ser concluida
    // a promessa é um objeto que serve como um retorno inicial dessa função
    // depois que qualquer cálculo for concluido, a promessa será RESOLVIDA e transformada em outra coisa (depende da função)
    // funções async (assicronas) permitem que o código continue rodando mesmo se ela não tiver sido concluida ainda

    const nome = document.getElementById('Nome').value // pega o valor de nome digitado
    const tipo = document.getElementById('Tipo').value //pega o valor de email 
    const nivel = document.getElementById('nivel').value // pega o valor de senha
   

    // try (lê-se trái)
    // significa tente / tentar
    // ele TENTA executar o código que fica dentro das chaves
    // se ocorrer algum erro, ele cai dentro do CATCH, que significa CAPTURAR 
    // o catch captura o erro e podemos exibir o erro
    try {
        // a função fetch (que significa 'buscar') é utilizada para que o nosso código possa se comunicar com o servidor
        // através dela, podemos acessar as rotas
        // await significa 'espere'
        // Como o servidor pode levar um tempo para nos dar a resposta para a nossa requisição, dizemos para o JS: 'aguarde esta requisição terminar, mas sem interromper o restante do codigo
        // a função fetch recebe DOIS PARâMETROS:
        // O PRIMEIRO é o link completo para a requisição
        // o segundo é um objeto com varias informações necessárias  para a requisição
    
        const resposta = await fetch(`${API_URL}/criar`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json' // define o tipo de conteudo como JSON
            },
            body: JSON.stringify({nome, tipo, nivel}) // converte os valores que pegamos nos inputs para o formato JSON

        })

        const dados = await resposta.text()  //converter a resposta do servidor (que vem em JSON) em u, texto simples
        alert(dados)
    } catch(erro){
        console.log("Erro:", erro)

    }
    
    
}

async function  obterPokemon(){
    try {
        //para requisições do métdodo GET, como não precisamos emviar nenhuma informação, sõ precisamos enviar como parâMETRO DA FUNÇÃO FETCH( O LINK DA REQUISIÇÃO)
        const resposta = await fetch (`${API_URL}/ler`)
        const dados = await resposta.json()

        const lista = document.getElementById('Pokemon')
        lista.innerHTML = ''  // representa tudo que tem dentro de um elemento
        // o foreach percorre um array OU um objeto
        // no nosso caso, ele vai percorrer o objeto 'dados'
        // a função foreach recebe como parametro uma outra função
        //esta função executa alguma coisa, alguma ação, para cada elemento-item que temos dentro do nosso objeto ou array
        // foreach significa, LITERALMENTE, para cada
        // ou seja, PARA CADA usuário, FAÇA ALGO
        dados.forEach((pokemon) => {
            // document.createElement() CRIA um novo elemento via código
            // precisamos
            const li = document.createElement('li')
            li.innerHTML = `
            ${pokemon.nome} - ${pokemon.tipo} - ${pokemon.nivel}
            <button onclick="editarPokemon(${pokemon.id}, '${pokemon.nome}', '${pokemon.tipo}', ${pokemon.nivel})">Editar</button>
            <button onclick="deletarPokemon(${pokemon.id})">Deletar</button>`

             lista.appendChild(li) // adiciona os 'li' que criamos dentro da lista que tem id 'usuarios'

        })

    } catch(erro) {
        console.log("Erro:", erro)

    }



}
    
async function  deletarPokemon(id){
    try{
        const resposta = await fetch (`${API_URL}/deletar/${id}`, {method: 'DELETE'})
        const dados = await resposta.text()
        alert(dados)


    } catch (erro) {
        alert("Erro ao deletar Pokémon:", erro)
    }

}


async function atualizarPokemon() {
    if (pokemonEditandoId === null) {
        alert('Selecione um Pokémon para editar')
        return
    }

    const nome = document.getElementById('Nome').value
    const tipo = document.getElementById('Tipo').value
    const nivel = document.getElementById('nivel').value

    try {
        const resposta = await fetch(`${API_URL}/atualizar/${pokemonEditandoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, tipo, nivel })
        })

        const dados = await resposta.text()
        alert(dados)

        pokemonEditandoId = null
        obterPokemon()
    } catch (erro) {
        console.log('Erro ao atualizar:', erro)
    }
}


function editarPokemon(id, nome, tipo, nivel) {
    document.getElementById('Nome').value = nome
    document.getElementById('Tipo').value = tipo
    document.getElementById('nivel').value = nivel

    pokemonEditandoId = id
}

// TRABALHO

// PARTE 1

// se reunir em duplas
// vocês precisarão criar um servidor do zero, como fizemos em aula
// neste servidor, deve ser permitido regristrar, ler, atualizar e deletar pokémons
// as informações necessárias ficam a cargo de vocês ( SUGESTÃO: nome e tipo)
// usem o que aprendemos em aula até agora
//criem as rotas, instalem as bibliotecas necessárias, testem as rotas usando o thunder client

//PARTE 2

// Depois que testaram o servidor e suas rotas, é hora de criar o front e consumir a nossa API
// você deve poder criar novos pokemón, ver quais pokemons já existem criados, deletar e (se conseguir) atualizar as informações de um pokémon especifico
