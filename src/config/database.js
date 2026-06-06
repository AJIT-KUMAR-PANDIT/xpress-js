/**
 * src/config/database.js
 * ===================================================================
 * Database connection module.
 * Handles MongoDB (Mongoose) / PostgreSQL (pg) initialization
 * and connection management for xpress-js.
 *
 * NOTE: Mongoose is optional — it loads dynamically only if installed.
 * The in-memory user model works standalone with zero extra deps.
 * ===================================================================
 */

// Connection state tracking
const connectionState = {
  disconnected: 'disconnected',
  connected: 'connected',
  connecting: 'connecting',
  reconnecting: 'reconnecting',
};

let currentConnState = connectionState.disconnected;

/**
 * Lazily load mongoose — only if the user has installed it.
 * Returns null when not installed so the rest of the framework still boots.
 */
const _loadMongoose = () => {
  try {
    return require('mongoose');
  } catch {
    return null;
  }
};

let _cachedMongoose = null;

/**
 * Initialize database connection.
 * Call this once at application startup from server.js.
 */
const connectDB = async () => {
  const { getConfig } = require('./env');
  const config = getConfig();
  const { db } = config;

  // Lazily load mongoose once
  if (!_cachedMongoose) _cachedMongoose = _loadMongoose();

  if (!_cachedMongoose) {
    console.warn('⚠️  Mongoose not installed — using in-memory data store.');
    console.warn('   npm install mongoose   # then restart to enable MongoDB\n');
    return null;
  }

  const uri = db.uri || `mongodb://${db.host}:${db.port}/${db.name}`;

  try {
    currentConnState = connectionState.connecting;
    console.log(`🔌 Connecting to database at ${db.host}:${db.port}...`);

    await _cachedMongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    currentConnState = connectionState.connected;
    console.log(`✅ Database "${db.name}" connected successfully`);

    setupConnectionListeners(_cachedMongoose);
    return _cachedMongoose.connection;
  } catch (error) {
    currentConnState = connectionState.disconnected;
    console.error('❌ Database connection failed:', error.message);
    if (config.isProd) {
      process.nextTick(() => process.exit(1));
    }
    throw error;
  }
};

/**
 * Listen for MongoDB connection lifecycle events.
 */
const setupConnectionListeners = (m) => {
  const { getConfig } = require('./env');
  const config = getConfig();

  m.connection.on('connected', () => {
    currentConnState = connectionState.connected;
    if (config.isDev) console.log(`📡 Mongoose connected to ${m.connection.host}`);
  });

  m.connection.on('disconnected', () => {
    currentConnState = connectionState.disconnected;
    console.warn('⚠️  Mongoose disconnected');
  });

  m.connection.on('reconnectNeeded', () => {
    currentConnState = connectionState.reconnecting;
    if (config.isDev) console.log('🔄 Mongoose reconnect needed');
  });

  m.connection.on('error', (err) => {
    currentConnState = connectionState.disconnected;
    console.error('❌ Mongoose connection error:', err.message);
  });
};

/**
 * Gracefully close all database connections.
 */
const disconnectDB = async () => {
  const m = _cachedMongoose;
  if (!m) return null;
  try {
    await m.disconnect();
    currentConnState = connectionState.disconnected;
    console.log('🔒 Database connection closed');
  } catch (error) {
    console.error('Error closing database:', error.message);
    throw error;
  }
};

/**
 * Get current connection state.
 */
const getConnectionState = () => currentConnState;

module.exports = { connectDB, disconnectDB, getConnectionState, connectionState };
