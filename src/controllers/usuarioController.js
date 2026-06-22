const usuarioService = require('../services/usuarioService');

async function buscarPerfil(req, res) {
  try {
    const usuario = await usuarioService.buscarPerfil(req.params.id);
    return res.status(200).json(usuario);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno.' });
  }
}

async function buscarDashboard(req, res) {
  try {
    // Pega o id via query param ou body (ex: /users/dashboard?id=1)
    const id = req.query.id || req.body.id;
    if (!id) {
      return res.status(400).json({ message: 'Informe o id do usuário via query param (?id=1).' });
    }
    const stats = await usuarioService.buscarDashboard(id);
    return res.status(200).json(stats);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno.' });
  }
}

async function atualizarSaldo(req, res) {
  try {
    const usuario = await usuarioService.atualizarSaldo(req.params.id, req.body.saldo);
    return res.status(200).json(usuario);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno.' });
  }
}

async function deletarUsuario(req, res) {
  try {
    const resultado = await usuarioService.deletarUsuario(req.params.id);
    return res.status(200).json(resultado);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno.' });
  }
}

module.exports = { buscarPerfil, buscarDashboard, atualizarSaldo, deletarUsuario };
