-- Script de criação do banco de dados
-- Execute no PostgreSQL antes de iniciar a aplicação

CREATE DATABASE campo_minado;

\c campo_minado;

CREATE TABLE IF NOT EXISTS usuarios (
  id               SERIAL PRIMARY KEY,
  nome             VARCHAR(150)    NOT NULL,
  email            VARCHAR(150)    NOT NULL UNIQUE,
  data_nascimento  DATE            NOT NULL,
  senha            VARCHAR(255)    NOT NULL,
  saldo            NUMERIC(10, 2)  NOT NULL DEFAULT 0.00,
  created_at       TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jogos (
  id                SERIAL PRIMARY KEY,
  usuario_id        INTEGER         NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  valor_aposta      NUMERIC(10, 2)  NOT NULL,
  tabuleiro         TEXT            NOT NULL,  -- JSON do tabuleiro 5x5
  posicoes_reveladas TEXT           NOT NULL DEFAULT '[]', -- JSON array de posições já reveladas
  diamantes         INTEGER         NOT NULL DEFAULT 0,
  status            VARCHAR(20)     NOT NULL DEFAULT 'EM_ANDAMENTO', -- EM_ANDAMENTO, GANHO, PERDIDO
  premio_final      NUMERIC(10, 2)  DEFAULT 0.00,
  created_at        TIMESTAMP       NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMP       NOT NULL DEFAULT NOW()
);
