const { adminPool } = require("../config/db");

const saveReport = async (userId, reportData) => {
  const { query_id, nombre, filtros, tipo_grafico } = reportData;
  const [result] = await adminPool.query(
    "INSERT INTO reportes (usuario_id, query_id, nombre, filtros, tipo_grafico) VALUES (?, ?, ?, ?, ?)",
    [userId, query_id, nombre, JSON.stringify(filtros), tipo_grafico]
  );
  return result.insertId;
};

const getReportsByUser = async (userId) => {
  const [rows] = await adminPool.query(
    "SELECT r.*, q.nombre as query_nombre FROM reportes r JOIN querys q ON r.query_id = q.id WHERE r.usuario_id = ?",
    [userId]
  );
  return rows.map(r => ({ ...r, filtros: JSON.parse(r.filtros) }));
};

const deleteReport = async (id, userId) => {
  await adminPool.query("DELETE FROM reportes WHERE id = ? AND usuario_id = ?", [id, userId]);
  return true;
};

const getReportById = async (id, userId) => {
  const [rows] = await adminPool.query(
    "SELECT * FROM reportes WHERE id = ? AND usuario_id = ?",
    [id, userId]
  );
  if (rows[0]) {
    rows[0].filtros = JSON.parse(rows[0].filtros);
  }
  return rows[0];
};

module.exports = {
  saveReport,
  getReportsByUser,
  deleteReport,
  getReportById
};
