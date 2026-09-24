const express = require("express")
const cors = require("cors")
const dados = require('./dados.json')

//Funções e códigos auxiliares, tipo: autoIncrement, totais, cálculos...

//Controllers CRUD [create, read, update, delete]
const listarDados = (req, res) => {
    res.send(dados)
}

const buscarDados = (req, resp) => {
    const { id, local, equipamento } = req.query

    const resultado = dados.filter((dado) => {
        const bateId = id ? dado.id == id : true
        const bateLocal = local ? dado.local == local : true
        const bateEquipamento = equipamento ? dado.equipamento == equipamento : true
        return bateId && bateLocal && bateEquipamento
    })

    if (resultado.length > 0) {
        resp.send(resultado)
    } else {
        resp.status(404).send("Nenhum dado encontrado :( (Erro 404)")
    }
}

const gerarNovoId = () => {
    if (dados.length === 0) return 1
    const maiorId = Math.max(...dados.map((dado) => dado.id))
    return maiorId + 1
}

const novodado = (req, resp) => {
    if (req.body) {
        const novoDado = {
            id: gerarNovoId(),
            ...req.body
        }
        dados.push(novoDado)
        resp.send("Dado adicionado com sucesso!")
    } else {
        resp.status(400).send("Erro ao adicionar Dado")
    }
}

const atualizarDado = (req, resp) => {
    const id = req.params.id
    const novoDado = req.body
    let status = 0

    dados.forEach((dado) => {
        if (dado.id == id) {
            status = 1
            dado.dado = novoDado.dado
            dado.local = novoDado.local
            dado.equipamento = novoDado.equipamento
            dado.consumo_kwh = novoDado.consumo_kwh
            dado.mes_referencia = novoDado.mes_referencia
            dado.consumo = novoDado.consumo
        }
    })

    if (status == 1) {
        resp.send("Dado atualizado com sucesso!")
    } else {
        resp.status(404).send("Dado não encontrado :( (Erro 404)")
    }
}

const excluirDado = (req, resp) => {
    const id = req.params.id;
    let status = 0
    dados.forEach((dado, indice) => {
        if (dado.id == id) {
            dados.splice(indice, 1)
            status = 1
        }
    })

    if (status == 1) {
        resp.send("dado Excluido com Sucesso")
    } else {
        resp.status(404).send("dado não encontrado :(")
    }
}


const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const porta = 3000

// rotas legais super
app.get("/dados")
app.post("/dados", novodado)
app.get("/dados", listarDados)
app.get("/dados/busca", buscarDados)
app.put("/dados/:id", atualizarDado)
app.delete("/dados/:id", excluirDado)

//Porta de entrada do servidor e saída do console
app.listen(porta, () => {
    console.log(`Servidor respondendo em: http://localhost:${porta}`)
})

