# XPress-JS Framework — Project Documentation

A full-featured Express.js boilerplate / framework scaffold with authentication, role-based authorization, JWT token management, password reset flow, and structured logging.

| Section | Description |
|---|---|
| [Architecture Overview](architecture.md) | System design, boot sequence, middleware pipeline |
| [Module Structure](modules/) | Detailed breakdown of every module directory |
| [API Reference](api/) | Complete endpoint documentation (request/response schemas) |
| [Dependency Graphs](dependency-graphs/) | Module dependency trees and data flow diagrams |
| [Configuration](config.md) | Environment variables, defaults, and config object shape |
| [Error Handling](error-handling.md) | XpressError class, middleware chain, error codes |

## Quick Stats

- **Source files**: 18 JS modules
- **API endpoints**: 14 (7 auth + 5 users + 2 root/health)
- **Middleware layers**: 9 (helmet → cors → json-parser → rate-limit → morgan → compression → routes → error-handler → static)
- **Dependencies**: express, jsonwebtoken, bcryptjs, cors, helmet, compression, morgan, express-rate-limit, dotenv
- **Test files**: 3 (auth.integration.test.js, auth.service.test.js, helpers.test.js)

## Directory Layout

```
xpress-js/
├── src/
│   ├── app.js              # Express app factory
│   ├── server.js           # Application entry point (HTTP server)
│   ├── index.js            # Alternative entry (boot + shutdown)
│   ├── config/
│   │   ├── env.js          # Env var loader + validator
│   │   └── database.js     # MongoDB (Mongoose) connection manager
│   ├── controllers/
│   │   ├── auth.controller.js   # Auth HTTP handlers
│   │   └── user.controller.js   # User CRUD HTTP handlers
│   ├── services/
│   │   ├── auth.service.js      # Auth business logic
│   │   └── user.service.js      # User business logic
│   ├── models/
│   │   └── user.model.js        # In-memory user data layer
│   ├── routes/
│   │   ├── auth.routes.js       # Auth route definitions
│   │   └── user.routes.js       # User route definitions
│   ├── middlewares/
│   │   ├── auth.middleware.js   # JWT authenticate + role authorize
│   │   └── error.middleware.js  # Error handler + async wrapper
│   ├── utils/
│   │   ├── helpers.js           # Pure utility functions
│   │   └── logger.js            # Structured console/file logger
│   └── validations/
│       └── user.validation.js   # Request validation schemas
├── tests/
│   ├── unit/
│   └── integration/
├── docs/
│   ├── codewiki/          # ← This directory (CodeWiki-style docs)
│   └── typedoc/           # Typedoc-compatible JSDoc + annotations
└── package.json
```

## Technology Stack

| Layer | Library / Tool | Purpose |
|---|---|---|
| HTTP Server | Node.js `http` | Request routing to Express |
| Framework | Express 4.x | Routing, middleware, request handling |
| Auth | jsonwebtoken | JWT access + refresh token management |
| Passwords | bcryptjs | Hash passwords (salt rounds = 12) |
| Security | helmet | Security headers (CSP, X-Frame, etc.) |
| CORS | cors | Cross-origin resource sharing |
| Rate Limiting | express-rate-limit | DDoS / brute-force prevention |
| Compression | compression | gzip/br response body compression |
| Logging | morgan + custom Logger | Request logging (dev: dev format, prod: combined) |
| Env Config | dotenv | Environment variable loading |
| DB (optional) | mongoose | MongoDB ODM — loads dynamically if installed |

## API Base URL

```
http://localhost:3000/api/v1/<module>
```

- **Auth** → `POST /api/v1/auth/*` (all public)
- **Users** → `GET/PUT/DELETE /api/v1/users/*` (requires JWT + admin role for write)

## Boot Sequence

```
dotenv → getConfig() → connectDB() → createApp() → http.createServer() → listen(PORT)
```

See [architecture.md](architecture.md) for the full pipeline.
