const { AuthError, ForbiddenError } = require("../utils/errors");

/**
 * Middleware para restringir acceso según el rol del usuario
 * @param {Array} rolesPermitidos - Lista de roles que pueden acceder (ej. ['admin', 'supervisor'])
 */
const roleMiddleware = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user || !req.user.rol) {
      throw new AuthError("No autenticado o rol no definido");
    }

    const tienePermiso = rolesPermitidos.includes(req.user.rol);

    if (!tienePermiso) {
      throw new ForbiddenError("Acceso prohibido: No tienes los permisos necesarios para esta acción");
    }

    next();
  };
};

module.exports = roleMiddleware;
