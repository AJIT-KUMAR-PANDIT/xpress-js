# Module: config/env.js — Environment Variable Loader

**File**: `src/config/env.js` (115 lines)  
**Responsibility**: Load `.env`, validate required vars, memoize config object  
**Module exports**: `getConfig()` → memoized config object

## Functions

| Function | Line | Description |
|---|---|---|
| `_loadMongoose()` | 27 | Lazy mongoose require (try/catch wrapper) |
| `connectDB()` | 41 | Initialize DB connection; returns Mongoose connection or null |
| `disconnectDB()` | 113 | Close all connections; called on graceful shutdown |
| `getConnectionState()` | 129 | Return current connection state string |

## Connection States

| Constant | Description |
|---|---|
| `disconnected` | Initial or closed state |
| `connected` | Successfully connected to MongoDB |
| `connecting` | In-flight connect() call |
| `reconnecting` | Reconnection attempt triggered |

## Database Lifecycle Events

| Event | Handler | Dev Log |
|---|---|---|
| `connected` | Set state, log host | `📡 Mongoose connected to <host>` |
| `disconnected` | Set state, warn | `⚠️  Mongoose disconnected` |
| `reconnectNeeded` | Set state, log | `🔄 Mongoose reconnect needed` |
| `error` | Set state, error | `❌ Mongoose connection error: <msg>` |

## Connection Options (when using Mongoose)

```javascript
{
  maxPoolSize: 10,              // Max concurrent DB connections
  serverSelectionTimeoutMS: 5000, // Fail fast if MongoDB unreachable
  socketTimeoutMS: 45000,        // TCP socket timeout
}
```
