# Error Handling Reference

## XpressError Class

```javascript
class XpressError extends Error {
  constructor(message, statusCode, type)
}
// Examples:
new XpressError('Not found', 404, 'NotFoundError')
new XpressError('Invalid fields', 400, 'ValidationError')
new XpressError('Access denied', 403, 'AuthorizationError')
```

## Error Response Shape

### Success (2xx/201)

```json
{
  "success": true,
  "message": "Optional message",
  "data": { /* response payload */ }
}
```

### Client Error (4xx)

```json
{
  "success": false,
  "message": "Human-readable error"
}
```

- 400 — Validation errors
- 401 — Auth failures (no token, expired, invalid)
- 403 — Role insufficient
- 404 — Route not found / resource missing

### Server Error (5xx)

```json
{
  "success": false,
  "message": "Internal server error"   // prod
  // or: "Internal server error" → actual message in dev
}
```

## Error Type Code Table

| `err.type` | Status | Scenario | Example |
|---|---|---|---|
| `ValidationError` | 400 | Input validation failed | Missing name, bad email format |
| `AuthorizationError` | 403 | Insufficient role/permissions | User tried admin route |
| `NotFoundError` | 404 | Route or resource not found | Unknown URL path, deleted user |

## Auth Error Messages (from service layer)

| Error Code | HTTP Status | Trigger |
|---|---|---|
| `EMAIL_ALREADY_EXISTS` | 409 | Duplicate registration email |
| `INVALID_CREDENTIALS` | 401 | Wrong password or email not found |
| `ACCOUNT_DISABLED` | 403 | User's isActive = false |
| `TOO_MANY_ATTEMPTS` | 429 | Login attempts >= 5 in window |
| `INVALID_REFRESH_TOKEN` | 401 | Expired or tampered refresh token |
| `USER_NOT_FOUND` | 404 | User lookup returned nothing |
| `INVALID_RESET_TOKEN` | 400 | Password reset token invalid/used |
| `EMAIL_VERIFIED` | 200 | Email verification succeeded |

## Middleware Error Chain

```
Route Handler (try/catch or asyncHandler)
  └── next(err) — passes to error middleware

errorHandler(err, req, res, next)  // Express signature: 4 params!
  ├── Checks err.type → maps to status code + format
  ├── Logs full error to Logger + file
  ├── Builds standardized response object
  └── Returns res.status(code).json(response)
```

## Best Practices for Authors

1. **Always use `asyncHandler`** — don't try-catch manually in every route
2. **Throw typed errors** — use `XpressError` when you control the status code
3. **Let `errorHandler` format** — never build response objects manually in catch blocks
4. **Check `err.type`** — error middleware routes on this property to determine status
5. **Dev vs Prod** — stack traces only appear in dev; never leak internals in prod
