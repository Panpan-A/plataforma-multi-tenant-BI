const { adminPool } = require("../config/db");

/**
 * Registra una acción de auditoría en la base de datos de administración.
 */
const recordLog = async (logData) => {
  const { usuario_id, empresa_id, accion, detalle, ip } = logData;
  const [result] = await adminPool.query(
    "INSERT INTO logs_auditoria (usuario_id, empresa_id, accion, detalle, ip) VALUES (?, ?, ?, ?, ?)",
    [usuario_id, empresa_id || null, accion, detalle || null, ip || null]
  );
  return result.insertId;
};

/**
 * Obtiene los logs filtrados por usuario o empresa.
 */
const getLogs = async (filters = {}) => {
  let sql = "SELECT l.*, u.nombre_corto FROM logs_auditoria l JOIN usuarios u ON l.usuario_id = u.id";
  const params = [];

  if (filters.usuario_id) {
    sql += " WHERE l.usuario_id = ?";
    params.push(filters.usuario_id);
  }

  if (filters.empresa_id) {
    sql += (params.length > 0 ? " AND" : " WHERE") + " l.empresa_id = ?";
    params.push(filters.empresa_id);
  }

  sql += " ORDER BY l.fecha DESC LIMIT 100";

  const [rows] = await adminPool.query(sql, params);
  return rows;
};

module.exports = {
  recordLog,
  getLogs
};
