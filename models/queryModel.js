const { adminPool } = require("../config/db");

const getQueries = async () => {
  const [rows] = await adminPool.query("SELECT id, nombre, tipo FROM querys");
  return rows;
};

const getQueryById = async (id) => {
  const [rows] = await adminPool.query("SELECT * FROM querys WHERE id = ?", [id]);
  return rows[0];
};

const executeDynamicQuery = async (pool, sql, params) => {
  // mysql2 ya usa prepared statements con el pool.query si pasas parámetros
  const [rows] = await pool.query(sql, params);
  return rows;
};

module.exports = {
  getQueries,
  getQueryById,
  executeDynamicQuery
};
