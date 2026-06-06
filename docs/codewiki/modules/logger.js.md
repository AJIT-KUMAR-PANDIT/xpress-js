# Module: utils/logger.js — Structured Logger

**File**: `src/utils/logger.js` (116 lines)  
**Responsibility**: Colorized console output + file transport for production logs  
**Exports**: Logger class with static methods `{ error, warn, info, debug, verbose }`

## Class Structure

```javascript
class Logger {
  static _log(level, message, meta)      // Core method (private)
  static _getLevelIndex(level)           // Level priority lookup (private)
  static setLevel(level)                  // Runtime level override
  static setProd(prod)                    // Toggle file transport
  static error(message, meta)            // Log at 'error' level
  static warn(message, meta)             // Log at 'warn' level
  static info(message, meta)             // Log at 'info' level
  static debug(message, meta)            // Log at 'debug' level
  static verbose(message, meta)          // Log at 'verbose' level
  static requestLogger(req, res, next)   // Express middleware for request logging
}
```

## Level Priority (ascending)

| Level | Index | Console Method | Production? |
|---|---|---|---|
| verbose | 0 | console.log | Yes (file only) |
| debug | 1 | console.log | No (default in dev) |
| info | 2 | console.log | Yes |
| warn | 3 | console.warn | Yes |
| error | 4 | console.error | Yes |

## Color Palette

| Level | Code | Color |
|---|---|---|
| error | `\x1b[31m\x1b[1m` | bold red |
| warn | `\x1b[33m\x1b[1m` | bold yellow |
| info | `\x1b[36m\x1b[1m` | bold cyan |
| debug | `\x1b[32m\x1b[1m` | bold green |
| verbose | `\x1b[90m` | dim gray |

## Log Output Format

```
[TIMESTAMP] [LEVEL] message {meta}
// e.g.:
[2026-06-06T16:58:28.234Z] [INFO] Database connected {}
```

## File Transport

- **Location**: `logs/YYYY-MM-DD.log` (created on first import)
- **Format**: JSON lines `{ timestamp, level, message, meta }`
- **Mode**: append-only via `fs.appendFile`

## requestLogger Middleware

Logs every HTTP request with:
- IP address
- Method + original URL
- Status code classification (error ≥ 500, warn ≥ 400, debug < 400)
- Response duration in ms
- User-Agent header
