# API Reference — XPress-JS Framework

## Base URL

```
http://localhost:3000/api/v1/<module>/<endpoint>
```

### Authentication Headers

```
Authorization: Bearer <access_token>
```

---

## Health & System

### GET /api/v1/health

Returns application health, uptime, and version info.

**Response `200 OK`**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "uptime": 12345.678,
    "timestamp": "2026-06-06T16:55:12.000Z",
    "nodeEnv": "development",
    "version": "1.0.0"
  }
}
```

### GET /

Welcome endpoint — returns framework metadata.

**Response `200 OK`**
```json
{
  "success": true,
  "message": "Welcome to XPress-JS Framework — Built by NAKPRC",
  "docs": "/api/v1/health"
}
```

---

## Authentication (public)

### POST /api/v1/auth/register

Register a new user account.

**Body**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "user"       // optional — defaults to 'user'
}
```

**Response `201 Created`**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "user": {
      "id": "1749235200000-1-abc123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isVerified": false,
      "isActive": true,
      "createdAt": "2026-06-06T16:55:12.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",     // access token (7d)
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."   // refresh token (30d)
  }
}
```

### POST /api/v1/auth/login

Authenticate with email + password.

**Body**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response `200 OK`**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object, password stripped */ },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### POST /api/v1/auth/refresh-token

Exchange a refresh token for a new access + refresh token pair (rotation).

**Body**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response `200 OK`**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",   // new access token
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."  // new refresh token (rotated)
  }
}
```

**Error responses**:
- `401` — `{ success: false, message: "Invalid refresh token" }`
- `400` — `{ success: false, message: "Refresh token is required" }`

### GET /api/v1/auth/verify-email/:token

Verify email via link sent during registration.

**Path Params**: `token` (string) — verification token from email

**Response `200 OK`**
```json
{
  "success": true,
  "message": "EMAIL_VERIFIED"
}
```

### POST /api/v1/auth/forgot-password

Request a password reset link.

**Body**
```json
{
  "email": "john@example.com"
}
```

**Response `200 OK`**
```json
{
  "success": true,
  "message": "If the email exists, a reset link has been sent."
}
```

### POST /api/v1/auth/reset-password

Complete password reset with token + new password.

**Body**
```json
{
  "resetToken": "abc123...",
  "newPassword": "newSecret456"
}
```

**Response `200 OK`**
```json
{
  "success": true,
  "message": "PASSWORD_RESET_SUCCESS"
}
```

### POST /api/v1/auth/logout

Invalidate current session.

**Headers**: `Authorization: Bearer <token>`

**Response `200 OK`**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Users (authenticated)

### GET /api/v1/users/me/profile

Get current user's profile.

**Headers**: `Authorization: Bearer <token>`

**Response `200 OK`**
```json
{
  "success": true,
  "data": {
    "id": "1749235200000-1-abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "bio": null,
    "avatar": null,
    "isVerified": true,
    "createdAt": "..."
  }
}
```

### PUT /api/v1/users/me

Update own profile.

**Headers**: `Authorization: Bearer <token>`

**Body** (all fields optional)
```json
{
  "name": "John Smith",     // min 2 chars
  "bio": "Software engineer", // max 500 chars
  "gender": "male"           // 'male' | 'female' | 'other' | 'prefer_not_to_say'
}
```

**Response `200 OK`**
```json
{
  "success": true,
  "message": "Profile updated",
  "data": { /* updated user object */ }
}
```

### GET /api/v1/users/

List all users (admin only).

**Headers**: `Authorization: Bearer <token>` + role must be `admin`

**Query Params**:
| Param | Type | Default | Range |
|---|---|---|---|
| `page` | int | 1 | ≥ 1 |
| `limit` | int | 10 | [1, 100] |
| `search` | string | null | trimmed |
| `sort` | string | `-createdAt` | any valid field |

**Response `200 OK`**
```json
{
  "success": true,
  "data": {
    "data": [ /* user objects (password stripped) */ ],
    "meta": {
      "total": 42,
      "page": 1,
      "pageSize": 10,
      "totalPages": 5,
      "hasMore": true
    }
  }
}
```

### GET /api/v1/users/:id

Get user by ID (admin only).

**Headers**: `Authorization: Bearer <token>` + role must be `admin`

**Path Params**: `id` (string) — user ID

**Response `200 OK`**
```json
{
  "success": true,
  "data": { /* user object */ }
}
```

### DELETE /api/v1/users/:id

Delete a user by ID (admin only).

**Headers**: `Authorization: Bearer <token>` + role must be `admin`

**Path Params**: `id` (string) — user ID

**Response `200 OK`**
```json
{
  "success": true,
  "message": "USER_DELETED_SUCCESSFULLY"
}
```
