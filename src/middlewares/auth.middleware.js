/**
 * src/middlewares/auth.middleware.js
 * ===================================================================
 * Authentication & authorization middleware for xpress-js.
 *
 * • authenticate — verify JWT and attach req.user
 * • authorizeRole  — ensure the authenticated user has a matching role
 * • optionalAuth   — attach req.user if token is valid, never reject
 * ===================================================================
 */

const jwt = require('jsonwebtoken');
const { getConfig } = require('../config/env');

/**
 * Middleware: Require a valid JWT.
 * Attaches req.user (decoded payload) and rejects with 401 on failure.
 */
const authenticate = (req, res, next) => {
  const config = getConfig();

  // Extract token from Authorization header
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded; // { userId, email, role }
    next();
  } catch (err) {
    // Handle specific JWT errors with helpful messages
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired.' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    return res.status(401).json({ success: false, message: 'Token verification failed.' });
  }
};

/**
 * Middleware: Require one of the given roles.
 * Usage: router.get('/admin', authenticate, authorizeRole(['admin']), handler)
 */
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ success: false, message: 'Access denied. No role assigned.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

/**
 * Middleware: Optional authentication.
 * Attaches req.user if a valid token is present; never rejects.
 */
const optionalAuth = (req, res, next) => {
  const config = getConfig();

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) return next(); // No token → proceed unauthenticated

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
  } catch (err) {
    // Silently ignore — user is just unauthenticated
  }

  next();
};

module.exports = { authenticate, authorizeRole, optionalAuth };
