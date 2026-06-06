# Architecture Overview

## System Design

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│  HTTP Client │────▶│ http.createServer()  │────▶│ Express App   │────▶│  Routes       │
│              │     │ (server.js)    │     │ (app factory) │     │  Controllers  │
└─────────────┘     └──────────────┘     └───────────────┘     └───────┬──────┘
                                                                        │
                                                                ┌───────▼──────┐
                                                                │  Services    │
                                                                │  + Models    │
                                                                └───────┬──────┘
                                                                        │
                                                           ┌────────────▼───────────┐
                                                           │  In-Memory Store       │
                                                           │  (or Mongoose/MongoDB) │
                                                           └────────────────────────┘
```

## Request Pipeline

Each incoming HTTP request passes through this middleware chain:

1. **helmet()** — Security headers (CSP, X-Frame-Options, HSTS, etc.)
2. **cors()** — Cross-origin configuration (origin from env)
3. **express.json({ limit: '10kb' })** — JSON body parser with 10KB limit
4. **express.urlencoded({ extended: true })** — Form-encoded body parser
5. **rateLimit()** — Global rate limiter (100 req / 15 min window)
6. **morgan** — Request logging (dev: `dev` format, prod: `combined` → Logger)
7. **compression()** — gzip/br compression for response bodies
8. **Route handler** — Controller → Service → Model → Response
9. **errorHandler(err, req, res, next)** — Global error middleware (404 + exceptions)

## Authentication Flow

```
Client                          Server                        Database/Store
  │                               │                               │
  ├── POST /auth/register ──────▶│                               │
  │   { name, email, password }  │                               │
  │                               ├── validateRegistration      │
  │                               ├── bcrypt.hash(password, 12) │
  │                               ├── userModel.create()        │ ◀── INSERT
  │                               │                               │
  │                               ├── jwt.sign(accessToken)     │
  │                               ├── jwt.sign(refreshToken)    │
  │◀── { token, refreshToken }   │                               │
  │                               │                               │
  ├── POST /auth/login ─────────▶│                               │
  │   { email, password }         │                               │
  │                               ├── findByEmail()             │ ◀── SELECT
  │                               ├── bcrypt.compare()          │
  │                               ├── jwt.sign(accessToken)     │
  │◀── { token, refreshToken }   │                               │
```

## Token Lifecycle

```
┌──────────────┐        ┌──────────────┐
│ ACCESS TOKEN │        │ REFRESH TOKEN│
│ (7d expire)  │        │ (30d expire) │
└──────┬───────┘        └──────┬───────┘
       │                       │
       │ Used for every API    │ Used only at /auth/refresh-token
       │ call in Authorization │ to get a NEW access token
       │ header:               │ (rotates both tokens)
       │   Authorization:      │
       │     Bearer <token>     │
└──────┴───────────────────────┴─────────────────────────────────
```

## Database Abstraction

The framework uses a **dynamic Mongoose loader**:

- If `mongoose` is installed → connects to MongoDB via URI from env vars
- If not installed → falls back to in-memory store (users array) with zero warnings
- The model interface (`findById`, `findByEmail`, etc.) remains the same regardless

## Error Handling Strategy

```
Route Handler          asyncHandler     errorHandler (global)
    │                     │                    │
    │  throw XpressError  │   next(err)        │
    │                     ├────────────────────▶│
    │                     │                    ├── Check err.type
    │                     │                    ├── ValidationError → 400
    │                     │                    ├── AuthorizationError → 403
    │                     │                    ├── NotFoundError → 404
    │                     │                    └── Default → 500
```

- **XpressError**: Custom error class with `statusCode` + `type` for structured routing
- **asyncHandler**: Catches both sync and async errors from route handlers, passes to next()
- **errorHandler**: Single source of truth for all error formatting; no stack traces in prod
