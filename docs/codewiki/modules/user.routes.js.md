# Module: routes/user.routes.js

**File**: `src/routes/user.routes.js` (32 lines)  
**Responsibility**: Map HTTP verbs to user controller handlers with auth gating  
**Exports**: Express Router instance with all user routes

## Route Table

| Method | Path | Controller | Auth | Role Gate |
|---|---|---|---|---|
| GET | `/me/profile` | `userController.getCurrentProfile` | Bearer JWT | owner (self) |
| PUT | `/me` | `userController.updateProfile` | Bearer JWT | owner (self) |
| GET | `/` | `userController.getAllUsers` | Bearer JWT | admin |
| GET | `/:id` | `userController.getUserById` | Bearer JWT | admin |
| DELETE | `/:id` | `userController.deleteUser` | Bearer JWT | admin |

## Mounted Path

```javascript
app.use('/api/v1/users', userRoutes);
// → Full paths: /api/v1/users/me/profile, /api/v1/users/me, etc.
```

## Auth Middleware Chain

```
router.use(authenticate)   // Applied globally to all routes in this file
↓
router.get('/', authorizeRole(['admin']), getAllUsers)  // Additional role gate for admin routes
```
