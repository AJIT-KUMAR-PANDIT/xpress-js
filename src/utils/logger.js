/**
 * src/utils/logger.js
 * ===================================================================
 * Structured logger built on Winston-like API (vanilla — no dependency).
 * Supports colorized console output + rotating file transport in prod.
 * ===================================================================
 */

const path = require('path');
const fs = require('fs');

// ANSI color codes
const COLORS = {
  error:   '\x1b[31m\x1b[1m',  // bold red
  warn:    '\x1b[33m\x1b[1m',  // bold yellow
  info:    '\x1b[36m\x1b[1m',  // bold cyan
  debug:   '\x1b[32m\x1b[1m',  // bold green
  verbose: '\x1b[90m',          // dim gray
  reset:   '\x1b[0m',
};

// Determine log level based on environment
const getLogLevel = (env) => {
  switch (env) {
    case 'production': return 'info';
    case 'test':       return 'warn';
    default:           return 'debug'; // development
  }
};

// Log directory for file transport
const LOG_DIR = path.join(__dirname, '../../logs');
const LOG_FILE = path.join(LOG_DIR, `${new Date().toISOString().slice(0, 10)}.log`);

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

let _level = getLogLevel(process.env.NODE_ENV || 'development');
let _isProd = (process.env.NODE_ENV || 'development') === 'production';

class Logger {
  /**
   * Core log method that formats and outputs a message.
   */
  static _log(level, message, meta = {}) {
    if (Logger._getLevelIndex(level) < Logger._getLevelIndex(_level)) return;

    const timestamp = new Date().toISOString();
    const levelUpper = level.toUpperCase();
    const color = COLORS[level] || COLORS.info;

    // Structured format: [TIMESTAMP] [LEVEL] message {meta}
    const formatted = `${color}[${timestamp}] [${levelUpper}] ${message}${COLORS.reset}`;

    if (_isProd) {
      // File log (append mode)
      const line = JSON.stringify({ timestamp, level: levelUpper, message, meta }) + '\n';
      fs.appendFile(LOG_FILE, line, () => {});
    }

    switch (level) {
      case 'error': console.error(formatted, meta); break;
      case 'warn':  console.warn(formatted, meta);  break;
      case 'info':  console.log(formatted, meta);   break;
      default:      console.log(formatted, meta);    break;
    }
  }

  static _getLevelIndex(level) {
    return { error: 4, warn: 3, info: 2, debug: 1, verbose: 0 }[level] || 0;
  }

  /** --- Public API -------------------------------------------------- */

  static setLevel(level)  { _level = level; }
  static setProd(prod)    { _isProd = !!prod; }

  static error(message, meta) { Logger._log('error', message, meta); }
  static warn(message, meta)  { Logger._log('warn',  message, meta); }
  static info(message, meta)  { Logger._log('info',  message, meta); }
  static debug(message, meta) { Logger._log('debug', message, meta); }
  static verbose(message, meta){ Logger._log('verbose', message, meta); }

  /**
   * Request logger middleware — used with Morgan-style logging.
   */
  static requestLogger(req, res, next) {
    const start = Date.now();
    const ip = req.ip || req.connection.remoteAddress || '-';

    Logger.info(`${ip} ${req.method} ${req.originalUrl}`);

    // Log when response finishes
    res.on('finish', () => {
      const duration = Date.now() - start;
      const meta = {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip,
        userAgent: req.get('User-Agent') || '-',
      };

      if (res.statusCode >= 500) Logger.error(`${req.method} ${req.originalUrl}`, meta);
      else if (res.statusCode >= 400) Logger.warn(`${req.method} ${req.originalUrl}`, meta);
      else Logger.debug(`Completed ${res.statusCode} in ${duration}ms`, meta);
    });

    next();
  }
}

module.exports = Logger;
