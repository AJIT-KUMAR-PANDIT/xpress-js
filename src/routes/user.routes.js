/**
 * src/routes/user.routes.js
 * ===================================================================
 * User management routes — all require authentication.
 * Admin-only routes are gated with authorizeRole(['admin']).
 * ===================================================================
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorizeRole } = require('../middlewares/auth.middleware');

// All routes under this file require authentication
router.use(authenticate);

// GET /api/v1/users/me/profile — Get own profile
router.get('/me/profile', userController.getCurrentProfile);

// PUT /api/v1/users/me — Update own profile
router.put('/me', userController.updateProfile);

// Admin: GET /api/v1/users — List all users
router.get('/', authorizeRole(['admin']), userController.getAllUsers);

// Admin: GET /api/v1/users/:id — Get user by ID
router.get('/:id', authorizeRole(['admin']), userController.getUserById);

// Admin: DELETE /api/v1/users/:id — Delete a user
router.delete('/:id', authorizeRole(['admin']), userController.deleteUser);

module.exports = router;
