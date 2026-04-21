const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const tenantMiddleware = require("../middleware/tenantMiddleware");
const { adminPool } = require("../config/db");
const empresaModel = require("../models/empresaModel");
const { AuthError, ForbiddenError, ValidationError, NotFoundError } = require("../utils/errors");

// Mocks
jest.mock("jsonwebtoken");
jest.mock("../config/db", () => ({
  adminPool: { query: jest.fn() },
  getTenantPool: jest.fn()
}));
jest.mock("../models/empresaModel");

describe('Middleware Validation Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {}, user: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('authMiddleware', () => {
    test('should throw ForbiddenError if no Authorization header', () => {
      expect(() => authMiddleware(req, res, next)).toThrow(ForbiddenError);
    });

    test('should throw AuthError if token is invalid', () => {
      req.headers.authorization = 'Bearer invalid_token';
      jwt.verify.mockImplementation(() => { throw new Error(); });
      expect(() => authMiddleware(req, res, next)).toThrow(AuthError);
    });

    test('should call next and set req.user if token is valid', () => {
      req.headers.authorization = 'Bearer valid_token';
      const decoded = { userId: 1, rol: 'admin' };
      jwt.verify.mockReturnValue(decoded);
      
      authMiddleware(req, res, next);
      
      expect(req.user).toEqual(decoded);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('roleMiddleware', () => {
    test('should throw AuthError if req.user is missing', () => {
      const middleware = roleMiddleware(['admin']);
      req.user = null;
      expect(() => middleware(req, res, next)).toThrow(AuthError);
    });

    test('should throw ForbiddenError if user role is not allowed', () => {
      const middleware = roleMiddleware(['admin']);
      req.user = { rol: 'user' };
      expect(() => middleware(req, res, next)).toThrow(ForbiddenError);
    });

    test('should call next if user role is allowed', () => {
      const middleware = roleMiddleware(['admin', 'editor']);
      req.user = { rol: 'editor' };
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('tenantMiddleware', () => {
    test('should throw ValidationError if x-empresa header is missing', async () => {
      await expect(tenantMiddleware(req, res, next)).rejects.toThrow(ValidationError);
    });

    test('should throw ForbiddenError if user has no access to tenant', async () => {
      req.headers['x-empresa'] = '1';
      req.user = { userId: 10, rol: 'user' };
      adminPool.query.mockResolvedValue([[]]); // No access in usuario_empresa

      await expect(tenantMiddleware(req, res, next)).rejects.toThrow(ForbiddenError);
    });

    test('should allow access if user is admin even without explicit access', async () => {
      req.headers['x-empresa'] = '1';
      req.user = { userId: 10, rol: 'admin' };
      empresaModel.getEmpresaById.mockResolvedValue({ id: 1, bd: 'bd_test', nombre: 'Test' });
      
      await tenantMiddleware(req, res, next);
      
      expect(next).toHaveBeenCalled();
    });

    test('should throw NotFoundError if company does not exist', async () => {
      req.headers['x-empresa'] = '999';
      req.user = { userId: 1, rol: 'admin' };
      empresaModel.getEmpresaById.mockResolvedValue(null);

      await expect(tenantMiddleware(req, res, next)).rejects.toThrow(NotFoundError);
    });
  });
});
