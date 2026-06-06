/**
 * src/controllers/user.controller.js
 * ===================================================================
 * User management controller — handles user CRUD.
 * All routes require authentication; some need admin role.
 * ===================================================================
 */

const userService = require('../services/user.service');
const { validateProfileUpdate, validateQueryParams } = require('../validations/user.validation');
const Logger = require('../utils/logger');

/**
 * GET /users — List all users (admin only)
 * Query params: ?page=1&limit=10&search=john&sort=-createdAt
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const parsed = validateQueryParams(req.query);
    const result = await userService.getAllUsers(parsed);

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /users/:id — Get a single user by ID */
exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /users/me — Update own profile (authenticated users only) */
exports.updateProfile = async (req, res, next) => {
  try {
    const { error, data } = validateProfileUpdate(req.body);
    if (error) return res.status(400).json({ success: false, message: error });

    const updated = await userService.updateProfile(req.user.userId, data);

    Logger.info(`User updated profile: ${req.user.email}`);

    return res.json({ success: true, message: 'Profile updated', data: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /users/:id — Delete a user by ID (admin only) */
exports.deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    Logger.warn(`User deleted: ${req.params.id} (by admin ${req.user.email})`);
    return res.json({ success: true, message: result.message });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /users/me/profile — Get current user profile */
exports.getCurrentProfile = async (req, res, next) => {
  try {
    const profile = await userService.getUserById(req.user.userId);
    return res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};
