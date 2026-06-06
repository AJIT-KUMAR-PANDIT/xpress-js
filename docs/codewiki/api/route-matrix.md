# Route Matrix

Complete table of every route in the application, sorted by mounted path.

## Health & System Routes

| Method | Full Path | Controller | Auth | Role | Notes |
|---|---|---|---|---|---|
| GET | `/api/v1/health` | inline (app.js) | No | — | Returns uptime, version, status |
| GET | `/` | inline (app.js) | No | — | Welcome message |

## Authentication Routes

| Method | Full Path | Controller | Auth | Role | Body Schema |
|---|---|---|---|---|---|
| POST | `/api/v1/auth/register` | authController.register | No | — | `{ name, email, password, role? }` |
| POST | `/api/v1/auth/login` | authController.login | No | — | `{ email, password }` |
| POST | `/api/v1/auth/refresh-token` | authController.refreshToken | No | — | `{ refreshToken }` |
| GET | `/api/v1/auth/verify-email/:token` | authController.verifyEmail | No | — | URL param: `token` |
| POST | `/api/v1/auth/forgot-password` | authController.forgotPassword | No | — | `{ email }` |
| POST | `/api/v1/auth/reset-password` | authController.resetPassword | No | — | `{ resetToken, newPassword }` |
| POST | `/api/v1/auth/logout` | authController.logout | Bearer JWT | owner | none |

## User Routes

| Method | Full Path | Controller | Auth | Role | Body Schema |
|---|---|---|---|---|---|
| GET | `/api/v1/users/me/profile` | userController.getCurrentProfile | Bearer JWT | owner | — |
| PUT | `/api/v1/users/me` | userController.updateProfile | Bearer JWT | owner | `{ name?, bio?, gender? }` |
| GET | `/api/v1/users/` | userController.getAllUsers | Bearer JWT | admin | query: `page, limit, search, sort` |
| GET | `/api/v1/users/:id` | userController.getUserById | Bearer JWT | admin | URL param: `id` |
| DELETE | `/api/v1/users/:id` | userController.deleteUser | Bearer JWT | admin | URL param: `id` |

## Routes Summary

| Category | Total | Public | Auth Required | Admin Only |
|---|---|---|---|---|
| Health/System | 2 | 2 | 0 | 0 |
| Authentication | 7 | 6 | 1 | 0 |
| Users | 5 | 0 | 5 | 3 |
