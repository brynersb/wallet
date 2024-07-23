
# Wallet
## Descrição
Este projeto é uma aplicação de carteira digital construída usando NestJS, PostgreSQL, Aws Sqs, estruturada como um monorepo com dois aplicativos: wallet-api e wallet-worker. O wallet-api gerencia as solicitações de transações, enquanto o wallet-worker processa essas transações.

## Rotas da API
Descrição das rotas disponíveis na aplicação.

###  Account
GET /account/:accountId/balance
- Descrição: Obter o saldo em conta.
- Exemplo: GET http://localhost:3100/account/1/balance

GET /account/:accountId/summary
- Descrição: Obter o extrato detalhado por range de datas.
- Exemplo: GET http://localhost:3100/account/1/summary

POS /account/create/
- Descrição: criar conta.
- Exemplo: POST http://localhost:3100/account/create/

### Transactions
POST /transactions/
Descrição: Realizar uma transação. Tipos de transação suportados: 'DEPOSIT', 'WITHDRAWAL', 'BUY', 'CANCELLATION' e 'REFUND'.
Exemplo: POST http://localhost:3100/transactions/

GET /transactions/:id
Descrição: Obter o resultado de uma transação solicitada.
Exemplo: GET http://localhost:3100/transactions/1

### swagger
- http://localhost:3100/swagger

## Instalação
```bash
# Clone o repositório
git clone https://github.com/brynersb/wallet.git

# Entre no diretório do projeto
cd wallet

# Instale as dependências
npm install
```
# Configuração
```bash
# Copie o arquivo .env.example para .env em cada aplicação
$ cp apps/wallet-api/.env.example apps/wallet-api/.env
$ cp apps/wallet-worker/.env.example apps/wallet-worker/.env
```
## Execução
```bash

# Entre na pasta utils/docker
$ cd utils/docker

# Suba os containers do SQS com LocalStack e o banco de dados com suas tabelas
$ docker-compose up -d

# Volte para a raiz do projeto
$ cd ../..

# Inicie o app wallet-api  
$ npm run start:dev

# Inicie o app wallet-worker 
$ npm run start:dev wallet-worker 
# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Tecnologias Utilizadas
Lista das principais tecnologias utilizadas no projeto.

- NestJS
- PostgreSQL
- Docker
- AWS SQS
- TypeScript

