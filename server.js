const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 3000;

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
    user: "seu_usuario",
    host: "localhost", // Ou o IP do servidor do banco
    database: "seu_banco",
    password: "sua_senha",
    port: 5432, // Porta padrão do PostgreSQL
});

// Middlewares
app.use(express.json()); 
app.use(cors());

// Rota para receber pedidos
app.post("/api/pedidos", async (req, res) => {
    const { nome_cliente, endereco, produtos } = req.body;

    if (!nome_cliente || !endereco || !produtos) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO pedidos (nome_cliente, endereco, produtos) VALUES ($1, $2, $3) RETURNING *",
            [nome_cliente, endereco, produtos]
        );
        res.status(201).json({ mensagem: "Pedido recebido com sucesso", pedido: result.rows[0] });
    } catch (error) {
        console.error("Erro ao salvar pedido:", error);
        res.status(500).json({ erro: "Erro ao processar pedido" });
    }
});

// Rota para listar os pedidos
app.get("/api/pedidos", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM pedidos ORDER BY id DESC");
        res.json(result.rows);
    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        res.status(500).json({ erro: "Erro ao buscar pedidos" });
    }
});

// Iniciando o servidor
app.listen(port, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${port}`);
});
