# Module: controllers/user.controller.js — User Management HTTP Handlers

**File**: `src/controllers/user.controller.js` (80 lines)  
**Responsibility**: Parse requests for user CRUD → call service → format JSON response  
**Module exports**: `getAllUsers`, `getUserById`, `updateProfile`, `deleteUser`, `getCurrentProfile`

## Function Reference

| Exported | HTTP Method/Path | Auth Required | Role | Input | Output |
|---|---|---|---|---|---|
| `getAllUsers` | GET /users/?page&limit&search&sort | Required (Bearer) | admin | query params | `{ success, data: { data[], meta } }` (200) |
| `getUserById` | GET /users/:id | Required (Bearer) | admin | URL param: id | `{ success, data: user }` (200) |
| `updateProfile` | PUT /users/me | Required (Bearer) | owner | body: { name?, bio? } | `{ success, message, data: updatedUser }` (200) |
| `deleteUser` | DELETE /users/:id | Required (Bearer) | admin | URL param: id | `{ success, message }` (200) |
| `getCurrentProfile` | GET /users/me/profile | Required (Bearer) | owner | none | `{ success, data: profile }` (200) |

## Validation Used

| Function | Validator | Source |
|---|---|---|
| `updateProfile` | `validateProfileUpdate(body)` | user.validation.js |
| `getAllUsers` | `validateQueryParams(query)` | user.validation.js |

## Auth Context Access

- All controllers access `req.user.userId` (from JWT decode) to identify current user
- Admin-only routes gate with `authorizeRole(['admin'])` middleware
