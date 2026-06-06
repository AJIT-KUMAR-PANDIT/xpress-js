/**
 * Typedoc configuration for xpress-js framework documentation.
 *
 * Usage:
 *   npx typedoc --options docs/typedoc/typedoc.config.js
 */

module.exports = {
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
  out: 'docs/typedoc/out',
  readme: 'none',
  excludeExternals: true,
  excludePrivate: true,
  includeVersion: true,
  githubPages: false,
  hideGenerator: false,
  sort: ['source-order'],
  validation: true,
  logLevel: 'Info',
};
