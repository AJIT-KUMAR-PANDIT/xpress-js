# Module: app.js — Express Application Factory

**File**: `src/app.js` (143 lines)  
**Responsibility**: Assembles the full middleware stack, registers routes, returns Express app instance  
**Module exports**: `createApp()` → Express application object

## Functions

| Function | Line | Description |
|---|---|---|
| `createApp()` | 34 | Factory — creates and configures the Express app with all middleware |

## Middleware Pipeline (mount order)

| # | Middleware | Purpose | Config |
|---|---|---|---|
| 1 | `helmet()` | Security headers | CSP, X-Frame, HSTS, etc. |
| 2 | `cors()` | Cross-origin policy | origin from env, credentials: true |
| 3 | `express.json({ limit: '10kb' })` | JSON body parser | 10KB max payload |
| 4 | `express.urlencoded({ extended: true })` | Form body parser | extended syntax |
| 5 | `rateLimit()` | Rate limiting | 100 req / 15 min window (draft-7) |
| 6 | `morgan('dev')` or `morgan('combined')` | Request logging | dev→colorized, prod→Logger stream |
| 7 | `compression()` | gzip/br compression | automatic |
| 8 | Routes + error middleware | — | See route tables below |

## Route Registration

### Health Check
| Method | Path | Handler | Auth |
|---|---|---|---|
| GET | `/health` | Inline (res.json) | No |

### Module Routes
| Prefix | Module File | Controllers Used |
|---|---|---|
| `/auth` | `routes/auth.routes.js` | auth.controller.* |
| `/users` | `routes/user.routes.js` | user.controller.* |

### Root Welcome
| Method | Path | Response | Auth |
|---|---|---|---|
| GET | `/` | `{ success, message, docs }` | No |

### Catch-All (404)
Mounted via `app.use('{*splat}', ...)` with asyncHandler that throws a 404 XpressError.

## Key Dependencies

```javascript
express, path, cors, helmet, compression, morgan, express-rate-limit
↓
./config/env         (getConfig)
./utils/logger       (Logger)
./middlewares/error.middleware (errorHandler, asyncHandler)
./routes/auth.routes    (authRoutes)
./routes/user.routes    (userRoutes)
```
