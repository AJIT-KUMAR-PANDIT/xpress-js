# Enhanced JSDoc — auth.service.js

Below is the **enhanced JSDoc version** of `auth.service.js`. To apply, add these annotations to your source file.

## Key Enhancements

### @typedef Definitions (add at top of file)

```javascript
/**
 * @typedef {Object} AuthTokenPair
 * Access token pair returned from registration/login/refresh operations.
 * @property {Object} user    - User object with password field removed
 * @property {string} user.id         - Unique user identifier
 * @property {string} user.name       - Display name
 * @property {string} user.email      - Normalized lowercase email
 * @property {string} [user.role]     - Role ('user' | 'admin')
 * @property {boolean} [user.isVerified]
 * @property {boolean} [user.isActive]
 * @property {string}  user.createdAt  - ISO8601 creation timestamp
 * @property {string} token           - JWT access token (expires: JWT_EXPIRE)
 * @property {string} refreshToken    - JWT refresh token (expires: JWT_REFRESH_EXPIRE)
 */

/**
 * @typedef {Object} RegistrationPayload
 * @property {string} name         - Minimum 2 characters
 * @property {string} email        - Valid email address
 * @property {string} password     - Minimum 6 characters
 * @property {string} [role]       - 'user' or 'admin' (default: 'user')
 */

/**
 * @typedef {Object} LoginPayload
 * @property {string} email    - Valid email address
 * @property {string} password - Plain text password
 */

/**
 * @typedef {Object} PasswordResetPayload
 * @property {string} resetToken    - From forgotPassword response
 * @property {string} newPassword   - Minimum 6 characters
 */
```

### Function Signatures (replace existing functions with annotated versions)

```javascript
/**
 * Register a new user account.
 * 
 * Flow: check duplicate → hash password (bcrypt, saltRounds=12) → create user → generate tokens
 * 
 * @param {RegistrationPayload} payload - Registration data
 * @returns {Promise<AuthTokenPair>}
 * @throws {Error} 'EMAIL_ALREADY_EXISTS' if email is already registered
 * @example
 * const result = await auth.register({ name: 'John', email: 'john@example.com', password: 'secret123' });
 * console.log(result.token);  // JWT access token
 * console.log(result.refreshToken);  // JWT refresh token
 */
const register = async (payload) => { ... };

/**
 * Authenticate a user with email and password.
 * 
 * Flow: find user → check active status → compare password → reset login attempts → generate tokens
 * 
 * @param {LoginPayload} payload - Login credentials
 * @returns {Promise<AuthTokenPair>}
 * @throws {Error} 'INVALID_CREDENTIALS' if email or password is wrong
 * @throws {Error} 'ACCOUNT_DISABLED' if user account is deactivated
 * @throws {Error} 'TOO_MANY_ATTEMPTS' if login attempts exceeded threshold (5)
 * @example
 * const result = await auth.login({ email: 'john@example.com', password: 'secret123' });
 */
const login = async (payload) => { ... };

/**
 * Exchange a refresh token for a new access + refresh token pair (token rotation).
 * 
 * @param {string} refreshTokenValue - The JWT refresh token string
 * @returns {Promise<{ token: string, refreshToken: string }>}
 * @throws {Error} 'INVALID_TOKEN_TYPE' if decoded token is not a refresh token
 * @throws {Error} 'USER_NOT_FOUND_OR_DISABLED' if the user no longer exists or is disabled
 * @throws {Error} 'INVALID_REFRESH_TOKEN' if token verification fails
 */
const refreshToken = async (refreshTokenValue) => { ... };

/**
 * Generate a password-reset token for the given email.
 * 
 * @param {string} email - The user's registered email address
 * @returns {Promise<{ resetToken: string }>}
 * @throws {Error} 'USER_NOT_FOUND' if no account with that email exists
 */
const forgotPassword = async (email) => { ... };

/**
 * Complete the password reset by validating the token and setting a new password.
 * 
 * @param {PasswordResetPayload} payload - resetToken + newPassword
 * @returns {Promise<{ message: string }>}
 * @throws {Error} 'INVALID_RESET_TOKEN' if the token is expired or already used
 */
const resetPassword = async ({ resetToken, newPassword }) => { ... };

/**
 * Verify a user's email address using the verification token.
 * 
 * @param {string} token - Verification token from the email link
 * @returns {Promise<{ message: string }>}
 * @throws {Error} 'INVALID_VERIFICATION_TOKEN' if token is invalid or expired
 */
const verifyEmail = async (token) => { ... };

/**
 * Get a user profile by ID (password stripped).
 * 
 * @param {string} userId - The user's unique identifier
 * @returns {Promise<Object>} User object without password field
 * @throws {Error} 'USER_NOT_FOUND' if no user with that ID exists
 */
const getProfile = async (userId) => { ... };
```
