# Enhanced JSDoc — user.model.js

Below is the **enhanced JSDoc version** of `models/user.model.js`. Add these annotations to your source file.

## @typedef Definitions (add at top)

```javascript
/**
 * User object schema (as stored in the in-memory data store).
 * In production this would be a Mongoose Document.
 * @typedef {Object} UserModel
 * @property {string} id                    - UUID-like unique identifier
 * @property {string} name                  - Display name (min 2 chars)
 * @property {string} email                 - Normalized lowercase email
 * @property {string} password              - bcrypt hashed password
 * @property {'user'|'admin'} [role]       - User role (default: 'user')
 * @property {string|null} [avatar]         - URL to avatar image
 * @property {string|null} [bio]            - Short bio (max 500 chars)
 * @property {'male'|'female'|'other'|'prefer_not_to_say'} [gender]
 * @property {boolean} isVerified           - Email verified status
 * @property {boolean} isActive             - Account active/deactivated
 * @property {string|null} lastLoginAt      - ISO8601 timestamp of last login
 * @property {string|null} verificationToken
 * @property {string|null} resetToken
 * @property {string} createdAt             - ISO8601 creation timestamp
 * @property {string} updatedAt             - ISO8601 update timestamp
 */

/**
 * @typedef {Object} PaginatedResult
 * @property {UserModel[]} data      - The data items (password stripped)
 * @property {object} meta           - Pagination metadata
 * @property {number} meta.total     - Total number of records
 * @property {number} meta.page      - Current page number
 * @property {number} meta.pageSize  - Items per page
 * @property {number} meta.totalPages
 * @property {boolean} meta.hasMore
 */
```

## Function Signatures (annotated versions)

```javascript
/**
 * Create a new user record in the in-memory store.
 * @param {Object} userData - Raw user data to insert
 * @param {string} userData.name
 * @param {string} userData.email
 * @param {string} userData.password     // hashed by service layer
 * @param {string} [userData.role]       // 'user' or 'admin'
 * @param {string|null} [userData.avatar]
 * @param {string|null} [userData.bio]
 * @returns {UserModel} The created user object (with id, timestamps, etc.)
 */
const create = (userData) => { ... };

/**
 * Find a user by their email address.
 * @param {string} email - Email to search for (case-insensitive)
 * @returns {UserModel|null} Found user or null if not found
 */
const findByEmail = (email) => users.find((u) => u.email === email.toLowerCase()) || null;

/**
 * Find a user by their unique ID.
 * @param {string} id - User's unique identifier
 * @returns {UserModel|null} Found user or null if not found
 */
const findById = (id) => users.find((u) => u.id === id) || null;

/**
 * Find a user by any token field (verificationToken, resetToken).
 * @param {string} field - The field name to search on
 * @param {string} tokenValue - The token value to match
 * @returns {UserModel|null} Found user or null if not found
 */
const findByTokenField = (field, tokenValue) => { ... };

/**
 * Update specific fields of a user by their ID.
 * @param {string} id - User's unique identifier
 * @param {Object} updates - Fields to update (partial update)
 * @returns {UserModel|null} Updated user or null if not found
 */
const updateById = (id, updates) => { ... };

/**
 * Update a user by their email address.
 * @param {string} email - User's email
 * @param {Object} updates - Fields to update (full merge on matched user)
 * @returns {UserModel|null} Updated user or null if not found
 */
const updateByEmail = (email, updates) => { ... };

/**
 * Delete a user by their ID.
 * @param {string} id - User's unique identifier
 * @returns {boolean} true if deleted, false if not found
 */
const deleteById = (id) => { ... };

/**
 * Find all users with pagination and optional search filtering.
 * @param {number} [page=1]           - Page number (1-based)
 * @param {number} [limit=10]         - Items per page (max 100)
 * @param {string|null} [search=null] - Search term for name/email matching
 * @returns {PaginatedResult} Paginated user list with metadata
 */
const findAll = (page, limit, search) => { ... };

/**
 * Count all users in the store.
 * @returns {number} Total user count
 */
const count = () => users.length;

/**
 * Verify a user's email address (set isVerified = true).
 * @param {string} email - User's email
 * @returns {UserModel|null} Updated user or null if not found
 */
const verifyByEmail = (email) => updateByEmail(email, { isVerified: true });

/**
 * Clear token fields (after use in verification/reset flow).
 * @param {string} email - User's email
 * @returns {UserModel|null} Updated user or null
 */
const clearTokenFields = (email) => updateByEmail(email, { verificationToken: null, resetToken: null });

/**
 * Reset a user's password by setting a new hashed value.
 * @param {string} email - User's email
 * @param {string} hashedPassword - Pre-hashed password string
 * @returns {UserModel|null} Updated user or null
 */
const resetPasswordByEmail = (email, hashedPassword) => updateByEmail(email, { password: hashedPassword });

/**
 * Increment login attempt counter for brute-force protection.
 * @param {string} email - User's email
 * @returns {number} New attempt count
 */
const addLoginAttempt = (email) => { ... };

/**
 * Reset login attempt counter (after successful login).
 * @param {string} email - User's email
 */
const resetLoginAttempts = (email) => { delete loginAttempts[email]; };

/**
 * Check if a user's account is locked due to excessive login attempts.
 * @param {string} email - User's email
 * @param {number} [maxAttempts=5] - Maximum allowed attempts before lockout
 * @param {number} [windowMs=900000] - Time window in milliseconds (15 min)
 * @returns {boolean} true if account is locked
 */
const isEmailLocked = (email, maxAttempts, windowMs) => { ... };

/**
 * Clear all test data (useful in tests/dev).
 * Resets users array, ID counter, and login attempts.
 */
const clearAll = () => { ... };
```
