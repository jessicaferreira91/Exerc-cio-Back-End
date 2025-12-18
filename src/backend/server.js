// é o script do nosso servidor
// nele, vamos definir as rotas e o que cada uma delas faz
// nos tambem vamos nos conectar com nosso banco de dados


// importando a biblioteca do express (que tem funções para criar meu servidor e acessar minhas rotas)
const express = require('express')
const app = express()
// importando a biblioteca do mysql2 (que tem funções para se conectar e interagir com meu banco de dados)
const mysql = require('mysql2')

// importando a bilbioteca do CORS (que permite requisições de navegadores como o crome para este server)
const cors = require('cors')

// nosso servidor vai enviar e receber dados no formato JSON
app.use(express.json())
app.use(cors()) // permitir requisições de qualquer lugar
// app.use(cors('http://127.0.0.1:5500/')) // permite requisições apenas de um lugar especifico

//como vamos trabalhar com nosso banco de dados, precisamos primeiro nos conectar com ele. para isso, primeiro, vamos configurar a conexão

// createConnection -> criar conexão
const connection = mysql.createConnection({
    host: 'localhost',          //localhost indica que o banco está no meu computador
    port: 3306,                 // porta em que esse servidor "atende"
    user: 'root',               // usuario que usamos para entrar no banco
    password: 'root',           // senha que usamos para entrar no banco
    database: 'banco_artur',    // nome do banco que criamos
});

// conecta usando as informações que passamos acima
connection.connect();

const PORT = 3000

// =========================================================ROTAS=================================================================

// rota para criar um usuario
// o primeiro parametro é o caminho (EX: '/usuarios')
// o segundo parametro é a função que vai fazer algo quando eu acessar esta rotas
// req representa os dadis/informações que vou enviar para o servidor (neste caso, as informações para criar um usoario)
// res representa a RESPOSTA que o servidor vai me dar
app.post('/criar', (req, res ) => {
    const {nome, tipo, nivel} = req.body;


    //criamos um commando que serve para INSERIR um dado no nosso banco
    const commando = "INSERT INTO pokemons (nome,tipo, nivel) VALUES (?,?,?)"
    // connection é a conexão com o nosso banco
    // query() é uma função que me permite executar um comando de banco de dados
    // o 1° parametro é o comando que queremos executar
    // o 2° parametro é um array que contém as informações que serão colocadas no lugar dos '?'
    // o 3° parametro é a função que vai ser executada DEPOIS que o servidor responder (por exemplo, dizendo se achou algo, se conseguir fazer algo ou se deu erro)

    connection.query(commando, [nome, tipo, nivel], (erro) => {
        // se der erro
        if (erro) {
            // status 500 indica que ocorreu algum problema
            // o send() envia a resposta para quem fez a requisição
            console.log(erro)
            return res.status(500).send("erro ao tentar inserir pokémon!")
            
        }
        // status 201 indica que algo foi CRIADO com sucesso
        res.status(201).send("o pokémon foi criado com sucesso")
    })

})

//essa rota retorna os dados de todos os usuarios
app.get('/ler', (req,res) =>{
    const comando = "SELECT * FROM pokemons"

    connection.query(comando, (erro, resultado) => {
        if (erro) {
            return res.status(500).send("erro ao tentar ler as informações")
        }

        res.status(200).json(resultado)
    })
})

// essa rota retorna os dados de um usuário especifico
app.get('/ler/:id', (req, res) =>{
    // pegue o id atraves do parametro da requisição, que nada mais é do que o id que fica na URL
    const {id} = req.params
    // comando do banco que filtra os usuarios por id
    // SELECIONE TODAS AS INFORMAÇÕES DA TABELA USUARIOS
    // PARA QUEM TIVER O ID TAL
    const comando = "SELECT * FROM pokemons WHERE id = ?"
    // LEMBRANDO: .query() é a função que EXECUTA o comando do banco
      connection.query(comando, [id], (erro, resultado) => {
        if (erro) {
            return res.status(500).send("Erro ao tentar ler as informações deste pokémon. Verifique se o id está correto!")
        }
        res.status(200).json(resultado)

    }) 
})

// Rota para atualizar as informações de um pokemon
app.put('/atualizar/:id', (req, res) =>{
    const {id} = req.params
    const {nome, tipo, nivel} = req.body
    // update é o comando do banco que atualiza uma ou mais informações
    // atualize a tabela usuarios trocando nome para o novo valor, email para o novo valor, para quem tiver o id tal
    const comando =  "UPDATE pokemons SET nome = ?, tipo = ?, nivel = ? WHERE id = ?"
    connection.query(comando,[nome,tipo,nivel,id], (erro) =>{
        if (erro) {
            console.log(erro)
            return res.status(500).send("erro ao tentar atualizar os pokémons. Verifique as informações.")
        }
    
        res.status(200).send("pokémon atualizado com sucesso!")

    })
})

// Rota para deletar um usuário
app.delete('/deletar/:id', (req, res) => {
    const {id} = req.params
    // este é o comando para DELETAR uma informação de um banco
    // DELETE DA TABELA USUÁRIOS QUEM TIVER O ID TAL
    const comando = "DELETE FROM pokemons WHERE id = ?"
    connection.query(comando, [id],(erro) => {
        if (erro) {
            return res.status(500).send("erro ao tentar deletar o pokémon. Verifique as informações;")
        } 

        res.status(200).send("pokémon deletado com sucesso!")
    }) 
})


// ================================================================================================================================



app.listen(PORT, () => { console.log(`o servidor está no ar em http://localhost:${PORT}`)})
