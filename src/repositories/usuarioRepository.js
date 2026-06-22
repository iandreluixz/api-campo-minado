const db = require('../config/database');

async function criarUsuario({ nome, email, dataNascimento, senha }) {
  const result = await db.query(
    `INSERT INTO usuarios (nome, email, data_nascimento, senha)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nome, email, data_nascimento`,
    [nome, email, dataNascimento, senha]
  );
  return result.rows[0];
}

async function buscarPorEmail(email) {
  const result = await db.query(
    'SELECT * FROM usuarios WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

async function buscarPorId(id) {
  const result = await db.query(
    'SELECT id, nome, email, data_nascimento, saldo FROM usuarios WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

async function atualizarSenha(id, novaSenha) {
  await db.query(
    'UPDATE usuarios SET senha = $1 WHERE id = $2',
    [novaSenha, id]
  );
}

async function atualizarSaldo(id, saldo) {
  const result = await db.query(
    'UPDATE usuarios SET saldo = $1 WHERE id = $2 RETURNING id, nome, email, saldo',
    [saldo, id]
  );
  return result.rows[0] || null;
}

async function debitarSaldo(id, valor) {
  const result = await db.query(
    'UPDATE usuarios SET saldo = saldo - $1 WHERE id = $2 RETURNING saldo',
    [valor, id]
  );
  return result.rows[0] || null;
}

async function creditarSaldo(id, valor) {
  const result = await db.query(
    'UPDATE usuarios SET saldo = saldo + $1 WHERE id = $2 RETURNING saldo',
    [valor, id]
  );
  return result.rows[0] || null;
}

async function deletarUsuario(id) {
  // Os jogos são deletados em cascata (ON DELETE CASCADE no banco)
  const result = await db.query(
    'DELETE FROM usuarios WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rows[0] || null;
}

async function buscarEstatisticas(usuarioId) {
  const result = await db.query(
    `SELECT
       COUNT(*)                                            AS "totalJogos",
       COUNT(*) FILTER (WHERE status = 'GANHO')           AS "vitorias",
       COUNT(*) FILTER (WHERE status = 'PERDIDO')         AS "derrotas",
       COALESCE(SUM(premio_final) FILTER (WHERE status = 'GANHO'),  0) AS "valorGanho",
       COALESCE(SUM(valor_aposta) FILTER (WHERE status = 'PERDIDO'), 0) AS "valorPerdido"
     FROM jogos
     WHERE usuario_id = $1`,
    [usuarioId]
  );
  return result.rows[0];
}

module.exports = {
  criarUsuario,
  buscarPorEmail,
  buscarPorId,
  atualizarSenha,
  atualizarSaldo,
  debitarSaldo,
  creditarSaldo,
  deletarUsuario,
  buscarEstatisticas,
};
