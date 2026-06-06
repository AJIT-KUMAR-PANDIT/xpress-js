# Module: server.js — Application Entry Point

**File**: `src/server.js` (94 lines)  
**Responsibility**: HTTP server creation, database connection, graceful shutdown  
**Module exports**: nothing (runs on import)

## Boot Flow

```
require('./app')   → createApp()          // Express app factory
require('./config/database') → connectDB()  // MongoDB (or in-memory fallback)
http.createServer(app) → listen(PORT)       // Start accepting requests
```

## Functions

| Function | Line | Description |
|---|---|---|
| `boot()` | 25 | Async init: config → app → DB → listen |
| `gracefulShutdown(signal)` | 61 | Disconnect DB, exit process cleanly on SIGTERM/SIGINT |

## Events Listened

| Event | Handler | Action |
|---|---|---|
| `SIGTERM` | gracefulShutdown | Graceful shutdown: disconnectDB → exit(0) |
| `SIGINT` | gracefulShutdown | Graceful shutdown (same as SIGTERM) |
| `uncaughtException` | inline error logger | Exit with code 1 |
| `unhandledRejection` | inline error logger | Exit with code 1 |

## Startup Banner (production log)

```
🚀 XPress-JS running at http://localhost:3000

   Environment : development
   API Prefix  : /api/v1
   Sample routes:
     POST  /api/v1/auth/register   — Register user
     POST  /api/v1/auth/login      — Login
     GET   /api/v1/health          — Health check
```
