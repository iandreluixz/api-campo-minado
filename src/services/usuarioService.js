const usuarioRepository = require('../repositories/usuarioRepository');

async function buscarPerfil(id) {
  const usuario = await usuarioRepository.buscarPorId(id);
  if (!usuario) {
    throw { status: 404, message: 'Usuário não encontrado.' };
  }
  return {
    id:    usuario.id,
    nome:  usuario.nome,
    email: usuario.email,
    saldo: parseFloat(usuario.saldo),
  };
}

async function buscarDashboard(usuarioId) {
  const usuario = await usuarioRepository.buscarPorId(usuarioId);
  if (!usuario) {
    throw { status: 404, message: 'Usuário não encontrado.' };
  }

  const stats = await usuarioRepository.buscarEstatisticas(usuarioId);

  return {
    totalJogos:   parseInt(stats.totalJogos),
    vitorias:     parseInt(stats.vitorias),
    derrotas:     parseInt(stats.derrotas),
    valorGanho:   parseFloat(stats.valorGanho),
    valorPerdido: parseFloat(stats.valorPerdido),
  };
}

async function atualizarSaldo(id, saldo) {
  if (saldo === undefined || saldo === null) {
    throw { status: 400, message: 'O campo saldo é obrigatório.' };
  }

  if (saldo < 0) {
    throw { status: 400, message: 'Não é permitido cadastrar saldo negativo.' };
  }

  // Limitar a duas casas decimais
  const saldoFormatado = parseFloat(parseFloat(saldo).toFixed(2));

  const usuario = await usuarioRepository.atualizarSaldo(id, saldoFormatado);
  if (!usuario) {
    throw { status: 404, message: 'Usuário não encontrado.' };
  }

  return {
    id:    usuario.id,
    nome:  usuario.nome,
    email: usuario.email,
    saldo: parseFloat(usuario.saldo),
  };
}

async function deletarUsuario(id) {
  const deletado = await usuarioRepository.deletarUsuario(id);
  if (!deletado) {
    throw { status: 404, message: 'Usuário não encontrado.' };
  }
  return { message: 'Usuário excluído com sucesso.' };
}

module.exports = { buscarPerfil, buscarDashboard, atualizarSaldo, deletarUsuario };
