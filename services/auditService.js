const auditModel = require("../models/auditModel");

/**
 * Registra una actividad de usuario.
 * @param {Object} req - El objeto de la petición para extraer info del usuario, IP, etc.
 * @param {String} accion - La acción realizada (ej. 'LOGIN', 'EXECUTE_QUERY').
 * @param {String} detalle - Información adicional sobre la acción.
 */
const logActivity = async (req, accion, detalle) => {
  try {
    const logData = {
      usuario_id: req.user?.userId || null,
      empresa_id: req.tenant?.id || null,
      accion,
      detalle: typeof detalle === 'object' ? JSON.stringify(detalle) : detalle,
      ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress
    };

    await auditModel.recordLog(logData);
  } catch (error) {
    // No lanzamos el error para no detener el flujo principal, solo logueamos en consola
    console.error("Error al registrar log de auditoría:", error.message);
  }
};

/**
 * Obtiene los logs de auditoría (solo para administradores).
 */
const getAuditHistory = async (filters = {}) => {
  return await auditModel.getLogs(filters);
};

module.exports = {
  logActivity,
  getAuditHistory
};
