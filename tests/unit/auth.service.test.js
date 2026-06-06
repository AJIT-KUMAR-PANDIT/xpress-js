/**
 * tests/unit/auth.service.test.js
 * ===================================================================
 * Unit tests for the authentication service.
 * Uses in-memory user model (no real DB needed).
 * ===================================================================
 */

const authService = require('../../src/services/auth.service');
const userModel = require('../../src/models/user.model');

// Reset model between tests
beforeEach(() => userModel.clearAll());
afterEach(() => userModel.clearAll());

describe('authService.register()', () => {
  test('should create a user and return tokens', async () => {
    const payload = { name: 'John Doe', email: 'john@example.com', password: 'secret123' };
    const result = await authService.register(payload);

    expect(result).toHaveProperty('user');
    expect(result.user.name).toBe('John Doe');
    expect(result.user.email).toBe('john@example.com');
    expect(result).not.toHaveProperty('user.password'); // password stripped
    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('refreshToken');
  });

  test('should throw if email already exists', async () => {
    const payload = { name: 'John', email: 'john@example.com', password: 'secret123' };
    await authService.register(payload);

    await expect(authService.register(payload)).rejects.toThrow('EMAIL_ALREADY_EXISTS');
  });
});

describe('authService.login()', () => {
  test('should return tokens for valid credentials', async () => {
    // First register a user
    await authService.register({ name: 'Jane', email: 'jane@example.com', password: 'password123' });
    // Then login (need to bypass verification — model allows it)
    userModel.updateByEmail('jane@example.com', { isVerified: true });

    const result = await authService.login({ email: 'jane@example.com', password: 'password123' });

    expect(result.user.email).toBe('jane@example.com');
    expect(result.token).toBeDefined();
  });

  test('should throw for invalid credentials', async () => {
    await authService.register({ name: 'Jane', email: 'jane@example.com', password: 'password123' });

    await expect(
      authService.login({ email: 'jane@example.com', password: 'wrongpassword' })
    ).rejects.toThrow('INVALID_CREDENTIALS');
  });
});
