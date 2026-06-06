# Module: validations/user.validation.js

**File**: `src/validations/user.validation.js` (121 lines)  
**Responsibility**: Request validation schemas — pure data, no side effects  
**Exports**: `{ validateRegistration, validateLogin, validateProfileUpdate, validateQueryParams, VALID_ROLES, VALID_GENDERS }`

## Validation Functions

### `validateRegistration(body)`
- **Returns**: `{ error: null, data: sanitized }` on success or `{ error: string }` on failure
- **Rules**:
  | Field | Rule |
  |---|---|
  | name | required, min 2 chars |
  | email | required, valid email regex |
  | password | required, min 6 chars |
  | role | optional, one of VALID_ROLES |

### `validateLogin(body)`
- **Rules**:
  | Field | Rule |
  |---|---|
  | email | required, valid email regex |
  | password | required, string type |

### `validateProfileUpdate(body)`
- **Allowed fields** (only these pass validation):
  | Field | Rule |
  |---|---|
  | name | min 2 chars if provided |
  | bio | max 500 chars if provided |
  | gender | one of VALID_GENDERS if provided |

### `validateQueryParams(query)`
- **Returns**: `{ page, limit, sort, search }` (always valid; defaults applied)
- **Defaults**:
  | Param | Default | Bounds |
  |---|---|---|
  | page | 1 | ≥ 1 |
  | limit | 10 | [1, 100] |
  | sort | '-createdAt' | string |
  | search | null | trimmed string |

## Valid Values

```javascript
VALID_ROLES = ['user', 'admin']
VALID_GENDERS = ['male', 'female', 'other', 'prefer_not_to_say']
```
