# Module: middlewares/error.middleware.js

**File**: `src/middlewares/error.middleware.js` (89 lines)  
**Responsibility**: Global Express error handler + async wrapper + custom error class  
**Exports**: `{ errorHandler, asyncHandler, XpressError }`

## Functions

### `errorHandler(err, req, res, next)`
- **Express signature**: 4 parameters (triggers Express error middleware detection)
- **Mount position**: LAST in middleware chain (catches everything that passed through)
- **Behavior**:
  1. Logs full error to Logger + file transport
  2. Determines status code from `err.statusCode`, `err.status`, or defaults to 500
  3. Builds standardized response object
  4. Routes by `err.type`: ValidationError→400, AuthorizationError→403, NotFoundError→404
  5. Returns `res.status(code).json(response)`

### `asyncHandler(fn)`
- **Purpose**: Wrapper that catches both sync and async errors in route handlers
- **Usage**: `router.get('/users', asyncHandler(async (req, res) => { ... }))`
- **Mechanism**: `Promise.resolve(fn(req, res, next)).catch(next)`

### `XpressError` class
```javascript
class XpressError extends Error {
  constructor(message, statusCode, type)
}
// Properties: message, statusCode, type, stack (via captureStackTrace)
```

## Response Shaping by Error Type

| err.type | status | response shape |
|---|---|---|
| `ValidationError` | 400 | `{ success: false, message: 'Validation failed', errors: [...] }` |
| `AuthorizationError` | 403 | `{ success: false, message: err.message }` |
| `NotFoundError` | 404 | `{ success: false, message: err.message || 'Resource not found' }` |
| (none/default) | 500 | `{ success: false, message: err.message (dev) / 'Internal server error' (prod) }` |
