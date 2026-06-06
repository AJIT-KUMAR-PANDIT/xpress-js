# Module Dependency Tree

```
src/
├── server.js
│   ├── app.js                         → createApp()
│   │   ├── config/env.js              → getConfig()
│   │   ├── utils/logger.js            → Logger
│   │   ├── middlewares/error.middleware.js → errorHandler, asyncHandler
│   │   ├── routes/auth.routes.js      → authController.* (7 routes)
│   │   │   └── controllers/auth.controller.js
│   │   │       ├── services/auth.service.js        (register, login, refreshToken, forgotPassword, resetPassword, verifyEmail, getProfile)
│   │   │       │   ├── utils/helpers.js            → generateRandomString
│   │   │       │   └── models/user.model.js        → findByEmail, findById, findByTokenField, updateByEmail, create
│   │   │       └── validations/user.validation.js  → validateRegistration, validateLogin
│   │   ├── routes/user.routes.js      → userController.* (5 routes)
│   │   │   └── controllers/user.controller.js
│   │   │       ├── services/user.service.js        (getAllUsers, getUserById, updateProfile, deleteUser, toggleAccountStatus)
│   │   │       │   ├── utils/helpers.js            → omit
│   │   │       │   └── models/user.model.js        → findById, updateById, deleteById
│   │   │       └── validations/user.validation.js  → validateProfileUpdate, validateQueryParams
│   │   └── middlewares/auth.middleware.js (for user routes)
│   │       └── config/env.js                    → getConfig()
│   ├── config/database.js             → connectDB(), disconnectDB()
│   │   └── config/env.js              → getConfig()
│   ├── config/env.js                  → dotenv load + validation + memoized config
│   └── utils/logger.js                → colorized console + file transport
├── app.js                           (see above via server.js)
├── index.js                         (alternative boot — same deps as server.js)
├── controllers/auth.controller.js   (see above)
├── controllers/user.controller.js   (see above)
├── services/auth.service.js         (see above)
├── services/user.service.js         (see above)
├── models/user.model.js             (in-memory store — no external deps except helpers)
├── routes/auth.routes.js            (thin mapping: router.post/get → controller)
├── routes/user.routes.js            (thin mapping with authenticate/authorizeRole)
├── middlewares/auth.middleware.js   (jwt.verify, authorizeRole factory)
├── middlewares/error.middleware.js  (errorHandler, asyncHandler, XpressError)
├── utils/helpers.js                 (pure functions — no deps on express/db)
├── utils/logger.js                  (colorized console + fs file transport)
└── validations/user.validation.js   (pure validation logic — only dep: helpers.generateRandomString)
```

## Circular Dependency Check

No circular dependencies detected. All imports flow downward in the module hierarchy:

```
Entry → Config/Utils → Routes → Controllers → Services → Models
                                          ↘ Middlewares ↗
```
