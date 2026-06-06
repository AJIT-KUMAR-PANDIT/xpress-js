/**
 * src/routes/auth.routes.js
 * ===================================================================
 * Authentication routes — all public (no auth required).
 * Maps HTTP verbs to controller handlers.
 * ===================================================================
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Registration — POST /api/v1/auth/register
router.post('/register', authController.register);

// Login — POST /api/v1/auth/login
router.post('/login', authController.login);

// Token refresh — POST /api/v1/auth/refresh-token
router.post('/refresh-token', authController.refreshToken);

// Email verification — GET /api/v1/auth/verify-email/:token
router.get('/verify-email/:token', authController.verifyEmail);

// Forgot password — POST /api/v1/auth/forgot-password
router.post('/forgot-password', authController.forgotPassword);

// Reset password — POST /api/v1/auth/reset-password
router.post('/reset-password', authController.resetPassword);

// Logout — POST /api/v1/auth/logout
router.post('/logout', authController.logout);

module.exports = router;
