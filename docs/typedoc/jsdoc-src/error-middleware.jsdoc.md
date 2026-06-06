# Enhanced JSDoc — error.middleware.js

## Class: XpressError

```javascript
/**
 * Custom error class for the xpress-js framework.
 * 
 * Provides structured error information (statusCode, type) that the global
 * error middleware routes to produce consistent API error responses.
 * 
 * @extends {Error}
 */
class XpressError extends Error {
  /**
   * Create a new framework-specific error.
   * @param {string} message - Human-readable error description
   * @param {number} statusCode - HTTP status code to return
   * @param {'ValidationError'|'AuthorizationError'|'NotFoundError'|string} type - Error category for middleware routing
   */
  constructor(message, statusCode, type) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

## Function Signatures (annotated)

```javascript
/**
 * Global Express error-handling middleware.
 * 
 * MUST be mounted LAST in the middleware chain (after all routes).
 * Follows Express error middleware signature: (err, req, res, next) — 4 parameters.
 * 
 * Routes errors by err.type to appropriate status codes and response formats.
 * Includes stack traces in development, hides them in production.
 * 
 * @param {Error} err   - The error object passed via next(err)
 * @param {import('express').Request} req - Express request (for logging url, method, ip)
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Not used (4-param signature required for error middleware)
 * @returns {void}
 * 
 * @example
 * // Mount at the END of your app:
 * const { errorHandler } = require('./middlewares/error.middleware');
 * app.use(errorHandler);
 */
const errorHandler = (err, req, res, next) => { ... };

/**
 * Async route handler wrapper that catches both synchronous and asynchronous errors.
 * 
 * Wraps a route handler function so any errors (thrown or returned as rejected promises)
 * are caught and passed to Express's error middleware via next(err).
 * 
 * @param {Function} fn - The async route handler function
 * @returns {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => void}
 * 
 * @example
 * const { asyncHandler } = require('./middlewares/error.middleware');
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await userService.getAllUsers();  // errors auto-captured
 *   res.json({ success: true, data: users });
 * }));
 */
const asyncHandler = (fn) => (req, res, next) => { ... };
```
