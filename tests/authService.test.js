const authService = require('../services/authService');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthError } = require('../utils/errors');

// Mocks
jest.mock('../models/userModel');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
  });

  test('authenticate should return token and user on valid credentials', async () => {
    const mockUser = { id: 1, nombre_corto: 'admin', contraseña: 'hashed_password', rol: 'admin' };
    userModel.findUserByUsername.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mock_token');

    const result = await authService.authenticate('admin', '123456');

    expect(result).toHaveProperty('token', 'mock_token');
    expect(result.user).toHaveProperty('nombre', 'admin');
    expect(result.user).toHaveProperty('rol', 'admin');
  });

  test('authenticate should throw AuthError on user not found', async () => {
    userModel.findUserByUsername.mockResolvedValue(null);

    await expect(authService.authenticate('nonexistent', 'pass'))
      .rejects.toThrow(AuthError);
  });

  test('authenticate should throw AuthError on invalid password', async () => {
    const mockUser = { id: 1, nombre_corto: 'admin', contraseña: 'hashed_password' };
    userModel.findUserByUsername.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await expect(authService.authenticate('admin', 'wrong_pass'))
      .rejects.toThrow(AuthError);
  });
});
