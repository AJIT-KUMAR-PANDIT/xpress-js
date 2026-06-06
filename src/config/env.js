/**
 * src/config/env.js
 * ===================================================================
 * Environment variable loader with validation.
 * Loads .env at startup and throws on any missing required variable.
 * ===================================================================
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Define all required variables with their defaults
const REQUIRED = [
  'PORT',
  'NODE_ENV',
  'JWT_SECRET',
  'JWT_EXPIRE',
];

const DEFAULTS = {
  PORT: 3000,
  NODE_ENV: 'development',
  API_PREFIX: '/api/v1',
  DB_PORT: 27017,
  RATE_LIMIT_WINDOW_MS: 900_000,
  RATE_LIMIT_MAX: 100,
  CORS_ORIGIN: 'http://localhost:3000',
  JWT_REFRESH_EXPIRE: '30d',
  MAX_FILE_SIZE: 5_242_880,
  UPLOAD_PATH: './uploads',
};

// Validate — exit immediately if anything critical is missing
for (const key of REQUIRED) {
  if (!process.env[key]) {
    // eslint-disable-next-line no-process-env
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

// Export a typed, memoized config object
let _config = null;

const getConfig = () => {
  if (_config) return _config;

  const isDev = process.env.NODE_ENV === 'development';
  const isProd = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === 'test';

  _config = {
    port: Number(process.env.PORT) || DEFAULTS.PORT,
    nodeEnv: process.env.NODE_ENV || DEFAULTS.NODE_ENV,
    apiPrefix: process.env.API_PREFIX || DEFAULTS.API_PREFIX,

    // Database
    db: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || DEFAULTS.DB_PORT,
      name: process.env.DB_NAME || 'xpress_js_db',
      user: process.env.DB_USER || '',
      password: process.env.DB_PASSWORD || '',
      uri: isDev
        ? `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}/${process.env.DB_NAME || 'xpress_js_db'}`
        : `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    },

    // JWT
    jwt: {
      secret: process.env.JWT_SECRET,
      expire: process.env.JWT_EXPIRE || '7d',
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      refreshExpire: process.env.JWT_REFRESH_EXPIRE || DEFAULTS.JWT_REFRESH_EXPIRE,
    },

    // Rate limiting
    rateLimit: {
      windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || DEFAULTS.RATE_LIMIT_WINDOW_MS,
      max: Number(process.env.RATE_LIMIT_MAX) || DEFAULTS.RATE_LIMIT_MAX,
    },

    // CORS
    corsOrigin: isProd
      ? (process.env.CORS_ORIGIN_PROD || 'https://yourdomain.com')
      : (process.env.CORS_ORIGIN || DEFAULTS.CORS_ORIGIN),

    // Email
    email: {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS || '',
      from: process.env.EMAIL_FROM || `noreply@xpressjs.dev`,
    },

    // Uploads
    upload: {
      maxFileSize: Number(process.env.MAX_FILE_SIZE) || DEFAULTS.MAX_FILE_SIZE,
      path: process.env.UPLOAD_PATH || DEFAULTS.UPLOAD_PATH,
    },

    // Helpers
    isDev,
    isProd,
    isTest,
  };

  return _config;
};

// Warm the cache on import — fails fast if secrets are missing
getConfig();

module.exports = { getConfig };
