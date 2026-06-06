# Module: models/user.model.js — User Data Layer

**File**: `src/models/user.model.js` (197 lines)  
**Responsibility**: In-memory user data storage with full CRUD + login attempt tracking  
**Exports**: `{ create, findByEmail, findById, findByTokenField, updateById, updateByEmail, deleteById, findAll, count, verifyByEmail, clearTokenFields, resetPasswordByEmail, addLoginAttempt, resetLoginAttempts, isEmailLocked, clearAll }`

## Data Model (User Object)

```javascript
{
  id: String,           // UUID-like: `${Date.now()}-${counter}-${random(8)}`
  name: String,
  email: String,        // normalized to lowercase
  password: String,     // bcrypt hashed
  role: String,         // 'user' | 'admin'
  avatar: String | null,
  bio: String | null,   // max 500 chars
  gender: String | null,// 'male' | 'female' | 'other' | 'prefer_not_to_say'
  isVerified: Boolean,
  isActive: Boolean,
  lastLoginAt: Date | null,
  verificationToken: String | null,
  resetToken: String | null,
  createdAt: ISO8601,
  updatedAt: ISO8601,
}
```

## CRUD Operations

| Operation | Method | Signature | Notes |
|---|---|---|---|
| Create | `create(userData)` | → User object | auto-generates id, timestamps |
| Find by email | `findByEmail(email)` | → User \| null | case-insensitive |
| Find by ID | `findById(id)` | → User \| null | exact match |
| Find by token | `findByTokenField(field, value)` | → User \| null | for verification/reset tokens |
| Update by ID | `updateById(id, updates)` | → User \| null | partial update with allowedFields check |
| Update by email | `updateByEmail(email, updates)` | → User \| null | full merge on matched user |
| Delete by ID | `deleteById(id)` | → Boolean | returns true if found/deleted |
| Find all | `findAll(page, limit, search?)` | → { data[], meta } | pagination-aware |
| Count | `count()` | → number | total records |

## Security Operations

| Operation | Method | Notes |
|---|---|---|
| Add login attempt | `addLoginAttempt(email)` | increments counter; returns new count |
| Reset login attempts | `resetLoginAttempts(email)` | deletes entry |
| Check lockout | `isEmailLocked(email, maxAttempts, windowMs)` | returns true if over threshold |
| Clear tokens | `clearTokenFields(email)` | nulls verificationToken + resetToken |
| Reset password | `resetPasswordByEmail(email, hash)` | sets new hashed password |
