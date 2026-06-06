/**
 * src/services/auth.service.js
 * ===================================================================
 * Authentication service — the business logic layer for all auth flows.
 * This sits between controllers and models, handling:
 *   • Password hashing / comparison
 *   • JWT token generation & verification
 *   • Refresh token rotation
 *   • Email verification
 *   • Password reset flow (forgot → reset)
 *
 * In production you'd swap the in-memory user model for MongoDB/PostgreSQL.
 * ===================================================================
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getConfig } = require('../config/env');
const { generateRandomString, sanitize } = require('../utils/helpers');
const userModel = require('../models/user.model');

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Register a new user account.
 * @param {Object} payload - name, email, password, role?
 * @returns {Promise<{user, token, refreshToken}>}
 */
const register = async (payload) => {
  const config = getConfig();

  // Check for duplicate email
  const existing = await userModel.findByEmail(payload.email);
  if (existing) throw new Error('EMAIL_ALREADY_EXISTS');

  // Hash password with bcrypt
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(payload.password, saltRounds);

  // Create user record
  const newUser = await userModel.create({
    name: payload.name.trim(),
    email: payload.email.toLowerCase().trim(),
    password: hashedPassword,
    role: (['admin', 'super_admin'].includes(payload.role)) ? payload.role : 'user',
    avatar: null,
    bio: null,
    verificationToken: generateRandomString(32),
    resetToken: generateRandomString(32),
  });

  // Generate tokens
  const token = await _signAccessToken({ userId: newUser.id, email: newUser.email });
  const refreshToken = await _signRefreshToken({ userId: newUser.id });

  return {
    user: stripPassword(newUser),
    token,
    refreshToken,
  };
};

/**
 * Authenticate with email + password.
 * @param {Object} payload - email, password
 * @returns {Promise<{user, token, refreshToken}>}
 */
const login = async (payload) => {
  const config = getConfig();

  // Find user
  const user = await userModel.findByEmail(payload.email);
  if (!user) throw new Error('INVALID_CREDENTIALS');

  // Check status
  if (!user.isActive) throw new Error('ACCOUNT_DISABLED');

  // Compare password
  const isMatch = await bcrypt.compare(payload.password, user.password);
  if (!isMatch) {
    // Rate-limit brute-force: track attempts
    const attempts = await userModel.incrementLoginAttempts(user.email);
    if (attempts >= 5) throw new Error('TOO_MANY_ATTEMPTS');
    throw new Error('INVALID_CREDENTIALS');
  }

  // Reset login attempts on success
  await userModel.resetLoginAttempts(user.email);

  // Update last login timestamp
  await userModel.updateByEmail(user.email, { lastLoginAt: new Date().toISOString() });

  const updatedUser = await userModel.findByEmail(user.email);

  return {
    user: stripPassword(updatedUser),
    token: await _signAccessToken({ userId: updatedUser.id, email: updatedUser.email }),
    refreshToken: await _signRefreshToken({ userId: updatedUser.id }),
  };
};

/**
 * Refresh access token using a valid refresh token. */
const refreshToken = async (refreshTokenValue) => {
  const config = getConfig();

  try {
    const decoded = jwt.verify(refreshTokenValue, config.jwt.refreshSecret);
    if (decoded.type !== 'refresh') throw new Error('INVALID_TOKEN_TYPE');

    const user = await userModel.findById(decoded.userId);
    if (!user || !user.isActive) throw new Error('USER_NOT_FOUND_OR_DISABLED');

    return {
      user: stripPassword(user),
      token: await _signAccessToken({ userId: user.id, email: user.email }),
      refreshToken: await _signRefreshToken({ userId: user.id }), // rotate
    };
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      throw new Error('INVALID_REFRESH_TOKEN');
    }
    throw err;
  }
};

/**
 * Generate password-reset token and return it (email should be sent externally). */
const forgotPassword = async (email) => {
  const user = await userModel.findByEmail(email);
  if (!user) throw new Error('USER_NOT_FOUND');

  const resetToken = generateRandomString(32);
  await userModel.updateByEmail(email, { resetToken });

  return { resetToken }; // → send via email in the controller
};

/**
 * Complete password reset with token + new password. */
const resetPassword = async ({ resetToken, newPassword }) => {
  const user = await userModel.findByTokenField('resetToken', resetToken);
  if (!user) throw new Error('INVALID_RESET_TOKEN');

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await userModel.updateByEmail(user.email, {
    password: hashedPassword,
    resetToken: null,
  });

  return { message: 'PASSWORD_RESET_SUCCESS' };
};

/**
 * Verify email with the verification token. */
const verifyEmail = async (token) => {
  const user = await userModel.findByTokenField('verificationToken', token);
  if (!user) throw new Error('INVALID_VERIFICATION_TOKEN');

  await userModel.updateByEmail(user.email, {
    isVerified: true,
    verificationToken: null,
  });

  return { message: 'EMAIL_VERIFIED' };
};

/**
 * Get user profile by ID. */
const getProfile = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) throw new Error('USER_NOT_FOUND');
  return stripPassword(user);
};

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

const _signAccessToken = (payload) => {
  const config = getConfig();
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expire });
};

const _signRefreshToken = (payload) => {
  const config = getConfig();
  return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpire });
};

/** Remove password field before exposing to client. */
const stripPassword = (user) => {
  const { password, ...rest } = user;
  return rest;
};

module.exports = {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getProfile,
};
