const jogoRepository    = require('../repositories/jogoRepository');
const usuarioRepository = require('../repositories/usuarioRepository');
const { gerarTabuleiro, calcularPremio } = require('../modules/tabuleiro');

async function iniciarJogo({ idUser, valorAposta }) {
  if (!idUser || !valorAposta) {
    throw { status: 400, message: 'idUser e valorAposta são obrigatórios.' };
  }

  if (valorAposta <= 0) {
    throw { status: 400, message: 'O valor da aposta deve ser maior que zero.' };
  }

  // Verifica se usuário existe e tem saldo suficiente
  const usuario = await usuarioRepository.buscarPorId(idUser);
  if (!usuario) {
    throw { status: 404, message: 'Usuário não encontrado.' };
  }

  if (parseFloat(usuario.saldo) < valorAposta) {
    throw { status: 400, message: 'Saldo insuficiente para realizar a aposta.' };
  }

  // Verifica se o usuário já tem uma partida em andamento
  const jogoAtivo = await jogoRepository.buscarJogoEmAndamento(idUser);
  if (jogoAtivo) {
    throw { status: 400, message: 'Você já possui uma partida em andamento. Conclua-a antes de iniciar uma nova.' };
  }

  // Debita o valor da aposta
  await usuarioRepository.debitarSaldo(idUser, valorAposta);

  // Gera o tabuleiro aleatório
  const tabuleiro = gerarTabuleiro();

  // Cria o jogo no banco
  const jogo = await jogoRepository.criarJogo({ usuarioId: idUser, valorAposta, tabuleiro });

  return { gameId: jogo.id };
}

async function revelarPosicao({ gameId, linha, coluna }) {
  if (linha === undefined || coluna === undefined) {
    throw { status: 400, message: 'linha e coluna são obrigatórios.' };
  }

  // Validar limites do tabuleiro (0-4)
  if (linha < 0 || linha > 4 || coluna < 0 || coluna > 4) {
    throw { status: 400, message: 'Posição inválida. Linha e coluna devem estar entre 0 e 4.' };
  }

  const jogo = await jogoRepository.buscarJogoPorId(gameId);
  if (!jogo) {
    throw { status: 404, message: 'Jogo não encontrado.' };
  }

  if (jogo.status !== 'EM_ANDAMENTO') {
    throw { status: 400, message: 'Esta partida já foi encerrada.' };
  }

  // Verifica se posição já foi revelada
  const posicoesReveladas = JSON.parse(jogo.posicoes_reveladas);
  const jaRevelada = posicoesReveladas.some(p => p.linha === linha && p.coluna === coluna);
  if (jaRevelada) {
    throw { status: 400, message: 'Esta posição já foi revelada. Escolha outra posição.' };
  }

  // Verifica o conteúdo da posição
  const tabuleiro = JSON.parse(jogo.tabuleiro);
  const conteudo  = tabuleiro[linha][coluna];

  // Adiciona a posição às reveladas
  posicoesReveladas.push({ linha, coluna });

  if (conteudo === 'BOMBA') {
    // Derrota: jogo encerrado, sem prêmio
    await jogoRepository.atualizarJogo({
      id:                  gameId,
      posicoes_reveladas:  posicoesReveladas,
      diamantes:           jogo.diamantes,
      status:              'PERDIDO',
      premio_final:        0,
    });

    return { resultado: 'BOMBA', status: 'PERDIDO' };
  }

  // Diamante encontrado
  const novosDiamantes = parseInt(jogo.diamantes) + 1;
  const premioAtual    = calcularPremio(parseFloat(jogo.valor_aposta), novosDiamantes);

  await jogoRepository.atualizarJogo({
    id:                 gameId,
    posicoes_reveladas: posicoesReveladas,
    diamantes:          novosDiamantes,
    status:             'EM_ANDAMENTO',
    premio_final:       premioAtual,
  });

  return {
    resultado:          'DIAMANTE',
    diamantesEncontrados: novosDiamantes,
    premioAtual,
  };
}

async function cashout(gameId) {
  const jogo = await jogoRepository.buscarJogoPorId(gameId);
  if (!jogo) {
    throw { status: 404, message: 'Jogo não encontrado.' };
  }

  if (jogo.status !== 'EM_ANDAMENTO') {
    throw { status: 400, message: 'Esta partida já foi encerrada.' };
  }

  if (parseInt(jogo.diamantes) === 0) {
    throw { status: 400, message: 'Você precisa encontrar pelo menos um diamante antes de sacar.' };
  }

  const premioFinal = calcularPremio(parseFloat(jogo.valor_aposta), parseInt(jogo.diamantes));

  // Credita o prêmio ao usuário
  await usuarioRepository.creditarSaldo(jogo.usuario_id, premioFinal);

  // Finaliza o jogo
  await jogoRepository.atualizarJogo({
    id:                 gameId,
    posicoes_reveladas: JSON.parse(jogo.posicoes_reveladas),
    diamantes:          jogo.diamantes,
    status:             'GANHO',
    premio_final:       premioFinal,
  });

  return {
    message:      'Saque realizado com sucesso!',
    diamantes:    parseInt(jogo.diamantes),
    premioFinal,
  };
}

module.exports = { iniciarJogo, revelarPosicao, cashout };
