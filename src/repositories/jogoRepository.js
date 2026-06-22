const db = require('../config/database');

async function criarJogo({ usuarioId, valorAposta, tabuleiro }) {
  const result = await db.query(
    `INSERT INTO jogos (usuario_id, valor_aposta, tabuleiro, posicoes_reveladas, diamantes, status)
     VALUES ($1, $2, $3, '[]', 0, 'EM_ANDAMENTO')
     RETURNING id`,
    [usuarioId, valorAposta, JSON.stringify(tabuleiro)]
  );
  return result.rows[0];
}

async function buscarJogoPorId(id) {
  const result = await db.query(
    'SELECT * FROM jogos WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

async function buscarJogoEmAndamento(usuarioId) {
  const result = await db.query(
    `SELECT id FROM jogos
     WHERE usuario_id = $1 AND status = 'EM_ANDAMENTO'
     LIMIT 1`,
    [usuarioId]
  );
  return result.rows[0] || null;
}

async function atualizarJogo({ id, posicoes_reveladas, diamantes, status, premio_final }) {
  const result = await db.query(
    `UPDATE jogos
     SET posicoes_reveladas = $1,
         diamantes          = $2,
         status             = $3,
         premio_final       = $4,
         updated_at         = NOW()
     WHERE id = $5
     RETURNING *`,
    [JSON.stringify(posicoes_reveladas), diamantes, status, premio_final, id]
  );
  return result.rows[0];
}

module.exports = {
  criarJogo,
  buscarJogoPorId,
  buscarJogoEmAndamento,
  atualizarJogo,
};
