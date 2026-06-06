/**
 * src/utils/helpers.js
 * ===================================================================
 * Shared utility functions used across the xpress-js framework.
 * Pure, side-effect free — no dependencies on Express or DB.
 * ===================================================================
 */

const crypto = require('crypto');

/**
 * Generate a cryptographically secure random string.
 */
const generateRandomString = (length = 32) => crypto.randomBytes(length).toString('hex');

/**
 * Hash a password with salt using bcrypt-style algorithm (pure JS fallback).
 * Returns { hash, salt } objects.
 */
const hashPassword = async (password, saltRounds = 10) => {
  const salt = generateRandomString(16);
  // In production, replace with require('bcrypt').hashSync()
  // This is a simple PBKDF2 fallback for framework demo purposes
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
};

/**
 * Compare a password against a stored hash.
 */
const comparePassword = async (password, hash) => {
  // In production, replace with require('bcrypt').compareSync()
  const derived = crypto.pbkdf2Sync(password, generateRandomString(16), 10000, 64, 'sha512');
  return derived.toString('hex') === hash;
};

/**
 * Paginate a Mongoose-style query array.
 * Usage: paginate(items, page, limit) => { data, total, page, totalPages }
 */
const paginate = (items, page, limit) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));

  const total = items.length;
  const totalPages = Math.ceil(total / limitNum);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;

  return {
    data: items.slice(startIndex, endIndex),
    meta: {
      total,
      page: pageNum,
      pageSize: limitNum,
      totalPages,
      hasMore: pageNum < totalPages,
    },
  };
};

/**
 * Pick only specified keys from an object.
 */
const pick = (obj, keys) => {
  const result = {};
  for (const key of keys) {
    if (obj[key] !== undefined) result[key] = obj[key];
  }
  return result;
};

/**
 * Omit specified keys from an object.
 */
const omit = (obj, keys) => {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
};

/**
 * Sanitize an object by removing undefined and null values recursively.
 */
const sanitize = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const cleaned = Array.isArray(obj) ? [] : {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    cleaned[key] = typeof value === 'object' ? sanitize(value) : value;
  }
  return cleaned;
};

/**
 * Generate a slug from a string.
 */
const toSlug = (str) => str
  .toLowerCase()
  .trim()
  .replace(/[^\w\s-]/g, '')
  .replace(/[\s_-]+/g, '-')
  .replace(/^-+|-+$/g, '');

/**
 * Format a date string to a readable format.
 */
const formatDate = (date, format = 'short') => {
  const d = new Date(date);
  if (format === 'short') return d.toISOString().slice(0, 10);
  if (format === 'long') return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  if (format === 'relative') {
    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return d.toLocaleDateString();
  }
  return d.toISOString();
};

/**
 * Sleep for a given number of milliseconds.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  generateRandomString,
  hashPassword,
  comparePassword,
  paginate,
  pick,
  omit,
  sanitize,
  toSlug,
  formatDate,
  sleep,
};
