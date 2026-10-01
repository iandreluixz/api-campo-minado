# API Campo Minado

API REST em Node.js, Express e PostgreSQL para um jogo de campo minado com sistema de saldo e partidas. Projeto desenvolvido para estudo de APIs REST e modelagem de banco de dados.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)

> **Aviso:** projeto educacional. Não utiliza dinheiro real nem processa pagamentos.

## Sobre o projeto

O usuário se cadastra, adiciona saldo, inicia uma partida em um tabuleiro 5x5 com 5 bombas e 20 diamantes, revela posições e pode sacar o prêmio acumulado a qualquer momento. Se revelar uma bomba, perde a aposta.

## Funcionalidades

- Cadastro e login de usuários
- Redefinição de senha
- Consulta de perfil e saldo
- Estatísticas pessoais (total de jogos, vitórias, derrotas, valor ganho e perdido)
- Início de partidas com tabuleiro gerado aleatoriamente
- Revelação de posições e saque do prêmio
- Validações de regras de negócio (senha forte, uma partida por vez, posição não repetida)

## Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| Node.js (v24.15.0) | Ambiente de execução |
| Express.js | Criação das rotas da API |
| PostgreSQL | Banco de dados relacional |
| dotenv | Variáveis de ambiente |
| cors | Controle de acesso entre origens |
| nodemon | Reinício automático em desenvolvimento |

## Estrutura do projeto

```
api-campo-minado/
├── src/              # Código-fonte da API
├── .env.example      # Modelo das variáveis de ambiente
├── .gitignore
├── package.json
└── README.md
```

## Como executar

### Pré-requisitos

- Node.js instalado
- PostgreSQL instalado e em execução

### Passo a passo

1. Clone o repositório e entre na pasta:

```bash
git clone https://github.com/iandreluixz/api-campo-minado.git
cd api-campo-minado
```

2. Instale as dependências:

```bash
npm install
```

3. Crie o banco de dados e as tabelas:

```bash
psql -U postgres -f src/config/database.sql
```

Ou, se preferir, rode manualmente no `psql`:

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
  id                 SERIAL PRIMARY KEY,
  usuario_id         INTEGER         NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  valor_aposta       NUMERIC(10, 2)  NOT NULL,
  tabuleiro          TEXT            NOT NULL,
  posicoes_reveladas TEXT            NOT NULL DEFAULT '[]',
  diamantes          INTEGER         NOT NULL DEFAULT 0,
  status             VARCHAR(20)     NOT NULL DEFAULT 'EM_ANDAMENTO',
  premio_final       NUMERIC(10, 2)  DEFAULT 0.00,
  created_at         TIMESTAMP       NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMP       NOT NULL DEFAULT NOW()
);
```

4. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o `.env` com os seus dados:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=campo_minado
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
PORT=3000
NODE_ENV=development
```

5. Inicie a aplicação:

```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

A API ficará disponível em `http://localhost:3000`.

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Cadastrar usuário |
| POST | `/auth/login` | Autenticar usuário |
| PATCH | `/auth/reset-password` | Redefinir senha |
| GET | `/users/{id}` | Buscar perfil (id, nome, email e saldo) |
| GET | `/users/dashboard?id={id}` | Estatísticas pessoais |
| PUT | `/users/{id}` | Cadastrar saldo |
| DELETE | `/users/{id}` | Excluir usuário e seus jogos |
| POST | `/games/start` | Iniciar partida |
| POST | `/games/{gameId}/reveal` | Revelar posição (linha e coluna de 0 a 4) |
| POST | `/games/{gameId}/cashout` | Sacar prêmio acumulado |

## Exemplos de uso

**Cadastrar usuário**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "dataNascimento": "1990-01-01",
    "senha": "Senha@123",
    "confirmacaoSenha": "Senha@123"
  }'
```

**Iniciar partida**

```bash
curl -X POST http://localhost:3000/games/start \
  -H "Content-Type: application/json" \
  -d '{ "idUser": 1, "valorAposta": 100 }'
```

Resposta:

```json
{ "gameId": 1 }
```

**Revelar uma posição**

```bash
curl -X POST http://localhost:3000/games/1/reveal \
  -H "Content-Type: application/json" \
  -d '{ "linha": 2, "coluna": 3 }'
```

Resposta ao encontrar um diamante:

```json
{ "resultado": "DIAMANTE", "diamantesEncontrados": 1, "premioAtual": 133 }
```

Resposta ao encontrar uma bomba:

```json
{ "resultado": "BOMBA", "status": "PERDIDO" }
```

## Regras de negócio

- Senha com no mínimo 8 caracteres, uma letra maiúscula, um número e um caractere especial
- Um usuário não pode iniciar uma nova partida com outra em andamento
- O saldo é debitado ao iniciar a partida e creditado ao sacar ou ao ganhar
- Tabuleiro 5x5 com 5 bombas e 20 diamantes, gerados aleatoriamente
- Fórmula do prêmio: `valorAposta × (1 + diamantes × 0.33)`
- Uma posição já revelada não pode ser escolhida novamente

## Limitações conhecidas

Por ser um projeto de estudo, algumas decisões ainda não seguem práticas de produção:

- As rotas não exigem autenticação por token, então qualquer cliente pode chamá-las com o `id` de qualquer usuário
- A redefinição de senha recebe apenas o `id` do usuário
- O saldo é definido diretamente pelo usuário, sem integração com pagamento
- Não há testes automatizados

## Melhorias futuras

- [ ] Autenticação com JWT e proteção das rotas
- [ ] Validação de que cada usuário só acesse os próprios dados
- [ ] Fluxo seguro de redefinição de senha
- [ ] Testes automatizados
- [ ] Documentação interativa dos endpoints com Swagger
- [ ] Limite de tentativas de login

## O que aprendi

- Modelar tabelas relacionadas no PostgreSQL, com chave estrangeira e exclusão em cascata
- Organizar uma API REST com rotas separadas por assunto
- Aplicar regras de negócio e validações antes de gravar no banco
- Usar variáveis de ambiente para não expor credenciais no repositório

## Autor

**André Luiz** — Estudante de Análise e Desenvolvimento de Sistemas (UNILAVRAS)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/iandreluixz)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/iandreluixz)
