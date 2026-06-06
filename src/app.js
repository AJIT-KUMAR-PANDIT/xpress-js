/**
 * src/app.js
 * ===================================================================
 * Express application factory — assembles the full xpress-js stack:
 *   1. Trust proxy & CORS
 *   2. Helmet (security headers)
 *   3. Body parsing (JSON, URL-encoded, file uploads via multer)
 *   4. Rate limiting (express-rate-limit)
 *   5. Morgan request logging
 *   6. Compression (gzip/br)
 *   7. Route registration
 *   8. Global error middleware (catch-all for unhandled errors)
 *   9. Static file serving
 * ===================================================================
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { getConfig } = require('./config/env');
const Logger = require('./utils/logger');
const { errorHandler, asyncHandler } = require('./middlewares/error.middleware');

// Register routes (imported lazily to avoid circular deps)
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

/**
 * Create and configure the Express application. */
const createApp = () => {
  const config = getConfig();
  const app = express();

  // ----------------------------------------------------------------
  // Trust proxy (for behind nginx/reverse-proxy)
  // ----------------------------------------------------------------
  app.set('trust proxy', 1);

  // ----------------------------------------------------------------
  // Security headers (helmet) + CORS
  // ----------------------------------------------------------------
  app.use(helmet());
  app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
  }));

  // ----------------------------------------------------------------
  // Body parsing — limit to 10kb for JSON to prevent large payloads
  // ----------------------------------------------------------------
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true }));

  // ----------------------------------------------------------------
  // Rate limiting — prevents brute-force and DDoS
  // ----------------------------------------------------------------
  const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
  });
  app.use(limiter);

  // ----------------------------------------------------------------
  // Logging — Morgan → Logger
  // ----------------------------------------------------------------
  if (config.isDev) {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined', {
      stream: { write: (str) => Logger.info(str.trim()) },
    }));
  }

  // ----------------------------------------------------------------
  // Compression — gzip/br response bodies
  // ----------------------------------------------------------------
  app.use(compression());

  // ----------------------------------------------------------------
  // Static files
  // ----------------------------------------------------------------
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
  app.use('/public', express.static(path.join(__dirname, '../public')));

  // ----------------------------------------------------------------
  // Routes — mounted under /api/v1 (framework convention)
  // ----------------------------------------------------------------
  const prefix = config.apiPrefix || '/api/v1';

  // Health check endpoint
  app.get(`${prefix}/health`, (req, res) => {
    res.json({
      success: true,
      data: {
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        nodeEnv: config.nodeEnv,
        version: require('../package.json').version,
      },
    });
  });

  // Module routes
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/users`, userRoutes);

  // ----------------------------------------------------------------
  // Root welcome endpoint
  // ----------------------------------------------------------------
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Welcome to XPress-JS Framework — Built by NAKPRC',
      docs: `${prefix}/health`,
    });
  });

  // ----------------------------------------------------------------
  // 404 handler — must come AFTER all routes
  // ----------------------------------------------------------------
  app.use('{*splat}', asyncHandler(async (req, res) => {
    const err = new Error(`Route ${req.method} ${req.originalUrl} not found`);
    err.statusCode = 404;
    throw err;
  }));

  // ----------------------------------------------------------------
  // Global error middleware — Express signature: (err, req, res, next)
  // ----------------------------------------------------------------
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
