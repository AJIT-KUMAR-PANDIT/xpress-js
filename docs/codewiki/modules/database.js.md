# Module: config/database.js — Database Connection Manager

**File**: `src/config/database.js` (131 lines)  
**Responsibility**: Initialize/manage MongoDB (Mongoose) connections with state tracking  
**Module exports**: `connectDB`, `disconnectDB`, `getConnectionState`, `connectionState`

## Functions

| Function | Line | Description |
|---|---|---|
| `_loadMongoose()` | 27 | Lazy require('mongoose') — returns null if not installed |
| `connectDB()` | 41 | Initialize DB connection with pool/config options |
| `setupConnectionListeners(m)` | 85 | Register event handlers on Mongoose connection object |
| `disconnectDB()` | 113 | Gracefully close connections |
| `getConnectionState()` | 129 | Return current state string |

## Lazy Loading Strategy

Mongoose is loaded lazily — only when `connectDB()` is first called. If not installed:
- Warns user and continues booting with in-memory store
- Console message: `"⚠️  Mongoose not installed — using in-memory data store."`

## URI Construction

```javascript
// Dev: plain MongoDB URI
uri = `mongodb://${host}:${port}/${name}`

// Prod: MongoDB Atlas-style
uri = `mongodb+srv://${user}:${password}@${host}/${name}?retryWrites=true&w=majority`
```
