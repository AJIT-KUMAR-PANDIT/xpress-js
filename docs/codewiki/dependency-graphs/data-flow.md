# Data Flow Diagram

## Request → Response Flow (one example: POST /auth/register)

```
HTTP Client
    │
    ├── [POST] /api/v1/auth/register
    │   { name: "John", email: "john@example.com", password: "secret" }
    │
    ▼
express.json()           // Parse body → 10kb limit
▼
rateLimit()              // Check rate (100 req/15min)
▼
auth.routes.js           // router.post('/register', ...)
▼
auth.controller.register // try/catch wrapper
    ├── validateRegistration(body)    // ← user.validation.js
    │   → checks name, email, password schema
    │   → returns { error: null, data: sanitized }
    ▼
auth.service.register(payload)        // ← auth.service.js
    ├── userModel.findByEmail(email)  // in-memory search
    ├── bcrypt.hash(password, 12)     // → hashedPassword
    ├── userModel.create({...})       // → newUser (id generated)
    ├── _signAccessToken({ userId })  // → JWT access token (7d)
    ├── _signRefreshToken({ userId }) // → JWT refresh token (30d)
    ├── stripPassword(newUser)        // → user (no password)
    ▼
res.status(201).json(...)             // { success, message, data: { user, token, refreshToken } }
```

## Token Verification Flow (user routes with auth)

```
Client sends: Authorization: Bearer <token>
    ▼
auth.middleware.authenticate
    ├── Extract token from header (slice 'Bearer ')
    ├── jwt.verify(token, config.jwt.secret)
    │   ├── TokenExpiredError → 401 "Token has expired"
    │   ├── JsonWebTokenError → 401 "Invalid token"
    │   └── valid → req.user = decodedPayload
    ▼
authorizeRole(['admin'])  // for admin routes only
    ├── Check req.user.role in allowedRoles
    │   ├── Not in list → 403 "Access denied. Insufficient permissions."
    │   └── OK → next()
    ▼
controller handler (e.g., getAllUsers)
    ▼
service layer
    ▼
model layer (in-memory or MongoDB)
    ▼
res.json({ success, data: [...] })
```

## Error Flow

```
Controller catches exception in try/catch
    └── next(err)
        ▼
errorHandler(err, req, res, next)     // 4-param Express error middleware
    ├── Logger.error(...)              // log to console + file
    ├── Determine status code:
    │   ├── err.statusCode / err.status / 500
    │   └── Route on err.type:
    │       ValidationError → 400
    │       AuthorizationError → 403
    │       NotFoundError → 404
    ├── Build response object:
    │   ├── { success: false, message }
    │   └── (dev only): + stack trace
    ▼
res.status(code).json(response)
```
