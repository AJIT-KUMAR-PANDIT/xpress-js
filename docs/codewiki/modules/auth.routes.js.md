# Module: routes/auth.routes.js

**File**: `src/routes/auth.routes.js` (34 lines)  
**Responsibility**: Map HTTP verbs to auth controller handlers  
**Exports**: Express Router instance with all auth routes

## Route Table

| Method | Path | Controller | Notes |
|---|---|---|---|
| POST | `/register` | `authController.register` | Public — validates + hashes password |
| POST | `/login` | `authController.login` | Public — validates credentials |
| POST | `/refresh-token` | `authController.refreshToken` | Public — exchanges refresh token for new pair |
| GET | `/verify-email/:token` | `authController.verifyEmail` | Public — uses verification link from email |
| POST | `/forgot-password` | `authController.forgotPassword` | Public — generates reset token |
| POST | `/reset-password` | `authController.resetPassword` | Public — completes password reset |
| POST | `/logout` | `authController.logout` | Auth required (Bearer) |

## Mounted Path

```javascript
app.use('/api/v1/auth', authRoutes);
// → Full paths: /api/v1/auth/register, /api/v1/auth/login, etc.
```
