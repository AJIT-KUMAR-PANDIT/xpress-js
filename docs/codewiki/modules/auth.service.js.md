# Module: services/auth.service.js — Authentication Business Logic

**File**: `src/services/auth.service.js` (206 lines)  
**Responsibility**: Core auth operations — register, login, token management, password reset  
**Exports**: `{ register, login, refreshToken, forgotPassword, resetPassword, verifyEmail, getProfile }`

## Public API

### `register(payload)`
- **Input**: `{ name, email, password, role? }`
- **Process**: check duplicate → bcrypt hash → create user → generate tokens
- **Output**: `{ user (stripped), token, refreshToken }`
- **Error codes**: `EMAIL_ALREADY_EXISTS`

### `login(payload)`
- **Input**: `{ email, password }`
- **Process**: find user → check status → bcrypt compare → reset attempts → update lastLogin → generate tokens
- **Output**: `{ user (stripped), token, refreshToken }`
- **Error codes**: `INVALID_CREDENTIALS`, `ACCOUNT_DISABLED`, `TOO_MANY_ATTEMPTS`

### `refreshToken(refreshTokenValue)`
- **Input**: refresh token string
- **Process**: verify → check type === 'refresh' → find user → generate new pair (rotation)
- **Output**: `{ user, token, refreshToken }`
- **Error codes**: `INVALID_TOKEN_TYPE`, `USER_NOT_FOUND_OR_DISABLED`, `INVALID_REFRESH_TOKEN`

### `forgotPassword(email)`
- **Input**: email string
- **Process**: find user → generate reset token → store → return
- **Output**: `{ resetToken }` (caller sends via email)
- **Error codes**: `USER_NOT_FOUND`

### `resetPassword({ resetToken, newPassword })`
- **Input**: object with resetToken + newPassword
- **Process**: find by resetToken → bcrypt hash new password → store → clear token
- **Output**: `{ message: 'PASSWORD_RESET_SUCCESS' }`
- **Error codes**: `INVALID_RESET_TOKEN`

### `verifyEmail(token)`
- **Input**: verification token string
- **Process**: find by token → set isVerified=true → clear token
- **Output**: `{ message: 'EMAIL_VERIFIED' }`
- **Error codes**: `INVALID_VERIFICATION_TOKEN`

### `getProfile(userId)`
- **Input**: user ID string
- **Process**: find user → strip password
- **Output**: user object (no password)
- **Error codes**: `USER_NOT_FOUND`

## Security Details

| Detail | Value |
|---|---|
| Password hashing | bcryptjs, saltRounds = 12 |
| Access token expiry | env JWT_EXPIRE (default: 7d) |
| Refresh token expiry | env JWT_REFRESH_EXPIRE (default: 30d) |
| Token signing algorithm | HS256 (jsonwebtoken default) |
| Password stripping | `stripPassword()` removes `password` field before any response |
