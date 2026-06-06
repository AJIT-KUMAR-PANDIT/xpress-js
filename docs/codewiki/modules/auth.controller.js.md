# Module: controllers/auth.controller.js — Authentication HTTP Handlers

**File**: `src/controllers/auth.controller.js` (157 lines)  
**Responsibility**: Parse request → validate input → call service → format JSON response  
**Module exports**: `register`, `login`, `refreshToken`, `verifyEmail`, `forgotPassword`, `resetPassword`, `logout`

## Function Reference

| Exported | HTTP Method/Path | Auth Required | Input Schema | Output Schema |
|---|---|---|---|---|
| `register` | POST /auth/register | No | `{ name, email, password, role? }` | `{ success, message, data: { user, token, refreshToken } }` (201) |
| `login` | POST /auth/login | No | `{ email, password }` | `{ success, message, data: { user, token, refreshToken } }` (200) |
| `refreshToken` | POST /auth/refresh-token | No | `{ refreshToken }` | `{ success, message, data: { token, refreshToken } }` (200) |
| `verifyEmail` | GET /auth/verify-email/:token | No | URL param: `token` | `{ success, message }` (200) |
| `forgotPassword` | POST /auth/forgot-password | No | `{ email }` | `{ success, message }` (200) |
| `resetPassword` | POST /auth/reset-password | No | `{ resetToken, newPassword }` | `{ success, message }` (200) |
| `logout` | POST /auth/logout | Required (Bearer) | none | `{ success, message }` (200) |

## Validation Used

| Function | Validator | Source |
|---|---|---|
| `register` | `validateRegistration(body)` | user.validation.js |
| `login` | `validateLogin(body)` | user.validation.js |

## Common Patterns

1. Every handler uses `try/catch/next(err)` pattern (or asyncHandler wrapper in routes)
2. Auth errors return 400 `{ success: false, message }`
3. Successful auth operations log to Logger then return 200/201 with data
4. Email sending is stubbed (commented out) — production would call `emailService.sendPasswordReset()`
