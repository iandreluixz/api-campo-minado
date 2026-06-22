/**
 * Módulo do tabuleiro Campo Minado (5x5)
 * Cada célula é: 'DIAMANTE' ou 'BOMBA'
 * Gerado aleatoriamente a cada nova partida
 */

const LINHAS  = 5;
const COLUNAS = 5;
const TOTAL_BOMBAS = 5; // 5 bombas e 20 diamantes num tabuleiro 5x5

function gerarTabuleiro() {
  // Cria array de 25 posições com 5 bombas e 20 diamantes
  const celulas = [];

  for (let i = 0; i < TOTAL_BOMBAS; i++) {
    celulas.push('BOMBA');
  }
  for (let i = TOTAL_BOMBAS; i < LINHAS * COLUNAS; i++) {
    celulas.push('DIAMANTE');
  }

  // Embaralha (Fisher-Yates)
  for (let i = celulas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [celulas[i], celulas[j]] = [celulas[j], celulas[i]];
  }

  // Converte para matriz 5x5
  const tabuleiro = [];
  for (let l = 0; l < LINHAS; l++) {
    tabuleiro.push(celulas.slice(l * COLUNAS, l * COLUNAS + COLUNAS));
  }

  return tabuleiro;
}

/**
 * Calcula o prêmio acumulado
 * premio = valorApostado × (1 + (quantidadeDiamantes × 0.33))
 */
function calcularPremio(valorAposta, quantidadeDiamantes) {
  return parseFloat((valorAposta * (1 + quantidadeDiamantes * 0.33)).toFixed(2));
}

module.exports = { gerarTabuleiro, calcularPremio };
