require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRoutes    = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const jogoRoutes    = require('./routes/jogoRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth',  authRoutes);
app.use('/users', usuarioRoutes);
app.use('/games', jogoRoutes);

// Rota de saúde
app.get('/', (req, res) => {
  res.json({ message: 'API Campo Minado funcionando!' });
});

// Middleware de erro genérico
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor.' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;
