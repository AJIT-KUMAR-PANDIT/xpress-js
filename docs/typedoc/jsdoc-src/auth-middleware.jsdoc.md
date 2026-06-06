# Enhanced JSDoc — auth.middleware.js

## @typedef Definitions (add at top)

```javascript
/**
 * Decoded JWT token payload as attached to req.user.
 * @typedef {Object} DecodedTokenPayload
 * @property {string} userId   - The user's unique identifier
 * @property {string} email    - User's normalized email address
 * @property {'user'|'admin'} [role]
 */

/**
 * Response object returned when authentication/authorization fails.
 * @typedef {Object} AuthFailureResponse
 * @property {boolean} success  - Always false for auth failures
 * @property {string} message   - Human-readable error description
 */
```

## Function Signatures (annotated)

```javascript
/**
 * Express middleware: Require a valid JWT access token.
 * 
 * Extracts the Bearer token from the Authorization header, verifies it
 * against the configured JWT_SECRET, and attaches the decoded payload to req.user.
 * Rejects with 401 if the token is missing, expired, or invalid.
 * 
 * @param {import('express').Request} req   - Express request object (will have req.user set on success)
 * @param {import('express').Response} res  - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void}
 * 
 * @example
 * // In your route file:
 * const { authenticate } = require('../middlewares/auth.middleware');
 * router.get('/profile', authenticate, (req, res) => {
 *   console.log(req.user.userId);  // available after middleware
 * });
 */
const authenticate = (req, res, next) => { ... };

/**
 * Factory function: create a role-checking Express middleware.
 * 
 * The returned middleware checks that the authenticated user's role
 * is in the allowedRoles list. Returns 403 if not.
 * 
 * @param {Array<string>} allowedRoles - Array of permitted role strings (e.g., ['admin', 'super_admin'])
 * @returns {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => void}
 * 
 * @example
 * const { authenticate, authorizeRole } = require('../middlewares/auth.middleware');
 * router.get('/admin/dashboard', authenticate, authorizeRole(['admin']), adminHandler);
 */
const authorizeRole = (allowedRoles) => { ... };

/**
 * Express middleware: Attach req.user if a valid JWT is present.
 * 
 * Unlike `authenticate`, this middleware never rejects — it silently
 * proceeds if the token is missing or invalid. Useful for routes that
 * behave differently for authenticated vs anonymous users.
 * 
 * @param {import('express').Request} req   - Express request object
 * @param {import('express').Response} res  - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void}
 * 
 * @example
 * // Middleware chain: authenticate first, then optionalAuth as fallback
 * router.get('/content', (req, res, next) => {
 *   if (!req.user) return renderGuestView();  // anonymous
 *   return renderUserView(req.user);           // authenticated
 * });
 */
const optionalAuth = (req, res, next) => { ... };
```
