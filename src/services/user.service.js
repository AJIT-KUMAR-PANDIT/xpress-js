/**
 * src/services/user.service.js
 * ===================================================================
 * User service — business logic for user CRUD operations.
 * Coordinates the model layer with validation helpers.
 * ===================================================================
 */

const { sanitize, omit } = require('../utils/helpers');
const userModel = require('../models/user.model');

/** Get all users with pagination + search */
const getAllUsers = async ({ page, limit, sort, search }) => {
  const query = {};
  if (search) query.search = search;

  return userModel.findAll({ page, limit, sort, ...query });
};

/** Get a single user by ID */
const getUserById = async (id) => {
  const user = await userModel.findById(id);
  if (!user) throw new Error('USER_NOT_FOUND');
  return stripPassword(user);
};

/** Update current user's own profile */
const updateProfile = async (userId, payload) => {
  const user = await userModel.findById(userId);
  if (!user) throw new Error('USER_NOT_FOUND');

  const allowedFields = ['name', 'bio', 'avatar', 'gender'];
  const updates = {};
  for (const key of Object.keys(payload)) {
    if (allowedFields.includes(key)) updates[key] = payload[key];
  }

  const updated = await userModel.updateById(userId, updates);
  return stripPassword(updated);
};

/** Delete a user by ID */
const deleteUser = async (userId) => {
  const deleted = await userModel.deleteById(userId);
  if (!deleted) throw new Error('USER_NOT_FOUND_OR_DELETED');
  return { message: 'USER_DELETED_SUCCESSFULLY' };
};

/** Deactivate / activate account */
const toggleAccountStatus = async (userId, isActive) => {
  const user = await userModel.findById(userId);
  if (!user) throw new Error('USER_NOT_FOUND');

  const updated = await userModel.updateById(userId, { isActive });
  return stripPassword(updated);
};

// ---------------------------------------------------------------------------

const stripPassword = (user) => omit(user, ['password']);

module.exports = { getAllUsers, getUserById, updateProfile, deleteUser, toggleAccountStatus };
