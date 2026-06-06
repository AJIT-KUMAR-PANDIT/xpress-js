/**
 * src/validations/user.validation.js
 * ===================================================================
 * Request validation schemas for xpress-js framework.
 * Pure data — no side effects. Easy to swap with Joi/Zod later.
 * ===================================================================
 */

const { generateRandomString } = require('../utils/helpers');

// Valid role constants (single source of truth)
const VALID_ROLES = ['user', 'admin'];
const VALID_GENDERS = ['male', 'female', 'other', 'prefer_not_to_say'];

/**
 * Validate user registration payload.
 * Returns { error: null, data } on success or { error: string } on failure.
 */
const validateRegistration = (body) => {
  const errors = [];

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
    errors.push('name is required and must be at least 2 characters');
  }

  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push('a valid email address is required');
  }

  if (!body.password || typeof body.password !== 'string' || body.password.length < 6) {
    errors.push('password must be at least 6 characters long');
  }

  if (body.role && !VALID_ROLES.includes(body.role)) {
    errors.push(`role must be one of: ${VALID_ROLES.join(', ')}`);
  }

  if (errors.length > 0) return { error: errors[0] };

  // Sanitize and return validated data with auto-generated fields
  const sanitized = {
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    password: body.password,
    role: body.role || 'user',
    avatar: body.avatar || null,
    bio: body.bio ? body.bio.slice(0, 500) : null,
    // Auto-generated IDs
    verificationToken: generateRandomString(32),
    resetToken: generateRandomString(32),
  };

  return { error: null, data: sanitized };
};

/**
 * Validate login payload.
 */
const validateLogin = (body) => {
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return { error: 'a valid email address is required' };
  }
  if (!body.password || typeof body.password !== 'string') {
    return { error: 'password is required' };
  }
  return { error: null, data: { email: body.email.trim().toLowerCase(), password: body.password } };
};

/**
 * Validate user profile update.
 */
const validateProfileUpdate = (body) => {
  const errors = [];
  const allowed = {};

  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim().length < 2) {
      errors.push('name must be at least 2 characters');
    } else {
      allowed.name = body.name.trim();
    }
  }

  if (body.bio !== undefined) {
    if (typeof body.bio !== 'string' || body.bio.length > 500) {
      errors.push('bio must be under 500 characters');
    } else {
      allowed.bio = body.bio;
    }
  }

  if (body.gender !== undefined && !VALID_GENDERS.includes(body.gender)) {
    errors.push(`gender must be one of: ${VALID_GENDERS.join(', ')}`);
  } else if (body.gender !== undefined) {
    allowed.gender = body.gender;
  }

  if (errors.length > 0) return { error: errors[0] };
  return { error: null, data: allowed };
};

/**
 * Validate pagination/query parameters.
 */
const validateQueryParams = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const sort = query.sort ? String(query.sort) : '-createdAt';
  const search = query.search ? String(query.search).trim() : null;

  return { page, limit, sort, search };
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validateQueryParams,
  VALID_ROLES,
  VALID_GENDERS,
};
