const { getTenantPool, adminPool } = require("../config/db");
const empresaModel = require("../models/empresaModel");
const { ValidationError, ForbiddenError, NotFoundError } = require("../utils/errors");

const tenantMiddleware = async (req, res, next) => {
  const empresaId = req.headers["x-empresa"];

  if (!empresaId) {
    throw new ValidationError("Falta el encabezado x-empresa");
  }

  // 1. Validar que el usuario tiene acceso a esta empresa (SEGURIDAD AVANZADA)
    if (req.user.rol !== 'admin') {
      const [userAccess] = await adminPool.query(
        "SELECT 1 FROM usuario_empresa WHERE usuario_id = ? AND empresa_id = ?",
        [req.user.userId, empresaId]
      );

      if (userAccess.length === 0) {
        throw new ForbiddenError("Acceso denegado: No tienes permiso para acceder a esta empresa");
      }
    }

    // 2. Obtener la configuración de la empresa (incluyendo su BD)
    const empresa = await empresaModel.getEmpresaById(empresaId);

    if (!empresa) {
      throw new NotFoundError("Empresa no encontrada");
    }

    // 3. Obtener el pool de conexión para esta empresa específica
    const pool = await getTenantPool(empresa.bd);

    // 4. Inyectar el pool y la info de la empresa en el request
    req.tenant = {
      id: empresa.id,
      nombre: empresa.nombre,
      bd: empresa.bd,
      pool: pool
    };

    next();
};

module.exports = tenantMiddleware;
