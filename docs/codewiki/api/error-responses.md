# Error Responses

All error responses follow a consistent JSON shape:

```json
{
  "success": false,
  "message": "Human-readable description"
}
```

## HTTP Status Codes

| Code | Scenario | Example Message |
|---|---|---|
| 400 | Validation failed | `"name is required and must be at least 2 characters"` |
| 400 | Bad request body | `"Refresh token is required"` |
| 401 | No token provided | `"Access denied. No token provided."` |
| 401 | Expired token | `"Token has expired."` |
| 401 | Invalid token | `"Invalid token."` |
| 401 | Invalid refresh token | `"INVALID_REFRESH_TOKEN"` |
| 403 | Insufficient permissions | `"Access denied. Insufficient permissions."` |
| 403 | Account disabled | `"ACCOUNT_DISABLED"` |
| 404 | Resource not found | `"USER_NOT_FOUND"`, `"Resource not found"` |
| 409 | Conflict | `"EMAIL_ALREADY_EXISTS"` |
| 429 | Too many attempts | `"TOO_MANY_ATTEMPTS"` |
| 429 | Rate limited | `"Too many requests, please try again later."` |
| 500 | Internal error | `"Internal server error"` (prod) / message details (dev) |

## ValidationError Format (when errors array is present)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "name must be at least 2 characters",
    "a valid email address is required"
  ]
}
```

## Token Error Codes (service layer)

| Code | Meaning |
|---|---|
| `INVALID_CREDENTIALS` | Wrong password or user not found |
| `ACCOUNT_DISABLED` | User's isActive flag is false |
| `TOO_MANY_ATTEMPTS` | 5+ failed login attempts in window |
| `INVALID_REFRESH_TOKEN` | Token expired or tampered |
| `USER_NOT_FOUND_OR_DISABLED` | Refreshed token's user missing or disabled |
| `EMAIL_ALREADY_EXISTS` | Registration with existing email |
| `INVALID_RESET_TOKEN` | Password reset token invalid/used |
| `EMAIL_VERIFIED` | Email verification succeeded |
