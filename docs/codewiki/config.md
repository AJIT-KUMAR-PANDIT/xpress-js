# Configuration Reference

## Environment Variables

### Required (boots will fail without these)

| Variable | Type | Description | Example |
|---|---|---|---|
| `PORT` | number | Server listening port | `3000` |
| `NODE_ENV` | string | Runtime environment | `development` \| `production` \| `test` |
| `JWT_SECRET` | string | Access token signing secret (HMAC) | `my-super-secret-jwt-key` |
| `JWT_EXPIRE` | string | Access token expiration | `7d` \| `1h` \| `3600s` |

### Optional (uses defaults if omitted)

| Variable | Default | Type | Description |
|---|---|---|---|
| `API_PREFIX` | `/api/v1` | string | URL prefix for all API routes |
| `DB_HOST` | `localhost` | string | MongoDB host address |
| `DB_PORT` | `27017` | number | MongoDB port |
| `DB_NAME` | `xpress_js_db` | string | Database name |
| `DB_USER` | *(empty)* | string | Auth user (for cloud Atlas) |
| `DB_PASSWORD` | *(empty)* | string | Auth password (for cloud Atlas) |
| `RATE_LIMIT_WINDOW_MS` | `900000` (15 min) | number | Rate limit time window |
| `RATE_LIMIT_MAX` | `100` | number | Max requests per window |
| `CORS_ORIGIN` (dev) | `http://localhost:3000` | string | Allowed CORS origin in dev |
| `CORS_ORIGIN_PROD` | `https://yourdomain.com` | string | Allowed CORS origin in prod |
| `JWT_REFRESH_SECRET` | *(empty)* | string | Refresh token signing secret |
| `JWT_REFRESH_EXPIRE` | `30d` | string | Refresh token expiration |
| `MAX_FILE_SIZE` | `5242880` (5 MB) | number | Max upload file size in bytes |
| `UPLOAD_PATH` | `./uploads` | string | Directory for uploaded files |
| `EMAIL_HOST` | `smtp.gmail.com` | string | SMTP server hostname |
| `EMAIL_PORT` | `587` | number | SMTP port (STARTTLS) |
| `EMAIL_USER` | *(empty)* | string | SMTP username |
| `EMAIL_PASS` | *(empty)* | string | SMTP password |
| `EMAIL_FROM` | `noreply@xpressjs.dev` | string | From-address for outgoing mail |

## Config Object Shape (getConfig())

```javascript
{
  port: Number,          // e.g. 3000
  nodeEnv: String,       // 'development' | 'production' | 'test'
  apiPrefix: String,     // '/api/v1'

  db: {
    host: String,        // DB host
    port: Number,        // DB port
    name: String,        // DB name
    user: String,        // DB auth user
    password: String,    // DB auth password
    uri: String,         // Full MongoDB URI (built from above)
  },

  jwt: {
    secret: String,      // Access token signing key
    expire: String,      // e.g. '7d'
    refreshSecret: String, // Refresh token signing key
    refreshExpire: String, // e.g. '30d'
  },

  rateLimit: {
    windowMs: Number,    // ms (900000)
    max: Number,         // req count (100)
  },

  corsOrigin: String,    // Single origin or wildcard
  email: { /* SMTP config */ },
  upload: {              // Upload limits
    maxFileSize: Number,
    path: String,
  },

  isDev: Boolean,        // NODE_ENV === 'development'
  isProd: Boolean,       // NODE_ENV === 'production'
  isTest: Boolean,       // NODE_ENV === 'test'
}
```

## Production vs Development Behavior

| Feature | Development | Production |
|---|---|---|
| Log level | `debug` | `info` |
| Morgan format | `dev` (colorized) | `combined` → Logger |
| Stack traces | Included in error response | Omitted |
| DB failure | Continue (demo mode) | `process.exit(1)` |
| Rate limit window | 900s | 900s |
