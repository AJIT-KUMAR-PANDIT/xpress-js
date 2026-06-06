# Typedoc Documentation — XPress-JS Framework

This directory contains Typedoc-compatible JSDoc annotations and configuration for generating static API documentation from the xpress-js source code.

## Quick Start

```bash
# Install typedoc
npm install --save-dev typedoc

# Generate docs
npx typedoc --out docs/typedoc/out src/app.js src/server.js \
  src/config/env.js src/config/database.js \
  src/controllers/auth.controller.js src/controllers/user.controller.js \
  src/services/auth.service.js src/services/user.service.js \
  src/models/user.model.js src/routes/auth.routes.js src/routes/user.routes.js \
  src/middlewares/auth.middleware.js src/middlewares/error.middleware.js \
  src/utils/helpers.js src/utils/logger.js src/validations/user.validation.js \
  src/index.js

# Or use the config file:
npx typedoc --options docs/typedoc/typedoc.config.js
```

## What Gets Documented

### Server & App Layer
| File | Description | Exported |
|---|---|---|
| `app.js` | Express application factory | `createApp()` — returns configured Express app |
| `server.js` | HTTP server boot + graceful shutdown | (runs on import) |
| `index.js` | Alternative entry point | (runs on import) |

### Configuration
| File | Description | Exported |
|---|---|---|
| `config/env.js` | Environment variable loader with validation | `getConfig()` → memoized config object |
| `config/database.js` | MongoDB connection manager (Mongoose) | `connectDB()`, `disconnectDB()`, `getConnectionState()`, `connectionState` |

### Controllers
| File | Description | Exported |
|---|---|---|
| `controllers/auth.controller.js` | Auth HTTP request handlers | `register`, `login`, `refreshToken`, `verifyEmail`, `forgotPassword`, `resetPassword`, `logout` |
| `controllers/user.controller.js` | User CRUD HTTP handlers | `getAllUsers`, `getUserById`, `updateProfile`, `deleteUser`, `getCurrentProfile` |

### Services (Business Logic)
| File | Description | Exported |
|---|---|---|
| `services/auth.service.js` | Auth operations — register, login, tokens, password reset | `register()`, `login()`, `refreshToken()`, `forgotPassword()`, `resetPassword()`, `verifyEmail()`, `getProfile()` |
| `services/user.service.js` | User CRUD business logic | `getAllUsers()`, `getUserById()`, `updateProfile()`, `deleteUser()`, `toggleAccountStatus()` |

### Models (Data Layer)
| File | Description | Exported |
|---|---|---|
| `models/user.model.js` | In-memory user store with full CRUD | `create()`, `findByEmail()`, `findById()`, `findByTokenField()`, `updateById()`, `updateByEmail()`, `deleteById()`, `findAll()`, `count()`, `verifyByEmail()`, `clearTokenFields()`, `resetPasswordByEmail()`, `addLoginAttempt()`, `resetLoginAttempts()`, `isEmailLocked()`, `clearAll()` |

### Routes
| File | Description | Exported |
|---|---|---|
| `routes/auth.routes.js` | Express Router — 7 auth routes | Router instance (Express) |
| `routes/user.routes.js` | Express Router — 5 user routes + auth/role gates | Router instance (Express) |

### Middlewares
| File | Description | Exported |
|---|---|---|
| `middlewares/auth.middleware.js` | JWT authentication + role authorization | `authenticate`, `authorizeRole()`, `optionalAuth` |
| `middlewares/error.middleware.js` | Global error handler + async wrapper + XpressError class | `errorHandler`, `asyncHandler`, `XpressError` |

### Utilities
| File | Description | Exported |
|---|---|---|
| `utils/helpers.js` | Pure utility functions | `generateRandomString()`, `hashPassword()`, `comparePassword()`, `paginate()`, `pick()`, `omit()`, `sanitize()`, `toSlug()`, `formatDate()`, `sleep()` |
| `utils/logger.js` | Structured console + file logger class | `Logger.error()`, `Logger.warn()`, `Logger.info()`, `Logger.debug()`, `Logger.verbose()`, `Logger.setLevel()`, `Logger.setProd()`, `Logger.requestLogger()` |

### Validation
| File | Description | Exported |
|---|---|---|
| `validations/user.validation.js` | Request validation schemas + constants | `validateRegistration()`, `validateLogin()`, `validateProfileUpdate()`, `validateQueryParams()`, `VALID_ROLES`, `VALID_GENDERS` |

## Output Structure (after generation)

```
docs/typedoc/
├── README.md          ← this file
├── typedoc.config.js  ← typedoc configuration
└── out/               ← generated HTML docs (run: npx typedoc --options docs/typedoc/typedoc.config.js)
    ├── index.html
    ├── modules/
    │   ├── app_module/
    │   ├── server_module/
    │   ├── config_env_module/
    │   ├── ...
    └── assets/
```

## typedoc.config.js Configuration

See [typedoc.config.js](typedoc.config.js) for the full configuration with:

- Entry points for all 18 source modules
- Theme customization (logo, sidebar, etc.)
- Externals / globals settings
- Source file patterns
- Output directory
