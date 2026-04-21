const auditService = require("../services/auditService");
const { successResponse } = require("../utils/helpers");

const obtenerLogs = async (req, res) => {
  const filters = {
    usuario_id: req.query.usuario_id,
    empresa_id: req.query.empresa_id
  };
  
  const logs = await auditService.getAuditHistory(filters);
  successResponse(res, logs, "Logs de auditoría obtenidos");
};

module.exports = {
  obtenerLogs
};
