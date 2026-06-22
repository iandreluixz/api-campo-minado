const jogoService = require('../services/jogoService');

async function iniciarJogo(req, res) {
  try {
    const resultado = await jogoService.iniciarJogo(req.body);
    return res.status(201).json(resultado);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno.' });
  }
}

async function revelarPosicao(req, res) {
  try {
    const gameId = parseInt(req.params.gameId);
    const { linha, coluna } = req.body;
    const resultado = await jogoService.revelarPosicao({ gameId, linha, coluna });
    return res.status(200).json(resultado);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno.' });
  }
}

async function cashout(req, res) {
  try {
    const gameId = parseInt(req.params.gameId);
    const resultado = await jogoService.cashout(gameId);
    return res.status(200).json(resultado);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno.' });
  }
}

module.exports = { iniciarJogo, revelarPosicao, cashout };
