const usuarioRepository = require('../repositories/usuarioRepository');
const { validarSenha }   = require('../modules/senhaValidator');

async function register({ nome, email, dataNascimento, senha, confirmacaoSenha }) {
  // Campos obrigatórios
  if (!nome || !email || !dataNascimento || !senha || !confirmacaoSenha) {
    throw { status: 400, message: 'Todos os campos são obrigatórios.' };
  }

  // Confirmação de senha
  if (senha !== confirmacaoSenha) {
    throw { status: 400, message: 'A senha e a confirmação de senha não coincidem.' };
  }

  // Requisitos da senha
  const errosSenha = validarSenha(senha);
  if (errosSenha.length > 0) {
    throw { status: 400, message: errosSenha.join(' ') };
  }

  // E-mail duplicado
  const existente = await usuarioRepository.buscarPorEmail(email);
  if (existente) {
    throw { status: 409, message: 'E-mail já cadastrado.' };
  }

  const usuario = await usuarioRepository.criarUsuario({
    nome,
    email,
    dataNascimento,
    senha, // em produção usar bcrypt; mantido simples conforme escopo do trabalho
  });

  return usuario;
}

async function login({ email, senha }) {
  if (!email || !senha) {
    throw { status: 400, message: 'E-mail e senha são obrigatórios.' };
  }

  const usuario = await usuarioRepository.buscarPorEmail(email);
  if (!usuario || usuario.senha !== senha) {
    throw { status: 401, message: 'E-mail ou senha inválidos.' };
  }

  return {
    nome:           usuario.nome,
    email:          usuario.email,
    dataNascimento: usuario.data_nascimento,
  };
}

async function resetPassword({ id, novaSenha }) {
  if (!id || !novaSenha) {
    throw { status: 400, message: 'ID e nova senha são obrigatórios.' };
  }

  const errosSenha = validarSenha(novaSenha);
  if (errosSenha.length > 0) {
    throw { status: 400, message: errosSenha.join(' ') };
  }

  // Busca o usuário para verificar senha atual
  const result = await require('../config/database').query(
    'SELECT senha FROM usuarios WHERE id = $1', [id]
  );
  const usuario = result.rows[0];
  if (!usuario) {
    throw { status: 404, message: 'Usuário não encontrado.' };
  }

  if (usuario.senha === novaSenha) {
    throw { status: 400, message: 'A nova senha não pode ser igual à senha atual.' };
  }

  await usuarioRepository.atualizarSenha(id, novaSenha);

  return { message: 'Senha atualizada com sucesso.' };
}

module.exports = { register, login, resetPassword };
