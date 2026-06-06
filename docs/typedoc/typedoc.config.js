/**
 * Typedoc configuration for xpress-js framework documentation.
 *
 * Usage:
 *   npx typedoc --options docs/typedoc/typedoc.config.js
 */

module.exports = {
  // --- Project ---
  name: 'XPress-JS Framework API',
  entryPoints: [
    './src/app.js',
    './src/server.js',
    './src/index.js',
    './src/config/env.js',
    './src/config/database.js',
    './src/controllers/auth.controller.js',
    './src/controllers/user.controller.js',
    './src/services/auth.service.js',
    './src/services/user.service.js',
    './src/models/user.model.js',
    './src/routes/auth.routes.js',
    './src/routes/user.routes.js',
    './src/middlewares/auth.middleware.js',
    './src/middlewares/error.middleware.js',
    './src/utils/helpers.js',
    './src/utils/logger.js',
    './src/validations/user.validation.js',
  ],

  // --- Output ---
  out: 'docs/typedoc/out',

  // --- Format ---
  readme: 'none',            // Use our own README.md as the landing page
  excludeExternals: true,
  excludePrivate: true,
  excludeNotExported: false,

  // --- Source ---
  includeVersion: true,
  gitRevision: 'main',
  githubPages: false,        // Set true for GitHub Pages deployment

  // --- Theme ---
  theme: 'default',
  hideGenerator: false,

  // --- Navigation ---
  navigationIncludeContent: true,
  sort: ['source-order'],

  // --- Validation ---
  disableValidation: false,
  tsconfig: undefined,       // No TypeScript config needed — pure JS with JSDoc

  // --- Log level ---
  logLevel: 'Info',

  // --- Emit ---
  jsdoc: 'auto',             // Use JSDoc comments for documentation (default)
};
