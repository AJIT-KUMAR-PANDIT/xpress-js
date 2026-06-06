/**
 * tests/integration/auth.integration.test.js
 * ===================================================================
 * Integration tests for auth routes — uses supertest to hit the real
 * Express app without starting a server. Tests full request/response.
 * ===================================================================
 */

const request = require('supertest');
const createApp = require('../../src/app');

let app;

beforeAll(() => {
  // Fresh app instance for each test suite
  app = createApp();
});

// Reset in-memory data between tests
beforeEach(() => {
  const userModel = require('../../src/models/user.model');
  userModel.clearAll();
});
afterEach(() => {
  const userModel = require('../../src/models/user.model');
  userModel.clearAll();
});

describe('Health Check', () => {
  test('GET /api/v1/health should return status ok', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
  });
});

describe('Auth Routes', () => {
  describe('POST /api/v1/auth/register', () => {
    test('should register a new user and return token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('test@example.com');
      expect(res.body.data.user.password).toBeUndefined(); // password stripped
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
    });

    test('should reject invalid registration data', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'X', email: 'not-an-email', password: 'short' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    test('should login and return tokens', async () => {
      // Register first
      await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Tester', email: 'tester@example.com', password: 'password123' });

      // Verify the user (bypass in real app via token)
      const userModel = require('../../src/models/user.model');
      userModel.updateByEmail('tester@example.com', { isVerified: true });

      // Now login
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'tester@example.com', password: 'password123' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    test('should reject wrong password', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Tester', email: 'tester@example.com', password: 'password123' });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'tester@example.com', password: 'wrongpassword' });

      expect(res.statusCode).toBe(401);
    });
  });
});
