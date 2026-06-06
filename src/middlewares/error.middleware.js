/**
 * src/middlewares/error.middleware.js
 * ===================================================================
 * Centralized error handling for xpress-js.
 *
 * Every route should be wrapped in try/catch or the asyncHandler wrapper;
 * errors are passed to next() and caught here.  This middleware:
 *   • Distinguishes known framework errors from unexpected crashes
 *   • Never leaks stack traces or internal details in production
 *   • Provides consistent error response shape for API clients
 * ===================================================================
 */

const Logger = require('../utils/logger');

// ---------------------------------------------------------------------------
// Express error handler signature: (err, req, res, next) — 4 params!
// ---------------------------------------------------------------------------

/**
 * Global error middleware. Mount this LAST in your app stack.
 */
const errorHandler = (err, req, res, next) => {
  // Log the full error for server-side debugging
  Logger.error('Unhandled error caught by errorHandler:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  const config = getConfig();
  const statusCode = err.statusCode || err.status || 500;

  // Build a safe error response object
  const response = {
    success: false,
    ...(config.isDev ? { stack: err.stack } : {}), // show stack only in dev
  };

  // Framework-level errors
  if (err.type === 'ValidationError') {
    response.message = 'Validation failed';
    response.errors = err.errors || [err.message];
    return res.status(400).json(response);
  }

  if (err.type === 'AuthorizationError') {
    response.message = err.message || 'Access denied';
    return res.status(403).json(response);
  }

  if (err.type === 'NotFoundError') {
    response.message = err.message || 'Resource not found';
    return res.status(404).json(response);
  }

  // Default — unknown server error
  response.message = config.isDev ? err.message : 'Internal server error';

  if (statusCode >= 500) {
    Logger.error(`[${statusCode}] ${err.message}`);
  }

  res.status(statusCode).json(response);
};

/**
 * Async wrapper: catches synchronous and async errors in route handlers.
 * Usage: router.get('/users', asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Custom error class for xpress-js — makes type-checking easy. */
class XpressError extends Error {
  constructor(message, statusCode, type) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { errorHandler, asyncHandler, XpressError };
