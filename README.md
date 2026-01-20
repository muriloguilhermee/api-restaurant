# API Restaurant

API em Node.js + TypeScript para **gerenciar pedidos por mesas** de um restaurante (produtos, mesas, sessões de mesa e pedidos).

## Stack

- **Node.js + Express**
- **TypeScript** (executando com **tsx**)
- **Knex** + **SQLite**
- **Zod** (validação)

## Requisitos

- **Node.js** (recomendado: 18+)
- **npm**

## Como rodar

Instale as dependências:

```bash
npm install
```

Rode as migrations (cria as tabelas no SQLite):

```bash
npm run knex -- migrate:latest
```

(Opcional) Rode as seeds (dados iniciais):

```bash
npm run knex -- seed:run
```

Suba o servidor em modo dev:

```bash
npm run dev
```

A API sobe em **`http://localhost:3333`**.

## Banco de dados

- **SQLite** em arquivo: `src/database/database.db`
- Migrations: `src/database/migrations`
- Seeds: `src/database/seeds`

Comandos úteis:

```bash
# desfazer a última migration
npm run knex -- migrate:rollback
```

## Coleção do Insomnia

Importe o arquivo `Insomnia_2026-01-20.yaml` no Insomnia.

- Base URL usada na coleção: `localhost:3333`  
  Dica: se o cliente exigir protocolo, use `http://localhost:3333`.

## Rotas

Base: **`http://localhost:3333`**

### Products (`/products`)

- **GET** `/products?name=`: lista (filtro opcional por `name`)
- **POST** `/products`

```json
{ "name": "Executivo de Frango Grelhado", "price": 159.9 }
```

- **PUT** `/products/:id`
- **DELETE** `/products/:id`

### Tables (`/tables`)

- **GET** `/tables`: lista mesas

### Tables Sessions (`/tables-sessions`)

- **POST** `/tables-sessions`: abre sessão para uma mesa

```json
{ "table_id": 4 }
```

- **GET** `/tables-sessions`: lista sessões
- **PATCH** `/tables-sessions/:id`: fecha uma sessão

### Orders (`/orders`)

- **POST** `/orders`: cria um pedido (exige sessão aberta e produto existente)

```json
{ "table_session_id": 6, "product_id": 3, "quantity": 2 }
```

- **GET** `/orders/table-session/:table_session_id`: lista pedidos da sessão
- **GET** `/orders/table-session/:table_session_id/total`: total e quantidade da sessão

## Padrão de erros

- **Validação (Zod)**: `400` com `{ message: "validation error", issues: ... }`
- **Erros de regra de negócio**: retornam `{ message: "..." }` com o status apropriado.

