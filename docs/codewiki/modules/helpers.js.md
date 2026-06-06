# Module: utils/helpers.js — Utility Functions

**File**: `src/utils/helpers.js` (146 lines)  
**Responsibility**: Pure, side-effect free shared utilities  
**Exports**: `{ generateRandomString, hashPassword, comparePassword, paginate, pick, omit, sanitize, toSlug, formatDate, sleep }`

## Function Reference

| Function | Parameters | Returns | Description |
|---|---|---|---|
| `generateRandomString(length)` | length (default: 32) | hex string | cryptographically secure via crypto.randomBytes |
| `hashPassword(password, saltRounds)` | password, saltRounds (default: 10) | hex hash | PBKDF2 with random salt (sync) |
| `comparePassword(password, hash)` | password, hash | Boolean | Derive from password and compare to stored hash |
| `paginate(items, page, limit)` | array/page/limit | { data[], meta } | Mongoose-style pagination helper |
| `pick(obj, keys)` | object, key[] | object | Only specified keys present in source |
| `omit(obj, keys)` | object, key[] | object | All keys except specified |
| `sanitize(obj)` | any object | cleaned object | Recursively removes null/undefined values |
| `toSlug(str)` | string | string | Lowercase, trimmed, hyphens-only slug |
| `formatDate(date, format?)` | date, 'short'\|'long'\|'relative' | ISO8601 or formatted | Format date in various ways |
| `sleep(ms)` | ms | Promise<void> | Delay execution by milliseconds |

## Validation Constants

| Constant | Values | Usage |
|---|---|---|
| `VALID_ROLES` | `'user', 'admin'` | User role validation |
| `VALID_GENDERS` | `'male', 'female', 'other', 'prefer_not_to_say'` | Gender field validation |
