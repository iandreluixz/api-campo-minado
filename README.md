# API Campo Minado

API REST desenvolvida em Node.js para uma plataforma de apostas baseada no jogo Campo Minado.

## Autor

- André

## Tecnologias Utilizadas

- Node.js (v24.15.0)
- Express.js
- PostgreSQL
- dotenv
- cors
- nodemon

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/iandreluixz/api-campo-minado.git
cd api-campo-minado
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

Acesse o PostgreSQL e execute o script de criação:

```bash
psql -U postgres -f src/config/database.sql
```

Ou rode manualmente no psql:

```sql
CREATE DATABASE campo_minado;
\c campo_minado

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
  tabuleiro         TEXT            NOT NULL,
  posicoes_reveladas TEXT           NOT NULL DEFAULT '[]',
  diamantes         INTEGER         NOT NULL DEFAULT 0,
  status            VARCHAR(20)     NOT NULL DEFAULT 'EM_ANDAMENTO',
  premio_final      NUMERIC(10, 2)  DEFAULT 0.00,
  created_at        TIMESTAMP       NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMP       NOT NULL DEFAULT NOW()
);
```

### 4. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=campo_minado
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
PORT=3000
NODE_ENV=development
```

## Executando a aplicação

```bash
# Modo desenvolvimento (com nodemon)
npm run dev

# Modo produção
npm start
```

A API estará disponível em: `http://localhost:3000`

---

## Endpoints

### Autenticação

#### `POST /auth/register` — Cadastrar usuário
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "dataNascimento": "1990-01-01",
  "senha": "Senha@123",
  "confirmacaoSenha": "Senha@123"
}
```

#### `POST /auth/login` — Autenticar usuário
```json
{
  "email": "joao@email.com",
  "senha": "Senha@123"
}
```

#### `PATCH /auth/reset-password` — Redefinir senha
```json
{
  "id": 1,
  "novaSenha": "NovaSenha@456"
}
```

---

### Usuário

#### `GET /users/{id}` — Buscar perfil
Retorna id, nome, email e saldo do usuário.

#### `GET /users/dashboard?id={id}` — Estatísticas pessoais
Retorna totalJogos, vitórias, derrotas, valorGanho e valorPerdido.

#### `PUT /users/{id}` — Cadastrar saldo
```json
{
  "saldo": 500.00
}
```

#### `DELETE /users/{id}` — Excluir usuário
Remove o usuário e todos os seus jogos.

---

### Jogo

#### `POST /games/start` — Iniciar partida
```json
{
  "idUser": 1,
  "valorAposta": 100
}
```
Retorno: `{ "gameId": 1 }`

#### `POST /games/{gameId}/reveal` — Revelar posição (linha e coluna de 0 a 4)
```json
{
  "linha": 2,
  "coluna": 3
}
```
Retorno diamante: `{ "resultado": "DIAMANTE", "diamantesEncontrados": 1, "premioAtual": 133 }`  
Retorno bomba: `{ "resultado": "BOMBA", "status": "PERDIDO" }`

#### `POST /games/{gameId}/cashout` — Sacar prêmio acumulado
Encerra a partida e credita o prêmio ao saldo do usuário.

---

## Regras de Negócio

- Senha mínimo 8 caracteres, letra maiúscula, número e caractere especial
- Usuário não pode iniciar nova partida com outra em andamento
- Saldo é debitado ao iniciar e creditado ao sacar ou ao ganhar
- Tabuleiro 5x5 com 5 bombas e 20 diamantes gerados aleatoriamente
- Fórmula do prêmio: `valorAposta × (1 + diamantes × 0.33)`
- Posição já revelada não pode ser escolhida novamente

- ## Observação

Projeto criado para estudo de desenvolvimento de APIs REST. Não utiliza dinheiro real.

## Melhorias futuras

- Autenticação com JWT e proteção das rotas de usuário e de jogo
- Rota de redefinição de senha segura
- Validação de que cada usuário só acesse os próprios dados
- Testes automatizados
- Documentação dos endpoints com Swagger
