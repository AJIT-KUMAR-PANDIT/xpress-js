# Module: services/user.service.js — User Business Logic

**File**: `src/services/user.service.js` (62 lines)  
**Responsibility**: Coordinate user model operations with validation helpers  
**Exports**: `{ getAllUsers, getUserById, updateProfile, deleteUser, toggleAccountStatus }`

## Public API

### `getAllUsers({ page, limit, sort, search })`
- Delegates to `model.findAll()` with pagination parameters
- Returns `{ data: user[], meta: { total, page, pageSize, totalPages, hasMore } }`

### `getUserById(id)`
- Throws `USER_NOT_FOUND` if not found
- Strips password before returning

### `updateProfile(userId, payload)`
- Filters to allowed fields: `['name', 'bio', 'avatar', 'gender']`
- Returns updated user (stripped)
- Throws `USER_NOT_FOUND`

### `deleteUser(userId)`
- Calls `model.deleteById()`
- Returns `{ message: 'USER_DELETED_SUCCESSFULLY' }`
- Throws `USER_NOT_FOUND_OR_DELETED`

### `toggleAccountStatus(userId, isActive)`
- Sets user's `isActive` flag
- Returns updated user (stripped)
- Throws `USER_NOT_FOUND`

## Helper

- **`stripPassword(user)`** → uses `omit(user, ['password'])` from helpers to remove password field before exposing to clients
