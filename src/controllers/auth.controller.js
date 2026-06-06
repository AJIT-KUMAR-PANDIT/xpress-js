/**
 * src/controllers/auth.controller.js
 * ===================================================================
 * Authentication controller — handles all HTTP requests related to auth.
 * Each function is a thin layer over the service, keeping concerns separated:
 *   Controllers → parse request / format response
 *   Services     → business logic
 *   Models       → data access
 * ===================================================================
 */

const authService = require('../services/auth.service');
const { validateRegistration, validateLogin } = require('../validations/user.validation');
const Logger = require('../utils/logger');

/**
 * POST /auth/register
 * Register a new user account.
 */
exports.register = async (req, res, next) => {
  try {
    const { error, data } = validateRegistration(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const result = await authService.register(data);

    Logger.info(`New user registered: ${result.user.email}`);

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /auth/login
 * Authenticate and receive JWT tokens.
 */
exports.login = async (req, res, next) => {
  try {
    const { error, data } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const result = await authService.login(data);

    Logger.info(`User logged in: ${result.user.email}`);

    // Don't send refresh token in response body — use httpOnly cookie in production
    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken, // In prod, set this as httpOnly cookie
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /auth/refresh-token
 * Exchange a refresh token for a new access token.
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    const result = await authService.refreshToken(refreshToken);

    return res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: result.token,
        refreshToken: result.refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /auth/verify-email/:token
 * Verify email address via the link sent during registration. */
exports.verifyEmail = async (req, res, next) => {
  try {
    const result = await authService.verifyEmail(req.params.token);
    return res.json({ success: true, message: result.message });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /auth/forgot-password
 * Request a password reset link. */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { error } = validateLogin({ email: req.body.email }); // reuse validation
    if (error) return res.status(400).json({ success: false, message: error });

    const result = await authService.forgotPassword(req.body.email);

    // In production: send email with resetToken here
    // await emailService.sendPasswordReset(result.user.email, result.resetToken)

    return res.json({
      success: true,
      message: 'If the email exists, a reset link has been sent.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /auth/reset-password
 * Complete the password reset with token + new password. */
exports.resetPassword = async (req, res, next) => {
  try {
    const result = await authService.resetPassword({
      resetToken: req.body.resetToken,
      newPassword: req.body.newPassword,
    });
    return res.json({ success: true, message: result.message });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /auth/logout
 * Invalidate the current session. */
exports.logout = async (req, res, next) => {
  try {
    // In production: delete refresh token from Redis/DB
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};
