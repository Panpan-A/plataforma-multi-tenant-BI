const jwt = require("jsonwebtoken");
const { AuthError, ForbiddenError } = require("../utils/errors");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ForbiddenError("Acceso denegado: Token no proporcionado");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AuthError("Token expirado");
    }
    throw new AuthError("Token inválido");
  }
};

module.exports = authMiddleware;