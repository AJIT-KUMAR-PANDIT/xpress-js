# Enhanced JSDoc — utils/helpers.js

## Function Signatures (annotated)

```javascript
/**
 * Generate a cryptographically secure random hex string.
 * Uses Node.js crypto.randomBytes (not Math.random).
 * 
 * @param {number} [length=32] - Number of bytes to generate (hex output = length * 2 chars)
 * @returns {string} Hex-encoded random string
 * @example
 * const token = generateRandomString(16);  // 32-char hex string: "a1b2c3..."
 */
const generateRandomString = (length = 32) => crypto.randomBytes(length).toString('hex');

/**
 * Hash a password using PBKDF2 with a random salt.
 * 
 * In production, replace this with require('bcrypt').hashSync() for better security.
 * This is a pure-JS fallback for framework demo purposes.
 * 
 * @param {string} password - Plain text password to hash
 * @param {number} [saltRounds=10] - PBKDF2 iterations (higher = slower but more secure)
 * @returns {string} Hex-encoded derived key (64 chars for sha512)
 */
const hashPassword = async (password, saltRounds = 10) => { ... };

/**
 * Compare a plain text password against a PBKDF2-derived hash.
 * 
 * In production, replace this with require('bcrypt').compareSync().
 * Note: This implementation uses a NEW random salt each call, which means
 * stored hashes must use the same salt as the original — in practice, use bcrypt.
 * 
 * @param {string} password - Plain text password to check
 * @param {string} hash - Previously generated hash string
 * @returns {boolean} true if password matches the hash
 */
const comparePassword = async (password, hash) => { ... };

/**
 * Paginate an array of items with Mongoose-style metadata.
 * 
 * @param {Array<any>} items - The full result set to paginate
 * @param {number|string} [page=1] - Page number (1-based); coerced via parseInt
 * @param {number|string} [limit=10] - Items per page; clamped to [1, 100]
 * @returns {{ data: Array<any>, meta: { total: number, page: number, pageSize: number, totalPages: number, hasMore: boolean } }}
 * @example
 * const result = paginate(allUsers, 2, 10);
 * // → { data: [...], meta: { total: 45, page: 2, pageSize: 10, totalPages: 5, hasMore: true } }
 */
const paginate = (items, page, limit) => { ... };

/**
 * Extract only the specified keys from an object.
 * 
 * @param {Object} obj - Source object
 * @param {Array<string>} keys - Keys to include (only if present in source)
 * @returns {Object} New object with only the specified keys
 * @example
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])  // → { a: 1, c: 3 }
 */
const pick = (obj, keys) => { ... };

/**
 * Remove the specified keys from an object.
 * 
 * @param {Object} obj - Source object (not mutated — returns new object)
 * @param {Array<string>} keys - Keys to remove
 * @returns {Object} New object without the specified keys
 * @example
 * omit({ a: 1, b: 2, c: 3 }, ['b'])  // → { a: 1, c: 3 }
 */
const omit = (obj, keys) => { ... };

/**
 * Recursively remove null and undefined values from an object.
 * 
 * @param {Object|Array} obj - Source to sanitize
 * @returns {Object|Array} Cleaned copy with all null/undefined values removed
 */
const sanitize = (obj) => { ... };

/**
 * Convert a string to a URL-friendly slug.
 * 
 * Lowercases, trims, removes non-word characters (except hyphens), and collapses whitespace.
 * 
 * @param {string} str - Input string (e.g., "Hello World!")
 * @returns {string} Slug (e.g., "hello-world")
 */
const toSlug = (str) => str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

/**
 * Format a date string to a human-readable format.
 * 
 * @param {string|Date} date - Date to format
 * @param {'short'|'long'|'relative'} [format='short'] - Output format
 * @returns {string} Formatted date
 * 
 * @example
 * formatDate(new Date(), 'short')   // "2026-06-06"
 * formatDate(new Date(), 'long')    // "June 6, 2026"
 * formatDate(new Date(Date.now() - 3600000), 'relative')  // "1h ago"
 */
const formatDate = (date, format = 'short') => { ... };

/**
 * Pause execution for the specified number of milliseconds.
 * 
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>} Resolves after the delay
 * @example
 * await sleep(1000);  // wait 1 second
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
```
