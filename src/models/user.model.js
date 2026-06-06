/**
 * src/models/user.model.js
 * ===================================================================
 * User model definition for xpress-js.
 * In production this would be a Mongoose schema or Sequelize model.
 * Here it's an in-memory store to keep the framework dependency-free.
 * Swap this file out for a real ORM implementation as needed.
 * ===================================================================
 */

const { generateRandomString } = require('../utils/helpers');

// In-memory "database" — replace with Mongoose/Sequelize in production
let users = [];
let _idCounter = 0;

/**
 * Internal ID generator (UUID v4 style).
 */
const uid = () => {
  _idCounter += 1;
  return `${Date.now()}-${_idCounter}-${generateRandomString(8)}`;
};

// ---- CRUD Operations --------------------------------------------------

/**
 * Create a new user.
 */
const create = (userData) => {
  const now = new Date().toISOString();
  const user = {
    id: uid(),
    name: userData.name,
    email: userData.email.toLowerCase(),
    password: userData.password,          // hashed by service layer
    role: userData.role || 'user',
    avatar: userData.avatar || null,
    bio: userData.bio || null,
    gender: userData.gender || null,
    isVerified: false,
    isActive: true,
    lastLoginAt: null,
    verificationToken: userData.verificationToken,
    resetToken: userData.resetToken,
    createdAt: now,
    updatedAt: now,
  };

  users.push(user);
  return { ...user };
};

/**
 * Find a single user by email.
 */
const findByEmail = (email) => users.find((u) => u.email === email.toLowerCase()) || null;

/**
 * Find a user by ID.
 */
const findById = (id) => users.find((u) => u.id === id) || null;

/**
 * Find a user by token field.
 */
const findByTokenField = (field, tokenValue) => {
  return users.find((u) => u[field] === tokenValue) || null;
};

/**
 * Update a user's fields (partial update).
 */
const updateById = (id, updates) => {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  const allowedFields = ['name', 'bio', 'avatar', 'gender', 'lastLoginAt'];
  const updatedUser = { ...users[index], updatedAt: new Date().toISOString() };

  for (const key of Object.keys(updates)) {
    if (allowedFields.includes(key) || updates[key] !== undefined) {
      updatedUser[key] = updates[key];
    }
  }

  users[index] = updatedUser;
  return { ...updatedUser };
};

/**
 * Update by email.
 */
const updateByEmail = (email, updates) => {
  const index = users.findIndex((u) => u.email === email.toLowerCase());
  if (index === -1) return null;

  users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
  return { ...users[index] };
};

/**
 * Delete a user by ID.
 */
const deleteById = (id) => {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;
  users.splice(index, 1);
  return true;
};

/**
 * List all users (pagination-aware).
 */
const findAll = (page = 1, limit = 10, search = null) => {
  let result = [...users];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }

  const total = result.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;

  return {
    data: result.slice(startIndex, startIndex + limit),
    meta: { total, page, pageSize: limit, totalPages, hasMore: page < totalPages },
  };
};

/**
 * Count all users.
 */
const count = () => users.length;

/**
 * Verify a user's email (set isVerified = true).
 */
const verifyByEmail = (email) => updateByEmail(email, { isVerified: true });

/**
 * Clear token fields (after use).
 */
const clearTokenFields = (email) => updateByEmail(email, {
  verificationToken: null,
  resetToken: null,
});

/**
 * Reset password by email.
 */
const resetPasswordByEmail = (email, hashedPassword) => updateByEmail(email, {
  password: hashedPassword,
});

/**
 * Increment login attempts and lock if over threshold.
 */
let loginAttempts = {};

const addLoginAttempt = (email) => {
  loginAttempts[email] = (loginAttempts[email] || 0) + 1;
  return loginAttempts[email];
};

const resetLoginAttempts = (email) => { delete loginAttempts[email]; };

const isEmailLocked = (email, maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = loginAttempts[email] || 0;
  return attempts >= maxAttempts;
};

/**
 * Clear old test data (useful in tests/dev).
 */
const clearAll = () => { users = []; _idCounter = 0; loginAttempts = {}; };

module.exports = {
  create,
  findByEmail,
  findById,
  findByTokenField,
  updateById,
  updateByEmail,
  deleteById,
  findAll,
  count,
  verifyByEmail,
  clearTokenFields,
  resetPasswordByEmail,
  addLoginAttempt,
  resetLoginAttempts,
  isEmailLocked,
  clearAll,
};
