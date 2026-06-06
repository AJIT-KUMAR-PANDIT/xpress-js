/**
 * src/index.js
 * ===================================================================
 * Entry point for xpress-js framework.
 *
 * This file boots the entire application:
 *   1. Loads environment variables
 *   2. Creates the Express app (via app factory)
 *   3. Connects to the database
 *   4. Starts listening on PORT
 *   5. Handles graceful shutdown
 * ===================================================================
 */

// Load .env first — everything else depends on it
require('dotenv').config();

const createApp = require('./app');
const { connectDB, disconnectDB } = require('./config/database');
const { getConfig } = require('./config/env');
const Logger = require('./utils/logger');

let server;

// ── Boot sequence ────────────────────────────────────────────────
const boot = async () => {
  const config = getConfig();
  app = createApp();
  const PORT = config.port || 3000;

  try {
    await connectDB();
  } catch (err) {
    Logger.error('Database connection failed:', err.message);
    if (config.isProd) process.exit(1); // fail fast in production
  }

  server = app.listen(PORT, () => {
    console.log(`\n🚀 XPress-JS running on http://localhost:${PORT}\n`);
  });
};

// ── Graceful shutdown ────────────────────────────────────────────
const shutdown = async () => {
  Logger.info('Shutting down...');
  if (server) server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT',  shutdown);
process.on('uncaughtException', (err) => { Logger.error(err); shutdown(); });
process.on('unhandledRejection',  (err) => { Logger.error(err); shutdown(); });

boot();
