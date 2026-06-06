/**
 * src/server.js
 * ===================================================================
 * XPress-JS Framework — Application Entry Point
 *
 * Responsibilities:
 *   • Load environment configuration (dotenv)
 *   • Create the Express app (app factory)
 *   • Initialize database connection
 *   • Listen on the configured PORT
 *   • Handle graceful shutdown (SIGTERM / SIGINT)
 * ===================================================================
 */

const http = require('http');
const createApp = require('./app');
const { connectDB, disconnectDB } = require('./config/database');
const { getConfig } = require('./config/env');
const Logger = require('./utils/logger');

// ---------------------------------------------------------------------------
// Boot the application
// ---------------------------------------------------------------------------

const boot = async () => {
  const config = getConfig();
  const app = createApp();
  const server = http.createServer(app);

  // ── Database connection ────────────────────────────────────────
  try {
    await connectDB();
    Logger.info('Database connected');
  } catch (err) {
    Logger.error('Failed to connect to database:', err.message);
    if (config.isProd) process.exit(1);
    // In dev, continue without DB for demo/testing
  }

  // ── Start listening ────────────────────────────────────────────
  const PORT = config.port || 3000;
  server.listen(PORT, () => {
    console.log(`\n🚀 XPress-JS running at http://localhost:${PORT}\n`);
    console.log(`   Environment : ${config.nodeEnv}`);
    console.log(`   API Prefix  : ${config.apiPrefix || '/api/v1'}`);
    if (config.isDev) {
      console.log('   Sample routes:');
      console.log('     POST  /api/v1/auth/register   — Register user');
      console.log('     POST  /api/v1/auth/login      — Login');
      console.log('     GET   /api/v1/health          — Health check\n');
    }
  });

  return server;
};

// ---------------------------------------------------------------------------
// Graceful shutdown
// ---------------------------------------------------------------------------

const gracefulShutdown = async (signal) => {
  Logger.info(`${signal} received — shutting down gracefully...`);

  try {
    await disconnectDB();
    Logger.info('Database disconnected');
  } catch (err) {
    Logger.error('Error during shutdown:', err.message);
  } finally {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

// Unhandled errors
process.on('uncaughtException', (err) => {
  Logger.error('Uncaught Exception:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  Logger.error('Unhandled Rejection:', err.message);
  process.exit(1);
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
boot().catch((err) => {
  Logger.error('Fatal boot error:', err.message);
  process.exit(1);
});
