# Module: middlewares/auth.middleware.js

**File**: `src/middlewares/auth.middleware.js` (88 lines)  
**Responsibility**: JWT-based authentication and role-based authorization middleware  
**Exports**: `{ authenticate, authorizeRole, optionalAuth }`

## Middleware Functions

### `authenticate`
- **Purpose**: Require valid JWT access token; rejects with 401 on failure
- **Token extraction**: `Authorization: Bearer <token>` header
- **On success**: sets `req.user = decoded.payload` (contains userId, email, role)
- **Error responses**:
  - No token → 401 `Access denied. No token provided.`
  - Expired → 401 `Token has expired.`
  - Invalid → 401 `Invalid token.`

### `authorizeRole(roles)`
- **Purpose**: Factory function; returns middleware that checks user role
- **Usage**: `router.get('/admin', authenticate, authorizeRole(['admin']), handler)`
- **Error responses**:
  - No role assigned → 403 `Access denied. No role assigned.`
  - Role not in allowed list → 403 `Access denied. Insufficient permissions.`

### `optionalAuth`
- **Purpose**: Attach req.user if token is valid; never reject (proceeds without user)
- **Use case**: routes that behave differently for authenticated vs anonymous users
- **On success**: same as authenticate (sets req.user)
- **On failure**: silently ignores — user is "unauthenticated" but request continues

## Token Payload Structure

```javascript
// Access token payload:
{
  userId: String,
  email: String,
  iat: Number,          // issued-at timestamp
  exp: Number           // expiration timestamp
}

// Refresh token payload:
{
  userId: String,
  type: 'refresh',
  iat: Number,
  exp: Number
}
```
