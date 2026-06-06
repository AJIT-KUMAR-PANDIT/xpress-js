# XPress-JS Framework

A modern, modular **Express.js framework** built for scalability and developer happiness.  
Built with ❤️ by **NAKPRC**.

## 📐 Architecture

```
src/
├── config/        — Environment & DB configuration
├── controllers/   — HTTP request/response handlers
├── services/      — Business logic layer
├── models/        — Data access (Mongoose/Sequelize adapters)
├── middlewares/   — Auth, error handling, rate limiting
├── routes/        — Route definitions mounted on Express
├── utils/         — Shared helpers (logger, formatting)
├── validations/   — Input validation schemas
├── jobs/          — Background tasks (email, cron jobs)
├── app.js         — App factory (assembles the stack)
└── server.js      — Entry point (boot, graceful shutdown)
```

## 🚀 Quick Start

```bash
# 1. Clone & install
git clone <your-repo> && cd xpress-js
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your secrets

# 3. Start development server
npm run dev

# 4. Open http://localhost:3000/api/v1/health
```

## 📋 API Endpoints

| Method | Route                  | Auth    | Description         |
|--------|------------------------|---------|---------------------|
| POST   | /api/v1/auth/register  | Public  | Create account      |
| POST   | /api/v1/auth/login     | Public  | Login               |
| POST   | /api/v1/auth/refresh   | Public  | Refresh token       |
| GET    | /api/v1/users/me       | Bearer  | Get my profile      |
| PUT    | /api/v1/users/me       | Bearer  | Update profile      |
| GET    | /api/v1/users          | Admin   | List all users      |

## 🧪 Tests

```bash
npm test              # All tests + coverage
npm run test:unit     # Unit tests only
```

## 🔒 Security Defaults

- **helmet** — secure HTTP headers
- **xss-clean** — XSS protection on user input
- **express-rate-limit** — per-IP rate limiting (100 req/15min default)
- **cors** — configurable origin restrictions
- **bcryptjs** — password hashing (12 rounds)
- **JWT** — stateless auth with access + refresh tokens

## 📁 Project Structure

| Layer         | Purpose                               | Example          |
|---------------|---------------------------------------|------------------|
| `config/`     | App configuration, DB connections     | `env.js`         |
| `utils/`      | Shared pure utilities                 | `logger.js`      |
| `validations/`| Request schema validation             | `user.validation`|
| `models/`     | Data access & DB models               | `user.model.js`  |
| `services/`   | Business logic                        | `auth.service.js`|
| `controllers/`| HTTP handlers (thin layer)            | `auth.controller`|
| `routes/`     | Route → controller mapping            | `auth.routes.js` |
| `middlewares/`| Cross-cutting concerns                | `auth.middleware`|

## 🐳 Docker

```bash
docker-compose up -d   # Starts app + MongoDB
docker-compose down    # Stops everything
```

## 📝 License

ISC — Built by [NAKPRC](https://github.com/nakprc)
